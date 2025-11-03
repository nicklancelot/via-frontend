"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CreditCard,
  FileText,
  Truck,
  File,
  Search,
  Download,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { FacturationModal } from "./FacturationModal"
import { ImpeyerModal } from "./Impeyer"
import { FicheLivraisonModal } from "./FicheLivraison"
import { ModificationModal } from "./ModificationModal"
import { ConfirmationModal } from "./ConfirmationModal"
import { ConfirmationLivraison } from "./ConfirmationLivraison"
import { useAuth } from "@/lib/auth-context"
import { useReceptions } from "@/hooks/useReceptions"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import jsPDF from "jspdf"
import "jspdf-autotable"

// =============================================================================
// INTERFACES ET TYPES
// =============================================================================

interface DataTableProps {
  onInsertionClick: () => void
  onExportClick: () => void
  refreshTrigger?: number
}

interface Reception {
  id: number
  type: string
  dateHeure: string
  designation: string
  provenance: string
  nom_fournisseur: string
  prenom_fournisseur: string
  id_fiscale: string
  localisation: string
  contact: string
  poids_brut: number | null
  poids_net: number | null
  unite: string
  poids_packaging?: number | null
  taux_dessiccation?: number | null
  taux_humidite_fg?: number | null
  poids_agreé?: number | null
  densite?: number | null
  taux_humidite_cg?: number | null
  statut: string
  created_at?: string
  updated_at?: string
}

interface Facturation {
  id: number
  reception_id: number
  date_paiement: string
  numero_facture: string
  designation: string
  encaissement: string
  prix_unitaire: number
  quantite: number
  paiement_avance: number
  montant_paye: number
  statut: string
  created_at: string
  updated_at: string
}

interface MobileCardProps {
  item: Reception
  isOpen: boolean
  onToggle: () => void
  renderActions: (item: Reception) => React.ReactNode
  isAdmin: boolean
  onEdit: (item: Reception) => void
  onDelete: (item: Reception) => void
  isSelected: boolean
  onSelect: (item: Reception, selected: boolean) => void
  isExportSelected: boolean
  onSelectExport: (item: Reception, selected: boolean) => void
}

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

// Formater une date en français
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Date non définie"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch (error) {
    return "Date invalide"
  }
}

// Obtenir le libellé du type de matière première
const getTypeLabel = (type: string | null): string => {
  if (!type) return "Non défini"

  switch (type) {
    case "FG":
      return "Clous"
    case "GG":
      return "Griffes"
    case "CG":
      return "Feuilles"
    default:
      return type
  }
}

// Sécuriser les chaînes de caractères
const safeString = (str: any, defaultValue = "Non défini"): string => {
  if (str === null || str === undefined || str === "") return defaultValue
  if (typeof str === "string") return str
  if (typeof str === "number") return str.toString()
  return String(str)
}

// Sécuriser les nombres
const safeNumber = (num: any, defaultValue = "0"): string => {
  if (num === null || num === undefined) return defaultValue
  if (typeof num === "number") return num.toString()
  if (typeof num === "string") return num
  return String(num)
}

// Sécuriser les identifiants
const safeId = (item: any): number => {
  if (!item) return 0

  const id = item.id || item.ID || item.Id || item.iD

  if (id === null || id === undefined) return 0

  const numericId = Number(id)
  return isNaN(numericId) ? 0 : numericId
}

