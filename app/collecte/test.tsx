"use client"
import { useState } from "react"
import { StatsCardsTest } from "@/components/stats-cards-test"
import { DataTable } from "@/components/data-table-test"

export default function Test() {
  return (
    <div className="space-y-6 text-center">
      <StatsCardsTest />
      <DataTable
      />
    </div>
  )
}
