"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ExpeditionHeaderProps {
  onExportClick: () => void
}

export function ExpeditionHeader({ onExportClick }: ExpeditionHeaderProps) {
  return (
    <header className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground ml-6 mt-4">Liste des matières premiere en expedition</h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">JD</span>
            </div>
            <span className="text-sm font-medium">Jhon Doe</span>
          </div>
        </div>
      </div>
    </header>
  )
}