// Obtenir la couleur du badge selon le statut
const getStatusColor = (status: string): string => {
  switch (status) {
    case "En attente de livraison":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "Non payé":
      return "bg-red-100 text-red-800 border-red-200"
    case "Paiement incomplet":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Payé":
      return "bg-green-100 text-green-800 border-green-200"
    case "Livré":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// =============================================================================
// COMPOSANT MOBILE CARD
// =============================================================================

function MobileCard({
  item,
  isOpen,
  onToggle,
  renderActions,
  isAdmin,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
  isExportSelected,
  onSelectExport,
}: MobileCardProps) {
  const itemId = safeId(item)
  const canSelect = item.statut === "En attente de livraison"
  const canExport = item.statut === "Paiement incomplet" || item.statut === "Payé"
  const isDisabled = item.statut === "En attente de livraison" || item.statut === "Livré"

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* En-tête de la carte */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {/* Export checkbox for mobile */}
            {canExport && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Export</span>
                <Checkbox
                  checked={isExportSelected}
                  onCheckedChange={(checked) => onSelectExport(item, checked as boolean)}
                  className="data-[state=checked]:bg-[#76bc21] data-[state=checked]:border-[#76bc21]"
                />
              </div>
            )}
            {/* Checkbox pour livraison */}
            {canSelect && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Livraison</span>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelect(item, checked as boolean)}
                  className="data-[state=checked]:bg-[#76bc21] data-[state=checked]:border-[#76bc21]"
                />
              </div>
            )}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">{item.id_fiscale}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ID Fiscale: {item.id_fiscale}</h3>
              <p className="text-sm text-gray-600">{formatDate(item.dateHeure)}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={`p-2 border-gray-300 ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={onToggle}
            disabled={isDisabled}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Type MP</p>
            <Badge variant="secondary" className="bg-[#76bc21] text-white">
              {getTypeLabel(item.type)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Quantité</p>
            <p className="font-semibold text-gray-900">
              {safeNumber(item.poids_net)} {safeString(item.unite, "kg")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Provenance</p>
            <p className="text-gray-900">{safeString(item.provenance)}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Statut</p>
            <Badge variant="outline" className={`${getStatusColor(item.statut)} font-medium`}>
              {safeString(item.statut, "Non défini")}
            </Badge>
          </div>
        </div>

        {/* Actions admin */}
        {isAdmin && (
          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => onEdit(item)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Modifier
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Supprimer
            </Button>
          </div>
        )}

        {/* Actions contextuelles */}
        {isOpen && (
          <div className="border-t pt-3 mt-3">
            <div className="grid grid-cols-1 gap-1">{renderActions(item)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// COMPOSANT PRINCIPAL DATATABLE
// =============================================================================

export function DataTable({ onInsertionClick, onExportClick, refreshTrigger = 0 }: DataTableProps) {
  // ===========================================================================
  // ÉTATS ET HOOKS
  // ===========================================================================

  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [selectedReception, setSelectedReception] = useState<Reception | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [selectedExportItems, setSelectedExportItems] = useState<Set<number>>(new Set())
  const [isFacturationOpen, setIsFacturationOpen] = useState(false)
  const [isImpeyerOpen, setIsImpeyerOpen] = useState(false)
  const [isFicheLivraisonOpen, setIsFicheLivraisonOpen] = useState(false)
  const [isConfirmationLivraisonOpen, setIsConfirmationLivraisonOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isModificationOpen, setIsModificationOpen] = useState(false)

  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const { receptions, loading, initialLoading, error, refetch, deleteReception, facturations, marquerCommeLivre } = useReceptions()

  // ===========================================================================
  // EFFETS
  // ===========================================================================

  // Rafraîchir les données quand le trigger change
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch()
    }
  }, [refreshTrigger, refetch])

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // ===========================================================================
  // MÉMOISATION DES DONNÉES
  // ===========================================================================

  // Trier les réceptions par ID décroissant
  const sortedReceptions = useMemo(() => {
    if (!receptions || !Array.isArray(receptions) || receptions.length === 0) {
      return []
    }

    try {
      return [...receptions].sort((a, b) => {
        const idA = safeId(a)
        const idB = safeId(b)
        return idB - idA
      })
    } catch (error) {
      console.error("Erreur lors du tri:", error)
      return receptions
    }
  }, [receptions])

  // Filtrer les données selon la recherche
  const filteredData = useMemo(() => {
    if (!sortedReceptions || sortedReceptions.length === 0) {
      return []
    }

    const searchLower = searchTerm.toLowerCase()

    return sortedReceptions.filter((item: Reception) => {
      return (
        getTypeLabel(item.type).toLowerCase().includes(searchLower) ||
        safeString(item.provenance).toLowerCase().includes(searchLower) ||
        safeString(item.designation).toLowerCase().includes(searchLower) ||
        safeString(item.nom_fournisseur).toLowerCase().includes(searchLower) ||
        safeString(item.prenom_fournisseur).toLowerCase().includes(searchLower) ||
        safeString(item.localisation).toLowerCase().includes(searchLower) ||
        safeString(item.id_fiscale).toLowerCase().includes(searchLower)
      )
    })
  }, [sortedReceptions, searchTerm])

  // Paginer les données
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // ===========================================================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // ===========================================================================

  // Gérer la sélection/désélection d'un item
  const handleSelectItem = (item: Reception, selected: boolean) => {
    const itemId = safeId(item)
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
  }

  // Gérer la sélection/désélection d'un item pour export
  const handleSelectExportItem = (item: Reception, selected: boolean) => {
    const itemId = safeId(item)
    setSelectedExportItems((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
  }

  const handleLivraisonClick = () => {
    if (selectedItems.size === 0) {
      toast.warning("Veuillez sélectionner au moins une réception à livrer", {
        position: "top-right",
        autoClose: 5000,
      })
      return
    }
    setIsConfirmationLivraisonOpen(true)
  }

  // Fonction pour obtenir les informations de facturation d'une réception
  const getFacturationInfo = (receptionId: number): Facturation | null => {
    if (!facturations || !Array.isArray(facturations)) return null
    
    const facturation = facturations.find((fact: any) => {
      const factReceptionId = Number(fact.reception_id || fact.receptionId || fact.reception_ID)
      return factReceptionId === receptionId
    })
    
    return facturation || null
  }

  const handleExportPDFClick = () => {
    if (selectedExportItems.size === 0) {
      toast.warning("Veuillez sélectionner au moins une réception à exporter", {
        position: "top-right",
        autoClose: 5000,
      })
      return
    }

    try {
      const selectedReceptions = sortedReceptions.filter((item) => selectedExportItems.has(safeId(item)))

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      selectedReceptions.forEach((reception, index) => {
        if (index > 0) {
          doc.addPage()
        }

        doc.setFillColor(118, 188, 33)
        doc.rect(0, 0, pageWidth, 40, "F")

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text("VIA-CONSULTING", pageWidth / 2, 20, { align: "center" })

        doc.setFontSize(14)
        doc.setFont("helvetica", "normal")
        doc.text("Facture de Réception", pageWidth / 2, 32, { align: "center" })

        doc.setTextColor(0, 0, 0)

        const facturation = getFacturationInfo(reception.id)

        let yPos = 55

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Informations de Facturation", 20, yPos)

        yPos += 10
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)

        const receptionDetails = [
          ["ID Fiscale:", safeString(reception.id_fiscale)],
          ["Date de réception:", formatDate(reception.dateHeure)],
          ["Type de matière:", getTypeLabel(reception.type)],
          ["Désignation:", safeString(reception.designation)],
          ["Provenance:", safeString(reception.provenance)],
          ["", ""],
          ["Fournisseur:", `${safeString(reception.nom_fournisseur)} ${safeString(reception.prenom_fournisseur)}`],
          ["Contact:", safeString(reception.contact)],
          ["Localisation:", safeString(reception.localisation)],
        ]

        receptionDetails.forEach(([label, value]) => {
          if (label === "") {
            yPos += 5
          } else {
            doc.setFont("helvetica", "bold")
            doc.text(label, 20, yPos)
            doc.setFont("helvetica", "normal")
            doc.text(value, 80, yPos)
            yPos += 8
          }
        })

        yPos += 5

        if (facturation) {
          doc.setFont("helvetica", "bold")
          doc.text("Détails de Facturation", 20, yPos)
          yPos += 10

          const facturationDetails = [
            ["Numéro de facture:", safeString(facturation.numero_facture)],
            ["Date de paiement:", formatDate(facturation.date_paiement)],
            ["Désignation:", safeString(facturation.designation)],
            ["Encaissement:", safeString(facturation.encaissement)],
            ["Prix unitaire:", `${formatCurrency(facturation.prix_unitaire)}`],
            ["Quantité:", `${safeNumber(facturation.quantite)} kg`],
            ["Paiement d'avance:", `${formatCurrency(facturation.paiement_avance)}`],
            ["Montant payé:", `${formatCurrency(facturation.montant_paye)}`],
            ["Statut:", safeString(facturation.statut)],
          ]

          facturationDetails.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold")
            doc.text(label, 20, yPos)
            doc.setFont("helvetica", "normal")
            doc.text(value, 80, yPos)
            yPos += 8
          })

          const prixTotal = facturation.prix_unitaire * facturation.quantite
          const totalPaye = facturation.montant_paye + facturation.paiement_avance
          const resteAPayer = prixTotal - totalPaye

          yPos += 5
          doc.setFont("helvetica", "bold")
          doc.text("Résumé Financier", 20, yPos)
          yPos += 10

          const resumeDetails = [
            ["Prix total:", `${formatCurrency(prixTotal)}`],
            ["Total payé:", `${formatCurrency(totalPaye)}`],
            ["Reste à payer:", `${formatCurrency(resteAPayer)}`],
          ]

          resumeDetails.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold")
            doc.text(label, 20, yPos)
            doc.setFont("helvetica", "normal")
            doc.text(value, 80, yPos)
            yPos += 8
          })
        } else {
          doc.setFont("helvetica", "bold")
          doc.text("Informations de Poids", 20, yPos)
          yPos += 10

          const poidsDetails = [
            ["Poids brut:", `${safeNumber(reception.poids_brut)} ${safeString(reception.unite, "kg")}`],
            ["Poids net:", `${safeNumber(reception.poids_net)} ${safeString(reception.unite, "kg")}`],
            ["Statut:", safeString(reception.statut)],
          ]

          poidsDetails.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold")
            doc.text(label, 20, yPos)
            doc.setFont("helvetica", "normal")
            doc.text(value, 80, yPos)
            yPos += 8
          })
        }

        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
          `Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" },
        )
      })

      const fileName = `Factures_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)

      toast.success(`${selectedExportItems.size} facture(s) exportée(s) en PDF`, {
        position: "top-right",
        autoClose: 5000,
      })

      setSelectedExportItems(new Set())
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error)
      toast.error("Erreur lors de l'export PDF", {
        position: "top-right",
        autoClose: 5000,
      })
    }
  }

  // Fonction pour formater les montants en currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' Ar'
  }

  // Navigation entre les pages
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  // Ouvrir/fermer le menu d'actions
  const toggleMenu = (item: Reception) => {
    const isDisabled = item.statut === "En attente de livraison" || item.statut === "Livré"
    if (isDisabled) return
    const itemId = safeId(item)
    setOpenMenuId(openMenuId === itemId ? null : itemId)
    setSelectedReception(item)
  }

  // Actions des modales
  const handleFacturationClick = () => {
    setIsFacturationOpen(true)
    setOpenMenuId(null)
  }

  const handleImpeyerClick = () => {
    setIsImpeyerOpen(true)
    setOpenMenuId(null)
  }

  const handleEdit = (item: Reception) => {
    setSelectedReception(item)
    setIsModificationOpen(true)
  }

  const handleDelete = (item: Reception) => {
    setSelectedReception(item)
    setIsConfirmDeleteOpen(true)
  }

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!selectedReception) return

    try {
      const itemId = safeId(selectedReception)
      await deleteReception(itemId)
      setIsConfirmDeleteOpen(false)
      setSelectedReception(null)

      toast.error("Réception supprimée avec succès!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      })

      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur lors de la suppression de la réception", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      })
    }
  }

  // Gérer le succès de la modification
  const handleModificationSuccess = () => {
    setIsModificationOpen(false)
    setSelectedReception(null)
    toast.success("Réception modifiée avec succès!")
    refetch()
  }

  const handleConfirmLivraison = async () => {
    try {
      const promises = Array.from(selectedItems).map(async (itemId) => {
        await marquerCommeLivre(itemId)
      })

      await Promise.all(promises)
      await refetch()

      setIsConfirmationLivraisonOpen(false)
      setSelectedItems(new Set())

      toast.success(`${promises.length} réception(s) marquée(s) comme livrée(s) avec succès!`, {
        position: "top-right",
        autoClose: 5000,
      })
    } catch (error) {
      console.error("Erreur lors de la confirmation de livraison:", error)
      toast.error("Erreur lors de la confirmation de livraison", {
        position: "top-right",
        autoClose: 5000,
      })
    }
  }

  // ===========================================================================
  // RENDU DES ACTIONS CONTEXTUELLES
  // ===========================================================================

  const renderActions = (item: Reception): React.ReactNode => {
    const btnClass =
      "flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 text-left rounded-lg border border-transparent hover:border-gray-200"

    switch (item.statut) {
      case "Non payé":
        return (
          <button className={btnClass} onClick={handleFacturationClick}>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <File className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Facturation</div>
              <div className="text-xs text-gray-500">Générer une facture</div>
            </div>
          </button>
        )
      case "Paiement incomplet":
        return (
          <button className={btnClass} onClick={handleImpeyerClick}>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Impayé</div>
              <div className="text-xs text-gray-500">Gérer les impayés</div>
            </div>
          </button>
        )
      case "Payé":
        return (
          <>
            <button className={btnClass} onClick={() => setIsFicheLivraisonOpen(true)}>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Fiche de livraison</div>
                <div className="text-xs text-gray-500">Document de livraison</div>
              </div>
            </button>
          </>
        )
      case "Livré":
        return null
      default:
        return null
    }
  }

  // ===========================================================================
  // ÉTATS DE CHARGEMENT ET D'ERREUR
  // ===========================================================================

  if (initialLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#76bc21]" />
          <p className="mt-4 text-gray-600">Chargement des réceptions...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <Button onClick={refetch} className="bg-[#76bc21] hover:bg-[#5aa017]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ===========================================================================
  // RENDU PRINCIPAL
  // ===========================================================================

  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={onInsertionClick}
              size="sm"
              className="bg-[#76bc21] hover:bg-[#5aa017] text-white cursor-pointer transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
            <Button
              onClick={handleExportPDFClick}
              variant="outline"
              size="sm"
              disabled={selectedExportItems.size === 0}
              className={`cursor-pointer border-gray-300 hover:bg-gray-50 transition-colors duration-200 bg-transparent ${
                selectedExportItems.size === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF ({selectedExportItems.size})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLivraisonClick}
              disabled={selectedItems.size === 0}
              className={`cursor-pointer border-gray-300 hover:bg-gray-50 transition-colors duration-200 bg-transparent ${
                selectedItems.size === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Truck className="w-4 h-4 mr-2" />
              Livraison ({selectedItems.size})
            </Button>
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher par ID fiscale, type, provenance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-80 border-gray-300 focus:border-[#76bc21] transition-colors duration-200"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] text-white">
                    <th className="p-4 font-semibold text-sm text-left">ID Fiscale</th>
                    <th className="p-4 font-semibold text-sm text-left">Date de réception</th>
                    <th className="p-4 font-semibold text-sm text-left">Type</th>
                    <th className="p-4 font-semibold text-sm text-left">Désignation</th>
                    <th className="p-4 font-semibold text-sm text-left">Provenance</th>
                    <th className="p-4 font-semibold text-sm text-left">Quantité</th>
                    <th className="p-4 font-semibold text-sm text-left">État du MP</th>
                    {isAdmin && <th className="p-4 font-semibold text-sm text-center">Gestion</th>}
                    <th className="p-4 font-semibold text-sm text-center w-32">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="text-xs font-normal mb-1">Section</div>
                        <div className="flex space-x-6">
                          <span className="text-xs font-normal">Livraison</span>
                          <span className="text-xs font-normal">Export</span>
                        </div>
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item: Reception) => {
                    const itemId = safeId(item)
                    const isSelected = selectedItems.has(itemId)
                    const isExportSelected = selectedExportItems.has(itemId)
                    const canSelect = item.statut === "En attente de livraison"
                    const canExport = item.statut === "Paiement incomplet" || item.statut === "Payé"
                    const isDisabled = item.statut === "En attente de livraison" || item.statut === "Livré"

                    return (
                      <tr
                        key={itemId}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="p-4 font-medium text-gray-900 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 text-sm font-bold">{item.id_fiscale}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 text-left">{formatDate(item.dateHeure)}</td>
                        <td className="p-4 text-left">
                          <Badge variant="secondary" className="bg-[#76bc21] text-white">
                            {getTypeLabel(item.type)}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-700 text-left">{safeString(item.designation)}</td>
                        <td className="p-4 text-gray-700 text-left">{safeString(item.provenance)}</td>
                        <td className="p-4 text-left">
                          <span className="font-semibold text-gray-900">
                            {safeNumber(item.poids_net)} {safeString(item.unite, "kg")}
                          </span>
                        </td>
                        <td className="p-4 text-left">
                          <Badge variant="outline" className={`${getStatusColor(item.statut)} px-3 py-1 font-medium`}>
                            {safeString(item.statut, "Non défini")}
                          </Badge>
                        </td>

                        {isAdmin && (
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="p-2 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="p-2 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-6">
                            <div className="flex flex-col items-center">
                              {canSelect && (
                                <>
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => handleSelectItem(item, checked as boolean)}
                                    className="data-[state=checked]:bg-[#76bc21] data-[state=checked]:border-[#76bc21]"
                                  />
                                  <span className="text-xs text-gray-500 mt-1">Livraison</span>
                                </>
                              )}
                              {!canSelect && (
                                <div className="w-4 h-4"></div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-center">
                              {canExport && (
                                <>
                                  <Checkbox
                                    checked={isExportSelected}
                                    onCheckedChange={(checked) => handleSelectExportItem(item, checked as boolean)}
                                    className="data-[state=checked]:bg-[#76bc21] data-[state=checked]:border-[#76bc21]"
                                  />
                                  <span className="text-xs text-gray-500 mt-1">Export</span>
                                </>
                              )}
                              {!canExport && (
                                <div className="w-4 h-4"></div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 relative text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`p-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 ${
                              isDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            onClick={() => toggleMenu(item)}
                            disabled={isDisabled}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {openMenuId === itemId && (
                            <div className="absolute right-0 bottom-full mb-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                              {renderActions(item)}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden p-4 space-y-4">
            {paginatedData.map((item: Reception) => {
              const itemId = safeId(item)
              const isSelected = selectedItems.has(itemId)
              const isExportSelected = selectedExportItems.has(itemId)

              return (
                <MobileCard
                  key={itemId}
                  item={item}
                  isOpen={openMenuId === itemId}
                  onToggle={() => toggleMenu(item)}
                  renderActions={renderActions}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isSelected={isSelected}
                  onSelect={handleSelectItem}
                  isExportSelected={isExportSelected}
                  onSelectExport={handleSelectExportItem}
                />
              )
            })}
          </div>

          {filteredData.length === 0 && !initialLoading && (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Aucune réception ne correspond à votre recherche" : "Aucune réception trouvée"}
              </p>
              {!searchTerm && (
                <Button onClick={onInsertionClick} className="bg-[#76bc21] hover:bg-[#5aa017]">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la première réception
                </Button>
              )}
            </div>
          )}

          {filteredData.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                Affichage de <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                sur <span className="font-medium text-gray-900">{filteredData.length}</span> résultat
                {filteredData.length > 1 ? "s" : ""}
                {selectedItems.size > 0 && (
                  <span className="ml-2 text-[#76bc21] font-medium">• {selectedItems.size} pour livraison</span>
                )}
                {selectedExportItems.size > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">• {selectedExportItems.size} pour export</span>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="border-gray-300 hover:bg-gray-50 transition-colors duration-200 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Préc
                </Button>
                <span className="text-sm text-gray-600 px-3">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 hover:bg-gray-50 transition-colors duration-200 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suiv <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FacturationModal
        isOpen={isFacturationOpen}
        onClose={() => {
          setIsFacturationOpen(false)
          setSelectedReception(null)
        }}
        reception={selectedReception}
      />

      <ImpeyerModal
        isOpen={isImpeyerOpen}
        onClose={() => {
          setIsImpeyerOpen(false)
          setSelectedReception(null)
        }}
        reception={selectedReception}
      />

      <FicheLivraisonModal
        isOpen={isFicheLivraisonOpen}
        onClose={() => {
          setIsFicheLivraisonOpen(false)
          setSelectedReception(null)
        }}
        reception={selectedReception}
      />

      <ConfirmationLivraison
        isOpen={isConfirmationLivraisonOpen}
        onClose={() => setIsConfirmationLivraisonOpen(false)}
        onConfirm={handleConfirmLivraison}
        numberOfReceptions={selectedItems.size}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false)
          setSelectedReception(null)
        }}
        onConfirm={confirmDelete}
        message={`Êtes-vous sûr de vouloir supprimer la réception ${selectedReception?.id_fiscale} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />

      <ModificationModal
        isOpen={isModificationOpen}
        onClose={() => {
          setIsModificationOpen(false)
          setSelectedReception(null)
        }}
        reception={selectedReception}
        onSuccess={handleModificationSuccess}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
      />
    </>
  )
}
