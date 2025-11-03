"use client"

import React, { useState } from "react"
import { Eye, Plus, Filter, Download, Calendar, MapPin, Scale, Search, MoreVertical, TestTube, CheckSquare, FileText, Ban, User, Package, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

// Types
type AgreageStatus = "En attente de test" | "En cours de test" | "Validé" | "Refusé"
type MarchandiseType = "HEFG" | "HECG" | "HEGG"

interface AgreageItem {
  id: number
  date: string
  poids: string
  marchandise: MarchandiseType
  client: string
  status: AgreageStatus
  provenance: string
  poidsTeste: number
  corpsEtranger: "Oui" | "Non"
  densite?: number
  dateTest?: string
  resultatTest?: string
  vallisier?: string
}

// Données simulées
const initialData: AgreageItem[] = [
  { 
    id: 1, 
    date: "24 Mars 2024", 
    poids: "10 Kg", 
    marchandise: "HEFG", 
    client: "Jhon", 
    status: "En attente de test", 
    provenance: "PK 12", 
    poidsTeste: 1, 
    corpsEtranger: "Non",
    vallisier: "Jean Dupont"
  },
  { 
    id: 2, 
    date: "24 Mars 2024", 
    poids: "15 Kg", 
    marchandise: "HECG", 
    client: "Marie", 
    status: "En cours de test", 
    provenance: "PK 12", 
    poidsTeste: 1.5, 
    corpsEtranger: "Non",
    densite: 0.95,
    dateTest: "25 Mars 2024",
    vallisier: "Pierre Martin"
  },
  { 
    id: 3, 
    date: "23 Mars 2024", 
    poids: "20 Kg", 
    marchandise: "HEGG", 
    client: "Sophie", 
    status: "Validé", 
    provenance: "Mokomby", 
    poidsTeste: 2, 
    corpsEtranger: "Non",
    densite: 0.92,
    dateTest: "24 Mars 2024",
    resultatTest: "Test réussi - Marchandise conforme",
    vallisier: "Luc Bernard"
  },
  { 
    id: 4, 
    date: "22 Mars 2024", 
    poids: "12 Kg", 
    marchandise: "HEGG", 
    client: "Paul", 
    status: "Refusé", 
    provenance: "Mokomby", 
    poidsTeste: 1.2, 
    corpsEtranger: "Oui",
    densite: 0.88,
    dateTest: "23 Mars 2024",
    resultatTest: "Présence de corps étrangers détectée",
    vallisier: "Alice Petit"
  },
]

// Modal Détails de l'agréage
function ModalDetails({
  isOpen,
  setIsOpen,
  item
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  item: AgreageItem | null
}) {
  if (!item) return null

  const getStatusColor = (status: AgreageStatus) => {
    switch (status) {
      case "Validé": return "bg-green-100 text-green-800 border-green-200"
      case "Refusé": return "bg-red-100 text-red-800 border-red-200"
      case "En cours de test": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "En attente de test": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMarchandiseColor = (marchandise: MarchandiseType) => {
    switch (marchandise) {
      case "HEFG": return "bg-green-500"
      case "HECG": return "bg-purple-500"
      case "HEGG": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const getMarchandiseText = (marchandise: MarchandiseType) => {
    switch (marchandise) {
      case "HEFG": return "Huile Feuille (HEFG)"
      case "HECG": return "Huile Clous (HECG)"
      case "HEGG": return "Huile Griffe (HEGG)"
      default: return marchandise
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Détails de l'agréage - #{item.id}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur cet agréage provisoire
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec statut */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">#{item.id}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Agréage #{item.id}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Créé le {item.date}
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(item.status)} border px-3 py-1 text-sm font-medium`}>
              {item.status}
            </Badge>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne 1: Informations de base */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Informations de la marchandise
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Type de marchandise</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getMarchandiseColor(item.marchandise)} text-white border-0`}>
                        {item.marchandise}
                      </Badge>
                      <span className="text-sm text-gray-900">{getMarchandiseText(item.marchandise)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Scale className="w-4 h-4" />
                      Poids net
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{item.poids}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Poids testé</span>
                    <span className="text-sm font-semibold text-gray-900">{item.poidsTeste} kg</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Provenance
                    </span>
                    <span className="text-sm text-gray-900">{item.provenance}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Corps étranger</span>
                    <Badge className={`
                      ${item.corpsEtranger === "Oui" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      border-0
                    `}>
                      {item.corpsEtranger}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colonne 2: Informations client et test */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informations client
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Nom du client</span>
                    <span className="text-sm text-gray-900">{item.client}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Vallisier</span>
                    <span className="text-sm text-gray-900">{item.vallisier || "Non assigné"}</span>
                  </div>
                </div>

                {/* Informations du test */}
                {(item.status === "En cours de test" || item.status === "Validé" || item.status === "Refusé") && (
                  <>
                    <h4 className="font-semibold text-gray-900 mt-6 mb-4 flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                      Informations du test
                    </h4>
                    <div className="space-y-4">
                      {item.dateTest && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Date du test
                          </span>
                          <span className="text-sm text-gray-900">{item.dateTest}</span>
                        </div>
                      )}
                      
                      {item.densite && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">Densité</span>
                          <span className="text-sm font-semibold text-gray-900">{item.densite}</span>
                        </div>
                      )}
                      
                      {item.resultatTest && (
                        <div className="py-2">
                          <span className="text-sm font-medium text-gray-600 block mb-2">Résultat du test</span>
                          <div className={`p-3 rounded-lg text-sm ${
                            item.status === "Validé" 
                              ? "bg-green-50 text-green-800 border border-green-200" 
                              : item.status === "Refusé"
                              ? "bg-red-50 text-red-800 border border-red-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}>
                            <div className="flex items-start gap-2">
                              {item.status === "Refusé" && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                              {item.resultatTest}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Message pour statut en attente */}
                {item.status === "En attente de test" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">En attente de test</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Cet agréage est en attente de test de la marchandise. Aucune information de test n'est disponible pour le moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résumé des actions possibles */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Actions disponibles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {item.status === "En attente de test" && (
                  <>
                    <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <TestTube className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="text-sm font-medium text-blue-800">Test de la marchandise</p>
                      <p className="text-xs text-blue-600 mt-1">Démarrer le test de qualité</p>
                    </div>
                  </>
                )}
                
                {item.status === "En cours de test" && (
                  <>
                    <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                      <CheckSquare className="w-5 h-5 text-green-600 mb-1" />
                      <p className="text-sm font-medium text-green-800">Valider le test</p>
                      <p className="text-xs text-green-600 mt-1">Approuver les résultats</p>
                    </div>
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <Ban className="w-5 h-5 text-red-600 mb-1" />
                      <p className="text-sm font-medium text-red-800">Annuler le test</p>
                      <p className="text-xs text-red-600 mt-1">Revenir à l'état précédent</p>
                    </div>
                  </>
                )}
                
                {item.status === "Validé" && (
                  <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                    <FileText className="w-5 h-5 text-purple-600 mb-1" />
                    <p className="text-sm font-medium text-purple-800">Agréage définitif</p>
                    <p className="text-xs text-purple-600 mt-1">Finaliser l'agréage</p>
                  </div>
                )}
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <Eye className="w-5 h-5 text-gray-600 mb-1" />
                  <p className="text-sm font-medium text-gray-800">Vue détaillée</p>
                  <p className="text-xs text-gray-600 mt-1">Informations complètes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="flex-1 border-gray-300"
          >
            Fermer
          </Button>
          <Button 
            onClick={() => {
              setIsOpen(false)
              // Ici vous pouvez ajouter une action supplémentaire si nécessaire
            }}
            className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017]"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exporter les détails
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Modal pour créer une agrégation provisoire
function ModalCreerAgregation({ 
  isOpen, 
  setIsOpen,
  selectedItems 
}: { 
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  selectedItems: AgreageItem[]
}) {
  const [formData, setFormData] = useState({
    marchandise: "HEFG",
    poidsNet: "",
    nomClient: "",
    contact: ""
  })

  const handleSubmit = () => {
    console.log("Données de l'agrégation:", formData)
    console.log("IDs sélectionnés:", selectedItems.map(item => item.id))
    setIsOpen(false)
    setFormData({
      marchandise: "HEFG",
      poidsNet: "",
      nomClient: "",
      contact: ""
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Créer une agrégation provisoire
          </DialogTitle>
        </DialogHeader>
        
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800 mb-2">
              IDs sélectionnés pour l'agrégation:
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedItems.map((item) => (
                <div key={item.id} className="bg-[#76bc21] text-white">
                  #{item.id}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Produit</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="hefg" 
                  name="marchandise" 
                  value="HEFG"
                  checked={formData.marchandise === "HEFG"}
                  onChange={(e) => setFormData({...formData, marchandise: e.target.value as MarchandiseType})}
                  className="text-[#76bc21] focus:ring-[#76bc21]"
                />
                <Label htmlFor="hefg" className="text-sm font-normal">Huile Griffe (HEGG)</Label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="hecg" 
                  name="marchandise" 
                  value="HECG"
                  checked={formData.marchandise === "HECG"}
                  onChange={(e) => setFormData({...formData, marchandise: e.target.value as MarchandiseType})}
                  className="text-[#76bc21] focus:ring-[#76bc21]"
                />
                <Label htmlFor="hecg" className="text-sm font-normal">Huile Clous (HECG)</Label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="hefg2" 
                  name="marchandise" 
                  value="HEFG"
                  checked={formData.marchandise === "HEFG"}
                  onChange={(e) => setFormData({...formData, marchandise: e.target.value as MarchandiseType})}
                  className="text-[#76bc21] focus:ring-[#76bc21]"
                />
                <Label htmlFor="hefg2" className="text-sm font-normal">Huile Feuille (HEFG)</Label>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Agréage provisoire</h3>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                      Nature de marchandise
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                      Poids net (kG)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-gray-200 text-gray-600">
                      Huile Feuille (HEFG)
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <Input 
                        type="number" 
                        placeholder="10"
                        value={formData.poidsNet}
                        onChange={(e) => setFormData({...formData, poidsNet: e.target.value})}
                        className="w-20 border-gray-300"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Client</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Nom</Label>
                <Input 
                  placeholder="Jhon"
                  value={formData.nomClient}
                  onChange={(e) => setFormData({...formData, nomClient: e.target.value})}
                  className="mt-1 border-gray-300"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Contact</Label>
                <Input 
                  placeholder="+20133 44 555 66"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="mt-1 border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="flex-1 border-gray-300"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017]"
          >
            Créer l'agrégation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Modal Test de la marchandise
function ModalTestMarchandise({
  isOpen,
  setIsOpen,
  item
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  item: AgreageItem | null
}) {
  const [formData, setFormData] = useState({
    pagination: "Oui",
    dateTest: "",
    densite: "",
    corpsEtranger: "Oui",
    resultatTest: "",
    confirmation: false,
    siteDistillation: "Valider"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Données du test:", formData)
    setIsOpen(false)
    // Réinitialiser le formulaire
    setFormData({
      pagination: "Oui",
      dateTest: "",
      densite: "",
      corpsEtranger: "Oui",
      resultatTest: "",
      confirmation: false,
      siteDistillation: "Valider"
    })
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test de la marchandise - Agréage #{item.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="border-t border-gray-200 pt-4"></div>

          {/* Section Fiche de test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Fiche de teste</h3>
            
            {/* Tableau Date du teste / Densité */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                      Date du teste
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                      Densité
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="date"
                          value={formData.dateTest}
                          onChange={(e) => setFormData({...formData, dateTest: e.target.value})}
                          className="flex-1 border-gray-300"
                        />
                        <span className="text-sm text-gray-500">/ N/A / A/A</span>
                      </div>
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={formData.densite}
                        onChange={(e) => setFormData({...formData, densite: e.target.value})}
                        className="w-20 border-gray-300"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Présence de corps étranger */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Présence de corps étranger</Label>
              <RadioGroup 
                value={formData.corpsEtranger} 
                onValueChange={(value) => setFormData({...formData, corpsEtranger: value})}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Oui" id="corps-oui" />
                  <Label htmlFor="corps-oui" className="font-medium">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non" id="corps-non" />
                  <Label htmlFor="corps-non" className="font-medium">Non</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Résultat du test */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Résultat du test</Label>
              <Input 
                placeholder="Vérifié et correct"
                value={formData.resultatTest}
                onChange={(e) => setFormData({...formData, resultatTest: e.target.value})}
                className="border-gray-300"
              />
            </div>

            {/* Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                Suite au test effectué sur la marchandise, en fonction du soutien. Voulez-vous affirmer avoir effectué ce test en bonne et due forme et confirmez que les résultats reflètent fidèlement le verdict du test.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="confirmation"
                  checked={formData.confirmation}
                  onCheckedChange={(checked) => setFormData({...formData, confirmation: checked as boolean})}
                />
                <Label htmlFor="confirmation" className="text-sm font-medium">
                  Oui, je confirme.
                </Label>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-300"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={!formData.confirmation}
              className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <TestTube className="w-4 h-4 mr-2" />
              commencer le test
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Modal Agréage Définitif
function ModalAgreageDefinitif({
  isOpen,
  setIsOpen,
  item
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  item: AgreageItem | null
}) {
  const [formData, setFormData] = useState({
    piedNet: "",
    piedApresQuel: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Données agréage définitif:", formData)
    console.log("Agréage ID:", item?.id)
    setIsOpen(false)
    // Réinitialiser le formulaire
    setFormData({
      piedNet: "",
      piedApresQuel: ""
    })
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Agréage définitif - #{item.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Section Pied net */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Pied net (XG)
              </Label>
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#76bc21] border-gray-300 rounded focus:ring-[#76bc21]"
                />
                <Input
                  type="number"
                  placeholder="Entrez le poids net"
                  value={formData.piedNet}
                  onChange={(e) => setFormData({...formData, piedNet: e.target.value})}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
            </div>

            {/* Section Pied après lequel */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Pied après lequel (xG)
              </Label>
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#76bc21] border-gray-300 rounded focus:ring-[#76bc21]"
                />
                <Input
                  type="number"
                  placeholder="Entrez le poids après lequel"
                  value={formData.piedApresQuel}
                  onChange={(e) => setFormData({...formData, piedApresQuel: e.target.value})}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
            </div>

            {/* Section Vallisier */}
            <div className="border-t border-gray-200 pt-4">
              <Label className="text-sm font-medium text-gray-900 block mb-3">
                Vallisier
              </Label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">
                  Information du vallisier
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-300"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Valider l'agréage
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Mobile Card Component - Version compacte
function MobileAgreageCard({ 
  item, 
  onTest,
  onValidate,
  onDetails,
  onCancel,
  onDefinitif,
  isSelected,
  onSelect,
  isOpen,
  onToggle
}: { 
  item: AgreageItem
  onTest: () => void
  onValidate: () => void
  onDetails: () => void
  onCancel: () => void
  onDefinitif: () => void
  isSelected: boolean
  onSelect: (id: number, selected: boolean) => void
  isOpen: boolean
  onToggle: () => void
}) {
  const getStatusColor = (status: AgreageStatus) => {
    switch (status) {
      case "Validé": return "bg-green-100 text-green-800"
      case "Refusé": return "bg-red-100 text-red-800"
      case "En cours de test": return "bg-yellow-100 text-yellow-800"
      case "En attente de test": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getMarchandiseColor = (marchandise: MarchandiseType) => {
    switch (marchandise) {
      case "HEFG": return "bg-green-500"
      case "HECG": return "bg-purple-500"
      case "HEGG": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const renderActions = (item: AgreageItem) => {
    // Style compact pour les boutons d'action
    const btnClass = "flex items-center justify-center w-full p-2 hover:bg-gray-50 cursor-pointer transition-colors duration-200 text-center rounded-lg border border-transparent hover:border-gray-200"

    const getActionsByStatus = () => {
      switch (item.status) {
        case "En attente de test":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={onTest}
                title="Test de la marchandise"
              >
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-900">Test</span>
                </div>
              </button>

              <button 
                className={btnClass} 
                onClick={onDetails}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Bouton vide pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        case "En cours de test":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={onValidate}
                title="Validation du test"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-900">Valider</span>
                </div>
              </button>

              <button 
                className={btnClass} 
                onClick={onCancel}
                title="Annuler"
              >
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-gray-900">Annuler</span>
                </div>
              </button>

              {/* Bouton vide pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        case "Validé":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={onDefinitif}
                title="Agréage définitif"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-900">Définitif</span>
                </div>
              </button>

              <button 
                className={btnClass} 
                onClick={onDetails}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Bouton vide pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        case "Refusé":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={onDetails}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Boutons vides pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        default:
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={onDetails}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Boutons vides pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )
      }
    }

    return getActionsByStatus()
  }

  return (
    <Card className={`mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-[#76bc21]' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(item.id, e.target.checked)}
              className="w-4 h-4 text-[#76bc21] border-gray-300 rounded focus:ring-[#76bc21]"
            />
            <div className="w-8 h-8 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">#{item.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Agréage #{item.id}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.date}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(item.status)} border-0`}>
            {item.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Poids net
            </p>
            <p className="font-semibold text-gray-900">{item.poids}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Poids testé</p>
            <p className="font-semibold text-gray-900">{item.poidsTeste} kg</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Provenance
            </p>
            <p className="text-gray-900">{item.provenance}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Client</p>
            <p className="text-gray-900">{item.client}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge className={`${getMarchandiseColor(item.marchandise)} text-white border-0`}>
            {item.marchandise}
          </Badge>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Corps étranger: </span>
            <span className={item.corpsEtranger === "Oui" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
              {item.corpsEtranger}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Cliquez sur les trois points pour les actions
          </div>
          <Button
            size="sm"
            variant="outline"
            className="p-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={onToggle}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions menu - Affichage dynamique selon le statut */}
        {isOpen && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {renderActions(item)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Modal Export
function ModalExport({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportation des données
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Date de début</Label>
            <Input type="date" defaultValue="2024-03-01" />
          </div>
          <div>
            <Label className="text-sm font-medium">Date de fin</Label>
            <Input type="date" defaultValue="2024-03-31" />
          </div>
          <div>
            <Label className="text-sm font-medium">Format</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="all">Tous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-[#76bc21] text-white hover:bg-[#5aa017]">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Page principale
export default function AgreageProvisoir() {
  const [data, setData] = useState<AgreageItem[]>(initialData)
  const [isTestOpen, setIsTestOpen] = useState(false)
  const [testItem, setTestItem] = useState<AgreageItem | null>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isCreateAgregationOpen, setIsCreateAgregationOpen] = useState(false)
  const [isDefinitifOpen, setIsDefinitifOpen] = useState(false)
  const [definitifItem, setDefinitifItem] = useState<AgreageItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<AgreageItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const handleTest = (item: AgreageItem) => {
    setTestItem(item)
    setIsTestOpen(true)
    setOpenMenuId(null)
  }

  const handleValidate = (item: AgreageItem) => {
    setData(prev => prev.map(i => 
      i.id === item.id ? { ...i, status: "Validé" } : i
    ))
    setOpenMenuId(null)
    alert(`Test validé pour l'agréage #${item.id}`)
  }

  const handleDetails = (item: AgreageItem) => {
    setDetailsItem(item)
    setIsDetailsOpen(true)
    setOpenMenuId(null)
  }

  const handleCancel = (item: AgreageItem) => {
    setData(prev => prev.map(i => 
      i.id === item.id ? { ...i, status: "En attente de test" } : i
    ))
    setOpenMenuId(null)
    alert(`Agréage #${item.id} annulé`)
  }

  const handleDefinitif = (item: AgreageItem) => {
    setDefinitifItem(item)
    setIsDefinitifOpen(true)
    setOpenMenuId(null)
  }

  const handleDelete = (item: AgreageItem) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'agréage #${item.id} ?`)) {
      setData(prev => prev.filter(i => i.id !== item.id))
      setSelectedItems(prev => prev.filter(id => id !== item.id))
      setOpenMenuId(null)
      alert(`Agréage #${item.id} supprimé`)
    }
  }

  const handleSelectItem = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, id])
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(data.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const getSelectedAgreageItems = () => {
    return data.filter(item => selectedItems.includes(item.id))
  }

  const toggleMenu = (item: AgreageItem) => {
    setOpenMenuId(openMenuId === item.id ? null : item.id)
  }

  const renderActions = (item: AgreageItem) => {
    // Style compact pour les boutons d'action desktop
    const btnClass = "flex items-center justify-center w-full p-2 hover:bg-gray-50 cursor-pointer transition-colors duration-200 text-center rounded-lg border border-transparent hover:border-gray-200"

    const getActionsByStatus = () => {
      switch (item.status) {
        case "En attente de test":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={() => handleTest(item)}
                title="Test de la marchandise"
              >
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-900">Test</span>
                </div>
              </button>

              <button 
                className={btnClass} 
                onClick={() => handleDetails(item)}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Bouton vide pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        case "En cours de test":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={() => handleValidate(item)}
                title="Validation du test"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-900">Valider</span>
                </div>
              </button>

              <button 
                className={btnClass} 
                onClick={() => handleCancel(item)}
                title="Annuler"
              >
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-gray-900">Annuler</span>
                </div>
              </button>

              {/* Bouton vide pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        case "Validé":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={() => handleDefinitif(item)}
                title="Agréage définitif"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-900">Définitif</span>
                </div>
              </button>

              <button 
                className={btnClass} 
                onClick={() => handleDetails(item)}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Bouton vide pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        case "Refusé":
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={() => handleDetails(item)}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Boutons vides pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )

        default:
          return (
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={btnClass} 
                onClick={() => handleDetails(item)}
                title="Détails"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Détails</span>
                </div>
              </button>

              {/* Boutons vides pour maintenir la grille */}
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
              <div className={btnClass.replace('hover:bg-gray-50', 'opacity-0 pointer-events-none')}></div>
            </div>
          )
      }
    }

    return getActionsByStatus()
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:flex">
        <Sidebar currentPage="agregageProvisoire" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Agréage Provisoire" />

        <main className="flex-1 overflow-auto p-6">
          <Card className="border border-gray-200 shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Agréages provisoires</h2>
                  <p className="text-sm text-gray-600">Gérez les agrégations provisoires de marchandises</p>
                </div>
                <Button 
                  onClick={() => setIsCreateAgregationOpen(true)}
                  disabled={selectedItems.length === 0}
                  className="bg-[#76bc21] hover:bg-[#5aa017] text-white transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une agrégation ({selectedItems.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date début</Label>
                    <Input type="date" className="w-full md:w-40 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date fin</Label>
                    <Input type="date" className="w-full md:w-40 border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Statut</Label>
                    <Select defaultValue="Tous">
                      <SelectTrigger className="w-full md:w-36 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous les statuts</SelectItem>
                        <SelectItem value="En attente de test">En attente</SelectItem>
                        <SelectItem value="En cours de test">En cours</SelectItem>
                        <SelectItem value="Validé">Validé</SelectItem>
                        <SelectItem value="Refusé">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-end gap-3 flex-1">
                  <Button className="bg-[#76bc21] hover:bg-[#5aa017] text-white transition-colors duration-200">
                    <Search className="w-4 h-4 mr-2" />
                    Chercher
                  </Button>
                  
                  <Button 
                    onClick={() => setIsExportOpen(true)}
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

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {data.length} agréage{data.length > 1 ? 's' : ''} provisoire{data.length > 1 ? 's' : ''}
              {selectedItems.length > 0 && ` • ${selectedItems.length} sélectionné${selectedItems.length > 1 ? 's' : ''}`}
            </p>
            <div className="flex items-center gap-2">
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
              <span className="text-sm text-gray-600 hidden sm:block">par page</span>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="border border-gray-200 shadow-sm">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                      <th className="p-4 font-semibold text-sm text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === data.length && data.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-[#76bc21] border-white rounded focus:ring-[#76bc21]"
                        />
                      </th>
                      <th className="p-4 font-semibold text-sm text-left">ID</th>
                      <th className="p-4 font-semibold text-sm text-left">Date création</th>
                      <th className="p-4 font-semibold text-sm text-left">Poids net</th>
                      <th className="p-4 font-semibold text-sm text-left">Marchandise</th>
                      <th className="p-4 font-semibold text-sm text-left">Client</th>
                      <th className="p-4 font-semibold text-sm text-left">Statut</th>
                      <th className="p-4 font-semibold text-sm text-left">Provenance</th>
                      <th className="p-4 font-semibold text-sm text-left">Poids testé</th>
                      <th className="p-4 font-semibold text-sm text-left">Corps étranger</th>
                      <th className="p-4 font-semibold text-sm text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                            className="w-4 h-4 text-[#76bc21] border-gray-300 rounded focus:ring-[#76bc21]"
                          />
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{item.date}</td>
                        <td className="p-4 text-gray-700">{item.poids}</td>
                        <td className="p-4 text-gray-700">{item.marchandise}</td>
                        <td className="p-4 text-gray-700">{item.client}</td>
                        <td className="p-4">
                          <Badge className={`
                            ${item.status === "Validé" ? "bg-green-100 text-green-800" : ""}
                            ${item.status === "Refusé" ? "bg-red-100 text-red-800" : ""}
                            ${item.status === "En cours de test" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${item.status === "En attente de test" ? "bg-blue-100 text-blue-800" : ""}
                            border-0
                          `}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-700">{item.provenance}</td>
                        <td className="p-4 text-gray-700">{item.poidsTeste} kg</td>
                        <td className="p-4">
                          <Badge className={`
                            ${item.corpsEtranger === "Oui" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                            border-0
                          `}>
                            {item.corpsEtranger}
                          </Badge>
                        </td>
                        <td className="p-4 relative text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                            onClick={() => toggleMenu(item)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {openMenuId === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                              <div className="p-4">
                                {renderActions(item)}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {data.map((item) => (
              <MobileAgreageCard
                key={item.id}
                item={item}
                onTest={() => handleTest(item)}
                onValidate={() => handleValidate(item)}
                onDetails={() => handleDetails(item)}
                onCancel={() => handleCancel(item)}
                onDefinitif={() => handleDefinitif(item)}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleSelectItem}
                isOpen={openMenuId === item.id}
                onToggle={() => toggleMenu(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="w-8 h-8">1</Button>
              <Button variant="outline" size="sm" className="w-8 h-8">2</Button>
              <Button variant="outline" size="sm" className="w-8 h-8">3</Button>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ModalTestMarchandise 
        isOpen={isTestOpen} 
        setIsOpen={setIsTestOpen} 
        item={testItem} 
      />
      <ModalExport isOpen={isExportOpen} setIsOpen={setIsExportOpen} />
      <ModalCreerAgregation 
        isOpen={isCreateAgregationOpen} 
        setIsOpen={setIsCreateAgregationOpen}
        selectedItems={getSelectedAgreageItems()}
      />
      <ModalAgreageDefinitif 
        isOpen={isDefinitifOpen} 
        setIsOpen={setIsDefinitifOpen} 
        item={definitifItem} 
      />
      <ModalDetails 
        isOpen={isDetailsOpen} 
        setIsOpen={setIsDetailsOpen} 
        item={detailsItem} 
      />
    </div>
  )
}
