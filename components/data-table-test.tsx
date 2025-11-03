"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ChevronLeft, ChevronRight, Plus, FileText, Truck, CheckCircle, Receipt, Search, Download } from "lucide-react"

// Import de tes modals
import { FacturationHuilleEssentielle } from "./FacturationHuilleEssentielle"
import { FicheLivraisonModal } from "./FicheLivraison-test"
import { ConfirmationModal } from "./ConfirmationModal"
import { InsertionModalTest } from "./insertion-modal-test"
import { LivraisonTest } from "./Livraison-test"
import { ValidationHuille } from "@/components/ValidationHuille"


const mockData = [
  { id: 1, date: "24 Mars 2024", type: "Feuilles",  poids: 10, quantity: 10, location: "Manakara", status: "En attente de livraison" },
  { id: 2, date: "24 Mars 2024", type: "Griffes", poids: 10, quantity: 10, location: "Menambondro", status: "Accepté" },
  { id: 3, date: "24 Mars 2024", type: "Griffes", poids: 10, quantity: 10, location: "Manakara", status: "En cours de test" },
  { id: 4, date: "24 Mars 2024", type: "Clous", poids: 10, quantity: 10, location: "Menambondro", status: "En cours de test" },
  { id: 5, date: "24 Mars 2024", type: "Clous", poids: 10, quantity: 10, location: "Manakara", status: "Livraison en cours" },  
]

