import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bot, LogIn, LogOut, User, Sun, Moon, ChevronDown, LayoutDashboard, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/components/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href) => location.pathname === href

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U'
    const parts = name.trim().split(/\s+/)
    const initials = parts
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
    return initials.slice(0, 2) || 'U'
  }

  // Extract first name for display
  const getDisplayName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'User'
    return fullName.split(/\s+/)[0]
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Mount check for hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    // Force update DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md shadow-lg"
      >
        Skip to main content
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold group"
              aria-label="AI Agents Pro Home"
            >
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                AI Agents Pro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 rounded-full hover:bg-muted transition-colors"
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 hover:bg-muted transition-colors">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                        {getDisplayName(user?.name)}
                      </span>
                      <ChevronDown className="hidden lg:block h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild className="rounded-full hover:bg-muted transition-colors">
                    <Link to="/login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Log In</span>
                    </Link>
                  </Button>
                  <Button asChild className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-md">
                    <a
                      href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20to%20book%20a%20demo%20for%20an%20AI%20support%20agent."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book Demo
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </nav>
        </div>

        {/* Mobile Navigation Content */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-border/50 overflow-hidden bg-background/95 backdrop-blur-xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted text-foreground/80'
                        }`}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="h-px bg-border/50 my-2" />

                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium">Appearance</span>
                  <div className="flex items-center bg-muted rounded-full p-1">
                    <Button
                      variant={mounted && theme === 'light' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                      className="h-7 w-7 rounded-full p-0 transition-colors"
                      aria-label="Light mode"
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={mounted && theme === 'dark' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => handleThemeChange('dark')}
                      className="h-7 w-7 rounded-full p-0 transition-colors"
                      aria-label="Dark mode"
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isAuthenticated ? (
                  <div className="flex flex-col gap-3 mt-2 px-2">
                    <div className="flex items-center gap-3 px-2 py-2 bg-muted/50 rounded-lg">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </div>
                    <Button variant="outline" asChild className="w-full justify-start gap-2">
                      <Link to="/dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full justify-start gap-2">
                      <Link to="/profile">
                        <Settings className="h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mt-2 px-2">
                    <Button variant="outline" asChild className="w-full justify-start h-11">
                      <Link to="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Log In
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start h-11 bg-gradient-to-r from-primary to-purple-600 text-white">
                      <Link to="/signup">
                        Sign Up Free
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
