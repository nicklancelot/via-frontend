"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReceptions } from "@/hooks/useReceptions"
import { toast } from 'react-toastify'

interface InsertionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InsertionModal({ isOpen, onClose }: InsertionModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [typeMatiere, setTypeMatiere] = useState("")
  const [loading, setLoading] = useState(false)
  const [idFiscaleError, setIdFiscaleError] = useState(false)
  const [idFiscaleTouched, setIdFiscaleTouched] = useState(false)

  // Champs communs
  const [dateHeure, setDateHeure] = useState("")
  const [designation, setDesignation] = useState("")
  const [provenance, setProvenance] = useState("")
  const [autreProvenance, setAutreProvenance] = useState("")
  
  // Informations fournisseur
  const [nomFournisseur, setNomFournisseur] = useState("")
  const [prenomFournisseur, setPrenomFournisseur] = useState("")
  const [idFiscale, setIdFiscale] = useState("")
  const [localisation, setLocalisation] = useState("")
  const [contact, setContact] = useState("")

  // Champs de poids et mesures
  const [poidsBrut, setPoidsBrut] = useState("")
  const [poidsNet, setPoidsNet] = useState("")
  const [unite, setUnite] = useState("Kg")

  // Champs spécifiques pour Clous (FG)
  const [poidsPackaging, setPoidsPackaging] = useState("")
  const [tauxDessiccation, setTauxDessiccation] = useState("")
  const [tauxHumiditeFg, setTauxHumiditeFg] = useState("")

  // Champs spécifiques pour Griffes (GG)
  const [poidsAgree, setPoidsAgree] = useState("")
  const [densite, setDensite] = useState("")

  // Champs spécifiques pour Feuilles (CG)
  const [tauxHumiditeCg, setTauxHumiditeCg] = useState("")

  const { createReception, refetch, receptions } = useReceptions()

  const handleNext = () => setCurrentStep(2)
  const handleBack = () => setCurrentStep(1)

  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setCurrentStep(1)
    setTypeMatiere("")
    setDateHeure("")
    setDesignation("")
    setProvenance("")
    setAutreProvenance("")
    setNomFournisseur("")
    setPrenomFournisseur("")
    setIdFiscale("")
    setLocalisation("")
    setContact("")
    setPoidsBrut("")
    setPoidsNet("")
    setUnite("Kg")
    setPoidsPackaging("")
    setTauxDessiccation("")
    setTauxHumiditeFg("")
    setPoidsAgree("")
    setDensite("")
    setTauxHumiditeCg("")
    setIdFiscaleError(false)
    setIdFiscaleTouched(false)
  }

  useEffect(() => {
    if (typeMatiere === "FG") {
      setDesignation("")
      setLocalisation("Vohipeno")
    } else if (typeMatiere === "CG") {
      setDesignation("")
      setLocalisation("")
    } else if (typeMatiere === "GG") {
      setDesignation("")
      setLocalisation("")
    }
  }, [typeMatiere])

  // Vérification de l'ID fiscal
  useEffect(() => {
    const checkIdFiscale = () => {
      if (idFiscaleTouched && idFiscale && receptions && receptions.length > 0) {
        const exists = receptions.some((reception: any) => 
          reception.id_fiscale?.toString().toLowerCase() === idFiscale.toLowerCase().trim()
        )
        setIdFiscaleError(exists)
      } else {
        setIdFiscaleError(false)
      }
    }

    const timeoutId = setTimeout(checkIdFiscale, 500)
    return () => clearTimeout(timeoutId)
  }, [idFiscale, receptions, idFiscaleTouched])

  const handleIdFiscaleChange = (value: string) => {
    setIdFiscale(value)
    if (!idFiscaleTouched && value.trim() !== "") {
      setIdFiscaleTouched(true)
    }
  }

  const prepareDataForBackend = () => {
    const baseData = {
      type: typeMatiere,
      dateHeure: dateHeure || new Date().toISOString().slice(0, 19).replace('T', ' '),
      designation,
      provenance: autreProvenance || provenance,
      nom_fournisseur: nomFournisseur,
      prenom_fournisseur: prenomFournisseur,
      id_fiscale: idFiscale.trim(),
      localisation,
      contact,
      poids_brut: poidsBrut ? parseFloat(poidsBrut) : null,
      poids_net: poidsNet ? parseFloat(poidsNet) : null,
      unite,
    }

    if (typeMatiere === "FG") {
      Object.assign(baseData, {
        poids_packaging: poidsPackaging ? parseFloat(poidsPackaging) : null,
        taux_dessiccation: tauxDessiccation ? parseFloat(tauxDessiccation) : null,
        taux_humidite_fg: tauxHumiditeFg ? parseFloat(tauxHumiditeFg) : null,
      })
    } else if (typeMatiere === "GG") {
      Object.assign(baseData, {
        poids_agreé: poidsAgree ? parseFloat(poidsAgree) : null,
        densite: densite ? parseFloat(densite) : null,
      })
    } else if (typeMatiere === "CG") {
      Object.assign(baseData, {
        taux_humidite_cg: tauxHumiditeCg ? parseFloat(tauxHumiditeCg) : null,
      })
    }

    return baseData
  }

  const handleSubmit = async () => {
    if (!typeMatiere) {
      toast.warning("Veuillez sélectionner un type de matière première", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (!idFiscale || idFiscaleError) {
      toast.error("Veuillez entrer un ID fiscal valide et unique", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setLoading(true)
    try {
      const dataToSend = prepareDataForBackend()
      await createReception(dataToSend)
      await refetch()
      resetForm()
      onClose()
      toast.success("Réception créée avec succès!", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error: any) {
      console.error("Erreur lors de la création:", error)
      
      const isDuplicateIdFiscaleError = (error: any): boolean => {
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            error?.response?.data?.error ||
                            '';
        const errorString = JSON.stringify(error).toLowerCase();
        const messageString = String(errorMessage).toLowerCase();

        const duplicatePatterns = [
          'id_fiscale',
          'id fiscale', 
          'duplicate',
          'déjà existant',
          'already exists',
          'unique constraint',
          '409',
          'contrainte unique'
        ];

        return duplicatePatterns.some(pattern => 
          messageString.includes(pattern) || errorString.includes(pattern)
        );
      }

      if (isDuplicateIdFiscaleError(error)) {
        setIdFiscaleError(true)
        toast.error(
          <div>
            <div className="font-semibold">ID Fiscale déjà existant</div>
            <div className="text-sm">L'ID Fiscale "{idFiscale}" existe déjà dans le système.</div>
            <div className="text-sm mt-1">Veuillez utiliser un ID Fiscale unique.</div>
          </div>,
          {
            autoClose: 5000,
            closeButton: true,
          }
        )
      } else {
        const errorMessage = error?.response?.data?.message || 
                           error?.message || 
                           "Erreur lors de la création de la réception";
        
        toast.error(
          <div>
            <div className="font-semibold">Erreur de création</div>
            <div className="text-sm">{errorMessage}</div>
          </div>,
          {
            autoClose: 5000,
          }
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95%] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#76bc21]">
              PV de réception
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-[#76bc21]">Généralité</h3>

                <div className="space-y-2 mb-3">
                  <Label className="font-semibold text-xl">Type de matière première</Label>
                  <Select onValueChange={setTypeMatiere} value={typeMatiere}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FG">Clous (FG)</SelectItem>
                      <SelectItem value="GG">Griffes (GG)</SelectItem>
                      <SelectItem value="CG">Feuilles (CG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-xl">Date et heure réception</Label>
                  <Input 
                    type="datetime-local" 
                    value={dateHeure} 
                    onChange={e => setDateHeure(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-xl">Désignation</Label>
                  <Input 
                    placeholder="Pv reception ..." 
                    value={designation} 
                    onChange={e => setDesignation(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-xl">Provenance</Label>
                  {provenance === "autres" ? (
                    <Input
                      placeholder="Entrer une nouvelle provenance"
                      value={autreProvenance}
                      onChange={(e) => setAutreProvenance(e.target.value)}
                      onBlur={() => { if(!autreProvenance.trim()) setProvenance("") }}
                      autoFocus
                    />
                  ) : (
                    <Select onValueChange={setProvenance} value={provenance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la provenance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manakara">Manakara</SelectItem>
                        <SelectItem value="manambondro">Manambondro</SelectItem>
                        <SelectItem value="vohipeno">Vohipeno</SelectItem>
                        <SelectItem value="matangy">Matangy</SelectItem>
                        <SelectItem value="ampasimandreva">Ampasimandreva</SelectItem>
                        <SelectItem value="autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-[#76bc21]">Fournisseur</div>
                  
                  <div className="flex mt-3 space-x-4">
                    <div className="flex-1">
                      <Label className="font-semibold text-xl">Nom</Label>
                      <Input 
                        placeholder="Rakoto" 
                        value={nomFournisseur}
                        onChange={e => setNomFournisseur(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="font-semibold text-xl">Prénom</Label>
                      <Input 
                        placeholder="Jean Baptiste" 
                        value={prenomFournisseur}
                        onChange={e => setPrenomFournisseur(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex mt-3 space-x-4">
                    <div className="flex-1">
                      <Label className="font-semibold text-xl">ID fiscale</Label>
                      <Input 
                        placeholder="123456789" 
                        value={idFiscale}
                        onChange={e => handleIdFiscaleChange(e.target.value)}
                        className={idFiscaleError ? "border-red-500" : ""}
                      />
                      {idFiscaleError && (
                        <p className="text-red-500 text-sm mt-1">Cet ID fiscal existe déjà</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-semibold text-xl">Localisation</Label>
                      <Input 
                        placeholder="Adresse du fournisseur" 
                        value={localisation}
                        onChange={e => setLocalisation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold text-xl">Contact</Label>
                    <Input 
                      placeholder="+261321234567" 
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full rounded-xl bg-[#76bc21] text-white hover:bg-[#5aa017]" 
                  onClick={handleNext}
                  disabled={!typeMatiere || !nomFournisseur || !prenomFournisseur || !idFiscale || idFiscaleError}
                >
                  Suivant →
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-[#76bc21]">Produit</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-3">Poids brut (Kg)</Label>
                    <Input 
                      placeholder="XXX" 
                      type="number" 
                      value={poidsBrut} 
                      onChange={e => setPoidsBrut(e.target.value)} 
                    />
                  </div>
                  
                  {typeMatiere === "FG" && (
                    <div>
                      <Label className="mb-3">Poids de packaging (Kg)</Label>
                      <Input 
                        placeholder="XXX" 
                        type="number" 
                        value={poidsPackaging} 
                        onChange={e => setPoidsPackaging(e.target.value)} 
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="mb-3">Poids net (Kg)</Label>
                    <Input 
                      placeholder="XXX" 
                      type="number" 
                      value={poidsNet} 
                      onChange={e => setPoidsNet(e.target.value)} 
                    />
                  </div>
                  
                  {typeMatiere === "GG" && (
                    <div>
                      <Label className="mb-3">Poids agréé (Kg)</Label>
                      <Input 
                        placeholder="XXX" 
                        type="number" 
                        value={poidsAgree} 
                        onChange={e => setPoidsAgree(e.target.value)} 
                      />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-[#76bc21]">Spécification</h3>
                <div className="grid grid-cols-2 gap-4">
                  {typeMatiere === "FG" && (
                    <>
                      <div>
                        <Label className="mb-3">Taux de Dèssication %</Label>
                        <Input 
                          placeholder="XXX" 
                          type="number" 
                          step="0.01"
                          value={tauxDessiccation} 
                          onChange={e => setTauxDessiccation(e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label className="mb-3">Taux d'humidité FG %</Label>
                        <Input 
                          placeholder="XXX" 
                          type="number" 
                          step="0.01"
                          value={tauxHumiditeFg} 
                          onChange={e => setTauxHumiditeFg(e.target.value)} 
                        />
                      </div>
                    </>
                  )}
                  
                  {typeMatiere === "GG" && (
                    <div>
                      <Label className="mb-3">Densité</Label>
                      <Input 
                        placeholder="XXX" 
                        type="number" 
                        step="0.01"
                        value={densite} 
                        onChange={e => setDensite(e.target.value)} 
                      />
                    </div>
                  )}
                  
                  {typeMatiere === "CG" && (
                    <div>
                      <Label className="mb-3">Taux d'humidité CG %</Label>
                      <Input 
                        placeholder="XXX" 
                        type="number" 
                        step="0.01"
                        value={tauxHumiditeCg} 
                        onChange={e => setTauxHumiditeCg(e.target.value)} 
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="w-1/2 rounded-xl bg-gray-300 text-black hover:bg-gray-400" 
                    onClick={handleBack}
                  >
                    ← Retour
                  </Button>
                  <Button 
                    className="w-1/2 rounded-xl bg-[#76bc21] text-white hover:bg-[#5aa017]"
                    onClick={handleSubmit}
                    disabled={loading || !poidsBrut || !poidsNet || idFiscaleError}
                  >
                    {loading ? "Création..." : "Terminer"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
