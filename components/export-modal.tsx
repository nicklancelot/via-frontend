"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#76bc21]">Exportation de données</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date de début</Label>
            <Input type="date" defaultValue="2024-03-01" placeholder="JJ / MM / AA" />
          </div>

          <div className="space-y-2">
            <Label>Date de fin</Label>
            <Input type="date" defaultValue="2024-03-31" placeholder="JJ / MM / AA" />
          </div>

          <div className="space-y-2">
            <Label>Statut à inclure</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Non livré" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-livre">Non livré</SelectItem>
                <SelectItem value="livre">Livré (archive)</SelectItem>
                <SelectItem value="tous">Tous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-[#76bc21] text-primary-foreground hover:bg-[#5aa017] cursor-pointer">
            Exporter en PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
