import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ReceptionsProvider } from "@/context/ReceptionsContext"

// Métadonnées de l'application
export const metadata: Metadata = {
  title: "VIA-CONSULTING",
  description: "Dashboard de gestion de collecte VIA-CONSULTING",
  generator: "v0.app",
}

// Layout principal
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <ReceptionsProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </ReceptionsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
