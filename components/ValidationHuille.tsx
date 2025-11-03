"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ValidationHuilleProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (decision: string, poidsAgree: string, observations: string) => void
}

export function ValidationHuille({ isOpen, onClose, onConfirm }: ValidationHuilleProps) {
  const [decision, setDecision] = useState("")
  const [poidsAgree, setPoidsAgree] = useState("")
  const [observations, setObservations] = useState("")

  const handleSubmit = () => {
    onConfirm(decision, poidsAgree, observations)
    setDecision("")
    setPoidsAgree("")
    setObservations("")
    onClose()
  }

  const handleClose = () => {
    setDecision("")
    setPoidsAgree("")
    setObservations("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95%] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21]">Décision finale</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Décision finale */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Décision finale</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant={decision === "accepte" ? "default" : "outline"}
                className={`flex-1 ${
                  decision === "accepte" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "border-gray-300 hover:bg-green-50"
                }`}
                onClick={() => setDecision("accepte")}
              >
                Accepté
              </Button>
              <Button
                type="button"
                variant={decision === "rejete" ? "default" : "outline"}
                className={`flex-1 ${
                  decision === "rejete" 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-gray-300 hover:bg-red-50"
                }`}
                onClick={() => setDecision("rejete")}
              >
                Rejeté
              </Button>
              <Button
                type="button"
                variant={decision === "a_retraiter" ? "default" : "outline"}
                className={`flex-1 ${
                  decision === "a_retraiter" 
                    ? "bg-amber-500 hover:bg-amber-600 text-white" 
                    : "border-gray-300 hover:bg-amber-50"
                }`}
                onClick={() => setDecision("a_retraiter")}
              >
                À retraiter
              </Button>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-3">
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              placeholder="Observations..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Poids agréé */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-base font-semibold">Poids agréé</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="poids-agree">Poids agréé (kg)</Label>
                <Input
                  id="poids-agree"
                  type="number"
                  step="0.01"
                  placeholder="Poids agréé (kg)"
                  value={poidsAgree}
                  onChange={(e) => setPoidsAgree(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecart-poids">Observation / écart de poids</Label>
                <Input
                  id="ecart-poids"
                  type="text"
                  placeholder="Observation / écart de poids"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!decision}
            className="flex-1 bg-[#76bc21] hover:bg-[#5cae1b] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmer la décision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
