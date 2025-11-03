"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut, Menu } from "lucide-react"

interface HeaderProps {
  title: string
  onInsertionClick?: () => void
  onExportClick?: () => void
  onMenuClick?: () => void // Nouvelle prop pour le menu mobile
}

export function Header({ title, onInsertionClick, onExportClick, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-card border-b border-border p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Menu hamburger pour mobile */}
          <Button
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="sm:hidden h-9 w-9 bg-transparent border-gray-300"
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          {/* Titre */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2 bg-muted px-3 py-1 sm:px-4 sm:py-2 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#76bc21] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold">{user.fullName.charAt(0)}</span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                title="Déconnexion"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
