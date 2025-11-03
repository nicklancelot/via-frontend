'use client'
import React, { useState } from 'react'
import Table, { TableColumn, TableAction } from '@/components/Table'
import { CheckSquare, Eye, Truck, Calendar, User, Car, Package, MapPin } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import ReceptionSummaryCards from '@/components/reception-summary-cards'
import { ExportModal } from '@/components/export-modal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"

type ReceptionRow = {
  id: string
  date: string
  produit: 'HEG' | 'HEC' | 'HEF'
  status: 'arriver' | 'en attente'
  provenance: string
  quantiteKg: number
  dateLivraison?: string
  dateReception?: string
  livreur?: string
  numeroAutomobile?: string
  infosItule?: string
}

const sampleData: ReceptionRow[] = [
  { 
    id: 'R-1001', 
    date: '2025-10-01', 
    produit: 'HEG', 
    status: 'arriver', 
    provenance: 'Usine A', 
    quantiteKg: 1200,
    dateLivraison: '2025-10-01',
    dateReception: '2025-10-01',
    livreur: 'Jean Dupont',
    numeroAutomobile: 'AB-123-CD',
    infosItule: 'Livraison express - Colis fragile'
  },
  { 
    id: 'R-1002', 
    date: '2025-10-02', 
    produit: 'HEC', 
    status: 'en attente', 
    provenance: 'Port B', 
    quantiteKg: 800,
    dateLivraison: '2025-10-02',
    livreur: 'Marie Martin',
    numeroAutomobile: 'EF-456-GH',
    infosItule: 'Contrôle qualité en cours'
  },
  { 
    id: 'R-1003', 
    date: '2025-10-03', 
    produit: 'HEF', 
    status: 'arriver', 
    provenance: 'Entrepot C', 
    quantiteKg: 500,
    dateLivraison: '2025-10-03',
    dateReception: '2025-10-03',
    livreur: 'Pierre Durand',
    numeroAutomobile: 'IJ-789-KL',
    infosItule: 'Stockage zone climatisée'
  },
  { 
    id: 'R-1004', 
    date: '2025-10-04', 
    produit: 'HEG', 
    status: 'en attente', 
    provenance: 'Usine D', 
    quantiteKg: 1500,
    dateLivraison: '2025-10-04',
    livreur: 'Sophie Lambert',
    numeroAutomobile: 'MN-012-OP',
    infosItule: 'En attente de dédouanement'
  },
  { 
    id: 'R-1005', 
    date: '2025-10-05', 
    produit: 'HEC', 
    status: 'en attente', 
    provenance: 'Port E', 
    quantiteKg: 700,
    dateLivraison: '2025-10-05',
    livreur: 'Luc Petit',
    numeroAutomobile: 'QR-345-ST',
    infosItule: 'Vérification documents'
  },
]

