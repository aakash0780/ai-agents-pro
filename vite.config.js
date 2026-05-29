import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function searchConsoleVerificationPlugin(token) {
  const verificationToken = String(token || '').trim()

  return {
    name: 'search-console-verification',
    transformIndexHtml(html) {
      if (!verificationToken) return html

      return html.replace(
        '</head>',
        `    <meta name="google-site-verification" content="${escapeHtmlAttribute(verificationToken)}" />\n  </head>`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [searchConsoleVerificationPlugin(env.VITE_GOOGLE_SITE_VERIFICATION), react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/socket.io': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined

            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) {
              return 'react-core'
            }
            if (id.includes('/node_modules/react-router') || id.includes('/node_modules/@remix-run/')) {
              return 'router-vendor'
            }
            if (id.includes('/node_modules/framer-motion/')) {
              return 'motion-vendor'
            }
            if (id.includes('/node_modules/lucide-react/')) {
              return 'icons-vendor'
            }
            if (id.includes('/node_modules/@radix-ui/') || id.includes('/node_modules/embla-carousel-react/') || id.includes('/node_modules/cmdk/') || id.includes('/node_modules/vaul/')) {
              return 'ui-vendor'
            }
            if (id.includes('/node_modules/sonner/')) {
              return 'feedback-vendor'
            }
            if (id.includes('/node_modules/@tanstack/')) {
              return 'query-vendor'
            }

            return 'vendor'
          },
        },
      },
    },
  }
})
