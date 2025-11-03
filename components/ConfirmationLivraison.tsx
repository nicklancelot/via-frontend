// components/ConfirmationLivraison.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"

interface ConfirmationLivraisonProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  numberOfReceptions: number
  confirmText?: string
  cancelText?: string
}

export function ConfirmationLivraison({
  isOpen,
  onClose,
  onConfirm,
  numberOfReceptions,
  confirmText = "Confirmer la Livraison",
  cancelText = "Annuler"
}: ConfirmationLivraisonProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Truck className="w-5 h-5" />
            Confirmation de Livraison
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <p className="text-gray-600">
            Vous êtes sur le point de livrer <strong>{numberOfReceptions} réception(s)</strong>. 
            Cette action est définitive.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-[#76bc21] hover:bg-[#5aa017]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
