"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Search, Plus, Calendar, Package, MapPin, FlaskConical, Eye, Leaf,  GitBranch, Square } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Type pour les données du stock
interface StockItem {
  id: string
  traitementType: string
  quantityProduced: number
  provenance: string
  rawMaterial: string
  quantityUsed: number
  dateTraitement: string
}

const StockProduitFini = () => {
  // Données mockées basées sur l'image
  const stockData: StockItem[] = [
    {
      id: "2",
      traitementType: "Distillation",
      quantityProduced: 5,
      provenance: "Votipario",
      rawMaterial: "Clous",
      quantityUsed: 10,
      dateTraitement: "24 Mars 2024"
    },
    {
      id: "3",
      traitementType: "Vente d'huile",
      quantityProduced: 10,
      provenance: "Mématoria",
      rawMaterial: "Griffes",
      quantityUsed: 10,
      dateTraitement: "24 Mars 2024"
    },
    {
      id: "4",
      traitementType: "Stockage",
      quantityProduced: 10,
      provenance: "Mématoria",
      rawMaterial: "Feuille",
      quantityUsed: 0.7,
      dateTraitement: "24 Mars 2024"
    },
    {
      id: "5",
      traitementType: "Stockage",
      quantityProduced: 10,
      provenance: "Mémamionnato",
      rawMaterial: "Feuille",
      quantityUsed: 10,
      dateTraitement: "24 Mars 2024"
    }
  ]

  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fonction pour gérer le détail
  const handleDetail = (item: StockItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  // Gestionnaires d'événements
  const handleAdd = () => {
    console.log("Ajouter un nouvel élément")
  }

  const handleExport = () => {
    console.log("Exporter les données")
  }

  const handleSearch = (term: string) => {
    console.log("Rechercher:", term)
  }

  // Mobile Card Component
  function MobileStockCard({ 
    item, 
    onDetail 
  }: { 
    item: StockItem
    onDetail: (item: StockItem) => void
  }) {
    const getMatiereColor = (matiere: string) => {
      switch (matiere) {
        case "Clous": return "bg-purple-500"
        case "Griffes": return "bg-blue-500"
        case "Feuille": return "bg-green-500"
        default: return "bg-gray-500"
      }
    }

    return (
      <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm bg-white/95">
        <CardContent className="p-4">
          {/* Header avec ID et date */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">#{item.id}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Production #{item.id}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.dateTraitement}
                </p>
              </div>
            </div>
            <Badge className={`${getMatiereColor(item.rawMaterial)} text-white border-0 shadow-sm`}>
              {item.rawMaterial}
            </Badge>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="space-y-1">
              <p className="font-medium text-gray-700 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" />
                H.E Produite
              </p>
              <p className="font-semibold text-gray-900">{item.quantityProduced} kg</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">MP Utilisée</p>
              <p className="text-gray-900">{item.quantityUsed} {item.rawMaterial === "Feuille" && item.quantityUsed === 0.7 ? 'T' : 'Kg'}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700 flex items-center gap-1">
                <Package className="w-3 h-3" />
                Type MP
              </p>
              <p className="text-gray-900">{item.rawMaterial}</p>
            </div>
          </div>

          {/* Type de traitement */}
          <div className="mb-3">
            <Badge className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {item.traitementType}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDetail(item)}
              className="flex-1 flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
            >
              <Eye className="w-4 h-4" />
              Détail
            </Button>
            <input 
              type="checkbox" 
              className="w-4 h-4 cursor-pointer accent-[#76bc21] hover:accent-[#5a951a] transition-colors duration-200" 
              onChange={(e) => console.log("Checkbox:", e.target.checked, item)}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className='md:flex'>
        <Sidebar currentPage="stockProduitFini" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Gestion de stock des produits finis" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
          <Card className="border border-gray-200 shadow-sm mb-6 backdrop-blur-sm bg-white/95">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date de début</Label>
                    <Input type="date" className="w-full md:w-40 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date de fin</Label>
                    <Input type="date" className="w-full md:w-40 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Usine</Label>
                    <Select defaultValue="Pk12">
                      <SelectTrigger className="w-full md:w-30 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pk12">PK 12</SelectItem>
                        <SelectItem value="Makomby">Makomby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Par page</Label>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-full md:w-24 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-end gap-3 flex-1 mt-6">
                  <Button className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] hover:from-[#68a81d] hover:to-[#4c8a15] text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                    <Search className="w-4 h-4 mr-2"/>
                    Chercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* En-tête avec les quantités */}
          <div className="rounded-lg shadow-sm border p-6 mb-6 backdrop-blur-sm bg-white/95">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Stock</h1>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Usine de distillation :</span>
                  <span className="text-gray-600">Tous</span>
                </div>
              </div>
            </div>
            
            {/* Cartes des huiles essentielles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Carte H.E Feuille */}
              <Card className="border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-green-50/80 to-white hover:from-green-50 hover:to-green-100/30 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 group-hover:bg-green-200 transition-colors duration-200">
                      H.E Feuille
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Huile Essentielle Feuille</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock actuel</span>
                      <span className="text-xl font-bold text-gray-900">24,7 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prix</span>
                      <span className="text-sm font-semibold text-green-600">5,200 Ar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carte H.E Griffes */}
              <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-blue-50/80 to-white hover:from-blue-50 hover:to-blue-100/30 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <GitBranch className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 group-hover:bg-blue-200 transition-colors duration-200">
                      H.E Griffes
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Huile Essentielle Griffes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock actuel</span>
                      <span className="text-xl font-bold text-gray-900">18,3 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prix</span>
                      <span className="text-sm font-semibold text-blue-600">5,000 Ar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carte H.E Clous */}
              <Card className="border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-purple-50/80 to-white hover:from-purple-50 hover:to-purple-100/30 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Square className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 group-hover:bg-purple-200 transition-colors duration-200">
                      H.E Clous
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Huile Essentielle Clous</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock actuel</span>
                      <span className="text-xl font-bold text-gray-900">15,9 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prix</span>
                      <span className="text-sm font-semibold text-purple-600">5,000 Ar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de stockage</h2>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {stockData.length} production{stockData.length > 1 ? 's' : ''} de produits finis
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">Affichage</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-20 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="border border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white shadow-sm">
                      <th className="p-4 font-semibold text-sm text-left rounded-tl-lg">ID</th>
                      <th className="p-4 font-semibold text-sm text-left">Type de traitement</th>
                      <th className="p-4 font-semibold text-sm text-left">Quantité H.E produits</th>
                      <th className="p-4 font-semibold text-sm text-left">Matière première source</th>
                      <th className="p-4 font-semibold text-sm text-left">Quantité utilisée</th>
                      <th className="p-4 font-semibold text-sm text-left rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50/80 transition-all duration-150 ${
                          index === stockData.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-white text-sm font-bold">#{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                            {item.traitementType}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-gray-900">{item.quantityProduced} kg</span>
                          </div>
                        </td>
                        <td className="p-4">
                            {item.rawMaterial}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              {item.quantityUsed} {item.rawMaterial === "Feuille" && item.quantityUsed === 0.7 ? 'T' : 'Kg'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDetail(item)}
                              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Détail
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {stockData.map((item) => (
              <MobileStockCard
                key={item.id}
                item={item}
                onDetail={handleDetail}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Page 1 sur 3 • {stockData.length} résultats (Total: 18)
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled className="border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                Suivant
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de détails */}
      {selectedItem && isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails du produit #{selectedItem.id}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Type de traitement</p>
                    <p className="font-semibold text-gray-900">{selectedItem.traitementType}</p>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Quantité produite</p>
                    <p className="font-semibold text-gray-900">{selectedItem.quantityProduced} Kg</p>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Provenance</p>
                    <p className="font-semibold text-gray-900">{selectedItem.provenance}</p>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Matière première</p>
                    <p className="font-semibold text-gray-900">{selectedItem.rawMaterial}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleCloseModal}
                  className="w-full bg-gradient-to-r from-[#76bc21] to-[#5aa017] hover:from-[#68a81d] hover:to-[#4c8a15] text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockProduitFini
