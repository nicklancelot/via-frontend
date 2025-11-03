"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChevronDown, Search, Plus, Edit, Trash2, Calendar, Filter } from "lucide-react"

// Types
interface EugenolData {
  id: number
  dateDebut: string
  dateFin: string
  quantiteHuile: number
  statut: "Terminé" | "En cours" | "En attendre"
  eugenolObtenu: number | "--"
  purete: number | "--"
}

// Données mockées
const initialEugenolData: EugenolData[] = [
  {
    id: 2,
    dateDebut: "24 Nov 2024",
    dateFin: "24 Avril 2024",
    quantiteHuile: 10,
    statut: "Terminé",
    eugenolObtenu: 10,
    purete: 95,
  },
  {
    id: 3,
    dateDebut: "24 Nov 2024",
    dateFin: "24 Avril 2024",
    quantiteHuile: 10,
    statut: "En cours",
    eugenolObtenu: "--",
    purete: "--",
  },
  {
    id: 4,
    dateDebut: "24 Nov 2024",
    dateFin: "24 Avril 2024",
    quantiteHuile: 10,
    statut: "En cours",
    eugenolObtenu: "--",
    purete: "--",
  },
  {
    id: 5,
    dateDebut: "24 Nov 2024",
    dateFin: "24 Avril 2024",
    quantiteHuile: 10,
    statut: "En attendre",
    eugenolObtenu: "--",
    purete: "--",
  },
]

// Composants modaux
const CreationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md mx-auto bg-white rounded-xl shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#76bc21] text-center">Création d'eugénol</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 mt-4">
        <div>
          <Label htmlFor="quantiteHuile" className="font-semibold text-gray-700">Quantité d'huile à utiliser</Label>
          <div className="space-y-3 mt-2">
            <Input id="quantiteHuile1" placeholder="Quantité 1" className="border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21]" />
            <Input id="quantiteHuile2" placeholder="Quantité 2" className="border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateDebutEugenol" className="font-semibold text-gray-700">Date de début</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input id="dateDebutEugenol" type="date" className="pl-10 border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21] w-full md:w-56" />
            </div>
          </div>
          <div>
            <Label htmlFor="dateFinEugenol" className="font-semibold text-gray-700">Date de fin</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input id="dateFinEugenol" type="date" className="pl-10 border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21] w-full md:w-56" />
            </div>
          </div>
        </div>
        <Button className="w-full bg-[#76bc21] hover:bg-[#5aa017] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md">
          Valider l'insertion
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

