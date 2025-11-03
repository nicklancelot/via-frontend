"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Send, Calculator, AlertCircle } from "lucide-react"
import { useReceptions } from "@/hooks/useReceptions"
import { toast } from "react-toastify"

interface ImpeyerModalProps {
  isOpen: boolean
  onClose: () => void
  reception?: any
}

export function ImpeyerModal({ isOpen, onClose, reception }: ImpeyerModalProps) {
  const { createImpaye, updateImpaye, refetch, facturations, impayes, getReceptionTransitions, checkImpayeReception } =
    useReceptions()

  const [formData, setFormData] = useState({
    date_paiement: "",
    numero_facture: "",
    designation: "",
    encaissement_type: "",
    encaissement_value: "",
    prix_unitaire: 0,
    quantite: 0,
    montant_paye: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [solde, setSolde] = useState<any>(null)
  const [existingImpaye, setExistingImpaye] = useState<any>(null)
  const [transitions, setTransitions] = useState<any>(null)

  // Fonction utilitaire pour convertir en nombre sûr
  const safeNumber = (value: any, defaultValue = 0): number => {
    if (value === null || value === undefined || value === "") return defaultValue
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }

  // Vérifier les transitions disponibles et l'impayé existant
  useEffect(() => {
    const checkData = async () => {
      if (reception && isOpen) {
        try {
          // Vérifier les transitions disponibles
          const transitionsData = await getReceptionTransitions(reception.id)
          setTransitions(transitionsData)

          // Vérifier si un impayé existe déjà
          const impayeCheck = await checkImpayeReception(reception.id)
          setExistingImpaye(impayeCheck.exists ? impayeCheck.data : null)

          // Calculer le solde basé sur les données existantes
          calculerSoldeInitial()
        } catch (error) {
          console.error("Erreur lors de la vérification:", error)
          calculerSoldeInitial()
        }
      }
    }

    checkData()
  }, [reception, isOpen])

  // Calculer le solde initial basé sur les données disponibles
  const calculerSoldeInitial = () => {
    if (!reception) return

    let montantTotal = 0
    let totalPaye = 0

    // Si un impayé existe, utiliser ses données
    if (existingImpaye) {
      montantTotal = safeNumber(existingImpaye.prix_unitaire) * safeNumber(existingImpaye.quantite)
      totalPaye = safeNumber(existingImpaye.montant_paye)
    } else {
      // Sinon utiliser les facturations ou données de réception
      const facturationsReception = facturations.filter(
        (fact) => safeNumber(fact.reception_id) === safeNumber(reception.id),
      )

      if (facturationsReception.length > 0) {
        const derniereFacturation = facturationsReception[facturationsReception.length - 1]
        montantTotal = safeNumber(derniereFacturation.prix_unitaire) * safeNumber(derniereFacturation.quantite)
        totalPaye = safeNumber(derniereFacturation.montant_paye) + safeNumber(derniereFacturation.paiement_avance)
      } else {
        // Estimation basée sur la réception
        const prixEstime = safeNumber(reception.prix_unitaire, 1000)
        const quantite = safeNumber(reception.poids_net)
        montantTotal = prixEstime * quantite
        totalPaye = 0
      }
    }

    const resteAPayer = Math.max(0, montantTotal - totalPaye)

    setSolde({
      montant_total: montantTotal,
      total_paye: totalPaye,
      reste_a_payer: resteAPayer,
      statut: reception.statut,
    })

    // Pré-remplir le formulaire
    prefillFormData(montantTotal, resteAPayer)
  }

  // Pré-remplir le formulaire avec les données appropriées
  const prefillFormData = (montantTotal: number, resteAPayer: number) => {
    if (existingImpaye) {
      // Mode édition - parser l'encaissement existant
      let encaissementType = ""
      let encaissementValue = ""

      if (existingImpaye.encaissement) {
        const encaissementParts = existingImpaye.encaissement.split(":")
        if (encaissementParts.length >= 2) {
          encaissementType = encaissementParts[0].trim()
          encaissementValue = encaissementParts.slice(1).join(":").trim()
        }
      }

      setFormData({
        date_paiement: existingImpaye.date_paiement || new Date().toISOString().split("T")[0],
        numero_facture: existingImpaye.numero_facture || "",
        designation: existingImpaye.designation || "",
        encaissement_type: encaissementType,
        encaissement_value: encaissementValue,
        prix_unitaire: safeNumber(existingImpaye.prix_unitaire),
        quantite: safeNumber(existingImpaye.quantite),
        montant_paye: safeNumber(existingImpaye.montant_paye),
      })
    } else {
      // Mode création - chercher la dernière facturation pour pré-remplir l'encaissement
      const facturationsReception = facturations.filter(
        (fact) => safeNumber(fact.reception_id) === safeNumber(reception.id),
      )
      const derniereFacturation = facturationsReception[facturationsReception.length - 1]

      let encaissementType = ""
      let encaissementValue = ""
      let lastMontantPaye = Math.min(10000, resteAPayer)

      if (derniereFacturation?.encaissement) {
        const encaissementParts = derniereFacturation.encaissement.split(":")
        if (encaissementParts.length >= 2) {
          encaissementType = encaissementParts[0].trim()
          encaissementValue = encaissementParts.slice(1).join(":").trim()
        }
      }

      if (derniereFacturation?.montant_paye) {
        lastMontantPaye = safeNumber(derniereFacturation.montant_paye)
      }

      const prixUnitaire = derniereFacturation?.prix_unitaire || reception.prix_unitaire || 1000
      const quantite = reception.poids_net || 0
      const numeroFacture = derniereFacturation?.numero_facture || ""
      const designation = derniereFacturation?.designation || reception.designation || ""

      setFormData({
        date_paiement: new Date().toISOString().split("T")[0],
        numero_facture: numeroFacture,
        designation: designation,
        encaissement_type: encaissementType,
        encaissement_value: encaissementValue,
        prix_unitaire: safeNumber(prixUnitaire),
        quantite: safeNumber(quantite),
        montant_paye: lastMontantPaye,
      })
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    const safeValue = typeof value === "string" ? (value === "" ? 0 : safeNumber(value)) : safeNumber(value)

    setFormData((prev) => ({
      ...prev,
      [field]: safeValue,
    }))
  }

  const handleNumberIncrement = (field: "prix_unitaire" | "quantite" | "montant_paye") => {
    const currentValue = safeNumber(formData[field])
    let newValue = currentValue + (field === "montant_paye" ? 1000 : 1)

    // Pour montant_paye, ne pas dépasser le prix total calculé
    if (field === "montant_paye") {
      const prixTotal = safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite)
      newValue = Math.min(prixTotal, newValue)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }))
  }

  const handleNumberDecrement = (field: "prix_unitaire" | "quantite" | "montant_paye") => {
    const currentValue = safeNumber(formData[field])
    const newValue = Math.max(0, currentValue - (field === "montant_paye" ? 1000 : 1))

    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }))
  }

  const validateForm = (): boolean => {
    const montantPaye = safeNumber(formData.montant_paye)
    const prixUnitaire = safeNumber(formData.prix_unitaire)
    const quantite = safeNumber(formData.quantite)
    const prixTotal = prixUnitaire * quantite

    if (!formData.date_paiement) {
      setError("La date de paiement est obligatoire")
      return false
    }

    if (!formData.numero_facture) {
      setError("Le numéro de facture est obligatoire")
      return false
    }

    if (!formData.designation) {
      setError("La désignation est obligatoire")
      return false
    }

    if (prixUnitaire <= 0) {
      setError("Le prix unitaire doit être supérieur à 0")
      return false
    }

    if (quantite <= 0) {
      setError("La quantité doit être supérieure à 0")
      return false
    }

    if (montantPaye <= 0) {
      setError("Le montant payé doit être supérieur à 0")
      return false
    }

    // Validation backend : montant payé ne peut pas dépasser le prix total
    if (montantPaye > prixTotal) {
      setError(`Le montant payé ne peut pas dépasser le prix total (${formatCurrency(prixTotal)})`)
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async () => {
    setError(null)

    if (!reception) {
      setError("Aucune réception sélectionnée")
      return
    }

    // Vérifier que la transition est autorisée
    if (transitions && !transitions.available_transitions?.includes("impaye")) {
      setError("Cette réception ne peut pas passer en statut impayé dans son état actuel")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const encaissementFormatted =
        formData.encaissement_type && formData.encaissement_value
          ? `${formData.encaissement_type}: ${formData.encaissement_value}`
          : "Non spécifié"

      const impayeData = {
        reception_id: safeNumber(reception.id),
        date_paiement: formData.date_paiement,
        numero_facture: formData.numero_facture,
        designation: formData.designation,
        encaissement: encaissementFormatted,
        prix_unitaire: safeNumber(formData.prix_unitaire),
        quantite: safeNumber(formData.quantite),
        montant_paye: safeNumber(formData.montant_paye),
      }

      console.log("📤 Données impayé préparées:", impayeData)

      let result
      if (existingImpaye) {
        result = await updateImpaye(existingImpaye.id, impayeData)
      } else {
        result = await createImpaye(impayeData)
      }

      const calculs = {
        prix_total: safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite),
        reste_a_payer_calcule:
          safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite) - safeNumber(formData.montant_paye),
        paiement_complet:
          safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite) - safeNumber(formData.montant_paye) <= 1,
      }

      const successMessage = existingImpaye
        ? "L'ajustement de solde a été modifié avec succès."
        : "L'ajustement de solde a été enregistré avec succès."

      const detailsMessage = `Montant payé: ${formatCurrency(formData.montant_paye)} | Reste: ${formatCurrency(calculs.reste_a_payer_calcule)}${calculs.paiement_complet ? " ✓ Paiement complet!" : ""}`

      toast.success(`${successMessage} ${detailsMessage}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      await refetch()
      handleClose()
    } catch (error: any) {
      console.error("❌ Erreur détaillée:", error)

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat()
        setError(errorMessages.join(", "))
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.message) {
        setError(error.message)
      } else {
        setError("Erreur lors de l'enregistrement. Vérifiez les données saisies.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      date_paiement: "",
      numero_facture: "",
      designation: "",
      encaissement_type: "",
      encaissement_value: "",
      prix_unitaire: 0,
      quantite: 0,
      montant_paye: 0,
    })
    setError(null)
    setSolde(null)
    setExistingImpaye(null)
    setTransitions(null)
    onClose()
  }

  const formatCurrency = (amount: number): string => {
    const safeAmount = safeNumber(amount)
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(safeAmount) + " Ar"
    )
  }

  // Calculer les totaux pour l'affichage
  const calculs = {
    prix_total: safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite),
    reste_a_payer_calcule:
      safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite) - safeNumber(formData.montant_paye),
    paiement_complet:
      safeNumber(formData.prix_unitaire) * safeNumber(formData.quantite) - safeNumber(formData.montant_paye) <= 1,
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-[#76bc21] text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {existingImpaye ? "Modifier l'ajustement" : "Ajustement de solde"}
            {reception && <span className="text-sm text-gray-600 font-normal">- {reception.id_fiscale}</span>}
          </DialogTitle>
        </DialogHeader>

        {transitions && !transitions.available_transitions?.includes("impaye") && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Action non autorisée</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Statut actuel: <strong>{transitions.current_status}</strong>. Cette réception ne peut pas être ajustée.
            </p>
          </div>
        )}

        {solde ? (
          <>
            {/* Situation actuelle */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-600">Montant total :</span>
                  <div className="font-semibold text-blue-800">{formatCurrency(solde.montant_total)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Déjà payé :</span>
                  <div className="font-semibold text-green-600">{formatCurrency(solde.total_paye)}</div>
                </div>
              </div>
              {existingImpaye && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="text-xs text-blue-600">⚡ Ajustement existant - Mode édition</div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Date et N° facture */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">Date de paiement *</label>
                  <Input
                    type="date"
                    value={formData.date_paiement}
                    onChange={(e) => handleInputChange("date_paiement", e.target.value)}
                    className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">N° facture *</label>
                  <Input
                    value={formData.numero_facture}
                    onChange={(e) => handleInputChange("numero_facture", e.target.value)}
                    className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all"
                    placeholder="Numéro de facture"
                  />
                </div>
              </div>

              {/* Designation et Encaissement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">Désignation *</label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all"
                    placeholder="Désignation du règlement"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">Type d'encaissement *</label>
                  {formData.encaissement_type ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#76bc21] text-white rounded text-xs font-medium">
                          {formData.encaissement_type === "refMvola" ? "Mvola" : "Caisse"}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleInputChange("encaissement_type", "")
                            handleInputChange("encaissement_value", "")
                          }}
                          className="text-xs h-6 px-2"
                        >
                          Changer
                        </Button>
                      </div>
                      <Input
                        value={formData.encaissement_value}
                        onChange={(e) => handleInputChange("encaissement_value", e.target.value)}
                        className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all"
                        placeholder={formData.encaissement_type === "refMvola" ? "Réf. Mvola" : "N° pièce caisse"}
                      />
                    </div>
                  ) : (
                    <Select onValueChange={(value) => handleInputChange("encaissement_type", value)}>
                      <SelectTrigger className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21]">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="refMvola">Référence Mvola</SelectItem>
                        <SelectItem value="pieceCaisse">Pièce caisse</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Prix unitaire et Quantité */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">Prix unitaire (Ar) *</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="1"
                      value={formData.prix_unitaire || ""}
                      onChange={(e) => handleInputChange("prix_unitaire", e.target.value)}
                      className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all pr-8"
                      placeholder="0"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                      <ChevronUp
                        className="w-3 h-3 text-[#76bc21] cursor-pointer hover:text-[#5aa017]"
                        onClick={() => handleNumberIncrement("prix_unitaire")}
                      />
                      <ChevronDown
                        className="w-3 h-3 text-[#76bc21] cursor-pointer hover:text-[#5aa017]"
                        onClick={() => handleNumberDecrement("prix_unitaire")}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2 font-medium">Quantité (KG) *</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.quantite || ""}
                      onChange={(e) => handleInputChange("quantite", e.target.value)}
                      className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all pr-8"
                      placeholder="0"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                      <ChevronUp
                        className="w-3 h-3 text-[#76bc21] cursor-pointer hover:text-[#5aa017]"
                        onClick={() => handleNumberIncrement("quantite")}
                      />
                      <ChevronDown
                        className="w-3 h-3 text-[#76bc21] cursor-pointer hover:text-[#5aa017]"
                        onClick={() => handleNumberDecrement("quantite")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Montant payé */}
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">
                  Montant payé (Ar) *
                  <span className="text-gray-500 ml-1 text-xs">(max: {formatCurrency(calculs.prix_total)})</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1"
                    value={formData.montant_paye || ""}
                    onChange={(e) => handleInputChange("montant_paye", e.target.value)}
                    className="text-sm rounded-lg border-gray-300 focus:border-[#76bc21] focus:ring-2 focus:ring-[#76bc21] transition-all pr-8"
                    placeholder="0"
                    min="0"
                    max={calculs.prix_total}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                    <ChevronUp
                      className="w-3 h-3 text-[#76bc21] cursor-pointer hover:text-[#5aa017]"
                      onClick={() => handleNumberIncrement("montant_paye")}
                    />
                    <ChevronDown
                      className="w-3 h-3 text-[#76bc21] cursor-pointer hover:text-[#5aa017]"
                      onClick={() => handleNumberDecrement("montant_paye")}
                    />
                  </div>
                </div>
              </div>

              {/* Récapitulatif de cette transaction */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-700 text-sm">Récapitulatif de cette transaction :</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prix total :</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(calculs.prix_total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant payé :</span>
                  <span className="font-semibold text-green-600">{formatCurrency(formData.montant_paye)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span className="text-gray-700">Reste après paiement :</span>
                  <span className={calculs.reste_a_payer_calcule > 0 ? "text-orange-600" : "text-green-600"}>
                    {formatCurrency(calculs.reste_a_payer_calcule)}
                  </span>
                </div>
                {calculs.paiement_complet && (
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-center mt-2">
                    <span className="text-green-700 text-sm font-medium">
                      ✓ Cette transaction règle le solde complet
                    </span>
                  </div>
                )}
                <div className="text-xs text-gray-500 text-center mt-2">
                  Le backend calculera automatiquement le statut de la réception
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                className="w-full bg-[#76bc21] hover:bg-[#5aa017] text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-md"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.montant_paye ||
                  safeNumber(formData.montant_paye) <= 0 ||
                  (transitions && !transitions.available_transitions?.includes("impaye"))
                }
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {existingImpaye ? "Mise à jour..." : "Enregistrement..."}
                  </>
                ) : (
                  <>
                    {existingImpaye ? "Mettre à jour l'ajustement" : "Valider l'ajustement"}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
