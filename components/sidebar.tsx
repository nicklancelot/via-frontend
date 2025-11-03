"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Coffee,
  FileEdit,
  Shuffle,
  Box,
  Repeat,
  Leaf,
  Command,
  Archive,
  Car,
  Package,
  Upload,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  currentPage?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", key: "dashboard" },
  { name: "Collecte", icon: Leaf, href: "/collecte", key: "collecte" },
  // these items will be grouped under 'Gestion Distillation'
  { name: "Produit Fini", icon: Box, href: "/produitFini", key: "produitFini" },
  { name: "Stock de produit Fini", icon: Archive, href: "/stockProduitFini", key: "stockProduitFini" },
  { name: "Transport", icon: Car, href: "/transport", key: "transport" },
  { name: "Eugénol", icon: Coffee, href: "/eugenol", key: "eugenol" },
]

export function Sidebar({ currentPage = "dashboard", isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [activeKey, setActiveKey] = useState(currentPage)
  const { user, logout, hasAccess } = useAuth()

  // Fermer le sidebar mobile quand on clique sur un lien
  const handleNavigation = (key: string) => {
    setActiveKey(key)
    if (onMobileClose) {
      onMobileClose()
    }
  }

  const handleLogout = () => {
    logout()
  }

  // Fermer le sidebar quand on clique en dehors (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")

      if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node)) {
        if (onMobileClose) {
          onMobileClose()
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileOpen, onMobileClose])

  return (
    <>
      {/* Overlay Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-64 flex-col flex-shrink-0 shadow-2xl bg-gradient-to-b from-[#76bc21] to-[#5aa017] text-white">
        <SidebarContent
          activeKey={activeKey}
          onNavigation={setActiveKey}
          user={user}
          hasAccess={hasAccess}
          onLogout={handleLogout}
        />
      </div>

      {/* Sidebar Mobile */}
      <div
        id="mobile-sidebar"
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-72 flex flex-col z-50 transform transition-transform duration-300 shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ background: "linear-gradient(180deg, #76bc21 0%, #5aa017 100%)", color: "white" }}
      >
        <SidebarContent
          activeKey={activeKey}
          onNavigation={handleNavigation}
          user={user}
          hasAccess={hasAccess}
          onLogout={handleLogout}
        />
      </div>
    </>
  )
}