const ModificationModal = ({ 
  isOpen, 
  onClose, 
  confirmationChecked, 
  onConfirmationChange 
}: { 
  isOpen: boolean
  onClose: () => void
  confirmationChecked: boolean
  onConfirmationChange: (checked: boolean) => void
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md mx-auto bg-white rounded-xl shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#76bc21] text-center">Modification de la transformation</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 mt-4">
        <div>
          <Label htmlFor="quantiteHuileModif" className="font-semibold text-gray-700">Quantité d'huile à utiliser</Label>
          <div className="space-y-3 mt-2">
            <Input id="quantiteHuileModif1" placeholder="Quantité 1" className="border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21]" />
            <Input id="quantiteHuileModif2" placeholder="Quantité 2" className="border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21]" />
          </div>
        </div>
        <div>
          <Label htmlFor="pureteModif" className="font-semibold text-gray-700">Pureté (en %)</Label>
          <div className="space-y-3 mt-2">
            <Input id="pureteModif1" placeholder="Pureté 1" className="border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21]" />
            <Input id="pureteModif2" placeholder="Pureté 2" className="border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateDebutModif" className="font-semibold text-gray-700">Date de début</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input id="dateDebutModif" type="date" className="pl-10 border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21] w-full md:w-56" />
            </div>
          </div>
          <div>
            <Label htmlFor="dateFinModif" className="font-semibold text-gray-700">Date de fin</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input id="dateFinModif" type="date" className="pl-10 border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21] w-full md:w-56" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-3">
            En appuyant sur ce bouton, vous confirmez la finalisation de la transformation HEEE en Eugenol et donc la conformité des informations mentionnées ci-dessus concernant le résultat de la production partant le numéro de transformation XXXXX.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirmation"
              checked={confirmationChecked}
              onChange={(e) => onConfirmationChange(e.target.checked)}
              className="w-4 h-4 text-[#76bc21] border-gray-300 rounded focus:ring-[#76bc21]"
            />
            <Label htmlFor="confirmation" className="text-sm text-yellow-800">
              Oui, je confirme.
            </Label>
          </div>
        </div>
        
        <Button 
          className="w-full bg-[#76bc21] hover:bg-[#5aa017] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!confirmationChecked}
        >
          Valider la modification
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

// Composant StatsCard
const StatsCard = ({ 
  title, 
  value, 
}: { 
  title: string
  value: string
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    {/* normalize common liquid/volume unit mentions to Kg for display */}
    <p className="text-2xl font-bold text-gray-900 mb-0">{value.replace(' Litres', ' Kg').replace(' L', ' Kg').replace('Litres', 'Kg')}</p>
    {/* children intentionally not rendered to keep cards compact */}
  </div>
)

// Composant TableRow
const TableRow = ({ 
  item, 
  onEdit 
}: { 
  item: EugenolData
  onEdit: () => void
}) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
    <td className="w-12 px-4 py-4">
      <input
        type="checkbox"
        className="w-4 h-4 text-[#76bc21] border-gray-300 rounded"
        // selection controlled at parent level
      />
    </td>
    <td className="px-4 py-4 font-medium text-gray-900">{item.id}</td>
    <td className="px-4 py-4 text-gray-700">{item.dateDebut}</td>
  <td className="px-4 py-4 text-gray-700">{item.dateFin}</td>
  <td className="px-4 py-4 text-gray-700">{item.quantiteHuile} Kg</td>
    <td className="px-4 py-4">
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
          item.statut === "Terminé"
            ? "bg-green-100 text-green-800"
            : item.statut === "En cours"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {item.statut}
      </span>
    </td>
  <td className="px-4 py-4 text-gray-700">{item.eugenolObtenu}{typeof item.eugenolObtenu === 'number' ? ' Kg' : ''}</td>
  <td className="px-4 py-4 text-gray-700">{item.purete}{typeof item.purete === 'number' ? '%' : ''}</td>
    <td className="px-4 py-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className="border-[#76bc21] text-[#76bc21] hover:bg-[#76bc21] hover:text-white transition-colors duration-200"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </td>
  </tr>
)

// Mobile card for Eugenol list (responsive)
const MobileEugenolCard = ({ item, onEdit }: { item: EugenolData; onEdit: () => void }) => (
  <div className="mb-4 border bg-white rounded-2xl shadow-sm p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-semibold text-gray-900">Transformation #{item.id}</h4>
          <p className="text-sm text-gray-600">{item.dateDebut} - {item.dateFin}</p>
      </div>
      <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{item.quantiteHuile} Kg</p>
          <p className="text-sm text-gray-700">Eugénol: {item.eugenolObtenu}{typeof item.eugenolObtenu === 'number' ? ' Kg' : ''}</p>
          <p className="text-sm text-gray-700">Pureté: {item.purete}{typeof item.purete === 'number' ? '%' : ''}</p>
          <p className="text-xs text-gray-500">{item.statut}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 border-[#76bc21] text-[#76bc21] hover:bg-[#76bc21] hover:text-white">
        <Edit className="w-4 h-4" />
        <span className="ml-2">Modifier</span>
      </Button>
    </div>
  </div>
)

// Composant principal
export default function EugenolPage() {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false)
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [data] = useState<EugenolData[]>(initialEugenolData)
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

  const handleEdit = () => {
    setIsModificationModalOpen(true)
  }

  const handleSearch = () => {
    // Implémentez la logique de recherche ici
    console.log("Recherche avec:", { dateDebut, dateFin, searchTerm })
  }

  // Filtrage simple basé sur les champs (substring match)
  const filteredData = data.filter((item) => {
    const matchesStart = dateDebut ? item.dateDebut.toLowerCase().includes(dateDebut.toLowerCase()) : true
    const matchesEnd = dateFin ? item.dateFin.toLowerCase().includes(dateFin.toLowerCase()) : true
    const text = `${item.id} ${item.dateDebut} ${item.dateFin} ${item.statut} ${item.eugenolObtenu} ${item.purete} ${item.quantiteHuile}`.toLowerCase()
    const matchesSearch = searchTerm ? text.includes(searchTerm.toLowerCase()) : true
    return matchesStart && matchesEnd && matchesSearch
  })

  const total = filteredData.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  // ensure page in range
  if (page > totalPages) setPage(1)
  const displayData = filteredData.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="flex h-screen bg-background">
      <div className="md:flex">
        <Sidebar currentPage="eugenol" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header title="Gestion de l'Eugénol" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Top filters: Date de début, Date de fin, Recherche */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Date de début</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        id="dateDebut" 
                        type="date"
                        className="pl-10 border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21] w-full md:w-56"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Date de fin</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        id="dateFin" 
                        type="date"
                        className="pl-10 border-gray-300 focus:border-[#76bc21] focus:ring-[#76bc21] w-full md:w-56"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#76bc21] hover:bg-[#5aa017] text-white h-10 px-6 shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard 
              title="Total d'huile en une semaine avant la transformation en Eugenol"
              value="500 Kg"
            />

            <StatsCard 
              title="Total d'Eugenol obtenu après la transformation en une semaine"
              value="200 Kg"
            />

            <StatsCard 
              title="Le reste d'huile après la transformation en Eugenol en une semaine"
              value="50 Kg"
            />
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Liste des transformations</h2>
              <Button 
                className="bg-[#76bc21] hover:bg-[#5aa017] text-white font-semibold shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                onClick={() => setIsCreationModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une transformation
              </Button>
            </div>
            
            {/* Mobile list: show cards */}
            <div className="md:hidden">
              {displayData.map((item) => (
                <MobileEugenolCard key={item.id} item={item} onEdit={handleEdit} />
              ))}
            </div>

            {/* Desktop table: show on md+ */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                  <tr>
                    <th className="w-12 px-4 py-4"></th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">ID</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">Date début</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm hidden md:table-cell">Date fin</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm hidden lg:table-cell">Quantité d'huile utilisé</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">Statut</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">Eugenol obtenu</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm hidden md:table-cell">Pureté</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayData.map((item) => (
                    <TableRow 
                      key={item.id}
                      item={item} 
                      onEdit={handleEdit}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-lg">
            <span className="text-sm text-gray-600 font-medium">{total} résultats | Page {page} sur {totalPages}</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Par page</Label>
                <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1) }}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Précédent
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreationModal 
        isOpen={isCreationModalOpen} 
        onClose={() => setIsCreationModalOpen(false)} 
      />
      
      <ModificationModal 
        isOpen={isModificationModalOpen} 
        onClose={() => setIsModificationModalOpen(false)}
        confirmationChecked={confirmationChecked}
        onConfirmationChange={setConfirmationChecked}
      />
    </div>
  )
}
