"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface FacturationHuilleEssentielleProps {
  isOpen: boolean
  onClose: () => void
}

export function FacturationHuilleEssentielle({ isOpen, onClose }: FacturationHuilleEssentielleProps) {
  const [prixUnitaire, setPrixUnitaire] = useState("")
  const [montantTotal, setMontantTotal] = useState("")
  const [avanceVersee, setAvanceVersee] = useState("")
  const [controleurQualite, setControleurQualite] = useState("")
  const [responsableCommercial, setResponsableCommercial] = useState("")

  // Calcul du reste à payer
  const resteAPayer = (parseFloat(montantTotal) || 0) - (parseFloat(avanceVersee) || 0)

  const handleSubmit = () => {
    const data = {
      prixUnitaire,
      montantTotal,
      avanceVersee,
      resteAPayer,
      controleurQualite,
      responsableCommercial
    }
    console.log("Facturation:", data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21]">Négociation & Paiement</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Section Prix */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prix-unitaire">Prix unitaire (Ar/kg)</Label>
              <Input
                id="prix-unitaire"
                type="number"
                placeholder="Prix unitaire"
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="montant-total">Montant total (Ar)</Label>
              <Input
                id="montant-total"
                type="number"
                placeholder="Montant total"
                value={montantTotal}
                onChange={(e) => setMontantTotal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avance-versee">Avance versée (Ar)</Label>
              <Input
                id="avance-versee"
                type="number"
                placeholder="Avance versée"
                value={avanceVersee}
                onChange={(e) => setAvanceVersee(e.target.value)}
              />
            </div>
          </div>

          {/* Reste à payer */}
          <div className="border-t pt-4 space-y-2">
            <Label className="font-semibold text-gray-900">Reste à payer (Ar)</Label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg font-bold text-gray-900">
                {resteAPayer.toLocaleString('fr-FR')} Ar
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="controleur-qualite">Contrôleur qualité</Label>
              <Input
                id="controleur-qualite"
                type="text"
                placeholder="Nom et signature"
                value={controleurQualite}
                onChange={(e) => setControleurQualite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable-commercial">Responsable commercial</Label>
              <Input
                id="responsable-commercial"
                type="text"
                placeholder="Nom et signature"
                value={responsableCommercial}
                onChange={(e) => setResponsableCommercial(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-[#76bc21] hover:bg-[#5cae1b] text-white"
          >
            Valider la facturation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
