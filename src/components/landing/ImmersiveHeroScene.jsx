import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, Sparkles } from 'lucide-react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { DEMO_URL } from '@/constants/site'

function buildNodePositions(count) {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const radius = 2.2 + Math.random() * 1.3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions[index * 3] = x
    positions[index * 3 + 1] = y
    positions[index * 3 + 2] = z
  }

  return positions
}

function buildConnectionPositions(positions, maxDistance = 1.28, hardLimit = 260) {
  const segments = []
  const nodeCount = positions.length / 3

  for (let source = 0; source < nodeCount; source += 1) {
    for (let target = source + 1; target < nodeCount; target += 1) {
      if (segments.length / 6 >= hardLimit) break

      const x1 = positions[source * 3]
      const y1 = positions[source * 3 + 1]
      const z1 = positions[source * 3 + 2]
      const x2 = positions[target * 3]
      const y2 = positions[target * 3 + 1]
      const z2 = positions[target * 3 + 2]
      const distance = Math.hypot(x2 - x1, y2 - y1, z2 - z1)

      if (distance <= maxDistance) {
        segments.push(x1, y1, z1, x2, y2, z2)
      }
    }

    if (segments.length / 6 >= hardLimit) break
  }

  return new Float32Array(segments)
}

export function ImmersiveHeroScene() {
  const sceneRef = useRef(null)

  useEffect(() => {
    const container = sceneRef.current
    if (!container) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const root = new THREE.Group()
    scene.add(root)

    const nodeCount = window.innerWidth < 768 ? 76 : 118
    const pointsPositions = buildNodePositions(nodeCount)

    const coreGeometry = new THREE.IcosahedronGeometry(0.95, 2)
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00d992,
      emissive: 0x00d992,
      emissiveIntensity: 0.28,
      roughness: 0.18,
      metalness: 0.52,
      transparent: true,
      opacity: 0.9,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    root.add(coreMesh)

    const shellGeometry = new THREE.IcosahedronGeometry(1.65, 1)
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x74f8d2,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
    })
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial)
    root.add(shellMesh)

    const torusGeometry = new THREE.TorusGeometry(2.3, 0.04, 16, 126)
    const torusMaterialOne = new THREE.MeshBasicMaterial({ color: 0x00d992, transparent: true, opacity: 0.3 })
    const torusMaterialTwo = new THREE.MeshBasicMaterial({ color: 0x5f7cff, transparent: true, opacity: 0.2 })
    const torusOne = new THREE.Mesh(torusGeometry, torusMaterialOne)
    const torusTwo = new THREE.Mesh(torusGeometry.clone(), torusMaterialTwo)
    torusOne.rotation.x = Math.PI / 2.8
    torusTwo.rotation.y = Math.PI / 3.1
    torusTwo.rotation.z = Math.PI / 6.8
    root.add(torusOne, torusTwo)

    const pointsGeometry = new THREE.BufferGeometry()
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3))

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x95ffe1,
      size: 0.043,
      transparent: true,
      opacity: 0.84,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const pointsCloud = new THREE.Points(pointsGeometry, pointsMaterial)
    root.add(pointsCloud)

    const connectionsGeometry = new THREE.BufferGeometry()
    connectionsGeometry.setAttribute('position', new THREE.BufferAttribute(buildConnectionPositions(pointsPositions), 3))
    const connectionsMaterial = new THREE.LineBasicMaterial({
      color: 0x00d992,
      transparent: true,
      opacity: 0.16,
    })
    const networkLines = new THREE.LineSegments(connectionsGeometry, connectionsMaterial)
    root.add(networkLines)

    const ambient = new THREE.AmbientLight(0x88ffe0, 0.35)
    const keyLight = new THREE.PointLight(0x00d992, 2.1, 24)
    keyLight.position.set(3.4, 2.2, 4.8)
    const fillLight = new THREE.PointLight(0x5f7cff, 1.15, 20)
    fillLight.position.set(-3.2, -2, 3.4)
    scene.add(ambient, keyLight, fillLight)

    let pointerX = 0
    let pointerY = 0
    let frameId = 0

    const setSize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    const onPointerMove = (event) => {
      const bounds = container.getBoundingClientRect()
      pointerX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 0.45
      pointerY = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 0.38
    }

    container.addEventListener('pointermove', onPointerMove, { passive: true })

    let observer
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(setSize)
      observer.observe(container)
    } else {
      window.addEventListener('resize', setSize, { passive: true })
    }

    setSize()

    if (reducedMotion) {
      renderer.render(scene, camera)
    } else {
      const clock = new THREE.Clock()

      const animate = () => {
        const elapsed = clock.getElapsedTime()
        root.rotation.y = elapsed * 0.24 + pointerX * 0.8
        root.rotation.x = Math.sin(elapsed * 0.35) * 0.07 + pointerY * 0.58
        coreMesh.rotation.y = elapsed * 0.55
        shellMesh.rotation.z = elapsed * 0.2
        torusOne.rotation.z = elapsed * 0.24
        torusTwo.rotation.x = elapsed * 0.19
        pointsMaterial.opacity = 0.72 + Math.sin(elapsed * 1.8) * 0.12
        connectionsMaterial.opacity = 0.12 + Math.cos(elapsed * 1.7) * 0.04

        renderer.render(scene, camera)
        frameId = window.requestAnimationFrame(animate)
      }

      animate()
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      container.removeEventListener('pointermove', onPointerMove)
      if (observer) {
        observer.disconnect()
      } else {
        window.removeEventListener('resize', setSize)
      }

      root.traverse((node) => {
        if (node.geometry) node.geometry.dispose()
        if (Array.isArray(node.material)) {
          node.material.forEach((material) => material.dispose())
        } else if (node.material) {
          node.material.dispose()
        }
      })

      renderer.dispose()
      renderer.forceContextLoss()
      container.innerHTML = ''
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#3d3a39] bg-[linear-gradient(160deg,#05070d_0%,#0a1110_45%,#08090f_100%)] p-4 shadow-[rgba(0,0,0,0.72)_0px_24px_64px]">
      <div className="pointer-events-none absolute inset-0 immersive-scan-grid opacity-75" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[160px] bg-[radial-gradient(circle_at_top,rgba(0,217,146,0.22),transparent_72%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-4 top-4 h-10 w-28 rounded-full border border-[#3d3a39] immersive-glass" aria-hidden="true" />

      <div className="relative z-10 flex items-center justify-between border-b border-[#3d3a39] pb-4">
        <div>
          <p className="font-[system-ui] text-lg font-medium text-[#f2f2f2]">AI Agent Command Core</p>
          <p className="mt-1 text-sm text-[#8b949e]">Realtime orchestration preview</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#3d3a39] immersive-glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#00d992]">
          <Sparkles className="h-3.5 w-3.5" />
          Live
        </div>
      </div>

      <div className="relative mt-4 h-[350px] overflow-hidden rounded-[8px] border border-[#3d3a39] bg-[#050507] md:h-[420px]">
        <div ref={sceneRef} className="absolute inset-0" aria-hidden="true" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-[#3d3a39] immersive-glass px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#8b949e]">Conversation Throughput</p>
          <p className="mt-1 font-[system-ui] text-xl text-[#f2f2f2]">+286%</p>
        </div>

        <div className="pointer-events-none absolute right-4 bottom-4 rounded-md border border-[#3d3a39] immersive-glass px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#8b949e]">Lead Qualification Accuracy</p>
          <p className="mt-1 font-[system-ui] text-xl text-[#f2f2f2]">97.4%</p>
        </div>
      </div>

      <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
        <p className="text-sm leading-6 text-[#b8b3b0]">
          Built for fast sales response, autonomous support, and CRM-synced lead workflows.
        </p>
        <Button asChild className="immersive-neon-shadow rounded-md border border-[#3d3a39] bg-[#101010] px-4 py-3 text-[#2fd6a1] hover:bg-black/20">
          <Link to="/get-started" className="inline-flex items-center gap-2 no-underline">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" className="rounded-md border border-[#3d3a39] bg-transparent px-4 py-3 text-[#f2f2f2] hover:bg-black/20">
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 no-underline">
            <CalendarClock className="h-4 w-4" />
            Book Demo
          </a>
        </Button>
      </div>
    </div>
  )
}
