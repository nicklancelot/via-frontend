import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FlaskConical, Beaker, Leaf, Sprout, Package, Droplets, TrendingUp, Factory } from "lucide-react"

export function TransformationCards() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedUsine, setSelectedUsine] = useState("")

  return (
    <div className="space-y-8 p-4">
      {/* Titre général avec design amélioré */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-2xl text-white">💰</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">
          Montant Général : <span className="text-amber-600">30.000 Ar</span>
        </h1>
        <p className="text-gray-600 text-sm">Vue d'ensemble des stocks et transformations</p>
      </div>

      {/* Header avec titre transformation + recherche */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-xl flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">TRANSFORMATION</h2>
                <p className="text-sm text-gray-600">Gestion des processus de production</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Usine et Dates avec design amélioré - MODIFICATION PRINCIPALE ICI */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                {/* Sélecteur d'usine */}
                <div className="space-y-2 flex-1 xs:flex-none">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Factory className="w-4 h-4" />
                    Usine
                  </label>
                  <Select value={selectedUsine} onValueChange={setSelectedUsine}>
                    <SelectTrigger className="w-full md:w-40 border-gray-300 focus:border-[#76bc21] transition-colors">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pk12">PK 12</SelectItem>
                      <SelectItem value="makomby">Makomby</SelectItem>
                      <SelectItem value="all">Toutes les usines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates container */}
                <div className="flex flex-col md:flex-row gap-3 flex-1">
                  {/* Date début */}
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span>📅</span> Date début
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border-gray-300 focus:border-[#76bc21] transition-colors"
                    />
                  </div>

                  {/* Date fin */}
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span>📅</span> Date fin
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border-gray-300 focus:border-[#76bc21] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton rechercher - MODIFICATION PRINCIPALE ICI */}
              <div className="flex items-end w-full md:w-auto mt-2 md:mt-0">
                <Button className="w-full md:w-auto bg-gradient-to-r from-[#76bc21] to-[#5aa017] hover:from-[#5aa017] hover:to-[#4a8a14] text-white transition-all duration-200 shadow-sm hover:shadow-md">
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Le reste du code reste inchangé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distillation */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Beaker className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Stock Huile Essentielle
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-2 font-medium">Matière première à transformer</p>
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-800">300 kg</p>
                </div>
                <Badge variant="outline" className="mt-2 bg-blue-100 text-blue-700 border-blue-200">
                  Entrée
                </Badge>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 mb-2 font-medium">Huile essentielle obtenue</p>
                <div className="flex items-center justify-center gap-2">
                  <Droplets className="w-4 h-4 text-green-600" />
                  <p className="text-2xl font-bold text-green-800">200 kg</p>
                </div>
                <Badge variant="outline" className="mt-2 bg-green-100 text-green-700 border-green-200">
                  Sortie
                </Badge>
              </div>
            </div>

            {/* Indicateur de rendement */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rendement</span>
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  66.7%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '66.7%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eugénol */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Stock Eugénol
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-700 mb-2 font-medium">Huile essentielle à transformer</p>
                <div className="flex items-center justify-center gap-2">
                  <Droplets className="w-4 h-4 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-800">300 kg</p>
                </div>
                <Badge variant="outline" className="mt-2 bg-purple-100 text-purple-700 border-purple-200">
                  Entrée
                </Badge>
              </div>
              
              <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700 mb-2 font-medium">Eugénol obtenu</p>
                <div className="flex items-center justify-center gap-2">
                  <Beaker className="w-4 h-4 text-amber-600" />
                  <p className="text-2xl font-bold text-amber-800">200 kg</p>
                </div>
                <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-700 border-amber-200">
                  Sortie
                </Badge>
              </div>
            </div>

            {/* Indicateur de rendement */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rendement</span>
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  66.7%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '66.7%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stocks matière première - OCCUPANT TOUTE LA LARGEUR */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">STOCK MATIÈRE PREMIÈRE</h2>
              <p className="text-sm text-gray-600">Inventaire des matières premières disponibles</p>
            </div>
          </div>

          {/* Grille de 3 colonnes occupant toute la largeur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Feuilles de girofle */}
            <Card className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Feuilles de girofle</h3>
                <p className="text-3xl font-bold text-gray-900 mb-3">300 kg</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm">
                  Disponible
                </Badge>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">85% de capacité</p>
              </CardContent>
            </Card>

            {/* Griffes de girofle */}
            <Card className="border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Griffes de girofle</h3>
                <p className="text-3xl font-bold text-gray-900 mb-3">300 kg</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm">
                  Disponible
                </Badge>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">75% de capacité</p>
              </CardContent>
            </Card>

            {/* Clous de girofle */}
            <Card className="border border-gray-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clous de girofle</h3>
                <p className="text-3xl font-bold text-gray-900 mb-3">300 kg</p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-sm">
                  Disponible
                </Badge>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">90% de capacité</p>
              </CardContent>
            </Card>
          </div>

          {/* Carte Huile Essentielle EN DESSOUS */}
          <div className="grid grid-cols-1">
            <Card className="border border-gray-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Huile Essentielle</h3>
                    <p className="text-sm text-gray-600">Répartition par type</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* HE Feuille */}
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-green-700 mb-1">HE Feuille</p>
                    <p className="text-xl font-bold text-green-800">40 kg</p>
                  </div>
                  
                  {/* HE Griffe */}
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sprout className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-blue-700 mb-1">HE Griffe</p>
                    <p className="text-xl font-bold text-blue-800">35 kg</p>
                  </div>
                  
                  {/* HE Clous */}
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-purple-700 mb-1">HE Clous</p>
                    <p className="text-xl font-bold text-purple-800">45 kg</p>
                  </div>
                  
                  {/* HE Achetée */}
                  <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Droplets className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-amber-700 mb-1">HE Achetée</p>
                    <p className="text-xl font-bold text-amber-800">30 kg</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-semibold text-gray-600">Stock total HE</p>
                      <p className="text-2xl font-bold text-amber-600">150 kg</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mx-auto sm:mx-0">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">60% de capacité totale</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé global */}
          <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Stock total matière première : <strong className="text-gray-900">900 kg</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tous les stocks sont au niveau optimal
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600">Capacité moyenne</p>
                <p className="text-xl font-bold text-green-600">83.3%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
