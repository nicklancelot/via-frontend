"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { useUsers } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Wallet, Mail, Phone, MapPin } from "lucide-react"

export default function UsersPage() {
  const users = useUsers()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "collecteur":
        return "bg-green-100 text-green-800 border-green-200"
      case "distilleur":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "vente":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "collecteur":
        return "Collecteur"
      case "distilleur":
        return "Distilleur"
      case "vente":
        return "Gestion de Vente"
      default:
        return role
    }
  }

  return (
    <AuthGuard requiredPage="users">
      <div className="flex h-screen bg-background">
        <div className="md:flex">
          <Sidebar currentPage="users" />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Gestion des utilisateurs" />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Liste des utilisateurs</h2>
                <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs du système</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#76bc21] to-[#5aa017] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {user.prenom?.charAt(0) || user.fullName.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-lg truncate">{user.fullName}</CardTitle>
                            <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <Badge variant="outline" className={`${getRoleBadgeColor(user.role)} font-medium`}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>

                      {user.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      )}

                      {user.contact && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.contact}</span>
                        </div>
                      )}

                      {user.adresse && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.adresse}</span>
                        </div>
                      )}

                      {user.balance !== undefined && (
                        <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-200">
                          <Wallet className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="font-semibold text-green-700">
                            Solde: {user.balance.toLocaleString()} Ar
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          <strong>Accès:</strong>{" "}
                          {user.role === "admin"
                            ? "Complet (toutes les pages)"
                            : user.role === "collecteur"
                              ? "Collecte uniquement"
                              : user.role === "distilleur"
                                ? "Gestion de Distillation"
                                : "Gestion de Vente"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
                  <p className="text-gray-600">Il n'y a pas encore d'utilisateurs dans le système.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
