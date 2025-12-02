"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 transition-transform hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[oklch(var(--safety-yellow))] transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-[oklch(var(--lab-gray))] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
