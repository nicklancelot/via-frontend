"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TransformationCards } from "@/components/transformation-cards"
import { PerformanceChart } from "@/components/performance-chart"
import { CollectionPoints } from "@/components/collection-points"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <AuthGuard requiredPage="dashboard">
      <div className="flex h-screen bg-background">
        {/* Sidebar avec contrôle du menu mobile */}
        <Sidebar 
          currentPage="dashboard" 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={closeMobileMenu}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header avec bouton menu hamburger */}
          <Header 
            title="Tableau de bord" 
            onMenuClick={toggleMobileMenu}
          />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              <TransformationCards />
              <PerformanceChart />
              <CollectionPoints />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
