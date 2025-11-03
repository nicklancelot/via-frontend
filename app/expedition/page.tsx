"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ExpeditionHeader } from "@/components/expedition-header"
import { ExpeditionTable } from "@/components/expedition-table"
import { ExportModal } from "@/components/export-modal"
import { StatsCards } from "@/components/stats-cards"
import { Header } from "@/components/header"

export default function ExpeditionPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="md:flex md:flex-shrink-0">
        <Sidebar currentPage="expedition" />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <Header title={"Liste des matières premiere en expedition"} />

          {/* Stats Cards */}
        <div className="p-6 cursor-pointer">
          <StatsCards showTitle={false} />
        </div>

        {/* Table */}
        <main className="flex-1 overflow-auto p-6 ">
          <ExpeditionTable onExportClick={() => setIsExportModalOpen(true)} />
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  )
}