// Mobile Card Component
function MobileCard({ 
  item, 
  isOpen, 
  onToggle, 
  renderActions 
}: { 
  item: typeof mockData[0]
  isOpen: boolean
  onToggle: () => void
  renderActions: (item: typeof mockData[0]) => React.ReactNode
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente de livraison": return "bg-amber-100 text-amber-800 border-amber-200"
      case "Accepté": return "bg-green-100 text-green-800 border-green-200"
      case "En cours de test": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Livraison en cours": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* Header avec ID et actions */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">#{item.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Test #{item.id}</h3>
              <p className="text-sm text-gray-600">{item.date}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={`p-2 border-gray-300 ${item.status === "Livraison en cours" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={onToggle}
            disabled={item.status === "Livraison en cours"}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Type MP</p>
            <Badge variant="secondary" className="bg-[#76bc21] text-white">
              {item.type}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Poids tester</p>
            <p className="font-semibold text-gray-900">{item.location}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Statut</p>
            <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium`}>
              {item.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Teneur en eau</p>
            <p className="font-semibold text-gray-900">{item.quantity} kg</p>
          </div>
        </div>

        {/* Actions menu */}
        {isOpen && (
          <div className="border-t pt-3 mt-3">
            <div className="grid grid-cols-1 gap-1">
              {renderActions(item)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DataTable() {
  const [isLivraisonTestOpen, setIsLivraisonTestOpen] = useState(false)
  const [isValidationHuilleOpen, setIsValidationHuilleOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  // States des modals
  const [isFacturationOpen, setIsFacturationOpen] = useState(false)
  const [isFicheLivraisonOpen, setIsFicheLivraisonOpen] = useState(false)
  const [isConfirmLivraisonOpen, setIsConfirmLivraisonOpen] = useState(false)
  const [isInsertionOpen, setIsInsertionOpen] = useState(false)

  const filteredData = mockData.filter((item) =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleMenu = (id: number) => {
    const item = mockData.find(item => item.id === id)
    if (item && item.status === "Livraison en cours") return
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente de livraison": return "bg-amber-100 text-amber-800 border-amber-200"
      case "Accepté": return "bg-green-100 text-green-800 border-green-200"
      case "En cours de test": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Livraison en cours": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleValidationConfirm = (decision: string, poidsAgree: string, observations: string) => {
    console.log("Décision:", decision)
    console.log("Poids agréé:", poidsAgree)
    console.log("Observations:", observations)
    // Ici vous pouvez mettre à jour le statut de l'élément dans votre state
  }

  const renderActions = (item: typeof mockData[0]) => {
    const btnClass = "flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 text-left rounded-lg border border-transparent hover:border-gray-200"

    switch (item.status) {
      case "Accepté":
        return (
          <button className={btnClass} onClick={() => setIsFacturationOpen(true)}>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Facturer</div>
              <div className="text-xs text-gray-500">Générer une facture</div>
            </div>
          </button>
        )

      case "En cours de test":
        return (
          <button className={btnClass} onClick={() => setIsValidationHuilleOpen(true)}>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Validation Test</div>
              <div className="text-xs text-gray-500">Confirmer les résultats</div>
            </div>
          </button>
        )

      case "En attente de livraison":
        return (
          <div className="space-y-1">
            <button className={btnClass} onClick={() => setIsFicheLivraisonOpen(true)}>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Fiche Livraison</div>
                <div className="text-xs text-gray-500">Document de livraison</div>
              </div>
            </button>
            <button className={btnClass} onClick={() => setIsLivraisonTestOpen(true)}>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Livraison</div>
                <div className="text-xs text-gray-500">Organiser la livraison</div>
              </div>
            </button>
          </div>
        )

      default:
        return (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            Aucune action disponible
          </div>
        )
    }
  }

  const handleConfirmLivraison = () => {
    console.log("Livraison confirmée !")
    setIsConfirmLivraisonOpen(false)
  }

  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="bg-[#76bc21] hover:bg-[#5aa017] text-white cursor-pointer transition-colors duration-200 shadow-sm"
              onClick={() => setIsInsertionOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              <Truck className="w-4 h-4 mr-2" />
              Livraison
            </Button>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher par type ou provenance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-80 border-gray-300 focus:border-[#76bc21] transition-colors duration-200"
            />
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
                    <th className="p-4 font-semibold text-sm text-left">Date de réception</th>
                    <th className="p-4 font-semibold text-sm text-left">Type MP</th>
                    <th className="p-4 font-semibold text-sm text-left">Provenance</th>
                    <th className="p-4 font-semibold text-sm text-left">Poids tester</th>
                    <th className="p-4 font-semibold text-sm text-left">Status</th>
                    <th className="p-4 font-semibold text-sm text-left">Teneur en eau</th>
                    <th className="p-4 font-semibold text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="p-4 font-medium text-gray-900">
                        <div className="flex items-left gap-2">
                          <div className="w-8 h-8 bg-[#76bc21] rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">#{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 text-left">{item.date}</td>
                      <td className="p-4 text-left">
                          {item.type}
                      </td>
                      <td className="p-4 text-gray-700 text-left">{item.location}</td>
                      <td className="p-4 text-gray-700 text-left">{item.quantity}kg</td>
                      <td className="p-4 text-left">
                        <Badge variant="outline" className={`${getStatusColor(item.status)} px-3 py-1 font-medium `}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-left">
                        <span className="font-semibold text-gray-900 ">{item.poids} L</span>
                      </td>
                      <td className="p-4 relative text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`p-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 ${
                            item.status === "Livraison en cours" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          }`}
                          onClick={() => toggleMenu(item.id)}
                          disabled={item.status === "Livraison en cours"}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>

                        {openMenuId === item.id && (
                          <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                            {renderActions(item)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {filteredData.map((item) => (
              <MobileCard
                key={item.id}
                item={item}
                isOpen={openMenuId === item.id}
                onToggle={() => toggleMenu(item.id)}
                renderActions={renderActions}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              <span className="font-medium text-gray-900">{filteredData.length}</span> résultat{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
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

      {/* Modals */}
      <LivraisonTest
        isOpen={isLivraisonTestOpen}
        onClose={() => setIsLivraisonTestOpen(false)}
      />
      <InsertionModalTest
        isOpen={isInsertionOpen}
        onClose={() => setIsInsertionOpen(false)}
      />
      <FacturationHuilleEssentielle
        isOpen={isFacturationOpen}
        onClose={() => setIsFacturationOpen(false)}
      />
      <FicheLivraisonModal
        isOpen={isFicheLivraisonOpen}
        onClose={() => setIsFicheLivraisonOpen(false)}
      />
      <ConfirmationModal
        isOpen={isConfirmLivraisonOpen}
        onClose={() => setIsConfirmLivraisonOpen(false)}
        onConfirm={handleConfirmLivraison}
        message="Voulez-vous valider ce test ?"
      />

      {/* Modal Validation Huile */}
      <ValidationHuille
        isOpen={isValidationHuilleOpen}
        onClose={() => setIsValidationHuilleOpen(false)}
        onConfirm={handleValidationConfirm}
      />
    </>
  )
}
