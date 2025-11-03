"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface LivraisonTestProps {
  isOpen: boolean
  onClose: () => void
}

export function LivraisonTest({ isOpen, onClose }: LivraisonTestProps) {
  const [dateLivraison, setDateLivraison] = useState("")

  // Livreur
  const [livreurNom, setLivreurNom] = useState("")
  const [livreurPrenom, setLivreurPrenom] = useState("")
  const [livreurTel, setLivreurTel] = useState("")

  // Véhicule
  const [numeroVehicule, setNumeroVehicule] = useState("")

  // Destinataire
  const [destNom, setDestNom] = useState("")
  const [destPrenom, setDestPrenom] = useState("")
  const [destFonction, setDestFonction] = useState("")
  const [destTel, setDestTel] = useState("")

  // Lieu
  const [lieuDepart, setLieuDepart] = useState("")
  const [destination, setDestination] = useState("")

  // Produits
  const [typeProduit, setTypeProduit] = useState("")
  const [poidsNet, setPoidsNet] = useState("")

  // Ristournes
  const [ristourneRegionale, setRistourneRegionale] = useState("")
  const [ristourneCommunale, setRistourneCommunale] = useState("")

  const handleLivrer = () => {
    const data = {
      dateLivraison,
      livreur: { livreurNom, livreurPrenom, livreurTel },
      numeroVehicule,
      destinataire: { destNom, destPrenom, destFonction, destTel },
      lieuDepart,
      destination,
      typeProduit,
      poidsNet,
      ristourneRegionale,
      ristourneCommunale
    }
    console.log("Livraison confirmée :", data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21]">Livraison</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date */}
          <Input
            type="datetime-local"
            placeholder="Date de livraison"
            value={dateLivraison}
            onChange={e => setDateLivraison(e.target.value)}
          />

          {/* Livreur */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Nom du livreur" value={livreurNom} onChange={e => setLivreurNom(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input placeholder="Prénom du livreur" value={livreurPrenom} onChange={e => setLivreurPrenom(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input placeholder="Téléphone du livreur" value={livreurTel} onChange={e => setLivreurTel(e.target.value)} />
            </div>
          </div>

          {/* Véhicule */}
          <Input placeholder="Numéro du véhicule" value={numeroVehicule} onChange={e => setNumeroVehicule(e.target.value)} />

          {/* Destinataire */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Nom du destinataire" value={destNom} onChange={e => setDestNom(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input placeholder="Prénom du destinataire" value={destPrenom} onChange={e => setDestPrenom(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Fonction du destinataire" value={destFonction} onChange={e => setDestFonction(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input placeholder="Téléphone du destinataire" value={destTel} onChange={e => setDestTel(e.target.value)} />
            </div>
          </div>

          {/* Lieux */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Lieu de départ" value={lieuDepart} onChange={e => setLieuDepart(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
          </div>

          {/* Type de produit et poids */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Type de produit" value={typeProduit} onChange={e => setTypeProduit(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input type="number" placeholder="Poids net (kg)" value={poidsNet} onChange={e => setPoidsNet(e.target.value)} />
            </div>
          </div>

          {/* Ristournes */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input type="number" placeholder="Ristourne Régionale" value={ristourneRegionale} onChange={e => setRistourneRegionale(e.target.value)} />
            </div>
            <div className="flex-1">
              <Input type="number" placeholder="Ristourne Communale" value={ristourneCommunale} onChange={e => setRistourneCommunale(e.target.value)} />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleLivrer} className="bg-[#76bc21] text-white hover:bg-[#5aa017]">Confirmer Livraison</Button>
          </div>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
