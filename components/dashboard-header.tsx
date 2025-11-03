"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  return (
    <header className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground ml-5 top-5">Tableaux de bord</h1>
        </div>
          {/* Utilisateur */}
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/user.png" alt="User" />
              <AvatarFallback >JD</AvatarFallback>
            </Avatar>
            <span className="text-sm">John Doe</span>
          </div>
        </div>
    </header>
  )
}
