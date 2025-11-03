"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.viaconsulting.mg/api"

// Configuration des types avec icônes et couleurs
const typeConfig: Record<string, { icon: string; bgColor: string }> = {
  clous: { icon: "🍃", bgColor: "#76bc21" },
  griffes: { icon: "🌿", bgColor: "#124734" },
  feuilles: { icon: "📍", bgColor: "#089a8d" },
}

// Alias pour les codes reçus depuis l'API
const typeAlias: Record<string, string> = {
  GG: "griffes",
  CG: "clous",
  FG: "feuilles",
}

// Normalisation des types
const normalizeType = (type?: string) => {
  if (!type) return ""
  return type
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

// Recherche dans la config avec fallback
const findConfigFor = (rawType?: string) => {
  const clean = normalizeType(rawType)
  if (!clean) return null
  if (typeConfig[clean]) return typeConfig[clean]
  if (typeConfig[clean + "s"]) return typeConfig[clean + "s"]
  if (clean.endsWith("s") && typeConfig[clean.slice(0, -1)]) return typeConfig[clean.slice(0, -1)]
  return null
}

interface Stat {
  title: string
  value: string
  bgColor: string
  icon: string
}

interface StatsCardsProps {
  showTitle?: boolean
}

export function StatsCards({ showTitle = true }: StatsCardsProps) {
  const { user } = useAuth()
  const balance = user?.role === "collecteur" && user?.balance ? user.balance : 2000
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuantitesNonLivrees = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/statistiques/quantites-non-livrees`, {
          headers: { Accept: "application/json" },
        })

        if (!response.ok) throw new Error("Erreur lors de la récupération des données")

        const data = await response.json()

        if (data.statut === "succes") {
          const formattedStats = data.donnees.quantites_par_type.map((item: any) => {
            console.log("Type brut reçu:", item.type)

            const alias = typeAlias[item.type] || item.type
            const config = findConfigFor(alias) || { bgColor: "#4b5e40", icon: "📦" }

            return {
              title: item.type_libelle,
              value: item.quantite_formatee,
              bgColor: config.bgColor,
              icon: config.icon,
            }
          })
          setStats(formattedStats)
        } else {
          throw new Error(data.message || "Erreur dans la réponse de l'API")
        }
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchQuantitesNonLivrees()
  }, [])

  if (loading) return <div className="text-center p-4">Chargement des statistiques...</div>
  if (error) return <div className="text-center p-4 text-red-500">Erreur : {error}</div>

  return (
    <div className="space-y-6 p-4">
      {showTitle && (
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Solde actuel :{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {balance.toLocaleString()} Ar
            </span>
          </h1>
          <p className="text-gray-500 text-sm">Stock des matières premières</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 group backdrop-blur-sm bg-white/50"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg text-3xl"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  {stat.icon}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500">En stock</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 rounded-full flex-1 bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: stat.bgColor,
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
