"use client"

import { useEffect } from "react"

export default function ParallaxBG() {
  useEffect(() => {
    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY * 1.0 // parallax factor
        document.documentElement.style.setProperty("--parallax-y", `${y}px`)
        rafId = null
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  return null
}


