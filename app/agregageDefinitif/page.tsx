"use client"

import React, { useState } from "react"
import { Eye, Plus, Download, Calendar, MapPin, FileText, User, Package, Clock, AlertCircle, CheckCircle, Scale, TestTube, MoreVertical, ChevronLeft, ChevronRight, CreditCard, DollarSign, CheckCircle2, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Types
type AgreageStatus = "En attente de test" | "En cours de test" | "Validé" | "Refusé" | "Définitif" | "En attente de paiement" | "Paiement incomplet" | "Payé"
type MarchandiseType = "HEFG" | "HECG" | "HEGG"
type PaymentMode = "ESPÈCES" | "VIREMENT" | "CHÈQUE" | "MOBILE"

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
  piedApresQuel?: number
  taux?: number
  montantTotal?: number
  montantPaye?: number
  montantRestant?: number
}

// Données simulées
const initialData: AgreageItem[] = [
  { 
    id: 1, 
    date: "24 Mars 2024", 
    poids: "100 Kg", 
    marchandise: "HEFG", 
    client: "John", 
    status: "En attente de paiement", 
    provenance: "PK 12", 
    poidsTeste: 10, 
    corpsEtranger: "Non",
    vallisier: "Jean Dupont",
    piedApresQuel: 5.0,
    taux: 95,
    densite: 0.92,
    dateTest: "25 Mars 2024",
    resultatTest: "Test réussi - Marchandise conforme",
    montantTotal: 150000,
    montantPaye: 0,
    montantRestant: 150000
  },
  { 
    id: 2, 
    date: "24 Mars 2024", 
    poids: "150 Kg", 
    marchandise: "HECG", 
    client: "Marie", 
    status: "Paiement incomplet", 
    provenance: "PK 12", 
    poidsTeste: 15, 
    corpsEtranger: "Non",
    vallisier: "Pierre Martin",
    piedApresQuel: 0.0,
    taux: 90,
    densite: 0.95,
    dateTest: "25 Mars 2024",
    montantTotal: 225000,
    montantPaye: 120000,
    montantRestant: 105000
  },
  { 
    id: 3, 
    date: "23 Mars 2024", 
    poids: "200 Kg", 
    marchandise: "HEGG", 
    client: "Sophie", 
    status: "Payé", 
    provenance: "Mokomby", 
    poidsTeste: 20, 
    corpsEtranger: "Non",
    vallisier: "Luc Bernard",
    piedApresQuel: 0.0,
    taux: 92,
    densite: 0.93,
    dateTest: "24 Mars 2024",
    resultatTest: "Test réussi - Marchandise conforme",
    montantTotal: 300000,
    montantPaye: 300000,
    montantRestant: 0
  },
]

