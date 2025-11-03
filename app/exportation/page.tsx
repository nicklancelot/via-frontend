"use client"

import React, { useState } from "react"
import { Eye, Plus, Calendar, MoreVertical, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Types
type ExportStatus = "En attente" | "En cours" | "Complété" | "Annulé"
type ProduitType = "HEFG" | "HECG" | "HEGG"

interface ExportItem {
  id: number
  date: string
  quantite: string
  client: string
  status: ExportStatus
  produit: ProduitType
  poidsNet: string
  montantTotal: number
  montantPaye: number
  montantRestant: number
}

// Données initiales
const initialData: ExportItem[] = [
  { 
    id: 1, 
    date: "24 Mars 2024", 
    quantite: "100 Kg", 
    client: "John", 
    status: "En attente", 
    produit: "HEFG",
    poidsNet: "100 Kg",
    montantTotal: 150000,
    montantPaye: 0,
    montantRestant: 150000
  },
  { 
    id: 2, 
    date: "24 Mars 2024", 
    quantite: "150 Kg", 
    client: "Marie", 
    status: "En cours", 
    produit: "HECG",
    poidsNet: "150 Kg",
    montantTotal: 225000,
    montantPaye: 120000,
    montantRestant: 105000
  },
  { 
    id: 3, 
    date: "23 Mars 2024", 
    quantite: "200 Kg", 
    client: "Sophie", 
    status: "Complété", 
    produit: "HEGG",
    poidsNet: "200 Kg",
    montantTotal: 300000,
    montantPaye: 300000,
    montantRestant: 0
  },
]

// Utilitaires
const getStatusColor = (status: ExportStatus) => {
  const colors = {
    "Complété": "bg-green-100 text-green-800",
    "En cours": "bg-yellow-100 text-yellow-800",
    "En attente": "bg-blue-100 text-blue-800",
    "Annulé": "bg-red-100 text-red-800"
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

const getProduitColor = (produit: ProduitType) => {
  const colors = {
    "HEFG": "bg-green-500",
    "HECG": "bg-purple-500",
    "HEGG": "bg-blue-500"
  }
  return colors[produit] || "bg-gray-500"
}

// Composant FileUpload réutilisable
function FileUpload({ id, label, file, onChange }: {
  id: string
  label: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <Input 
          type="file"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
          id={id}
        />
        <Label 
          htmlFor={id} 
          className="cursor-pointer text-[#76bc21] font-medium"
        >
          Insérer un fichier
        </Label>
        {file && (
          <p className="text-sm text-green-600 mt-2">
            {file.name}
          </p>
        )}
      </div>
    </div>
  )
}

// Composant FileDisplay pour afficher les fichiers dans le modal de détails
function FileDisplay({ label, fileName, onDownload }: {
  label: string
  fileName: string
  onDownload: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">{fileName}</span>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onDownload}
        className="p-1 h-7"
      >
        <Download className="w-3 h-3" />
      </Button>
    </div>
  )
}

// Composant ActionsMenu pour les trois points - SEULEMENT DÉTAIL
function ActionsMenu({ 
  onDetails 
}: { 
  onDetails: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border-gray-300"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[120px]">
          <button
            onClick={() => {
              onDetails()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Eye className="w-4 h-4" />
            Détail
          </button>
        </div>
      )}
    </div>
  )
}

// Modal Détails de l'exportation
function ModalDetails({ isOpen, setIsOpen, item }: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  item: ExportItem | null
}) {
  if (!item) return null

  const handleDownload = (fileName: string) => {
    console.log(`Téléchargement du fichier: ${fileName}`)
    // Implémentez la logique de téléchargement ici
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Détails de l'exportation #{item.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations Générales */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Générale</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">ID de l'exportation</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-900">#{item.id}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Date</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-900">{item.date}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Client</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-900">{item.client}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Statut</Label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(item.status)} border-0`}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Produit</Label>
                <div className="mt-1">
                  <Badge className={`${getProduitColor(item.produit)} text-white border-0`}>
                    {item.produit}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Quantité</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-900">{item.quantite}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deposition transitoire */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposition transitoire</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Autorisation administrative</Label>
                <FileDisplay 
                  label="Autorisation administrative"
                  fileName="autorisation.pdf"
                  onDownload={() => handleDownload("autorisation.pdf")}
                />
              </div>
            </div>
          </div>

          {/* Domiciliation bancaire/reference */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Domiciliation bancaire / reference</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Document de référence</Label>
                <FileDisplay 
                  label="Document de référence"
                  fileName="reference_bancaire.pdf"
                  onDownload={() => handleDownload("reference_bancaire.pdf")}
                />
              </div>
            </div>
          </div>

          {/* Informations financières */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Financières</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-700 block mb-2">Montant Total</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className="font-semibold text-gray-900">{item.montantTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
              
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-700 block mb-2">Montant Payé</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className="font-semibold text-gray-900">{item.montantPaye.toLocaleString()} FCFA</span>
                </div>
              </div>
              
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-700 block mb-2">Reste à Payer</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className={`font-semibold ${item.montantRestant > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.montantRestant.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-[#76bc21] text-white hover:bg-[#5aa017]"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Composant Mobile Card
function MobileExportCard({ 
  item, 
  onDetails,
  isSelected,
  onSelect
}: { 
  item: ExportItem
  onDetails: () => void
  isSelected: boolean
  onSelect: (id: number, selected: boolean) => void
}) {
  return (
    <Card className={`mb-4 border border-gray-200 ${isSelected ? 'ring-2 ring-[#76bc21]' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
            />
            <div className="w-8 h-8 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">#{item.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export #{item.id}</h3>
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
          <div>
            <p className="font-medium text-gray-700">Quantité</p>
            <p className="font-semibold text-gray-900">{item.quantite}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Client</p>
            <p className="text-gray-900">{item.client}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Poids net</p>
            <p className="font-semibold text-gray-900">{item.poidsNet}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Produit</p>
            <Badge className={`${getProduitColor(item.produit)} text-white border-0 text-xs`}>
              {item.produit}
            </Badge>
          </div>
        </div>

        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Reste à payer: </span>
          <span className={`font-semibold ${item.montantRestant > 0 ? "text-red-600" : "text-green-600"}`}>
            {item.montantRestant.toLocaleString()} FCFA
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">Actions disponibles</span>
          <ActionsMenu 
            onDetails={onDetails}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Modal Nouvelle Exportation
function ModalNouvelleExportation({ isOpen, setIsOpen }: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}) {
  const [formData, setFormData] = useState({
    autorisationFile: null as File | null,
    autreFile: null as File | null,
    listeCollisageFile: null as File | null,
    referenceFile: null as File | null,
    numeroFacture: "",
    nomClient: "",
    modePaiement: "",
    designation: "",
    numeroPaiement: "",
    prixUnitaire: "",
    typePaiement: "",
    quantite: "",
    montantPaye: "",
  })

  const prixTotal = (parseFloat(formData.prixUnitaire) || 0) * (parseFloat(formData.quantite) || 0)
  const totalPayer = parseFloat(formData.montantPaye) || 0
  const restePayer = prixTotal - totalPayer

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nouvelle exportation créée:", { ...formData, prixTotal, totalPayer, restePayer })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Enregistrement de l'exportation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deposition transitoire */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposition transitoire</h3>
            <div className="space-y-4">
              <FileUpload
                id="autorisation-admin"
                label="Insérer un fichier"
                file={formData.autorisationFile}
                onChange={(file) => setFormData({...formData, autorisationFile: file})}
              />
              <div className="text-center">
                <span className="text-sm text-gray-600">Autorisation administrative</span>
              </div>
              
              <FileUpload
                id="autre-file"
                label="Insérer un fichier"
                file={formData.autreFile}
                onChange={(file) => setFormData({...formData, autreFile: file})}
              />
            </div>
          </div>

          {/* Domiciliation bancaire/reference */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Domiciliation bancaire/reference</h3>
            <div className="space-y-4">
              <FileUpload
                id="liste-collisage"
                label="Insérer un fichier"
                file={formData.listeCollisageFile}
                onChange={(file) => setFormData({...formData, listeCollisageFile: file})}
              />
              <div className="text-center">
                <span className="text-sm text-gray-600">Liste de collisage</span>
              </div>
              
              <FileUpload
                id="reference-file"
                label="Insérer un fichier"
                file={formData.referenceFile}
                onChange={(file) => setFormData({...formData, referenceFile: file})}
              />
            </div>
          </div>

          {/* Facture */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facture</h3>
            
            {/* Numéro de facture */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">N° facture</h4>
              <Input
                value={formData.numeroFacture}
                onChange={(e) => setFormData({...formData, numeroFacture: e.target.value})}
                placeholder="XXXXXX"
                className="text-center text-lg font-semibold border-none bg-transparent"
              />
            </div>

            {/* Grille principale */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nom du client</Label>
                    <Input
                      value={formData.nomClient}
                      onChange={(e) => setFormData({...formData, nomClient: e.target.value})}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mode de paiement</Label>
                    <Input
                      value={formData.modePaiement}
                      onChange={(e) => setFormData({...formData, modePaiement: e.target.value})}
                      placeholder="MVOLA"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Désignation</Label>
                    <Input
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      placeholder="XXXXXX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Numéro de paiement</Label>
                    <Input
                      value={formData.numeroPaiement}
                      onChange={(e) => setFormData({...formData, numeroPaiement: e.target.value})}
                      placeholder="XXXXXXX"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Prix unitaires</Label>
                    <Input
                      type="number"
                      value={formData.prixUnitaire}
                      onChange={(e) => setFormData({...formData, prixUnitaire: e.target.value})}
                      placeholder="XXX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Paiement</Label>
                    <Input
                      value={formData.typePaiement}
                      onChange={(e) => setFormData({...formData, typePaiement: e.target.value})}
                      placeholder="Avance"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Quantité (kG)</Label>
                    <Input
                      type="number"
                      value={formData.quantite}
                      onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                      placeholder="XXX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Montant payé</Label>
                    <Input
                      type="number"
                      value={formData.montantPaye}
                      onChange={(e) => setFormData({...formData, montantPaye: e.target.value})}
                      placeholder="XXX"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Totaux */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-700 block mb-2">Prix total</Label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="font-semibold text-gray-900">{prixTotal.toLocaleString()} ar</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-700 block mb-2">Total payer</Label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="font-semibold text-gray-900">{totalPayer.toLocaleString()} ar</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Label className="text-sm font-medium text-gray-700 block mb-2">Reste a payer</Label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className={`font-semibold ${restePayer > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {restePayer.toLocaleString()} ar
                    </span>
                  </div>
                </div>
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
              className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017]"
            >
              Valider l'insertion
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Composant principal
export default function ExportationPage() {
  const [data, setData] = useState<ExportItem[]>(initialData)
  const [isNouvelleExportOpen, setIsNouvelleExportOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ExportItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const handleDetails = (item: ExportItem) => {
    setSelectedItem(item)
    setIsDetailsOpen(true)
  }

  const handleSelectItem = (id: number, selected: boolean) => {
    setSelectedItems(prev => selected ? [...prev, id] : prev.filter(i => i !== id))
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedItems(selected ? data.map(item => item.id) : [])
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:flex">
        <Sidebar currentPage="exportation" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Exportation" />

        <main className="flex-1 overflow-auto p-6">
          <Card className="border border-gray-200 mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Exportations</h2>
                  <p className="text-sm text-gray-600">Gérez les exportations de marchandises</p>
                </div>
                <Button 
                  onClick={() => setIsNouvelleExportOpen(true)}
                  className="bg-[#76bc21] hover:bg-[#5aa017]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle exportation
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {data.length} exportation{data.length > 1 ? 's' : ''}
              {selectedItems.length > 0 && ` • ${selectedItems.length} sélectionné${selectedItems.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedItems.length === data.length}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                          className="border-white"
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-semibold">ID</th>
                      <th className="p-4 text-left text-sm font-semibold">Date</th>
                      <th className="p-4 text-left text-sm font-semibold">Quantité</th>
                      <th className="p-4 text-left text-sm font-semibold">Client</th>
                      <th className="p-4 text-left text-sm font-semibold">Statut</th>
                      <th className="p-4 text-left text-sm font-semibold">Produit</th>
                      <th className="p-4 text-left text-sm font-semibold">Reste à payer</th>
                      <th className="p-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{item.date}</td>
                        <td className="p-4 text-gray-700">{item.quantite}</td>
                        <td className="p-4 text-gray-700">{item.client}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(item.status)} border-0`}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getProduitColor(item.produit)} text-white border-0`}>
                            {item.produit}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${item.montantRestant > 0 ? "text-red-600" : "text-green-600"}`}>
                            {item.montantRestant.toLocaleString()} FCFA
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <ActionsMenu 
                              onDetails={() => handleDetails(item)}
                            />
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
          <div className="md:hidden">
            {data.map((item) => (
              <MobileExportCard
                key={item.id}
                item={item}
                onDetails={() => handleDetails(item)}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleSelectItem}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modal Nouvelle Exportation */}
      <ModalNouvelleExportation 
        isOpen={isNouvelleExportOpen} 
        setIsOpen={setIsNouvelleExportOpen} 
      />

      {/* Modal Détails */}
      <ModalDetails 
        isOpen={isDetailsOpen} 
        setIsOpen={setIsDetailsOpen} 
        item={selectedItem}
      />
    </div>
  )
}
