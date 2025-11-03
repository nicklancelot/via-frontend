"use client"

import React, { useState } from 'react'
import { Table } from '@/components/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, FileText, Truck, MapPin, User, Package, Warehouse, Download, X, Eye, Calendar } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

// Types pour les données de transport
interface TransportItem {
  id: string
  deliveryDate: string
  unreur: string
  destinataire: string
  product: string
  weight: string
  status: string
  vehicule: string
  departureSite: string
}

// Composant Modal amélioré
const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden animate-in fade-in-90 zoom-in-90 slide-in-from-bottom-10 duration-300`}
      >
        {/* Header amélioré */}
        <div className="flex items-center justify-between p-6 border-b bg-[#76bc21] text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#5a9e1f] rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)] bg-gray-50/50">
          {children}
        </div>
      </div>
    </div>
  )
}

// Composant Status amélioré
const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Livré":
        return {
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          dotColor: "bg-emerald-500",
          label: "Livré"
        }
      case "En cours de livraison":
        return {
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          dotColor: "bg-amber-500",
          label: "En cours"
        }
      default:
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-500",
          label: status
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${config.bgColor} ${config.textColor} text-sm font-medium border`}>
      <span className={`w-2 h-2 ${config.dotColor} rounded-full mr-2 animate-pulse`}></span>
      {config.label}
    </div>
  )
}

