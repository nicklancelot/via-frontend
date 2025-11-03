"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  requiredPage: string
}

export function AuthGuard({ children, requiredPage }: AuthGuardProps) {
  const { isAuthenticated, hasAccess, getHomePage } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si pas authentifié, rediriger vers login
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!hasAccess(requiredPage)) {
      const homePage = getHomePage()
      router.push(homePage)
    }
  }, [isAuthenticated, hasAccess, requiredPage, router, pathname, getHomePage])

  // Ne rien afficher si pas authentifié ou pas d'accès
  if (!isAuthenticated || !hasAccess(requiredPage)) {
    return null
  }

  return <>{children}</>
}
