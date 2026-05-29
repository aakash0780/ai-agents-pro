import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect } from 'react'

export function ThemeProvider({ children, ...props }) {
  useEffect(() => {
    // Ensure the html element is properly initialized
    const htmlElement = document.documentElement
    const isDark = htmlElement.classList.contains('dark')
    
    // Initialize class on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && !isDark) {
      htmlElement.classList.add('dark')
    }
  }, [])

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="theme-preference"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
