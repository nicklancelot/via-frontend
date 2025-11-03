"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Search, Plus } from "lucide-react"

// Exemple de données initiales
const transformationData = [
  { id: 1, date: "24/03/2024", fournisseur: "John Doe", typeMP: "Clous", poidsBrut: 50, tauxHumidite: 12 },
  { id: 2, date: "25/03/2024", fournisseur: "Jane Smith", typeMP: "Griffe", poidsBrut: 30, tauxHumidite: 10 },
  { id: 3, date: "26/03/2024", fournisseur: "Paul Martin", typeMP: "Feuille", poidsBrut: 40, tauxHumidite: 15 },
]

export default function TransformationMP() {
  const [data, setData] = useState(transformationData)
  const [filterDateDebut, setFilterDateDebut] = useState("")
  const [filterDateFin, setFilterDateFin] = useState("")
  const [perPage, setPerPage] = useState("5")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage="transformation-mp" />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Gestion de Transformation MP</h1>
        </div>

        <div className="p-6">
          {/* Filtres */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="dateDebut">Date début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={filterDateDebut}
                onChange={(e) => setFilterDateDebut(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="dateFin">Date fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={filterDateFin}
                onChange={(e) => setFilterDateFin(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="perPage">Par page</Label>
              <Select value={perPage} onValueChange={setPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Chercher
            </Button>
            <Button className="bg-[#76bc21] text-white px-4 py-2 hover:opacity-80">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {/* Tableau */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#76bc21] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Fournisseur</th>
                  <th className="px-4 py-3 text-left">Type MP</th>
                  <th className="px-4 py-3 text-left">Poids brut (kg)</th>
                  <th className="px-4 py-3 text-left">Taux d'humidité (%)</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}>
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.fournisseur}</td>
                    <td className="px-4 py-3">{item.typeMP}</td>
                    <td className="px-4 py-3">{item.poidsBrut}</td>
                    <td className="px-4 py-3">{item.tauxHumidite}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">5 résultats (Total: 15, Page 1 sur 3)</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Préc.</Button>
              <Button variant="outline" size="sm">Suiv.</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
