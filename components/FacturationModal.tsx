"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useReceptions } from "@/hooks/useReceptions"
import { toast } from "react-toastify"
import { Calendar, FileText, DollarSign, Scale, CreditCard, Send, AlertCircle } from "lucide-react"

interface FacturationModalProps {
  isOpen: boolean
  onClose: () => void
  reception: any
}

export function FacturationModal({ isOpen, onClose, reception }: FacturationModalProps) {
  const { createFacturation, facturations } = useReceptions()

  const [formData, setFormData] = useState({
    date_paiement: "",
    numero_facture: "",
    designation: "",
    encaissement_type: "",
    encaissement_value: "",
    prix_unitaire: "",
    quantite: "",
    paiement_avance: "",
    montant_paye: "",
  })

  const [loading, setLoading] = useState(false)
  const [numeroFactureError, setNumeroFactureError] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (reception && isOpen) {
      const today = new Date().toISOString().split("T")[0]

      // Chercher la dernière facturation pour cette réception pour pré-remplir l'encaissement
      const facturationsReception = facturations.filter((fact: any) => fact.reception_id === reception.id)

      let lastEncaissementType = ""
      let lastEncaissementValue = ""
      let lastMontantPaye = "0"

      if (facturationsReception.length > 0) {
        const lastFacturation = facturationsReception[facturationsReception.length - 1]
        // Parser l'encaissement qui est au format "type: value"
        if (lastFacturation.encaissement) {
          const encaissementParts = lastFacturation.encaissement.split(":")
          if (encaissementParts.length >= 2) {
            lastEncaissementType = encaissementParts[0].trim()
            lastEncaissementValue = encaissementParts.slice(1).join(":").trim()
          }
        }
        if (lastFacturation.montant_paye) {
          lastMontantPaye = lastFacturation.montant_paye.toString()
        }
      }

      setFormData((prev) => ({
        ...prev,
        date_paiement: today,
        quantite: reception.poids_net ? reception.poids_net.toString() : "",
        numero_facture: "",
        designation: "",
        encaissement_type: lastEncaissementType,
        encaissement_value: lastEncaissementValue,
        prix_unitaire: "",
        paiement_avance: "0",
        montant_paye: lastMontantPaye,
      }))
      setNumeroFactureError("")
      setValidationErrors({})
    }
  }, [reception, isOpen, facturations])

  // Vérification des numéros de facture en double
  useEffect(() => {
    const checkNumeroFacture = () => {
      if (formData.numero_facture && facturations && facturations.length > 0) {
        const exists = facturations.some(
          (fact: any) => fact.numero_facture === formData.numero_facture && fact.reception_id !== reception?.id,
        )
        if (exists) {
          setNumeroFactureError("Ce numéro de facture existe déjà !")
          toast.warn("Ce numéro de facture existe déjà ! Veuillez en choisir un autre.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        } else {
          setNumeroFactureError("")
        }
      } else {
        setNumeroFactureError("")
      }
    }

    const timeoutId = setTimeout(checkNumeroFacture, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.numero_facture, facturations, reception?.id])

  // Conversion des valeurs pour les calculs
  const numericValues = {
    prix_unitaire: Number.parseFloat(formData.prix_unitaire) || 0,
    quantite: Number.parseFloat(formData.quantite) || 0,
    paiement_avance: Number.parseFloat(formData.paiement_avance) || 0,
    montant_paye: Number.parseFloat(formData.montant_paye) || 0,
  }

  // Calculs automatiques
  const calculs = {
    prix_total: numericValues.prix_unitaire * numericValues.quantite,
    total_paye: numericValues.montant_paye + numericValues.paiement_avance,
    reste_a_payer:
      numericValues.prix_unitaire * numericValues.quantite -
      (numericValues.montant_paye + numericValues.paiement_avance),
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Effacer les erreurs de validation quand l'utilisateur modifie le champ
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Logique spéciale pour gérer les paiements d'avance
  const handlePaiementAvanceChange = (value: string) => {
    const newPaiementAvance = Number.parseFloat(value) || 0

    // Si l'utilisateur met un paiement d'avance > 0, on ajuste automatiquement le montant payé
    if (newPaiementAvance > 0 && numericValues.montant_paye === 0) {
      // Calculer le montant payé automatiquement (prix total - avance)
      const montantPayeAuto = Math.max(0, calculs.prix_total - newPaiementAvance)
      setFormData((prev) => ({
        ...prev,
        paiement_avance: value,
        montant_paye: montantPayeAuto.toString(),
      }))
    } else {
      handleInputChange("paiement_avance", value)
    }
  }

  const validateForm = (): boolean => {
    const requiredFields = [
      { value: formData.date_paiement, name: "Date de paiement", key: "date_paiement" },
      { value: formData.numero_facture, name: "Numéro de facture", key: "numero_facture" },
      { value: formData.designation, name: "Désignation", key: "designation" },
      { value: formData.encaissement_type, name: "Type d'encaissement", key: "encaissement_type" },
      { value: formData.encaissement_value, name: "Valeur d'encaissement", key: "encaissement_value" },
      { value: formData.prix_unitaire, name: "Prix unitaire", key: "prix_unitaire" },
      { value: formData.quantite, name: "Quantité", key: "quantite" },
    ]

    let isValid = true
    const newErrors: Record<string, string[]> = {}

    for (const field of requiredFields) {
      if (!field.value || field.value.toString().trim() === "") {
        newErrors[field.key] = [`Le champ "${field.name}" est obligatoire`]
        isValid = false
      }
    }

    if (numericValues.prix_unitaire <= 0) {
      newErrors.prix_unitaire = ["Le prix unitaire doit être supérieur à 0"]
      isValid = false
    }

    if (numericValues.quantite <= 0) {
      newErrors.quantite = ["La quantité doit être supérieure à 0"]
      isValid = false
    }

    if (calculs.total_paye > calculs.prix_total) {
      newErrors.montant_paye = ["Le montant payé ne peut pas dépasser le prix total"]
      isValid = false
    }

    // Validation spéciale pour la logique métier des paiements
    if (numericValues.paiement_avance > 0 && numericValues.montant_paye === 0) {
      // C'est autorisé : paiement d'avance uniquement
      // Pas d'erreur dans ce cas
    } else if (numericValues.paiement_avance > numericValues.montant_paye) {
      newErrors.paiement_avance = ["Le paiement d'avance ne peut pas dépasser le montant payé"]
      isValid = false
    }

    if (numeroFactureError) {
      newErrors.numero_facture = [numeroFactureError]
      isValid = false
    }

    setValidationErrors(newErrors)

    if (!isValid) {
      toast.error("Veuillez corriger les erreurs dans le formulaire", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!reception?.id) {
      toast.error("Aucune réception sélectionnée", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setValidationErrors({})

    try {
      // Préparer les données avec le format attendu par l'API
      const facturationData = {
        reception_id: reception.id,
        date_paiement: formData.date_paiement,
        numero_facture: formData.numero_facture.trim(),
        designation: formData.designation.trim(),
        encaissement: `${formData.encaissement_type}: ${formData.encaissement_value.trim()}`,
        prix_unitaire: numericValues.prix_unitaire,
        quantite: numericValues.quantite,
        // Si paiement d'avance > 0 et montant payé = 0, on ajuste pour éviter l'erreur API
        paiement_avance: numericValues.paiement_avance,
        montant_paye:
          numericValues.paiement_avance > 0 && numericValues.montant_paye === 0
            ? numericValues.paiement_avance // On met le même montant que l'avance
            : numericValues.montant_paye,
        statut: calculs.reste_a_payer > 0 ? "Paiement incomplet" : "Payé",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("📤 Données envoyées au serveur:", JSON.stringify(facturationData, null, 2))

      await createFacturation(facturationData)

      // Message de succès adapté selon la présence d'avance
      if (numericValues.paiement_avance > 0) {
        toast.success("Facturation créée avec succès avec avance !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.success("Facturation créée avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }

      // Fermer la modal immédiatement après le succès
      handleClose()
    } catch (err: any) {
      console.error("❌ Erreur détaillée facturation:", err)

      // Afficher plus de détails sur l'erreur
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors
        console.error("📋 Erreurs de validation détaillées:", JSON.stringify(errors, null, 2))

        // Convertir les erreurs Laravel en format utilisable
        const formattedErrors: Record<string, string[]> = {}
        Object.keys(errors).forEach((key) => {
          formattedErrors[key] = errors[key]
        })

        setValidationErrors(formattedErrors)

        // Afficher la première erreur
        const firstErrorKey = Object.keys(errors)[0]
        const firstError = errors[firstErrorKey][0]

        toast.error(`Erreur: ${firstError}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.error("Erreur lors de la création de la facturation", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
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
      prix_unitaire: "",
      quantite: "",
      paiement_avance: "0",
      montant_paye: "0",
    })
    setNumeroFactureError("")
    setValidationErrors({})
    onClose()
  }

  const formatCurrency = (amount: number): string => {
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " Ar"
    )
  }

  // Calcul des pourcentages pour la barre de progression
  const pourcentagePaye = calculs.prix_total > 0 ? (calculs.total_paye / calculs.prix_total) * 100 : 0

  // Fonction pour afficher les erreurs de validation
  const renderFieldError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      return (
        <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          {validationErrors[fieldName][0]}
        </div>
      )
    }
    return null
  }

  // Déterminer le texte d'aide pour les paiements
  const getPaiementHelpText = () => {
    if (numericValues.paiement_avance > 0 && numericValues.montant_paye === 0) {
      return "Paiement d'avance uniquement - le reste sera payé plus tard"
    } else if (numericValues.paiement_avance > 0 && numericValues.montant_paye > 0) {
      return `Total payé: ${formatCurrency(calculs.total_paye)} (Avance: ${formatCurrency(numericValues.paiement_avance)} + Solde: ${formatCurrency(numericValues.montant_paye)})`
    }
    return ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl bg-white rounded-2xl p-0 overflow-hidden"
        aria-describedby="facturation-description"
      >
        {/* En-tête */}
        <DialogHeader className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] p-6 text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div>Création de Facture</div>
              {reception && (
                <div className="text-sm font-normal text-white/90 mt-1">Réception #{reception.id_fiscale}</div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Affichage des erreurs de validation globales */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                <AlertCircle className="w-5 h-5" />
                Erreurs de validation
              </div>
              <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                {Object.values(validationErrors)
                  .flat()
                  .map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Section Résumé financier */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Résumé Financier</h3>

            {/* Aide pour les paiements */}
            {getPaiementHelpText() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 text-sm text-center">{getPaiementHelpText()}</p>
              </div>
            )}

            {/* Barre de progression */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Payé: {formatCurrency(calculs.total_paye)}</span>
                <span>Total: {formatCurrency(calculs.prix_total)}</span>
                <span>Reste: {formatCurrency(calculs.reste_a_payer)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#76bc21] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(pourcentagePaye, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Cartes des montants */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(calculs.prix_total)}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                <div className="text-sm text-gray-600">Payé</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(calculs.total_paye)}</div>
              </div>
              <div
                className={`bg-white p-3 rounded-lg border shadow-sm ${
                  calculs.reste_a_payer > 0 ? "border-amber-200" : "border-green-200"
                }`}
              >
                <div className="text-sm text-gray-600">Reste</div>
                <div className={`text-lg font-bold ${calculs.reste_a_payer > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {formatCurrency(calculs.reste_a_payer)}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de facturation */}
          <div id="facturation-description" className="space-y-6">
            {/* Ligne 1: Date et Numéro de facture */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datePaiement" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#76bc21]" />
                  Date de paiement <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="datePaiement"
                  type="date"
                  value={formData.date_paiement}
                  onChange={(e) => handleInputChange("date_paiement", e.target.value)}
                  className={`w-full rounded-lg ${validationErrors.date_paiement ? "border-red-500" : ""}`}
                />
                {renderFieldError("date_paiement")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroFacture" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#76bc21]" />
                  N° Facture <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroFacture"
                  type="text"
                  placeholder="Ex: FAC-2024-001"
                  value={formData.numero_facture}
                  onChange={(e) => handleInputChange("numero_facture", e.target.value)}
                  className={`w-full rounded-lg ${validationErrors.numero_facture || numeroFactureError ? "border-red-500" : ""}`}
                />
                {numeroFactureError && <p className="text-red-500 text-xs mt-1">{numeroFactureError}</p>}
                {renderFieldError("numero_facture")}
              </div>
            </div>

            {/* Ligne 2: Désignation */}
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-medium text-gray-700">
                Désignation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="designation"
                type="text"
                placeholder="Description de la facture..."
                value={formData.designation}
                onChange={(e) => handleInputChange("designation", e.target.value)}
                className={`w-full rounded-lg ${validationErrors.designation ? "border-red-500" : ""}`}
              />
              {renderFieldError("designation")}
            </div>

            {/* Ligne 3: Type d'encaissement */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#76bc21]" />
                Type d'encaissement <span className="text-red-500">*</span>
              </Label>
              {formData.encaissement_type ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Type sélectionné:</span>
                    <span className="px-3 py-1 bg-[#76bc21] text-white rounded-full text-sm font-medium">
                      {formData.encaissement_type === "refMvola" ? "Référence Mvola" : "Pièce d'entrée en caisse"}
                    </span>
                  </div>
                  <Input
                    type="text"
                    placeholder={
                      formData.encaissement_type === "refMvola"
                        ? "Référence Mvola (Ex: MV2024001)"
                        : "Numéro de pièce d'entrée en caisse"
                    }
                    value={formData.encaissement_value}
                    onChange={(e) => handleInputChange("encaissement_value", e.target.value)}
                    className={`w-full rounded-lg ${validationErrors.encaissement_value ? "border-red-500" : ""}`}
                  />
                  {renderFieldError("encaissement_value")}
                  {renderFieldError("encaissement_type")}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleInputChange("encaissement_type", "")
                      handleInputChange("encaissement_value", "")
                    }}
                    className="text-xs hover:bg-[#76bc21] hover:text-white transition-colors"
                  >
                    Changer le type
                  </Button>
                </div>
              ) : (
                <div>
                  <Select onValueChange={(value) => handleInputChange("encaissement_type", value)}>
                    <SelectTrigger
                      className={`rounded-lg ${validationErrors.encaissement_type ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Sélectionnez le type d'encaissement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refMvola">Référence Mvola</SelectItem>
                      <SelectItem value="pieceCaisse">Pièce d'entrée en caisse</SelectItem>
                    </SelectContent>
                  </Select>
                  {renderFieldError("encaissement_type")}
                </div>
              )}
            </div>

            {/* Ligne 4: Prix et Quantité */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prixUnitaire" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#76bc21]" />
                  Prix unitaire (Ar) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prixUnitaire"
                  type="number"
                  placeholder="0"
                  value={formData.prix_unitaire}
                  onChange={(e) => handleInputChange("prix_unitaire", e.target.value)}
                  className={`w-full rounded-lg ${validationErrors.prix_unitaire ? "border-red-500" : ""}`}
                  step="0.01"
                  min="0"
                />
                {renderFieldError("prix_unitaire")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#76bc21]" />
                  Quantité (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantite"
                  type="number"
                  placeholder="0"
                  value={formData.quantite}
                  onChange={(e) => handleInputChange("quantite", e.target.value)}
                  className={`w-full rounded-lg ${validationErrors.quantite ? "border-red-500" : ""}`}
                  step="0.01"
                  min="0"
                />
                {renderFieldError("quantite")}
              </div>
            </div>

            {/* Ligne 5: Paiements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paiementAvance" className="text-sm font-medium text-gray-700">
                  Paiement d'avance (Ar)
                </Label>
                <Input
                  id="paiementAvance"
                  type="number"
                  placeholder="0"
                  value={formData.paiement_avance}
                  onChange={(e) => handlePaiementAvanceChange(e.target.value)}
                  className={`w-full rounded-lg ${validationErrors.paiement_avance ? "border-red-500" : ""}`}
                  step="0.01"
                  min="0"
                />
                {renderFieldError("paiement_avance")}
                <p className="text-xs text-gray-500 mt-1">
                  Montant payé à l'avance. Si rempli, le montant payé sera ajusté automatiquement.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montantPaye" className="text-sm font-medium text-gray-700">
                  Montant payé (Ar)
                </Label>
                <Input
                  id="montantPaye"
                  type="number"
                  placeholder="0"
                  value={formData.montant_paye}
                  onChange={(e) => handleInputChange("montant_paye", e.target.value)}
                  className={`w-full rounded-lg ${validationErrors.montant_paye ? "border-red-500" : ""}`}
                  step="0.01"
                  min="0"
                />
                {renderFieldError("montant_paye")}
                <p className="text-xs text-gray-500 mt-1">
                  Montant payé au moment de la facturation. Peut être 0 si seul l'avance est payé.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 rounded-lg py-3 bg-transparent"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#76bc21] text-white hover:bg-[#5aa017] shadow-sm rounded-lg py-3 flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={loading || !!numeroFactureError || Object.keys(validationErrors).length > 0}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Valider la facture
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