// Composant Mobile Card
function MobileAgreageCard({ 
  item, 
  onDetails,
  onPayment,
  onFacturation,
  isSelected,
  onSelect,
  isOpen,
  onToggle
}: { 
  item: AgreageItem
  onDetails: () => void
  onPayment: () => void
  onFacturation: () => void
  isSelected: boolean
  onSelect: (id: number, selected: boolean) => void
  isOpen: boolean
  onToggle: () => void
}) {
  const getStatusColor = (status: AgreageStatus) => {
    switch (status) {
      case "Payé": return "bg-green-100 text-green-800"
      case "Paiement incomplet": return "bg-yellow-100 text-yellow-800"
      case "En attente de paiement": return "bg-blue-100 text-blue-800"
      case "Définitif": return "bg-purple-100 text-purple-800"
      case "Validé": return "bg-blue-100 text-blue-800"
      case "Refusé": return "bg-red-100 text-red-800"
      case "En cours de test": return "bg-yellow-100 text-yellow-800"
      case "En attente de test": return "bg-gray-100 text-gray-800"
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

  return (
    <Card className={`mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-[#76bc21]' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
              className="text-[#76bc21] border-gray-300"
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
            <span className="font-medium text-gray-700">Reste à payer: </span>
            <span className={`font-semibold ${item.montantRestant && item.montantRestant > 0 ? "text-red-600" : "text-green-600"}`}>
              {item.montantRestant?.toLocaleString()} FCFA
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

        {/* Actions menu */}
        {isOpen && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onDetails}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Détails
              </Button>
              
              {(item.status === "En attente de paiement" || item.status === "Paiement incomplet") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onPayment}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Paiement
                </Button>
              )}
              
              {(item.status === "Payé" || item.status === "Paiement incomplet") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onFacturation}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Facturation
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Modal Paiement
function ModalPaiement({
  isOpen,
  setIsOpen,
  item
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  item: AgreageItem | null
}) {
  const [formData, setFormData] = useState({
    montantPaye: "",
    modePaiement: "ESPÈCES" as PaymentMode,
    datePaiement: "",
    reference: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Données de paiement:", formData)
    console.log("Agréage ID:", item?.id)
    setIsOpen(false)
    setFormData({
      montantPaye: "",
      modePaiement: "ESPÈCES",
      datePaiement: "",
      reference: "",
      notes: ""
    })
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Paiement - Agréage #{item.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Informations de paiement</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700">Montant total:</span>
                  <div className="font-semibold text-blue-900">{item.montantTotal?.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <span className="text-blue-700">Déjà payé:</span>
                  <div className="font-semibold text-green-600">{item.montantPaye?.toLocaleString()} FCFA</div>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-700">Reste à payer:</span>
                  <div className="font-semibold text-red-600">{item.montantRestant?.toLocaleString()} FCFA</div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Montant payé (FCFA)</Label>
              <Input 
                type="number"
                placeholder="Entrez le montant"
                value={formData.montantPaye}
                onChange={(e) => setFormData({...formData, montantPaye: e.target.value})}
                className="mt-1"
                max={item.montantRestant}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Mode de paiement</Label>
              <Select 
                value={formData.modePaiement}
                onValueChange={(value: PaymentMode) => setFormData({...formData, modePaiement: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESPÈCES">ESPÈCES</SelectItem>
                  <SelectItem value="VIREMENT">VIREMENT</SelectItem>
                  <SelectItem value="CHÈQUE">CHÈQUE</SelectItem>
                  <SelectItem value="MOBILE">MOBILE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Date du paiement</Label>
              <Input 
                type="date"
                value={formData.datePaiement}
                onChange={(e) => setFormData({...formData, datePaiement: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Référence</Label>
              <Input 
                placeholder="Numéro de référence"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Notes</Label>
              <Input 
                placeholder="Notes supplémentaires"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

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
              disabled={!formData.montantPaye || !formData.datePaiement}
              className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017] disabled:bg-gray-400"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Enregistrer le paiement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Modal Détails
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
      case "Payé": return "bg-green-100 text-green-800 border-green-200"
      case "Paiement incomplet": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "En attente de paiement": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Définitif": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Validé": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Refusé": return "bg-red-100 text-red-800 border-red-200"
      case "En cours de test": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "En attente de test": return "bg-gray-100 text-gray-800 border-gray-200"
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
            Détails de l'agréage définitif - #{item.id}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur cet agréage définitif
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">#{item.id}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Agréage Définitif #{item.id}</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="text-sm font-medium text-gray-600">Pied après quel (%)</span>
                    <span className="text-sm font-semibold text-gray-900">{item.piedApresQuel || 0}%</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Taux</span>
                    <span className="text-sm font-semibold text-gray-900">{item.taux || 0}%</span>
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

                <h4 className="font-semibold text-gray-900 mt-6 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Informations de paiement
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Montant total</span>
                    <span className="text-sm font-semibold text-gray-900">{item.montantTotal?.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Montant payé</span>
                    <span className="text-sm font-semibold text-green-600">{item.montantPaye?.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Reste à payer</span>
                    <span className="text-sm font-semibold text-red-600">{item.montantRestant?.toLocaleString()} FCFA</span>
                  </div>
                </div>

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
                        item.status === "Payé" || item.status === "Validé"
                          ? "bg-green-50 text-green-800 border border-green-200" 
                          : item.status === "Refusé"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}>
                        <div className="flex items-start gap-2">
                          {item.status === "Refusé" && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                          {item.status === "Payé" && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                          {item.resultatTest}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {item.status === "Payé" && (
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900 text-lg">Paiement Complet</h4>
                    <p className="text-green-700">
                      Cet agréage a été entièrement payé. Le montant total de {item.montantTotal?.toLocaleString()} FCFA a été réglé.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {item.status === "Paiement incomplet" && (
            <Card className="border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 text-lg">Paiement Incomplet</h4>
                    <p className="text-yellow-700">
                      Il reste {item.montantRestant?.toLocaleString()} FCFA à payer sur un total de {item.montantTotal?.toLocaleString()} FCFA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {item.status === "En attente de paiement" && (
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-lg">En Attente de Paiement</h4>
                    <p className="text-blue-700">
                      Aucun paiement n'a été effectué pour cet agréage. Le montant total dû est de {item.montantTotal?.toLocaleString()} FCFA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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

// Composant principal
export default function AgreageDefinitif() {
  const [data, setData] = useState<AgreageItem[]>(initialData)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isPaiementOpen, setIsPaiementOpen] = useState(false)
  const [isFacturationOpen, setIsFacturationOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AgreageItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tous")
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  // Filtrer les données
  const filteredData = data.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.provenance.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.marchandise.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "Tous" || item.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Gestion des actions
  const handleDetails = (item: AgreageItem) => {
    setSelectedItem(item)
    setIsDetailsOpen(true)
    setOpenMenuId(null)
  }

  const handlePayment = (item: AgreageItem) => {
    setSelectedItem(item)
    setIsPaiementOpen(true)
    setOpenMenuId(null)
  }

  const handleFacturation = (item: AgreageItem) => {
    setSelectedItem(item)
    setIsFacturationOpen(true)
    setOpenMenuId(null)
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

  const toggleMenu = (item: AgreageItem) => {
    setOpenMenuId(openMenuId === item.id ? null : item.id)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleExport = () => {
    console.log("Export des données")
  }

  const handleAdd = () => {
    console.log("Nouvel agréage")
  }

  // Render actions pour desktop
  const renderActions = (item: AgreageItem) => {
    const btnClass = "flex items-center justify-center w-full p-2 hover:bg-gray-50 cursor-pointer transition-colors duration-200 text-center rounded-lg border border-transparent hover:border-gray-200"

    return (
      <div className="grid grid-cols-2 gap-2">
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

        {(item.status === "En attente de paiement" || item.status === "Paiement incomplet") && (
          <button 
            className={btnClass} 
            onClick={() => handlePayment(item)}
            title="Paiement"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-900">Paiement</span>
            </div>
          </button>
        )}

        {(item.status === "Payé" || item.status === "Paiement incomplet") && (
          <button 
            className={btnClass} 
            onClick={() => handleFacturation(item)}
            title="Facturation"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-gray-900">Facturation</span>
            </div>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:flex">
        <Sidebar currentPage="agreageDefinitif" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Agréage Définitif" />

        <main className="flex-1 overflow-auto p-6">
          {/* Filtres et recherche */}
          <Card className="border border-gray-200 shadow-sm mb-6">
            <CardContent className="p-6">
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-36 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous les statuts</SelectItem>
                        <SelectItem value="Payé">Payé</SelectItem>
                        <SelectItem value="Paiement incomplet">Paiement incomplet</SelectItem>
                        <SelectItem value="En attente de paiement">En attente de paiement</SelectItem>
                        <SelectItem value="Définitif">Définitif</SelectItem>
                        <SelectItem value="Validé">Validé</SelectItem>
                        <SelectItem value="Refusé">Refusé</SelectItem>
                        <SelectItem value="En cours de test">En cours</SelectItem>
                        <SelectItem value="En attente de test">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-end gap-3 flex-1">
                  <Input
                    type="text"
                    placeholder="Rechercher par client, provenance..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 max-w-md border-gray-300"
                  />
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

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredData.length} agréage{filteredData.length > 1 ? 's' : ''} définitif{filteredData.length > 1 ? 's' : ''}
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
                        <Checkbox
                          checked={selectedItems.length === data.length && data.length > 0}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                          className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-[#76bc21]"
                        />
                      </th>
                      <th className="p-4 font-semibold text-sm text-left">ID</th>
                      <th className="p-4 font-semibold text-sm text-left">Date création</th>
                      <th className="p-4 font-semibold text-sm text-left">Poids net</th>
                      <th className="p-4 font-semibold text-sm text-left">Marchandise</th>
                      <th className="p-4 font-semibold text-sm text-left">Client</th>
                      <th className="p-4 font-semibold text-sm text-left">Statut</th>
                      <th className="p-4 font-semibold text-sm text-left">Provenance</th>
                      <th className="p-4 font-semibold text-sm text-left">Pied après quel</th>
                      <th className="p-4 font-semibold text-sm text-left">Taux</th>
                      <th className="p-4 font-semibold text-sm text-left">Reste à payer</th>
                      <th className="p-4 font-semibold text-sm text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                            className="text-[#76bc21] border-gray-300"
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
                        <td className="p-4">
                          <Badge className={`
                            ${item.marchandise === "HEFG" ? "bg-green-500" : item.marchandise === "HECG" ? "bg-purple-500" : "bg-blue-500"}
                            text-white border-0
                          `}>
                            {item.marchandise}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-700">{item.client}</td>
                        <td className="p-4">
                          <Badge className={`
                            ${item.status === "Payé" ? "bg-green-100 text-green-800" : ""}
                            ${item.status === "Paiement incomplet" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${item.status === "En attente de paiement" ? "bg-blue-100 text-blue-800" : ""}
                            ${item.status === "Définitif" ? "bg-purple-100 text-purple-800" : ""}
                            ${item.status === "Validé" ? "bg-blue-100 text-blue-800" : ""}
                            ${item.status === "Refusé" ? "bg-red-100 text-red-800" : ""}
                            ${item.status === "En cours de test" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${item.status === "En attente de test" ? "bg-gray-100 text-gray-800" : ""}
                            border-0
                          `}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-700">{item.provenance}</td>
                        <td className="p-4 text-gray-700">{item.piedApresQuel || 0}%</td>
                        <td className="p-4 text-gray-700">{item.taux || 0}%</td>
                        <td className="p-4">
                          <span className={`font-semibold ${item.montantRestant && item.montantRestant > 0 ? "text-red-600" : "text-green-600"}`}>
                            {item.montantRestant?.toLocaleString()} FCFA
                          </span>
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
            {filteredData.map((item) => (
              <MobileAgreageCard
                key={item.id}
                item={item}
                onDetails={() => handleDetails(item)}
                onPayment={() => handlePayment(item)}
                onFacturation={() => handleFacturation(item)}
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
      {selectedItem && (
        <>
          <ModalDetails 
            isOpen={isDetailsOpen} 
            setIsOpen={setIsDetailsOpen} 
            item={selectedItem} 
          />
          <ModalPaiement 
            isOpen={isPaiementOpen} 
            setIsOpen={setIsPaiementOpen} 
            item={selectedItem} 
          />
        </>
      )}
    </div>
  )
}
