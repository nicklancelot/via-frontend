"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Package, FlaskConical, Download, Calendar, Factory, MapPin, Scale, Search } from "lucide-react"
import { Header } from "@/components/header"

// Données distillation
const initialData = [
  { id: 1, dateReception: "24 Mars 2024", quantiteDepart: 50, provenance: "Manakara", type: "Clous", usine: "Pk 12", quantite: 10 },
  { id: 2, dateReception: "25 Mars 2024", quantiteDepart: 60, provenance: "Griffes", type: "Makomby", usine: "Griffes", quantite: 12 },
  { id: 3, dateReception: "28 Mars 2024", quantiteDepart: 30, provenance: "Manakara", type: "Feuilles", usine: "Pk 12", quantite: 8 },
  { id: 4, dateReception: "02 Avril 2024", quantiteDepart: 40, provenance: "Manambondro", type: "Griffes", usine: "Makomby", quantite: 15 },
  { id: 5, dateReception: "05 Avril 2024", quantiteDepart: 25, provenance: "Vohipeno", type: "Clous", usine: "Pk 12", quantite: 9 },
  { id: 6, dateReception: "10 Avril 2024", quantiteDepart: 35, provenance: "Manakara", type: "Feuilles", usine: "Pk 12", quantite: 11 },
  { id: 7, dateReception: "15 Avril 2024", quantiteDepart: 55, provenance: "Matangy", type: "Griffes", usine: "Makomby", quantite: 14 },
  { id: 8, dateReception: "20 Avril 2024", quantiteDepart: 45, provenance: "Ampasimanjeva", type: "Clous", usine: "Pk 12", quantite: 13 },
  { id: 9, dateReception: "25 Avril 2024", quantiteDepart: 38, provenance: "Manambondro", type: "Feuilles", usine: "Makomby", quantite: 10 },
  { id: 10, dateReception: "30 Avril 2024", quantiteDepart: 60, provenance: "Manambondro", type: "Griffes", usine: "Pk 12", quantite: 16 },
]

// Mobile Card Component
function MobileCard({ 
  item, 
  onDistiller
}: { 
  item: typeof initialData[0]
  onDistiller: () => void
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Feuilles": return "bg-green-500"
      case "Clous": return "bg-purple-500"
      case "Griffes": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* Header avec ID */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">#{item.id}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Lot #{item.id}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.dateReception}
              </p>
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Quantité départ
            </p>
            <p className="font-semibold text-gray-900">{item.quantiteDepart} kg</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Quantité actuelle</p>
            <p className="font-semibold text-gray-900">{item.quantite} kg</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Provenance
            </p>
            <p className="text-gray-900">{item.provenance}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <Factory className="w-3 h-3" />
              Usine
            </p>
            <Badge variant="secondary" className="bg-[#76bc21] text-white">
              {item.usine}
            </Badge>
          </div>
        </div>

        {/* Type MP + bouton Distiller */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <Badge variant="outline" className={`${getTypeColor(item.type)} text-white border-0`}>
            {item.type}
          </Badge>
          <Button 
            size="sm" 
            onClick={onDistiller}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Distiller
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Modal Action
function ModalAction({
  isOpen,
  setIsOpen,
  item,
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  item: any
}) {
  if (!item) return null

  const handleDistiller = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21] flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Initialisation de distillation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Usine</Label>
            <Select defaultValue="PK 12">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PK 12">PK 12</SelectItem>
                <SelectItem value="Makomby">Makomby</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Matière première à utiliser</Label>
            <Select defaultValue="Feuille de girofle">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feuille de girofle">Feuille de girofle</SelectItem>
                <SelectItem value="Clous de girofles">Clous de girofles</SelectItem>
                <SelectItem value="Griffes de girofles">Griffes de girofles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Quantité à utiliser (kg)</Label>
            <Input type="number" placeholder="5" />
          </div>
        </div>
        <Button className="w-full bg-[#76bc21] text-white hover:bg-[#5aa017]" onClick={handleDistiller}>
          Valider l'insertion
        </Button>
      </DialogContent>
    </Dialog>
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
export default function InitiationPage() {
  const [data] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalItem, setModalItem] = useState<any>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)

  const handleDistiller = (item: typeof initialData[0]) => {
    setModalItem(item)
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:flex">
        <Sidebar currentPage="initialisation" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Initiation de la distillation" />

        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
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
                    <Label className="text-sm font-medium text-gray-700">Usine</Label>
                    <Select defaultValue="Tous">
                      <SelectTrigger className="w-full md:w-36 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Toutes les usines</SelectItem>
                        <SelectItem value="Pk 12">Pk 12</SelectItem>
                        <SelectItem value="Makomby">Makomby</SelectItem>
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

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {data.length} lot{data.length > 1 ? 's' : ''} de matière première
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
                      <th className="p-4 font-semibold text-sm text-left">ID</th>
                      <th className="p-4 font-semibold text-sm text-left">Date réception</th>
                      <th className="p-4 font-semibold text-sm text-left">Quantité départ</th>
                      <th className="p-4 font-semibold text-sm text-left">Provenance</th>
                      <th className="p-4 font-semibold text-sm text-left">Type</th>
                      <th className="p-4 font-semibold text-sm text-left">Usine</th>
                      <th className="p-4 font-semibold text-sm text-left">Quantité Restant</th>
                      <th className="p-4 font-semibold text-sm text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="p-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#76bc21] from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{item.dateReception}</td>
                        <td className="p-4 text-gray-700">{item.quantiteDepart} kg</td>
                        <td className="p-4 text-gray-700">{item.provenance}</td>
                        <td className="p-4">{item.type}</td>
                        <td className="p-4 text-gray-700">{item.usine}</td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">{item.quantite} kg</span>
                        </td>
                        <td className="text-center">
                          <Button 
                            size="sm" 
                            onClick={() => handleDistiller(item)}
                            className="bg-[#76bc21] hover:bg-[#5aa017] text-white transition-colors duration-200"
                          >
                            <FlaskConical className="w-4 h-4 mr-2" />
                            Distiller
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
          <div className="md:hidden">
            {data.map((item) => (
              <MobileCard
                key={item.id}
                item={item}
                onDistiller={() => handleDistiller(item)}
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
      <ModalAction isOpen={isModalOpen} setIsOpen={setIsModalOpen} item={modalItem} />
      <ModalExport isOpen={isExportOpen} setIsOpen={setIsExportOpen} />
    </div>
  )
}