// Composant Mobile Card pour l'affichage responsive
const MobileReceptionCard = ({ 
  item, 
  isSelected, 
  onToggleSelect,
  onViewDetails 
}: { 
  item: ReceptionRow
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onViewDetails: (item: ReceptionRow) => void
}) => (
  <div className="mb-4 border bg-white rounded-2xl shadow-sm p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-semibold text-gray-900">{item.id}</h4>
        <p className="text-sm text-gray-600">{item.date}</p>
        <p className="text-sm text-gray-700">{item.produit}</p>
      </div>
      <div className="text-right">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === "arriver"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.status === "arriver" ? "Arrivé" : "En attente"}
        </span>
        <p className="text-sm font-medium text-gray-700 mt-1">{item.quantiteKg.toLocaleString()} Kg</p>
        <p className="text-xs text-gray-500">{item.provenance}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onViewDetails(item)}
        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Eye className="w-4 h-4" />
        <span className="ml-2">Voir détails</span>
      </Button>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(item.id)}
        disabled={item.status === "arriver"}
        className={`w-4 h-4 accent-[#76bc21] cursor-pointer ${
          item.status === "arriver" ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={item.status === "arriver" ? "Déjà arrivé" : "Sélectionner pour arrivage"}
      />
    </div>
  </div>
)

// Composant Modal de détails
const DetailsModal = ({ 
  isOpen, 
  onClose, 
  item 
}: { 
  isOpen: boolean
  onClose: () => void
  item: ReceptionRow | null
}) => {
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Détails de la réception #{item.id}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations principales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations principales</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Produit
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">{item.produit}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Quantité</p>
                  <p className="font-semibold text-gray-900 mt-1">{item.quantiteKg.toLocaleString()} Kg</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Provenance
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">{item.provenance}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Statut</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${
                      item.status === "arriver"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "arriver" ? "Arrivé" : "En attente"}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates importantes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dates importantes</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de livraison
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {item.dateLivraison || 'Non spécifiée'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de réception
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {item.dateReception || 'En attente'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations transport */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations transport</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Livreur
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {item.livreur || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Numéro automobile
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {item.numeroAutomobile || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations itulé */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations complémentaires</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Informations itulé</p>
                <p className="font-semibold text-gray-900">
                  {item.infosItule || 'Aucune information supplémentaire'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] hover:from-[#68a81d] hover:to-[#4c8a15] text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReceptionPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isArriveModalOpen, setIsArriveModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ReceptionRow | null>(null)
  const [arriveData, setArriveData] = useState<{ 
    dateReception?: string 
  }>({})
  
  // États pour les filtres
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  
  // État pour les données et les sélections
  const [data, setData] = useState<ReceptionRow[]>(sampleData)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    const item = data.find(item => item.id === id)
    if (item && item.status === "arriver") {
      return
    }
    
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Récupérer les données sélectionnées pour le modal
  const selectedItems = data.filter(item => selectedIds.has(item.id))

  // Fonction pour mettre à jour le statut des éléments sélectionnés
  const updateStatusToArriver = () => {
    setData(prevData => 
      prevData.map(item => 
        selectedIds.has(item.id) 
          ? { 
              ...item, 
              status: 'arriver' as const,
              dateReception: arriveData.dateReception || new Date().toISOString().split('T')[0]
            }
          : item
      )
    )
    setSelectedIds(new Set())
  }

  const handleSearch = () => {
    console.log("Recherche avec:", { dateDebut, dateFin, searchTerm })
  }

  const handleViewDetails = (item: ReceptionRow) => {
    setSelectedItem(item)
    setIsDetailsModalOpen(true)
  }

  // Filtrage des données
  const filteredData = data.filter((item) => {
    const matchesStart = dateDebut ? item.date >= dateDebut : true
    const matchesEnd = dateFin ? item.date <= dateFin : true
    const text = `${item.id} ${item.date} ${item.produit} ${item.status} ${item.provenance} ${item.quantiteKg}`.toLowerCase()
    const matchesSearch = searchTerm ? text.includes(searchTerm.toLowerCase()) : true
    return matchesStart && matchesEnd && matchesSearch
  })

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="md:flex md:flex-shrink-0">
        <Sidebar currentPage="reception" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Liste des huiles essentielles en réception" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="cursor-pointer mb-6">
            <ReceptionSummaryCards data={data} />
          </div>

          {/* Filtres */}
          <div className="bg-white border border-gray-200 shadow-sm mb-6 backdrop-blur-sm rounded-lg">
            <div className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date de début</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        type="date"
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200 w-full md:w-40"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date de fin</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        type="date"
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] transition-all duration-200 w-full md:w-40"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end gap-3 flex-1 mt-6">
                  <Button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] hover:from-[#68a81d] hover:to-[#4c8a15] text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Filter className="w-4 h-4 mr-2"/>
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Liste des réceptions</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsArriveModalOpen(true)}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[#76bc21] text-white rounded hover:bg-[#68a81d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Truck className="w-4 h-4" />
                  Arriver ({selectedIds.size})
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Exporter
                </button>
              </div>
            </div>

            {/* Mobile list: show cards */}
            <div className="md:hidden p-4">
              {filteredData.map((item) => (
                <MobileReceptionCard 
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={toggleSelect}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                  <tr>
                    <th className="w-12 px-4 py-4 font-semibold text-sm text-left rounded-tl-lg"></th>
                    <th className="px-4 py-4 font-semibold text-sm text-left">ID</th>
                    <th className="px-4 py-4 font-semibold text-sm text-left">Date de réception</th>
                    <th className="px-4 py-4 font-semibold text-sm text-left">Statut</th>
                    <th className="px-4 py-4 font-semibold text-sm text-left">Provenance</th>
                    <th className="px-4 py-4 font-semibold text-sm text-left">Quantité (kg)</th>
                    <th className="px-4 py-4 font-semibold text-sm text-left rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50/80 transition-all duration-150 ${
                        index === filteredData.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          disabled={item.status === "arriver"}
                          className={`w-4 h-4 accent-[#76bc21] cursor-pointer ${
                            item.status === "arriver" ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={item.status === "arriver" ? "Déjà arrivé" : "Sélectionner pour arrivage"}
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">{item.id}</td>
                      <td className="px-4 py-4 text-gray-700">{item.date}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.status === "arriver"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status === "arriver" ? "Arrivé" : "En attente"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{item.provenance}</td>
                      <td className="px-4 py-4 text-gray-700 text-center">{item.quantiteKg.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              {filteredData.length} réception{filteredData.length > 1 ? 's' : ''}
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

      {/* Export Modal */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />

      {/* Arrival Modal */}
      {isArriveModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Réception du produit fini</h2>
              
              {selectedItems.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium mb-2">Produits sélectionnés :</p>
                  <ul className="text-sm text-gray-600">
                    {selectedItems.map(item => (
                      <li key={item.id}>
                        {item.id} - {item.produit} - {item.quantiteKg}kg
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4">
                Confirmer la réception des produits sélectionnés
              </p>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm text-gray-700">Date de réception</label>
                <input
                  type="date"
                  value={arriveData.dateReception || ''}
                  onChange={(e) => setArriveData({ ...arriveData, dateReception: e.target.value })}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#76bc21] focus:border-transparent"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setIsArriveModalOpen(false)
                    setArriveData({})
                  }}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 rounded bg-[#76bc21] text-white hover:bg-[#68a81d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (!arriveData.dateReception) {
                      alert('Veuillez sélectionner une date de réception')
                      return
                    }
                    
                    updateStatusToArriver()
                    
                    alert(`Arrivage enregistré pour ${selectedItems.length} produit(s)\nDate: ${arriveData.dateReception}\nIDs: ${Array.from(selectedIds).join(', ')}`)
                    setIsArriveModalOpen(false)
                    setArriveData({})
                  }}
                  disabled={!arriveData.dateReception}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <DetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedItem(null)
        }}
        item={selectedItem}
      />
    </div>
  )
}
