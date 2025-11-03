"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Send, CheckCircle, Calculator, AlertCircle, Truck, User, Package, Calendar } from "lucide-react"
import { useReceptions } from "@/hooks/useReceptions"
import { toast } from 'react-toastify'

interface FicheLivraisonModalProps {
  isOpen: boolean
  onClose: () => void
  reception?: any
}

export function FicheLivraisonModal({ isOpen, onClose, reception }: FicheLivraisonModalProps) {
  const { createFicheLivraison, refetch, getReceptionTransitions } = useReceptions()
  
  const [formData, setFormData] = useState({
    date_livraison: "",
    lieu_depart: "",
    destination: "",
    livreur_nom: "",
    livreur_prenom: "",
    livreur_telephone: "",
    livreur_vehicule: "",
    destinateur_nom: "",
    destinateur_prenom: "",
    destinateur_fonction: "",
    destinateur_contact: "",
    type_produit: "",
    ristourne_regionale: 0,
    ristourne_communale: 0,
    quantite_a_livrer: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transitions, setTransitions] = useState<any>(null)

  // Fonction utilitaire pour convertir en nombre sûr
  const safeNumber = (value: any, defaultValue = 0): number => {
    if (value === null || value === undefined || value === '') return defaultValue
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }

  // Réinitialiser le formulaire quand la modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen && reception) {
      checkTransitions()
      prefillFormData()
    } else {
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reception])

  // Vérifier les transitions disponibles
  const checkTransitions = async () => {
    if (!reception) {
      setError("Aucune réception sélectionnée")
      return
    }

    try {
      const transitionsData = await getReceptionTransitions(reception.id)
      setTransitions(transitionsData)
      setError(null)
    } catch (error) {
      console.error("Erreur lors de la vérification des transitions:", error)
      setError("Impossible de vérifier le statut de la réception")
    }
  }

  // Pré-remplir le formulaire avec les données de la réception
  const prefillFormData = () => {
    if (!reception) return

    // Déterminer le type de produit basé sur le type de réception
    let typeProduit = ""
    if (reception.type === "FG") typeProduit = "Clous"
    if (reception.type === "GG") typeProduit = "Griffes"
    if (reception.type === "CG") typeProduit = "Feuille"

    setFormData(prev => ({
      ...prev,
      date_livraison: "",
      type_produit: typeProduit,
      quantite_a_livrer: safeNumber(reception.poids_net),
    }))
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      date_livraison: "",
      lieu_depart: "",
      destination: "",
      livreur_nom: "",
      livreur_prenom: "",
      livreur_telephone: "",
      livreur_vehicule: "",
      destinateur_nom: "",
      destinateur_prenom: "",
      destinateur_fonction: "",
      destinateur_contact: "",
      type_produit: "",
      ristourne_regionale: 0,
      ristourne_communale: 0,
      quantite_a_livrer: 0,
    })
    setError(null)
    setTransitions(null)
  }

  const handleInputChange = (field: string, value: string | number) => {
    let safeValue = value
    
    if (typeof value === 'string') {
      if (value === '') {
        safeValue = field.includes('ristourne') || field.includes('quantite') ? 0 : ''
      } else {
        safeValue = field.includes('ristourne') || field.includes('quantite') ? safeNumber(value) : value
      }
    } else {
      safeValue = safeNumber(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: safeValue
    }))
  }

  const validateForm = (): boolean => {
    if (!reception) {
      setError("Aucune réception sélectionnée")
      return false
    }

    // Validation de la date
    if (!formData.date_livraison) {
      setError("La date de livraison est obligatoire")
      return false
    }

    const requiredFields = [
      { field: 'lieu_depart', label: 'Le lieu de départ' },
      { field: 'destination', label: 'La destination' },
      { field: 'livreur_nom', label: 'Le nom du livreur' },
      { field: 'livreur_prenom', label: 'Le prénom du livreur' },
      { field: 'livreur_telephone', label: 'Le téléphone du livreur' },
      { field: 'livreur_vehicule', label: 'Le numéro de véhicule' },
      { field: 'destinateur_nom', label: 'Le nom du destinataire' },
      { field: 'destinateur_prenom', label: 'Le prénom du destinataire' },
      { field: 'destinateur_fonction', label: 'La fonction du destinataire' },
      { field: 'destinateur_contact', label: 'Le contact du destinataire' },
      { field: 'type_produit', label: 'Le type de produit' },
    ]

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${label} est obligatoire`)
        return false
      }
    }

    if (formData.quantite_a_livrer <= 0) {
      setError("La quantité à livrer doit être supérieure à 0")
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    // Appel direct à la logique de confirmation/création (sans modal intermédiaire)
    await handleConfirm()
  }

  const handleConfirm = async () => {
    setLoading(true)

    try {
      const livraisonData = {
        reception_id: safeNumber(reception.id),
        date_livraison: formData.date_livraison,
        lieu_depart: formData.lieu_depart,
        destination: formData.destination,
        livreur_nom: formData.livreur_nom,
        livreur_prenom: formData.livreur_prenom,
        livreur_telephone: formData.livreur_telephone,
        livreur_vehicule: formData.livreur_vehicule,
        destinateur_nom: formData.destinateur_nom,
        destinateur_prenom: formData.destinateur_prenom,
        destinateur_fonction: formData.destinateur_fonction,
        destinateur_contact: formData.destinateur_contact,
        type_produit: formData.type_produit,
        ristourne_regionale: safeNumber(formData.ristourne_regionale),
        ristourne_communale: safeNumber(formData.ristourne_communale),
        quantite_a_livrer: safeNumber(formData.quantite_a_livrer),
      }

      console.log("📤 Données fiche livraison:", livraisonData)
      
      await createFicheLivraison(livraisonData)
      
      // Toast de succès
      toast.success(`Fiche de livraison créée avec succès pour ${formData.quantite_a_livrer} KG de ${formData.type_produit}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
      
      setTimeout(async () => {
        await refetch()
        handleClose()
      }, 1000)

    } catch (error: any) {
      console.error("❌ Erreur création fiche livraison:", error)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat()
        setError(errorMessages.join(', '))
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.message) {
        setError(error.message)
      } else {
        setError("Erreur lors de la création de la fiche de livraison.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl max-w-[95vw] bg-gradient-to-b from-white to-gray Poj-50 rounded-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] sm:max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
          <DialogHeader className="pb-3 sm:pb-4 border-b border-gray-200 mb-4 sm:mb-6">
            <DialogTitle className="text-[#234d12] text-xl sm:text-2xl md:text-3xl font-extrabold flex items-center gap-2 sm:gap-4">
              <div className="bg-[#76bc21] p-2 sm:p-3 rounded-full shadow">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl">Fiche de Livraison</div>
                {reception && (
                  <div className="text-xs sm:text-sm md:text-base font-normal text-gray-500 mt-1">
                    Réception #{reception.id} • {reception.id_fiscale} • {safeNumber(reception.poids_net)} KG
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Alerts: reception manquante ou disabled transitions */}
          {!reception && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-700 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-800 text-sm sm:text-base">Réception manquante</div>
                  <div className="text-red-700 text-xs sm:text-sm mt-0.5 sm:mt-1">Aucune réception n'est sélectionnée pour créer une fiche de livraison.</div>
                </div>
              </div>
            </div>
          )}

          {transitions && !transitions.available_transitions?.includes('fiche_livraison') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-800 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-yellow-800 text-sm sm:text-base">Action non autorisée</div>
                  <div className="text-yellow-700 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Statut actuel: <strong className="capitalize">{transitions.current_status}</strong>. Seules les réceptions au statut "Payé" peuvent être livrées.
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-red-800 text-sm sm:text-base">Erreur de validation</div>
                  <div className="text-red-700 text-xs sm:text-sm mt-0.5 sm:mt-1">{error}</div>
                </div>
              </div>
            </div>
          )}

          {reception && (
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* 1er Card - Informations de Livraison */}
              <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-[#76bc21]" />
                  Informations de Livraison
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {/* Date de livraison avec grand input */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm text-gray-700 font-medium">Date de livraison *</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.date_livraison}
                        onChange={(e) => handleInputChange('date_livraison', e.target.value)}
                        className="w-full h-12 sm:h-14 text-sm sm:text-lg rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 pr-10 sm:pr-12 transition-all duration-200"
                      />
                      <Calendar className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Lieu de départ et Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium">Lieu de départ *</label>
                      <Select value={formData.lieu_depart} onValueChange={(value) => handleInputChange('lieu_depart', value)}>
                        <SelectTrigger className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200">
                          <SelectValue placeholder="Choisir un lieu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vohipeno">Vohipeno</SelectItem>
                          <SelectItem value="Manakara">Manakara</SelectItem>
                          <SelectItem value="Farafangana">Farafangana</SelectItem>
                          <SelectItem value="Manambondro">Manambondro</SelectItem>
                          <SelectItem value="Vagaindrano">Vagaindrano</SelectItem>
                          <SelectItem value="Matangy">Matangy</SelectItem>
                          <SelectItem value="Ampasimandeva">Ampasimandeva</SelectItem>
                          <SelectItem value="Autres">Autres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium">Destination *</label>
                      <Select value={formData.destination} onValueChange={(value) => handleInputChange('destination', value)}>
                        <SelectTrigger className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200">
                          <SelectValue placeholder="Choisir une destination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PK 12">PK 12</SelectItem>
                          <SelectItem value="Makomby">Makomby</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2ème Card - Informations Livreur (pleine largeur) */}
              <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#76bc21]" />
                  Informations Livreur
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Nom *</label>
                      <Input 
                        value={formData.livreur_nom}
                        onChange={(e) => handleInputChange('livreur_nom', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Nom du livreur"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Prénom *</label>
                      <Input 
                        value={formData.livreur_prenom}
                        onChange={(e) => handleInputChange('livreur_prenom', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Prénom du livreur"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Téléphone *</label>
                      <Input 
                        value={formData.livreur_telephone}
                        onChange={(e) => handleInputChange('livreur_telephone', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Numéro de téléphone"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Véhicule *</label>
                      <Input 
                        value={formData.livreur_vehicule}
                        onChange={(e) => handleInputChange('livreur_vehicule', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Numéro du véhicule"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3ème Card - Informations Destinataire (pleine largeur avec inputs larges) */}
              <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#76bc21]" />
                  Informations Destinataire
                </h4>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Nom *</label>
                      <Input 
                        value={formData.destinateur_nom}
                        onChange={(e) => handleInputChange('destinateur_nom', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Nom du destinataire"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Prénom *</label>
                      <Input 
                        value={formData.destinateur_prenom}
                        onChange={(e) => handleInputChange('destinateur_prenom', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Prénom du destinataire"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Fonction *</label>
                      <Input 
                        value={formData.destinateur_fonction}
                        onChange={(e) => handleInputChange('destinateur_fonction', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Fonction/Rôle"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Contact *</label>
                      <Input 
                        value={formData.destinateur_contact}
                        onChange={(e) => handleInputChange('destinateur_contact', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                        placeholder="Contact téléphonique"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 4ème Card - Détails du Produit */}
              <section className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#76bc21]" />
                  Détails du Produit
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Type de produit *</label>
                    <Select value={formData.type_produit} onValueChange={(value) => handleInputChange('type_produit', value)}>
                      <SelectTrigger className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feuille">Feuilles (KG)</SelectItem>
                        <SelectItem value="Clous">Clous (KG)</SelectItem>
                        <SelectItem value="Griffes">Griffes (KG)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Quantité (KG) *</label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={formData.quantite_a_livrer || ""}
                      onChange={(e) => handleInputChange('quantite_a_livrer', e.target.value)}
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Ristourne Régionale</label>
                    <Input 
                      type="number"
                      step="1"
                      value={formData.ristourne_regionale || ""}
                      onChange={(e) => handleInputChange('ristourne_regionale', e.target.value)}
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-gray-700 font-medium mb-1 sm:mb-2">Ristourne Communale</label>
                    <Input 
                      type="number"
                      step="1"
                      value={formData.ristourne_communale || ""}
                      onChange={(e) => handleInputChange('ristourne_communale', e.target.value)}
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]/20 transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          <DialogFooter className="pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full">
              <Button 
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                Annuler
              </Button>
              <Button 
                className="flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold bg-[#76bc21] hover:bg-[#5cbf1f] text-white rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={handleSubmit}
                disabled={loading || !reception || (transitions && !transitions.available_transitions?.includes('fiche_livraison'))}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">Créer la Fiche de Livraison</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
