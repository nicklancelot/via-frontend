"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "collecteur" | "distilleur" | "vente"

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  fullName: string
  email?: string
  contact?: string
  nom?: string
  prenom?: string
  adresse?: string
  balance?: number // Pour les collecteurs
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
  hasAccess: (page: string) => boolean
  getHomePage: () => string
  verifyAdminPassword: (password: string) => boolean
  createAccount: (userData: Omit<User, "id">) => boolean
  getAllUsers: () => Omit<User, "password">[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Utilisateurs simulés
const INITIAL_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
    fullName: "Administrateur Principal",
    email: "admin@viaconsulting.com",
    nom: "Admin",
    prenom: "Principal",
    contact: "+261 34 00 000 00",
    adresse: "Antananarivo, Madagascar",
  },
  {
    id: "2",
    username: "collecteur1",
    password: "collect123",
    role: "collecteur",
    fullName: "Jean Collecteur",
    email: "jean@viaconsulting.com",
    nom: "Collecteur",
    prenom: "Jean",
    contact: "+261 34 11 111 11",
    adresse: "Antalaha, Madagascar",
    balance: 15000,
  },
  {
    id: "3",
    username: "collecteur2",
    password: "collect123",
    role: "collecteur",
    fullName: "Marie Collecteur",
    email: "marie@viaconsulting.com",
    nom: "Collecteur",
    prenom: "Marie",
    contact: "+261 34 22 222 22",
    adresse: "Sambava, Madagascar",
    balance: 22000,
  },
  {
    id: "4",
    username: "distilleur",
    password: "distil123",
    role: "distilleur",
    fullName: "Pierre Distillateur",
    email: "pierre@viaconsulting.com",
    nom: "Distillateur",
    prenom: "Pierre",
    contact: "+261 34 33 333 33",
    adresse: "Antananarivo, Madagascar",
  },
  {
    id: "5",
    username: "vente",
    password: "vente123",
    role: "vente",
    fullName: "Sophie Vente",
    email: "sophie@viaconsulting.com",
    nom: "Vente",
    prenom: "Sophie",
    contact: "+261 34 44 444 44",
    adresse: "Antananarivo, Madagascar",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUsers = localStorage.getItem("allUsers")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      localStorage.setItem("allUsers", JSON.stringify(INITIAL_USERS))
    }

    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find((u) => u.username === username && u.password === password)

    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete (userWithoutPassword as any).password
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const getHomePage = (): string => {
    if (!user) return "/login"

    switch (user.role) {
      case "admin":
        return "/dashboard"
      case "collecteur":
        return "/collecte"
      case "distilleur":
        return "/expedition"
      case "vente":
        return "/reception"
      default:
        return "/dashboard"
    }
  }

  const hasAccess = (page: string): boolean => {
    if (!user) return false

    if (user.role === "admin") return true

    const accessMap: Record<UserRole, string[]> = {
      admin: ["*"],
      collecteur: ["collecte"],
      distilleur: ["expedition", "initialisation", "distillation", "transport"],
      vente: ["reception", "agregageProvisoire", "agregageDefinitif", "exportation"],
    }

    const allowedPages = accessMap[user.role]
    return allowedPages.includes("*") || allowedPages.includes(page)
  }

  const verifyAdminPassword = (password: string): boolean => {
    const admin = users.find((u) => u.role === "admin")
    return admin ? admin.password === password : false
  }

  const createAccount = (userData: Omit<User, "id">): boolean => {
    // Check if username already exists
    if (users.find((u) => u.username === userData.username)) {
      return false
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      balance: userData.role === "collecteur" ? 0 : undefined,
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
    return true
  }

  const getAllUsers = (): Omit<User, "password">[] => {
    return users.map((u) => {
      const { password, ...userWithoutPassword } = u
      return userWithoutPassword
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasAccess,
        getHomePage,
        verifyAdminPassword,
        createAccount,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useUsers() {
  const { getAllUsers } = useAuth()
  return getAllUsers()
}
