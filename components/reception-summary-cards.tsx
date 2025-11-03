import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, GitBranch, Square } from "lucide-react"

type Item = {
  produit: 'HEG' | 'HEC' | 'HEF'
  status: 'arriver' | 'en attente'
  quantiteKg: number
}

export default function ReceptionSummaryCards({ data }: { data: Item[] }) {
  const totalDeliveredKg = (product: Item['produit']) =>
    data.filter((r) => r.produit === product && r.status === 'arriver')
        .reduce((s, r) => s + r.quantiteKg, 0)

  const summaryProducts = [
    {
      code: 'HEF' as const,
      label: 'HE Feuille',
      title: 'Huile Essentielle Feuille',
      icon: <Leaf className="w-6 h-6 text-white" />,
      cardClass: "border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-green-50/80 to-white hover:from-green-50 hover:to-green-100/30 group",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      badgeClass: "bg-green-100 text-green-800 border-green-200 group-hover:bg-green-200 transition-colors duration-200",
      fg: "text-green-700"
    },
    {
      code: 'HEG' as const,
      label: 'HE Griffes',
      title: 'Huile Essentielle Griffes',
      icon: <GitBranch className="w-6 h-6 text-white" />,
      cardClass: "border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-blue-50/80 to-white hover:from-blue-50 hover:to-blue-100/30 group",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200 group-hover:bg-blue-200 transition-colors duration-200",
      fg: "text-blue-700"
    },
    {
      code: 'HEC' as const,
      label: 'HE Clous',
      title: 'Huile Essentielle Clous',
      icon: <Square className="w-6 h-6 text-white" />,
      cardClass: "border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-purple-50/80 to-white hover:from-purple-50 hover:to-purple-100/30 group",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-200 group-hover:bg-purple-200 transition-colors duration-200",
      fg: "text-purple-700"
    }
  ]

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {summaryProducts.map((p) => (
        <Card key={p.code} className={p.cardClass}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${p.iconBg} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300`}>
                {p.icon}
              </div>
              <Badge className={`${p.badgeClass}`}>
                {p.label}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{p.title}</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Huille essentielle livré</span>
                <span className={`text-xl font-bold ${p.fg}`}>{totalDeliveredKg(p.code as Item['produit'])} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Huille essentielle arriver</span>
                <span className={`text-xl font-bold ${p.fg}`}>{totalDeliveredKg(p.code as Item['produit'])} kg</span>
              </div>
              
              {/* Optionnel : conserver un champ prix ou autre */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
