"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { DataTable } from "@/components/data-table"
import { InsertionModal } from "@/components/insertion-modal"
import { ExportModal } from "@/components/export-modal"
import { Box, TestTube } from "lucide-react"
import Test from "./test"
import { AuthGuard } from "@/components/auth-guard"

export default function CollectePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isInsertionModalOpen, setIsInsertionModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<"matiere" | "huile">("matiere")
  const [statusFilter, setStatusFilter] = useState("Tous")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [startDate, setStartDate] = useState("2024-03-01")
  const [endDate, setEndDate] = useState("2024-03-31")

  useEffect(() => {
    const savedOption = localStorage.getItem("selectedOption") as "matiere" | "huile" | null
    if (savedOption) {
      setSelectedOption(savedOption)
    }
  }, [])

  const handleOptionChange = (option: "matiere" | "huile") => {
    setSelectedOption(option)
    localStorage.setItem("selectedOption", option)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleInsertionClick = () => {
    setIsInsertionModalOpen(true)
  }

  const handleExportClick = () => {
    setIsExportModalOpen(true)
  }

  return (
    <AuthGuard requiredPage="collecte">
      <div className="flex h-screen bg-background">
        {/* Sidebar avec contrôle du menu mobile */}
        <Sidebar 
          currentPage="collecte" 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={closeMobileMenu}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header avec bouton menu hamburger */}
          <Header
            title="Gestion de collecte"
            onInsertionClick={handleInsertionClick}
            onExportClick={handleExportClick}
            onMenuClick={toggleMobileMenu}
          />
          
          <div className="flex flex-col md:flex-row items-center justify-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                selectedOption === "matiere" ? "bg-[#76bc21] text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleOptionChange("matiere")}
            >
              <Box className="w-5 h-5" />
              Matière première
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                selectedOption === "huile" ? "bg-[#76bc21] text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleOptionChange("huile")}
            >
              <TestTube className="w-5 h-5" />
              Test Huile essentielle
            </button>
          </div>

          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6 text-center">
              {selectedOption === "matiere" ? (
                <>
                  <StatsCards />
                  <DataTable
                    onInsertionClick={handleInsertionClick}
                    onExportClick={handleExportClick}
                  />
                </>
              ) : (
                <Test />
              )}
            </div>
          </main>
        </div>

        <InsertionModal isOpen={isInsertionModalOpen} onClose={() => setIsInsertionModalOpen(false)} />
        <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      </div>
    </AuthGuard>
  )
}