// Composant InputField réutilisable
const InputField: React.FC<{
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  readOnly?: boolean
  className?: string
}> = ({ label, value, onChange, placeholder, type = "text", readOnly = false, className = "" }) => (
  <div className={className}>
    <Label className="text-sm font-semibold text-gray-700 mb-2 block">{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full transition-all duration-200 ${
        readOnly 
          ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' 
          : 'bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
      }`}
    />
  </div>
)

// Composant SelectField réutilisable
const SelectField: React.FC<{
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
}> = ({ label, value, onValueChange, options, placeholder, className = "" }) => (
  <div className={className}>
    <Label className="text-sm font-semibold text-gray-700 mb-2 block">{label}</Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

// Composant Checkbox personnalisé avec vraie checkbox HTML
const CheckboxField: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}> = ({ checked, onChange, label, className = "" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
    />
    {label && (
      <Label 
        className="text-sm font-medium text-gray-700 cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        {label}
      </Label>
    )}
  </div>
)

// Composant Mobile Card pour le mode responsive
const MobileTransportCard: React.FC<{
  item: TransportItem
  onDetail: (item: TransportItem) => void
  isSelected: boolean
  onSelect: (item: TransportItem) => void
}> = ({ item, onDetail, isSelected, onSelect }) => {
  return (
    <Card className={`mb-4 border transition-all duration-200 backdrop-blur-sm ${
      isSelected ? 'border-emerald-500 shadow-md bg-emerald-50' : 'border-gray-200 shadow-sm hover:shadow-md bg-white/95'
    }`}>
      <CardContent className="p-4">
        {/* Header avec ID et status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <CheckboxField
              checked={isSelected}
              onChange={() => onSelect(item)}
            />
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">#{item.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Transport #{item.id}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.deliveryDate}
              </p>
            </div>
          </div>
          <StatusIndicator status={item.status} />
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <Package className="w-3 h-3" />
              Produit
            </p>
            <p className="font-semibold text-gray-900">{item.product}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Poids</p>
            <p className="text-gray-900 font-semibold">{item.weight}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Destinataire</p>
            <p className="text-gray-900">{item.destinataire}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Site Départ</p>
            <p className="text-gray-900">{item.departureSite}</p>
          </div>
        </div>

        {/* Numéro verticale */}
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Numéro de véhicule</p>
          <p className="font-semibold text-gray-900">{item.vehicule}</p>
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
        </div>
      </CardContent>
    </Card>
  )
}

const TransportPage = () => {
  const [selectedTransport, setSelectedTransport] = useState<TransportItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<TransportItem[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tous")
  const [mpFilter, setMpFilter] = useState("Tous")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  // États pour le formulaire d'exportation
  const [exportFormData, setExportFormData] = useState({
    deliveryDate: "",
    departureSite: "",
    destination: "Magasin de stockage Manakara",
    driverFirstName: "",
    driverLastName: "",
    driverContact: "",
    recipientFirstName: "",
    recipientLastName: "",
    recipientContact: "",
    recipientFunction: "",
    productType: "",
    weight: "",
    regionalRestaurant: "",
    communalRestaurant: "",
    termsAccepted: false
  })

  // Données mockées avec les nouveaux détails
  const transportData: TransportItem[] = [
    {
      id: "1",
      deliveryDate: "01/08/2023 10:00 PM",
      unreur: "Rabets",
      destinataire: "Rabs",
      product: "HE feuille",
      weight: "200 Kg",
      status: "En cours de livraison",
      vehicule: "122.4 ABC",
      departureSite: "PK 12"
    },
    {
      id: "2",
      deliveryDate: "24 Mars 2024 à 18:22",
      unreur: "Rabets",
      destinataire: "Rabs",
      product: "HE griffe",
      weight: "100 Kg",
      status: "En cours de livraison",
      vehicule: "122.4 ABC",
      departureSite: "PK 12"
    },
    {
      id: "3",
      deliveryDate: "24 Mars 2024 à 18:22",
      unreur: "Rabets",
      destinataire: "Rabs",
      product: "HE clous",
      weight: "300 Kg",
      status: "Livré",
      vehicule: "122.4 ABC",
      departureSite: "Mastercity"
    }
  ]

  // Données détaillées pour le modal de détails
  const detailData = {
    deliveryDate: "01/08/2023 10:00 PM",
    departureSite: "",
    destination: "Manakara",
    driverLastName: "",
    driverFirstName: "Olivier",
    driverContact: "03/07/2024 11:45",
    recipientLastName: "",
    recipientFirstName: "Koto", 
    recipientContact: "03/07/2024 11:45",
    productType: "HE clous",
    weight: "",
    regionalRestaurant: "SIX",
    communalRestaurant: "XXX"
  }

  // Fonction pour sélectionner/désélectionner un item
  const handleSelectItem = (item: TransportItem) => {
    setSelectedItems(prev => {
      const isAlreadySelected = prev.some(selected => selected.id === item.id)
      if (isAlreadySelected) {
        return prev.filter(selected => selected.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  // Fonction pour sélectionner tous les items
  const handleSelectAll = () => {
    if (selectedItems.length === transportData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems([...transportData])
    }
  }

  // Fonction pour ouvrir les détails
  const handleOpenDetails = (item: TransportItem) => {
    setSelectedTransport(item)
    setIsDetailsModalOpen(true)
  }

  // En-tête avec checkbox pour sélectionner tous
  const TableHeader = () => (
    <thead className="bg-gray-50">
      <tr>
        <th className="w-12 px-4 py-3">
          <CheckboxField
            checked={selectedItems.length === transportData.length && transportData.length > 0}
            onChange={handleSelectAll}
          />
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de livraison</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Unreur</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Destinataire</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Produit</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids net</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Numéro verticale</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Site Départ</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
  )

  // Fonction pour mettre à jour les champs du formulaire
  const handleExportFormChange = (field: string, value: string | boolean) => {
    setExportFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Fonction pour réinitialiser le formulaire
  const resetExportForm = () => {
    setExportFormData({
      deliveryDate: "",
      departureSite: "",
      destination: "Magasin de stockage Manakara",
      driverFirstName: "",
      driverLastName: "",
      driverContact: "",
      recipientFirstName: "",
      recipientLastName: "",
      recipientContact: "",
      recipientFunction: "",
      productType: "",
      weight: "",
      regionalRestaurant: "",
      communalRestaurant: "",
      termsAccepted: false
    })
    setSelectedItems([])
  }

  // Fonction pour gérer l'exportation
  const handleExport = () => {
    if (selectedItems.length === 0) return
    
    console.log("Exportation vers le magasin:", selectedItems)
    // Ici vous ajouteriez la logique pour envoyer les données au backend
    
    setIsExportModalOpen(false)
    resetExportForm()
  }

  // Fonction pour ouvrir le modal d'exportation avec les données sélectionnées
  const handleOpenExportModal = () => {
    if (selectedItems.length === 0) return
    
    // Pré-remplir certains champs avec les données du premier transport sélectionné
    const firstItem = selectedItems[0]
    setExportFormData(prev => ({
      ...prev,
      deliveryDate: firstItem.deliveryDate.split(' à ')[0],
      departureSite: firstItem.departureSite,
      weight: firstItem.weight.replace(' Kg', '')
    }))
    setIsExportModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:flex">
        <Sidebar currentPage="transport" />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="w-full">
          <Header title="Transport" />
        </div>

        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Carte de filtres */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Récapitulatif de transport</h2>
                
                {/* Grille de filtres responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <InputField
                    label="Date de début"
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="JJ/MM/AAAA"
                  />
                  
                  <InputField
                    label="Date de fin"
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="JJ/MM/AAAA"
                  />
                  
                  <SelectField
                    label="Par page"
                    value="10"
                    onValueChange={() => {}}
                    options={[
                      { value: "10", label: "10" },
                      { value: "20", label: "20" },
                      { value: "50", label: "50" }
                    ]}
                    placeholder="10"
                  />
                  
                  <SelectField
                    label="MP"
                    value={mpFilter}
                    onValueChange={setMpFilter}
                    options={[
                      { value: "Tous", label: "Tous" },
                      { value: "HEF", label: "HE Feuille" },
                      { value: "HEC", label: "HE Clous" },
                      { value: "HEG", label: "HE Griffes" }
                    ]}
                    placeholder="Tous"
                  />
                  
                  <SelectField
                    label="Status"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={[
                      { value: "Tous", label: "Tous" },
                      { value: "Livré", label: "Livré" },
                      { value: "En cours", label: "En cours" }
                    ]}
                    placeholder="Tous"
                  />
                  
                  <div className="space-y-2">                
                    <div className="flex mt-7">
                      <Button className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg ">
                        Rechercher
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton d'exportation global */}
          {selectedItems.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedItems.length} élément(s) sélectionné(s)
                    </span>
                  </div>
                  <Button 
                    onClick={handleOpenExportModal}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Warehouse className="w-4 h-4 mr-2" />
                    Exporter vers le magasin ({selectedItems.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tableau principal - Desktop */}
          <div className="hidden md:block">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <table className="w-full">
                      <TableHeader />
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transportData.map((item) => (
                          <tr 
                            key={item.id}
                            className={`hover:bg-gray-50 transition-colors duration-150 ${
                              selectedItems.some(selected => selected.id === item.id) ? 'bg-emerald-50' : ''
                            }`}
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <CheckboxField
                                checked={selectedItems.some(selected => selected.id === item.id)}
                                onChange={() => handleSelectItem(item)}
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="font-semibold">{item.id}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {item.deliveryDate}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                              {item.unreur}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                              {item.destinataire}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                              {item.product}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="font-medium">{item.weight}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <StatusIndicator status={item.status} />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                              {item.vehicule}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                              {item.departureSite}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <button 
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-105 border border-emerald-200 hover:border-emerald-300"
                                onClick={() => handleOpenDetails(item)}
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cartes mobiles */}
          <div className="md:hidden space-y-4">
            {transportData.map((item) => (
              <MobileTransportCard
                key={item.id}
                item={item}
                onDetail={handleOpenDetails}
                isSelected={selectedItems.some(selected => selected.id === item.id)}
                onSelect={handleSelectItem}
              />
            ))}
          </div>

          {/* Pagination */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <span className="text-center sm:text-left font-medium">
                  5 résultats | Total : 18 | Page 1 sur 3
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="min-w-20 border-gray-300 hover:bg-gray-50">
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" disabled className="min-w-20 border-gray-300 hover:bg-gray-50">
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal d'Exportation vers le magasin */}
      <Modal 
        isOpen={isExportModalOpen} 
        onClose={() => {
          setIsExportModalOpen(false)
          resetExportForm()
        }}
        title={`Exporter vers le magasin (${selectedItems.length} élément(s))`}
        size="lg"
      >
        <div className="space-y-6 p-4 md:p-6">
          {/* Liste des éléments sélectionnés */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-[#76bc21] text-white py-4">
              <CardTitle className="flex items-center gap-3 text-lg font-bold">
                <Package className="w-5 h-5" />
                Éléments à exporter ({selectedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold">Transport #{item.id}</span>
                      <span className="text-sm text-gray-600 ml-2">- {item.product} ({item.weight})</span>
                    </div>
                    <StatusIndicator status={item.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section Envoi de produit fini */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-[#76bc21] text-white py-4">
              <CardTitle className="flex items-center gap-3 text-lg font-bold">
                <Truck className="w-5 h-5" />
                Envoi de produit fini
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <InputField
                label="Date de livraison"
                type="date"
                value={exportFormData.deliveryDate}
                onChange={(value) => handleExportFormChange("deliveryDate", value)}
              />
              
              <SelectField
                label="Lieu de départ"
                value={exportFormData.departureSite}
                onValueChange={(value) => handleExportFormChange("departureSite", value)}
                options={[
                  { value: "PK 12", label: "PK 12" },
                  { value: "Makomby", label: "Makomby" },
                  { value: "Mastercity", label: "Mastercity" }
                ]}
                placeholder="Sélectionnez un lieu"
              />
              
              <InputField
                label="Destination"
                value={exportFormData.destination}
                onChange={(value) => handleExportFormChange("destination", value)}
                placeholder="Magasin de stockage Manakara"
              />
            </CardContent>
          </Card>

          {/* Section Livreur et Destinataire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="bg-[#76bc21] text-white py-4">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <User className="w-5 h-5" />
                  Livreur
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Nom" 
                    value={exportFormData.driverLastName}
                    onChange={(value) => handleExportFormChange("driverLastName", value)}
                    placeholder="Rakoto" 
                  />
                  <InputField 
                    label="Prénom" 
                    value={exportFormData.driverFirstName}
                    onChange={(value) => handleExportFormChange("driverFirstName", value)}
                    placeholder="Livreur" 
                  />
                </div>
                <InputField 
                  label="Contact" 
                  value={exportFormData.driverContact}
                  onChange={(value) => handleExportFormChange("driverContact", value)}
                  placeholder="+261 33 44 555 06" 
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="bg-[#76bc21] text-white py-4">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <MapPin className="w-5 h-5" />
                  Destinataire
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Nom" 
                    value={exportFormData.recipientLastName}
                    onChange={(value) => handleExportFormChange("recipientLastName", value)}
                    placeholder="Rakoto" 
                  />
                  <InputField 
                    label="Prénom" 
                    value={exportFormData.recipientFirstName}
                    onChange={(value) => handleExportFormChange("recipientFirstName", value)}
                    placeholder="Livreur" 
                  />
                </div>
                <InputField 
                  label="Contact" 
                  value={exportFormData.recipientContact}
                  onChange={(value) => handleExportFormChange("recipientContact", value)}
                  placeholder="+261 33 44 555 06" 
                />
                <InputField 
                  label="Fonction" 
                  value={exportFormData.recipientFunction}
                  onChange={(value) => handleExportFormChange("recipientFunction", value)}
                  placeholder="Commercial" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsExportModalOpen(false)
                resetExportForm()
              }}
              className="min-w-24 border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              Annuler
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white min-w-24 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handleExport}
            >
              <Warehouse className="w-4 h-4 mr-2" />
              Exporter ({selectedItems.length})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Détails (lecture seule) */}
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)}
        title="Détails du transport"
        size="lg"
      >
        <div className="space-y-6 p-4 md:p-6">
          {/* Information générale */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-[#76bc21] text-white py-4">
              <CardTitle className="text-lg font-bold">
                Information générale
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Date de livraison :</Label>
                  <p className="text-gray-900 font-medium">{detailData.deliveryDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Lieu de départ :</Label>
                  <p className="text-gray-600">{detailData.departureSite || "Non spécifié"}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Destination :</Label>
                  <a 
                    href={detailData.destination} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {detailData.destination}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Livreur */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-[#76bc21] text-white py-4">
              <CardTitle className="text-lg font-bold">
                Livreur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Nom :</Label>
                  <p className="text-gray-600">{detailData.driverLastName || "Non spécifié"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Prénom :</Label>
                  <p className="text-gray-900 font-medium">{detailData.driverFirstName}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Contacts :</Label>
                  <p className="text-gray-900 font-medium">{detailData.driverContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Destinataire */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-[#76bc21] text-white py-4">
              <CardTitle className="text-lg font-bold">
                Destinataire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Nom :</Label>
                  <p className="text-gray-600">{detailData.recipientLastName || "Non spécifié"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Erenom :</Label>
                  <p className="text-gray-900 font-medium">{detailData.recipientFirstName}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Contacts :</Label>
                  <p className="text-gray-900 font-medium">{detailData.recipientContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Produit */}
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="bg-[#76bc21] text-white py-4">
              <CardTitle className="text-lg font-bold">
                Produit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Type de produits :</Label>
                  <p className="text-gray-900 font-medium">{detailData.productType}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Poids net :</Label>
                  <p className="text-gray-600">{detailData.weight || "Non spécifié"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Ristourne Régionale :</Label>
                  <p className="text-gray-900 font-medium">{detailData.regionalRestaurant}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Ristourne Communale :</Label>
                  <p className="text-gray-900 font-medium">{detailData.communalRestaurant}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsModalOpen(false)}
              className="min-w-24 border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TransportPage
