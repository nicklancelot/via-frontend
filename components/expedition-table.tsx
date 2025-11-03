"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Download, Truck, CheckCircle, XCircle, Package } from "lucide-react"

const expeditionData = [
  { id: 1, date: "24 Mars 2024", dateReception: "25 Mars 2024", type: "Feuilles", quantity: 10, location: "Menambondro", status: "En attente" },
  { id: 2, date: "24 Mars 2024", dateReception: "25 Mars 2024", type: "Griffes", quantity: 10, location: "Menambondro", status: "En attente" },
  { id: 3, date: "24 Mars 2024", dateReception: "25 Mars 2024", type: "Griffes", quantity: 10, location: "Manakara", status: "En attente" },
  { id: 4, date: "24 Mars 2024", dateReception: "25 Mars 2024", type: "Clous", quantity: 10, location: "Menambondro", status: "Réceptionnée" },
  { id: 5, date: "24 Mars 2024", dateReception: "25 Mars 2024", type: "Clous", quantity: 10, location: "Manakara", status: "Réceptionnée" },
]

interface ExpeditionTableProps {
  onExportClick: () => void
}

// Mobile Card Component
function MobileExpeditionCard({ 
  item, 
  isSelected, 
  onSelect,
  isSelectable 
}: { 
  item: typeof expeditionData[0]
  isSelected: boolean
  onSelect: () => void
  isSelectable: boolean
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente": return "bg-amber-100 text-amber-800 border-amber-200"
      case "Réceptionnée": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Feuilles": return "bg-green-500"
      case "Griffes": return "bg-blue-500"
      case "Clous": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Card className={`mb-4 border transition-all duration-200 ${
      item.status === "Réceptionnée" 
        ? "bg-gray-50 border-gray-200" 
        : "bg-white border-gray-200 hover:shadow-md"
    }`}>
      <CardContent className="p-4">
        {/* Header avec ID et checkbox */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Expédition #{item.id}</h3>
              <p className="text-sm text-gray-600">Type: {item.type}</p>
            </div>
          </div>
          {isSelectable && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-[#76bc21] focus:ring-[#76bc21] cursor-pointer transition-colors"
                checked={isSelected}
                onChange={onSelect}
              />
            </div>
          )}
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div className="space-y-2">
            <div>
              <p className="font-medium text-gray-700">Date d'envoi</p>
              <p className="text-gray-900">{item.date}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Lieu de collecte</p>
              <p className="text-gray-900">{item.location}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="font-medium text-gray-700">Date réception</p>
              <p className="text-gray-900">{item.dateReception}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Quantité</p>
              <p className="font-semibold text-gray-900">{item.quantity} kg</p>
            </div>
          </div>
        </div>

        {/* Statut */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium`}>
            {item.status}
          </Badge>
          {item.status === "Réceptionnée" && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ExpeditionTable({ onExportClick }: ExpeditionTableProps) {
  const selectableItems = expeditionData.filter(item => item.status !== "Réceptionnée")

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [allSelected, setAllSelected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
      setAllSelected(false)
    } else {
      setSelectedIds(selectableItems.map(item => item.id))
      setAllSelected(true)
    }
  }

  const handleCheckboxChange = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id))
      setAllSelected(false)
    } else {
      const newSelected = [...selectedIds, id]
      setSelectedIds(newSelected)
      if (newSelected.length === selectableItems.length) setAllSelected(true)
    }
  }

  const handleArrivesClick = () => {
    if (selectedIds.length > 0) {
      setCurrentItemIndex(0)
      setShowModal(true)
    }
  }

  const handleYes = () => {
    const itemId = selectedIds[currentItemIndex]
    const item = expeditionData.find(i => i.id === itemId)
    if (item) item.status = "Réceptionnée"

    if (currentItemIndex + 1 < selectedIds.length) {
      setCurrentItemIndex(currentItemIndex + 1)
    } else {
      setShowModal(false)
      setSelectedIds([])
      setAllSelected(false)
    }
  }

  const handleNo = () => {
    if (currentItemIndex + 1 < selectedIds.length) {
      setCurrentItemIndex(currentItemIndex + 1)
    } else {
      setShowModal(false)
      setSelectedIds([])
      setAllSelected(false)
    }
  }

  const currentItem = expeditionData.find(i => i.id === selectedIds[currentItemIndex])

  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleArrivesClick}
              size="sm"
              className={`bg-[#76bc21] hover:bg-[#5aa017] text-white transition-colors duration-200 shadow-sm ${
                selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={selectedIds.length === 0}
            >
              <Truck className="w-4 h-4 mr-2" />
              Arrivés ({selectedIds.length})
            </Button>
            <Button 
              onClick={onExportClick} 
              variant="outline" 
              size="sm" 
              className="cursor-pointer border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          
          {/* Sélection globale - Desktop seulement */}
          <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-700 font-medium">
              {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
            </span>
            {selectableItems.length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#76bc21] focus:ring-[#76bc21] cursor-pointer"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Tout sélectionner</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                    <th className="p-4 font-semibold text-sm text-left">ID</th>
                    <th className="p-4 font-semibold text-sm text-left">Date d'envoi</th>
                    <th className="p-4 font-semibold text-sm text-left">Date réception</th>
                    <th className="p-4 font-semibold text-sm text-left">Type</th>
                    <th className="p-4 font-semibold text-sm text-left">Quantité</th>
                    <th className="p-4 font-semibold text-sm text-left">Lieu de collecte</th>
                    <th className="p-4 font-semibold text-sm text-left">Status</th>
                    <th className="p-4 font-semibold text-sm text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-white bg-white/20 checked:bg-white text-[#76bc21] focus:ring-white cursor-pointer"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expeditionData.map((item) => {
                    const isSelectable = item.status !== "Réceptionnée"
                    const isSelected = selectedIds.includes(item.id)
                    
                    return (
                      <tr 
                        key={item.id} 
                        className={`border-b border-gray-100 transition-colors duration-150 ${
                          item.status === "Réceptionnée" 
                            ? "bg-gray-50/50" 
                            : "hover:bg-gray-50/80"
                        } ${isSelected ? "bg-blue-50/50" : ""}`}
                      >
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                              <span className="text-black text-sm font-bold">#{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{item.date}</td>
                        <td className="p-4 text-gray-700">{item.dateReception}</td>
                        <td className="p-4">
                            {item.type}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">{item.quantity} kg</span>
                        </td>
                        <td className="p-4 text-gray-700">{item.location}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`${
                            item.status === "En attente" 
                              ? "bg-amber-100 text-amber-800 border-amber-200" 
                              : "bg-green-100 text-green-800 border-green-200"
                          } px-3 py-1 font-medium`}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          {isSelectable ? (
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded border-gray-300 text-[#76bc21] focus:ring-[#76bc21] cursor-pointer transition-colors"
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(item.id)}
                            />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {expeditionData.map((item) => {
              const isSelectable = item.status !== "Réceptionnée"
              const isSelected = selectedIds.includes(item.id)
              
              return (
                <MobileExpeditionCard
                  key={item.id}
                  item={item}
                  isSelected={isSelected}
                  onSelect={() => handleCheckboxChange(item.id)}
                  isSelectable={isSelectable}
                />
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              <span className="font-medium text-gray-900">{expeditionData.length}</span> expédition{expeditionData.length > 1 ? 's' : ''} au total
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                <ChevronLeft className="w-4 h-4 mr-1" /> Préc
              </Button>
              <Button variant="outline" size="sm" disabled className="border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                Suiv <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmation */}
      {showModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            {/* En-tête du modal */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmation de réception</h3>
              <p className="text-gray-600">
                Article {currentItemIndex + 1} sur {selectedIds.length}
              </p>
            </div>

            {/* Contenu du modal */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {currentItem.quantity} kg de {currentItem.type}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>📍 {currentItem.location}</span>
                  <span>📅 {currentItem.dateReception}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-700 mb-6">
              Cette expédition est-elle arrivée à destination ?
            </p>

            {/* Actions du modal */}
            <div className="flex gap-3">
              <Button
                onClick={handleNo}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 transition-colors duration-200 py-3"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Non
              </Button>
              <Button
                onClick={handleYes}
                className="flex-1 bg-[#76bc21] hover:bg-[#5aa017] text-white transition-colors duration-200 py-3"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Oui, arrivée
              </Button>
            </div>

            {/* Progression */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#76bc21] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentItemIndex + 1) / selectedIds.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {currentItemIndex + 1} sur {selectedIds.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