function SidebarContent({
  activeKey,
  onNavigation,
  user,
  hasAccess,
  onLogout,
}: {
  activeKey: string
  onNavigation: (key: string) => void
  user: any
  hasAccess: (page: string) => boolean
  onLogout?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/30 flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="font-bold text-xl text-[#76bc21]">V</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">VIA-CONSULTING</h1>
          <p className="text-sm opacity-90 font-light">Gestion de Production</p>
        </div>
      </div>

      {user && (
        <div className="p-4 bg-white/10 border-b border-white/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{user.fullName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{user.fullName}</p>
              <p className="text-white/70 text-xs capitalize">{user.role}</p>
              {user.role === "collecteur" && user.balance && (
                <p className="text-white/90 text-xs font-medium mt-1">Solde: {user.balance.toLocaleString()} Ar</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs uppercase tracking-widest opacity-70 px-4 py-3 font-semibold bg-white/5 rounded-lg mb-4">
          Navigation Principale
        </p>
        <ul className="space-y-2">
          {user?.role === "admin" && (
            <li>
              <Link
                href="/dashboard"
                onClick={() => onNavigation("dashboard")}
                className={cn(
                  "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative",
                  activeKey === "dashboard"
                    ? "bg-white text-[#76bc21] font-semibold shadow-lg"
                    : "hover:bg-gray-300  hover:bg-opacity-20 hover:scale-105",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    activeKey === "dashboard" ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
                  )}
                >
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className={cn(activeKey === "dashboard" ? "text-[#76bc21] font-semibold" : "text-white")}>
                  Dashboard
                </span>
              </Link>
            </li>
          )}

          {(user?.role === "admin" || user?.role === "collecteur") && (
            <li>
              <Link
                href="/collecte"
                onClick={() => onNavigation("collecte")}
                className={cn(
                  "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative",
                  activeKey === "collecte"
                    ? "bg-white text-[#76bc21] font-semibold shadow-lg"
                    : "hover:bg-gray-300  hover:bg-opacity-20 hover:scale-105",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    activeKey === "collecte" ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
                  )}
                >
                  <Leaf className="w-5 h-5" />
                </div>
                <span className={cn(activeKey === "collecte" ? "text-[#76bc21] font-semibold" : "text-white")}>
                  Collecte
                </span>
              </Link>
            </li>
          )}

          {(user?.role === "admin" || user?.role === "distilleur") && (
            <li>
              <SidebarDistillationGroup activeKey={activeKey} onNavigation={onNavigation} />
            </li>
          )}

          {user?.role === "admin" && (
            <>
              <li>
                <Link
                  href="/produitFini"
                  onClick={() => onNavigation("produitFini")}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative",
                    activeKey === "produitFini"
                      ? "bg-white text-[#76bc21] font-semibold shadow-lg"
                      : "hover:bg-gray-300  hover:bg-opacity-20 hover:scale-105",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      activeKey === "produitFini" ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
                    )}
                  >
                    <Box className="w-5 h-5" />
                  </div>
                  <span className={cn(activeKey === "produitFini" ? "text-[#76bc21] font-semibold" : "text-white")}>
                    Produit Fini
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/stockProduitFini"
                  onClick={() => onNavigation("stockProduitFini")}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative",
                    activeKey === "stockProduitFini"
                      ? "bg-white text-[#76bc21] font-semibold shadow-lg"
                      : "hover:bg-gray-300  hover:bg-opacity-20 hover:scale-105",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      activeKey === "stockProduitFini" ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
                    )}
                  >
                    <Archive className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(activeKey === "stockProduitFini" ? "text-[#76bc21] font-semibold" : "text-white")}
                  >
                    Stock de produit Fini
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/transport"
                  onClick={() => onNavigation("transport")}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative",
                    activeKey === "transport"
                      ? "bg-white text-[#76bc21] font-semibold shadow-lg"
                      : "hover:bg-gray-300  hover:bg-opacity-20 hover:scale-105",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      activeKey === "transport" ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
                    )}
                  >
                    <Car className="w-5 h-5" />
                  </div>
                  <span className={cn(activeKey === "transport" ? "text-[#76bc21] font-semibold" : "text-white")}>
                    Transport
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/eugenol"
                  onClick={() => onNavigation("eugenol")}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative",
                    activeKey === "eugenol"
                      ? "bg-white text-[#76bc21] font-semibold shadow-lg"
                      : "hover:bg-gray-300  hover:bg-opacity-20 hover:scale-105",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      activeKey === "eugenol" ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
                    )}
                  >
                    <Coffee className="w-5 h-5" />
                  </div>
                  <span className={cn(activeKey === "eugenol" ? "text-[#76bc21] font-semibold" : "text-white")}>
                    Eugénol
                  </span>
                </Link>
              </li>
            </>
          )}

          {(user?.role === "admin" || user?.role === "vente") && (
            <li>
              <SidebarVenteGroup activeKey={activeKey} onNavigation={onNavigation} />
            </li>
          )}
        </ul>
      </div>

      {/* Compte */}
      <div className="p-4 border-t border-white/30 space-y-3 flex-shrink-0">
        <p className="text-xs uppercase tracking-widest opacity-70 font-semibold">Gestion du Compte</p>
        {user?.role === "admin" && (
          <Link href="/users">
            <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-300">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-white font-medium">Gestion utilisateurs</span>
            </button>
          </Link>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-white/10 text-white">
              <Command className="w-5 h-5" />
            </div>
            <span className="text-white font-medium">Déconnexion</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/30 text-center flex-shrink-0">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-xs opacity-80 font-medium">VIA-CONSULTING</p>
          <p className="text-xs opacity-60 mt-1">v2.1.0 • Production</p>
        </div>
      </div>
    </div>
  )
}

