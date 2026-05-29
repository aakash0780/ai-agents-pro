import { useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { BellRing, Bot, ChevronDown, LayoutDashboard, LogOut, Menu, TrendingUp, UserRound, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { getSocketUrl } from '@/lib/api'
import { LINKS, NAV_LINKS } from '@/utils/constants'

function navClass({ isActive }) {
  return `relative pb-1 text-sm no-underline transition-colors ${
    isActive ? 'text-[#00d992]' : 'text-[#9a9aaa] hover:text-[#f2f2f2]'
  }`
}

function authButtonClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
    isActive ? 'text-[#00d992]' : 'text-[#b8b3b0] hover:bg-[#101010] hover:text-[#f2f2f2]'
  }`
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [visitorCount, setVisitorCount] = useState(0)
  const [recentVisitors, setRecentVisitors] = useState([])
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const isAdmin = String(user?.role || '').toUpperCase() === 'ADMIN'

  useEffect(() => {
    if (!isAdmin) return undefined

    const socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    })
    socket.on('connect', () => socket.emit('join-admin'))
    socket.on('new-visitor', (visitor) => {
      setRecentVisitors((current) => [visitor, ...current].slice(0, 5))
      setVisitorCount((current) => current + 1)
    })

    return () => socket.disconnect()
  }, [isAdmin])

  const openBell = () => {
    setBellOpen((current) => !current)
    setVisitorCount(0)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-[var(--border)] bg-[rgba(5,5,7,0.75)] backdrop-blur-[20px]">
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex min-w-0 shrink items-center gap-3 no-underline" aria-label="AI Agents Pro home">
          <span className="logo-glow flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#3d3a39] bg-[#101010]">
            <Bot className="h-5 w-5 text-[#00d992]" />
          </span>
          <span className="hidden sm:block">
            <span className="block font-semibold text-[#f2f2f2]">AI Agents Pro</span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-[#8b949e]">AI Automation</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.href} to={item.href} className={navClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive ? <span className="absolute inset-x-0 -bottom-[9px] h-px bg-[#00d992]" /> : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {isAdmin ? (
            <div className="relative">
              <button
                type="button"
                onClick={openBell}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#3d3a39] text-[#f2f2f2] transition hover:border-[#00d992] hover:text-[#00d992]"
                aria-label="Open visitor notifications"
              >
                <BellRing className="h-4 w-4" />
                {visitorCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#fb565b] px-1 text-[11px] font-semibold text-white">
                    {visitorCount > 9 ? '9+' : visitorCount}
                  </span>
                ) : null}
              </button>
              <AnimatePresence>
                {bellOpen ? (
                  <Motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-12 w-80 rounded-lg border border-[#3d3a39] bg-[#101010] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-[#3d3a39] pb-2">
                      <p className="text-sm font-semibold text-[#f2f2f2]">Visitor alerts</p>
                      <NavLink to="/admin/visitors" onClick={() => setBellOpen(false)} className="text-xs text-[#00d992] no-underline hover:underline">
                        View all
                      </NavLink>
                    </div>
                    <div className="space-y-2">
                      {recentVisitors.length ? recentVisitors.map((visitor) => (
                        <div key={visitor.id} className="rounded-md border border-[#3d3a39] bg-[#050507] p-3">
                          <p className="truncate text-sm text-[#f2f2f2]">{visitor.city}, {visitor.country}</p>
                          <p className="mt-1 text-xs capitalize text-[#8b949e]">{visitor.device} · {visitor.browser}</p>
                        </div>
                      )) : (
                        <p className="rounded-md border border-[#3d3a39] bg-[#050507] p-3 text-sm text-[#8b949e]">
                          No new visitors yet.
                        </p>
                      )}
                    </div>
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : null}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={authButtonClass}>
                Login
              </NavLink>
              <NavLink
                to="/get-started"
                className="inline-flex items-center rounded-xl bg-[#00d992] px-5 py-2.5 text-sm font-semibold text-[#050507] no-underline transition hover:shadow-[0_0_24px_rgba(0,217,146,0.32)]"
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className="inline-flex h-10 max-w-[200px] items-center gap-1.5 rounded-lg border border-[#3d3a39] bg-[#101010] px-3 text-sm text-[#f2f2f2] transition hover:border-[#00d992]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d992] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]"
                aria-label="Account menu"
              >
                <UserRound className="h-4 w-4 shrink-0 text-[#00d992]" />
                <span className="truncate">{user?.name || user?.email || 'Account'}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[14rem] border-[#3d3a39] bg-[#101010] text-[#f2f2f2]">
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#0d1512] focus:text-[#00d992]">
                  <NavLink to="/dashboard" className="flex items-center gap-2 no-underline">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#0d1512] focus:text-[#00d992]">
                  <NavLink to="/client-profit-dashboard" className="flex items-center gap-2 no-underline">
                    <TrendingUp className="h-4 w-4" />
                    Client Profit Dashboard
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#0d1512] focus:text-[#00d992]">
                  <NavLink to="/profile" className="flex items-center gap-2 no-underline">
                    <UserRound className="h-4 w-4" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#3d3a39]" />
                <DropdownMenuItem
                  className="cursor-pointer text-[#fb565b] focus:bg-[#2a1717] focus:text-[#fb565b]"
                  onSelect={(event) => {
                    event.preventDefault()
                    handleLogout()
                  }}
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#3d3a39] text-[#f2f2f2] md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <Motion.button
              type="button"
              className="fixed inset-0 z-[90] bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-label="Close menu overlay"
            />
            <Motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed right-0 top-0 z-[100] flex h-screen w-[82%] max-w-sm flex-col border-l border-[var(--border)] bg-[#050507] p-6 md:hidden"
            >
              <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b949e]">Marketing</p>
              <div className="mt-3 flex flex-col gap-2">
                {NAV_LINKS.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg border px-4 py-3 text-sm no-underline ${
                        isActive
                          ? 'border-[#00d992] bg-[rgba(0,217,146,0.08)] text-[#00d992]'
                          : 'border-[#3d3a39] text-[#b8b3b0]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b949e]">Account</p>
              <div className="mt-3 flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-[#3d3a39] px-4 py-3 text-center text-sm font-medium text-[#f2f2f2] no-underline hover:border-[#00d992]/50"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-[#3d3a39] px-4 py-3 text-center text-sm font-medium text-[#b8b3b0] no-underline hover:border-[#00d992]/50 hover:text-[#f2f2f2]"
                    >
                      Sign up
                    </NavLink>
                    <NavLink
                      to="/get-started"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center rounded-xl bg-[#00d992] px-4 py-3 text-sm font-semibold text-[#050507] no-underline"
                    >
                      Get Started
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-[#3d3a39] px-4 py-3 text-sm text-[#b8b3b0] no-underline hover:border-[#00d992]/50 hover:text-[#00d992]"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/client-profit-dashboard"
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-[#3d3a39] px-4 py-3 text-sm text-[#b8b3b0] no-underline hover:border-[#00d992]/50 hover:text-[#00d992]"
                    >
                      Client Profit Dashboard
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="rounded-lg border border-[#3d3a39] px-4 py-3 text-sm text-[#b8b3b0] no-underline hover:border-[#00d992]/50 hover:text-[#00d992]"
                    >
                      Profile
                    </NavLink>
                    {isAdmin ? (
                      <NavLink
                        to="/admin/visitors"
                        onClick={() => setOpen(false)}
                        className="rounded-lg border border-[#3d3a39] px-4 py-3 text-sm text-[#b8b3b0] no-underline hover:border-[#00d992]/50 hover:text-[#00d992]"
                      >
                        Visitor analytics
                      </NavLink>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleLogout()}
                      className="rounded-lg border border-[#fb565b]/35 bg-transparent px-4 py-3 text-left text-sm font-medium text-[#fb565b]"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

              <div className="mt-auto border-t border-[#3d3a39] pt-4">
                <a
                  href={LINKS.watchDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block text-center text-sm text-[#8b949e] no-underline hover:text-[#00d992]"
                >
                  Watch demo (WhatsApp)
                </a>
              </div>
            </Motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
