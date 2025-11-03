"use client"

import { useState } from 'react'
import { Table, TableColumn } from '@/components/Table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Search, Download, Plus, Calendar, Package, MapPin, FlaskConical, X, Users, Clock, Fuel, TreePine, Scale, Factory, ZoomIn } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Header } from '@/components/header'

// Définition du type pour les données
interface ProduitFini {
  id: number
  dateDistillation: string
  quantiteHE: number
  lieuProvenance: string
  matierePremiere: string
  quantiteUtilisee: string
}

// Composant Modal pour les détails de distillation
function DistillationDetailsModal({ 
  item, 
  isOpen, 
  onClose 
}: { 
  item: ProduitFini
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  // Données simulées pour les détails
  const detailsData = {
    usine: "PK12",
    dateDebut: "15 Jan 2024 - 08:30:00",
    dateFin: "15 Jan 2024 - 11:30:00",
    tempsDistillation: "3 heures",
    mainOeuvre: "3 personnes",
    boisChauffe: "1 unité",
    carburant: "2.5 litres",
    machineId: "XXXXXXXXXX",
    matierePremiereRestante: "0.3 Kg",
    resultat: "Feuille 17 – 2% Poids"
  }

  const InfoItem = ({ 
    icon, 
    label, 
    value, 
    highlight = false 
  }: { 
    icon: React.ReactNode
    label: string
    value: string
    highlight?: boolean
  }) => (
    <div className={cn(
      "flex items-center justify-between py-2 px-3 rounded-lg border",
      highlight 
        ? "border-[#76bc21] bg-green-50" 
        : "border-gray-200 bg-gray-50"
    )}>
      <div className="flex items-center space-x-3">
        <div className={cn(
          "p-1 rounded",
          highlight ? "text-[#76bc21]" : "text-gray-500"
        )}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-semibold text-right",
        highlight ? "text-[#76bc21]" : "text-gray-900"
      )}>
        {value}
      </span>
    </div>
  )

  const StatCard = ({ 
    label, 
    value, 
    description 
  }: { 
    label: string
    value: string
    description: string
  }) => (
    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-lg font-bold text-[#76bc21] mb-1">{value}</div>
      <div className="text-xs font-semibold text-gray-900 mb-1">{label}</div>
      <div className="text-xs text-gray-600">{description}</div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-xl w-full max-w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header du modal */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Détails de distillation</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Production #{item.id} • {item.dateDistillation}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-8">
          {/* Section Image */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Fiche technique</h3>
              <span className="px-2 py-1 bg-[#76bc21] text-white text-xs sm:text-sm rounded-full">
                Complète
              </span>
            </div>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 p-4 sm:p-8 min-h-[120px] sm:min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <ZoomIn className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-gray-600 font-medium text-sm sm:text-base">Image des détails de distillation</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Production #{item.id}</p>
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
                <button className="p-1 sm:p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                  <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Colonne 1: Informations et ressources */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] rounded-lg sm:rounded-xl p-0.5 sm:p-1">
                <div className="bg-white rounded-lg p-3 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#76bc21]" />
                    Informations et ressources
                  </h3>
                  <div className="space-y-2 sm:space-y-4">
                    <InfoItem 
                      icon={<TreePine className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Matière première utilisée"
                      value={item.matierePremiere}
                    />
                    <InfoItem 
                      icon={<Users className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Main d'œuvre"
                      value={detailsData.mainOeuvre}
                    />
                    <InfoItem 
                      icon={<Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Temps de distillation"
                      value={detailsData.tempsDistillation}
                    />
                    <InfoItem 
                      icon={<TreePine className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Bois de chauffe"
                      value={detailsData.boisChauffe}
                    />
                    <InfoItem 
                      icon={<Fuel className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Carburant"
                      value={detailsData.carburant}
                    />
                    <InfoItem 
                      icon={<Factory className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="ID Machine"
                      value={detailsData.machineId}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2: Résultats de distillation */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
                <div className="bg-white rounded-lg p-3 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                    Résultats de distillation
                  </h3>
                  <div className="space-y-2 sm:space-y-4">
                    <InfoItem 
                      icon={<Factory className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Usine de distillation"
                      value={detailsData.usine}
                    />
                    <InfoItem 
                      icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Date de début"
                      value={detailsData.dateDebut}
                    />
                    <InfoItem 
                      icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Date de fin"
                      value={detailsData.dateFin}
                    />
                    <InfoItem 
                      icon={<Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Temps total"
                      value={detailsData.tempsDistillation}
                    />
                    <InfoItem 
                      icon={<Scale className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Quantité H.E produite"
                      value={`${item.quantiteHE} Kg`}
                      highlight
                    />
                    <InfoItem 
                      icon={<Scale className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Matière première utilisée"
                      value={item.quantiteUtilisee}
                    />
                    <InfoItem 
                      icon={<Scale className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Matière première restante"
                      value={detailsData.matierePremiereRestante}
                    />
                    <InfoItem 
                      icon={<Scale className="w-3 h-3 sm:w-4 sm:h-4" />}
                      label="Résultat"
                      value={detailsData.resultat}
                      highlight
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de provenance */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
            <div className="bg-white rounded-lg p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500" />
                Informations de provenance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Lieu de provenance</div>
                  <div className="text-[#76bc21] font-bold text-base sm:text-lg">{item.lieuProvenance}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <TreePine className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Type de matière</div>
                  <div className="text-[#76bc21] font-bold text-base sm:text-lg">{item.matierePremiere}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FlaskConical className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Rendement</div>
                  <div className="text-[#76bc21] font-bold text-base sm:text-lg">{(item.quantiteHE / parseFloat(item.quantiteUtilisee) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques de rendement */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
            <div className="bg-white rounded-lg p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Statistiques de rendement</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <StatCard 
                  label="Efficacité"
                  value="85%"
                  description="Rendement global"
                />
                <StatCard 
                  label="Durée"
                  value={detailsData.tempsDistillation}
                  description="Temps de distillation"
                />
                <StatCard 
                  label="Production"
                  value={`${item.quantiteHE} Kg`}
                  description="Huile essentielle"
                />
                <StatCard 
                  label="Taux conversion"
                  value="92%"
                  description="Matière première"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer du modal */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
          >
            Fermer
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 sm:px-6 py-2 bg-[#76bc21] text-white rounded-lg hover:bg-[#5aa017] transition-colors duration-200 text-sm sm:text-base"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  )
}

// Mobile Card Component
function MobileProduitCard({ 
  item, 
  onDetail 
}: { 
  item: ProduitFini
  onDetail: (item: ProduitFini) => void
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
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* Header avec ID et date */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">#{item.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Production #{item.id}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.dateDistillation}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={`${getMatiereColor(item.matierePremiere)} text-white border-0`}>
            {item.matierePremiere}
          </Badge>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <FlaskConical className="w-3 h-3" />
              H.E Produite
            </p>
            <p className="font-semibold text-gray-900">{item.quantiteHE} kg</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">MP Utilisée</p>
            <p className="text-gray-900">{item.quantiteUtilisee}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Provenance
            </p>
            <p className="text-gray-900">{item.lieuProvenance}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <Package className="w-3 h-3" />
              Type MP
            </p>
            <p className="text-gray-900">{item.matierePremiere}</p>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDetail(item)}
          className="w-full flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          <Eye className="w-4 h-4" />
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  )
}

const ProduitFini = () => {
  // Données mockées basées sur l'image
  const [data, setData] = useState<ProduitFini[]>([
    { id: 2, dateDistillation: "24 Mars 2024", quantiteHE: 5, lieuProvenance: "Véthème", matierePremiere: "Clous", quantiteUtilisee: "10 kg" },
    { id: 3, dateDistillation: "24 Mars 2024", quantiteHE: 10, lieuProvenance: "Mémokara", matierePremiere: "Griffes", quantiteUtilisee: "10 kg" },
    { id: 4, dateDistillation: "24 Mars 2024", quantiteHE: 10, lieuProvenance: "Mémokara", matierePremiere: "Feuille", quantiteUtilisee: "17 kg" },
    { id: 5, dateDistillation: "24 Mars 2024", quantiteHE: 10, lieuProvenance: "Manembondro", matierePremiere: "Feuille", quantiteUtilisee: "10 kg" },
  ])

  const [selectedItem, setSelectedItem] = useState<ProduitFini | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fonction pour gérer le détail
  const handleDetail = (item: ProduitFini) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleExport = () => {
    console.log("Exportation des données:", data)
  }

  const handleSearch = (term: string) => {
    console.log("Recherche:", term)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className='md:flex'>
        <Sidebar currentPage="produitFini" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Produit Fini (Historisation)" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
          <Card className="border border-gray-200 shadow-sm mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date de début</Label>
                    <Input type="date" className="w-full md:w-40 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date de fin</Label>
                    <Input type="date" className="w-full md:w-40 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Matière première</Label>
                    <Select>
                      <SelectTrigger className="w-full md:w-40 border-gray-300">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les MP</SelectItem>
                        <SelectItem value="griffes">Griffes</SelectItem>
                        <SelectItem value="clous">Clous</SelectItem>
                        <SelectItem value="feuilles">Feuilles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Par page</Label>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-full md:w-24 border-gray-300">
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
                  <Button className="bg-[#76bc21] hover:bg-[#5aa017] text-white transition-colors duration-200">
                    <Search className="w-4 h-4 mr-2" />
                    Chercher
                  </Button>

                  <Button 
                    onClick={handleExport}
                    variant="outline" 
                    className="border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {data.length} production{data.length > 1 ? 's' : ''} d'huile essentielle
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">Affichage</span>
              <Select defaultValue="10">
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
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="border border-gray-200 shadow-sm">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                      <th className="p-4 font-semibold text-sm text-left">ID</th>
                      <th className="p-4 font-semibold text-sm text-left">Date distillation</th>
                      <th className="p-4 font-semibold text-sm text-left">Quantité H.E</th>
                      <th className="p-4 font-semibold text-sm text-left">Matière première</th>
                      <th className="p-4 font-semibold text-sm text-left">Quantité utilisée</th>
                      <th className="p-4 font-semibold text-sm text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#76bc21] rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {item.dateDistillation}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-gray-900">{item.quantiteHE} kg</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-[#76bc21] text-white">
                            {item.matierePremiere}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">{item.quantiteUtilisee}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDetail(item)}
                            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            Détail
                          </Button>
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
            {data.map((item) => (
              <MobileProduitCard
                key={item.id}
                item={item}
                onDetail={handleDetail}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Page 1 sur 3 • {data.length} résultats (Total: 18)
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled className="border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                Suivant
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de détails */}
      {selectedItem && (
        <DistillationDetailsModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default ProduitFini
