"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface InsertionModalTestProps {
  isOpen: boolean
  onClose: () => void
}

export function InsertionModalTest({ isOpen, onClose }: InsertionModalTestProps) {
  const [currentStep, setCurrentStep] = useState(1)

  // Champs généraux
  const [dateReception, setDateReception] = useState("")
  const [heureReception, setHeureReception] = useState("")
  const [fournisseur, setFournisseur] = useState("")
  const [fournisseurID, setFournisseurID] = useState("")
  const [contact, setContact] = useState("")
  const [adresse, setAdresse] = useState("")
  const [siteCollecte, setSiteCollecte] = useState("")
  const [autreSiteCollecte, setAutreSiteCollecte] = useState("")
  const [poidsBrut, setPoidsBrut] = useState("")

  // Champs tests qualité
  const [dateTest, setDateTest] = useState("")
  const [heureTest, setHeureTest] = useState("")
  const [statutTest, setStatutTest] = useState("En cours")
  const [densite, setDensite] = useState("")
  const [presenceHuileVegetale, setPresenceHuileVegetale] = useState("")
  const [presenceLockheed, setPresenceLockheed] = useState("")
  const [teneurEau, setTeneurEau] = useState("")

  const handleNext = () => setCurrentStep(2)
  const handleBack = () => setCurrentStep(1)

  const handleSubmit = () => {
    const data = {
      dateReception, heureReception, fournisseur, fournisseurID, contact, adresse, 
      siteCollecte: siteCollecte === "autres" ? autreSiteCollecte : siteCollecte, 
      poidsBrut,
      dateTest, heureTest, statutTest, densite, presenceHuileVegetale, presenceLockheed, teneurEau
    }
    console.log("Nouvelle insertion:", data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#76bc21]">Fiche de Réception - HEFG</DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Date de réception</Label>
              <Input type="date" value={dateReception} onChange={e => setDateReception(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Heure de réception</Label>
              <Input type="time" value={heureReception} onChange={e => setHeureReception(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Fournisseur</Label>
              <Input placeholder="Rechercher fournisseur..." value={fournisseur} onChange={e => setFournisseur(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Nom & prénom</Label>
              <Input placeholder="Nom complet" value={fournisseur} onChange={e => setFournisseur(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>ID / Carte fiscale</Label>
              <Input placeholder="N° Identifiant ou carte fiscale" value={fournisseurID} onChange={e => setFournisseurID(e.target.value)} />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Contact</Label>
              <Input placeholder="Téléphone ou email" value={contact} onChange={e => setContact(e.target.value)} />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Adresse</Label>
              <Input placeholder="Adresse complète" value={adresse} onChange={e => setAdresse(e.target.value)} />
            </div>

            {/* Site de collecte avec sélection */}
            <div className="flex flex-col gap-2">
              <Label>Site de collecte</Label>
              {siteCollecte === "autres" ? (
                <Input
                  placeholder="Entrer un nouveau site de collecte"
                  value={autreSiteCollecte}
                  onChange={e => setAutreSiteCollecte(e.target.value)}
                  onBlur={() => { if (!autreSiteCollecte.trim()) setSiteCollecte("") }}
                />
              ) : (
                <Select value={siteCollecte} onValueChange={setSiteCollecte}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un site" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="vohitrandriana">Vohitrandriana</SelectItem>
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

            <div className="flex flex-col gap-2">
              <Label>Poids brut (kg)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 25" 
                value={poidsBrut} 
                onChange={e => setPoidsBrut(e.target.value)} 
              />
            </div>

            <Button onClick={handleNext} className="bg-[#76bc21] hover:bg-[#5cae1b] cursor-pointer">Tests qualité →</Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Date du test</Label>
              <Input type="date" value={dateTest} onChange={e => setDateTest(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Heure du test</Label>
              <Input type="time" value={heureTest} onChange={e => setHeureTest(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Statut du test</Label>
              <Select value={statutTest} onValueChange={setStatutTest}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="En cours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Densité (cible 0.940)</Label>
              <Input 
                type="number" 
                step="0.001"
                placeholder="Résultat mesuré" 
                value={densite} 
                onChange={e => setDensite(e.target.value)} 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Présence d'huile végétale</Label>
              <Select value={presenceHuileVegetale} onValueChange={setPresenceHuileVegetale}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Présence de Lockheed</Label>
              <Select value={presenceLockheed} onValueChange={setPresenceLockheed}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Teneur en eau (kg)</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Ex: 0.25" 
                value={teneurEau} 
                onChange={e => setTeneurEau(e.target.value)} 
              />
            </div>
            
            <div className="flex gap-4">
              <Button className="cursor-pointer" variant="outline" onClick={handleBack}>← Retour</Button>
              <Button onClick={handleSubmit} className="bg-[#76bc21] hover:bg-[#5cae1b] cursor-pointer">Ajouter</Button>
            </div>
          </div>
        )}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