function SidebarDistillationGroup({
  activeKey,
  onNavigation,
}: { activeKey: string; onNavigation: (key: string) => void }) {
  const [open, setOpen] = useState(false)

  const items = [
    { name: "Expédition", icon: FileEdit, href: "/expedition", key: "expedition" },
    { name: "Initialisation", icon: Shuffle, href: "/initialisation", key: "initialisation" },
    { name: "Distillation", icon: Repeat, href: "/distillation", key: "distillation" },
    { name: "Transport", icon: Car, href: "/transport", key: "transport" },
  ]

  const handleClickItem = (key: string) => {
    onNavigation(key)
    // keep the group open when a member is clicked
    setOpen(true)
  }

  // open the group automatically if one of its children is the active page
  useEffect(() => {
    const childKeys = items.map((i) => i.key)
    if (childKeys.includes(activeKey)) {
      setOpen(true)
    }
  }, [activeKey])

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300",
          open ? "bg-white text-[#76bc21] font-semibold shadow-lg" : "hover:bg-gray-300 hover:bg-opacity-20",
        )}
      >
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              open ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
            )}
          >
            <Repeat className="w-5 h-5" />
          </div>
          <span className={cn(open ? "text-[#76bc21] font-semibold" : "text-white")}>Gestion Distillation</span>
        </div>
        <div className={cn("p-2 rounded-lg bg-white/10 text-white")}>{open ? "▾" : "▸"}</div>
      </div>

      {open && (
        <ul className="mt-2 space-y-2 pl-6">
          {items.map((it) => (
            <li key={it.key}>
              <Link
                href={it.href}
                onClick={() => handleClickItem(it.key)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                  activeKey === it.key ? "bg-white text-[#76bc21] font-semibold" : "hover:bg-white/10 text-white",
                )}
              >
                <div className="p-1 rounded-md bg-white/10 text-white">
                  <it.icon className="w-4 h-4" />
                </div>
                <span className={cn(activeKey === it.key ? "text-[#76bc21] font-semibold" : "text-white")}>
                  {it.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// Nouveau : groupe Vente (retourne un fragment pour éviter <li> imbriqué)
function SidebarVenteGroup({ activeKey, onNavigation }: { activeKey: string; onNavigation: (key: string) => void }) {
  const [open, setOpen] = useState(false)

  const items = [
    { name: "Réception", icon: Package, href: "/reception", key: "reception" },
    { name: "Agrégage Provisoire", icon: Shuffle, href: "/agregageProvisoire", key: "agregageProvisoire" },
    { name: "Agrégage Définitif", icon: Box, href: "/agregageDefinitif", key: "agregageDefinitif" },
    { name: "Exportation", icon: Upload, href: "/exportation", key: "exportation" },
  ]

  const handleClickItem = (key: string) => {
    onNavigation(key)
    setOpen(true)
  }

  useEffect(() => {
    const childKeys = items.map((i) => i.key)
    if (childKeys.includes(activeKey)) {
      setOpen(true)
    }
  }, [activeKey])

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300",
          open ? "bg-white text-[#76bc21] font-semibold shadow-lg" : "hover:bg-gray-300 hover:bg-opacity-20",
        )}
      >
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              open ? "bg-[#76bc21] text-white" : "bg-white/10 text-white",
            )}
          >
            <Command className="w-5 h-5" />
          </div>
          <span className={cn(open ? "text-[#76bc21] font-semibold" : "text-white")}>Gestion Vente</span>
        </div>
        <div className={cn("p-2 rounded-lg bg-white/10 text-white")}>{open ? "▾" : "▸"}</div>
      </div>

      {open && (
        <ul className="mt-2 space-y-2 pl-6">
          {items.map((it) => (
            <li key={it.key}>
              <Link
                href={it.href}
                onClick={() => handleClickItem(it.key)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                  activeKey === it.key ? "bg-white text-[#76bc21] font-semibold" : "hover:bg-white/10 text-white",
                )}
              >
                <div className="p-1 rounded-md bg-white/10 text-white">
                  <it.icon className="w-4 h-4" />
                </div>
                <span className={cn(activeKey === it.key ? "text-[#76bc21] font-semibold" : "text-white")}>
                  {it.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
