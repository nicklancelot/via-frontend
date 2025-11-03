"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Send } from "lucide-react"

interface FicheLivraisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FicheLivraisonModal({ isOpen, onClose }: FicheLivraisonModalProps) {
  // Infos générales
  const [id, setId] = useState("")
  const [dateLivraison, setDateLivraison] = useState("")

  // Livreur
  const [nomLivreur, setNomLivreur] = useState("")
  const [prenomLivreur, setPrenomLivreur] = useState("")
  const [telephoneLivreur, setTelephoneLivreur] = useState("")
  const [numeroVehicule, setNumeroVehicule] = useState("")

  // Destinataire
  const [nomDestinataire, setNomDestinataire] = useState("")
  const [prenomDestinataire, setPrenomDestinataire] = useState("")
  const [fonctionDestinataire, setFonctionDestinataire] = useState("")
  const [telephoneDestinataire, setTelephoneDestinataire] = useState("")

  // Lieu & destination
  const [lieuDepart, setLieuDepart] = useState("")
  const [destination, setDestination] = useState("")

  // Produit
  const [typeProduit, setTypeProduit] = useState("HE Griffes")
  const [poidsNet, setPoidsNet] = useState("")

  // Ristourne
  const [ristourneRegionale, setRistourneRegionale] = useState("")
  const [ristourneCommunale, setRistourneCommunale] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-[#76bc21] text-lg font-semibold">
            Fiche d’envoi de Produit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Infos générales */}
          <div className="bg-[#76bc21] p-4 rounded-lg space-y-3">
            <div>
              <label className="block text-sm text-black mb-1">Date de livraison</label>
              <Input type="date" value={dateLivraison} onChange={(e) => setDateLivraison(e.target.value)} className="text-sm" />
            </div>
          </div>

          {/* Livreur */}
          <div className="bg-[#76bc21] p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800">Livreur</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Nom" value={nomLivreur} onChange={(e) => setNomLivreur(e.target.value)} />
              <Input placeholder="Prénom" value={prenomLivreur} onChange={(e) => setPrenomLivreur(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input placeholder="Téléphone" value={telephoneLivreur} onChange={(e) => setTelephoneLivreur(e.target.value)} />
              <Input placeholder="Numéro du véhicule" value={numeroVehicule} onChange={(e) => setNumeroVehicule(e.target.value)} />
            </div>
          </div>

          {/* Destinataire */}
          <div className="bg-[#76bc21] p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800">Destinataire</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Nom" value={nomDestinataire} onChange={(e) => setNomDestinataire(e.target.value)} />
              <Input placeholder="Prénom" value={prenomDestinataire} onChange={(e) => setPrenomDestinataire(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input placeholder="Fonction" value={fonctionDestinataire} onChange={(e) => setFonctionDestinataire(e.target.value)} />
              <Input placeholder="Téléphone" value={telephoneDestinataire} onChange={(e) => setTelephoneDestinataire(e.target.value)} />
            </div>
          </div>

          {/* Lieu & Destination */}
          <div className="bg-[#76bc21] p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800">Lieu et Destination</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Lieu de départ" value={lieuDepart} onChange={(e) => setLieuDepart(e.target.value)} />
              <Input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
          </div>

          {/* Produit */}
          <div className="bg-[#76bc21] p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800">Produit</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select value={typeProduit} onValueChange={setTypeProduit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HE Griffes">HE Griffes</SelectItem>
                  <SelectItem value="HE Clous">HE Clous</SelectItem>
                  <SelectItem value="HE Feuilles">HE Feuilles</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Poids net (Kg)" value={poidsNet} onChange={(e) => setPoidsNet(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input placeholder="Ristourne Régionale" value={ristourneRegionale} onChange={(e) => setRistourneRegionale(e.target.value)} />
              <Input placeholder="Ristourne Communale" value={ristourneCommunale} onChange={(e) => setRistourneCommunale(e.target.value)} />
            </div>
          </div>

        </div>

        <DialogFooter className="pt-4 border-t border-dotted border-gray-300 mt-4">
          <Button 
            className="w-full bg-[#76bc21] hover:bg-[#5cbf1f] text-white rounded-xl py-3 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            Suivant
            <Send className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
