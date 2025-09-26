'use client'
import { Button } from "@/components/ui/button"
import { FaSun, FaMoon } from "react-icons/fa"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full relative w-8 h-8"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            <FaSun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <FaMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )

}