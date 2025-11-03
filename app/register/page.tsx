"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Lock, User, Mail, Phone, MapPin, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [step, setStep] = useState<"verify" | "create">("verify")
  const [adminPassword, setAdminPassword] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    contact: "",
    nom: "",
    prenom: "",
    role: "" as UserRole,
    adresse: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { verifyAdminPassword, createAccount } = useAuth()

  const handleVerifyAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (verifyAdminPassword(adminPassword)) {
      setStep("create")
    } else {
      setError("Mot de passe administrateur incorrect")
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      setIsLoading(false)
      return
    }

    if (!formData.role) {
      setError("Veuillez sélectionner une fonction")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = createAccount({
      username: formData.username,
      password: formData.password,
      email: formData.email,
      contact: formData.contact,
      nom: formData.nom,
      prenom: formData.prenom,
      role: formData.role,
      adresse: formData.adresse,
      fullName: `${formData.prenom} ${formData.nom}`,
    })

    if (success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } else {
      setError("Ce nom d'utilisateur existe déjà")
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#76bc21] via-[#5aa017] to-[#4a8c13] p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Leaf className="w-10 h-10 text-[#76bc21]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VIA-CONSULTING</h1>
          <p className="text-white/90 text-lg">Création de Compte</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              {step === "verify" ? "Vérification Administrateur" : "Nouveau Compte"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "verify"
                ? "Entrez le mot de passe administrateur pour continuer"
                : "Remplissez les informations du nouveau compte"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "verify" ? (
              <form onSubmit={handleVerifyAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Mot de passe Administrateur</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Entrez le mot de passe admin"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Seul l'administrateur peut créer de nouveaux comptes utilisateur
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-[#76bc21] hover:bg-[#5aa017] text-white font-semibold py-6">
                  Vérifier
                </Button>

                <Link href="/login">
                  <Button variant="outline" className="w-full bg-transparent" type="button">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </form>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-4">
                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      Compte créé avec succès! Redirection vers la page de connexion...
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      type="text"
                      placeholder="Prénom"
                      value={formData.prenom}
                      onChange={(e) => updateFormData("prenom", e.target.value)}
                      required
                      disabled={isLoading || success}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      type="text"
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={(e) => updateFormData("nom", e.target.value)}
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email / Contact *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@via-consulting.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+261 34 00 000 00"
                      value={formData.contact}
                      onChange={(e) => updateFormData("contact", e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="adresse"
                      type="text"
                      placeholder="Ville, Région"
                      value={formData.adresse}
                      onChange={(e) => updateFormData("adresse", e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Fonction *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateFormData("role", value)}
                    disabled={isLoading || success}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une fonction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur / Manager</SelectItem>
                      <SelectItem value="collecteur">Collecteur</SelectItem>
                      <SelectItem value="distilleur">Distilleur</SelectItem>
                      <SelectItem value="vente">Gestion de Vente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nom d'utilisateur"
                      value={formData.username}
                      onChange={(e) => updateFormData("username", e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min. 6 caractères"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#76bc21] hover:bg-[#5aa017] text-white font-semibold py-6"
                  disabled={isLoading || success}
                >
                  {isLoading ? "Création en cours..." : "Créer le compte"}
                </Button>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    type="button"
                    disabled={isLoading || success}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-white/80 text-sm">
          <p>© 2025 VIA-CONSULTING - Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}
