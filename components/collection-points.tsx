import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Leaf, Sprout, Package, TrendingUp, Truck } from "lucide-react"

const collectionPoints = [
  { name: "Vangaindrano", feuilles: 30, griffes: 30, clous: 30, total: 90, status: "Actif" },
  { name: "Manambondro", feuilles: 35, griffes: 35, clous: 35, total: 105, status: "Actif" },
  { name: "Vohipeno", feuilles: 35, griffes: 35, clous: 35, total: 105, status: "Actif" },
  { name: "Manakara", feuilles: 20, griffes: 20, clous: 20, total: 60, status: "Actif" },
  { name: "Matangy", feuilles: 30, griffes: 30, clous: 30, total: 90, status: "Actif" },
  { name: "Ampasimandreva", feuilles: 30, griffes: 30, clous: 30, total: 90, status: "Actif" },
]

export function CollectionPoints() {
  const totalGlobal = collectionPoints.reduce((sum, point) => sum + point.total, 0)

  return (
    <div className="space-y-6 p-4">
      {/* En-tête avec statistiques globales */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">POINTS DE COLLECTE</h2>
            <p className="text-sm text-gray-600">Répartition des stocks par localité</p>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl border border-green-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Points collecte</span>
            </div>
            <p className="text-xl font-bold text-green-800 mt-1">
              {collectionPoints.filter(p => p.status === "Actif").length}/{collectionPoints.length}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Stock total</span>
            </div>
            <p className="text-xl font-bold text-blue-800 mt-1">{totalGlobal} kg</p>
          </div>
        </div>
      </div>

      {/* Grille des points de collecte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionPoints.map((point, index) => (
          <Card
            key={index}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
          >
            <CardContent className="p-6">
              {/* En-tête de la carte */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{point.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${
                        point.status === "Actif" 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      } font-medium`}
                    >
                      {point.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Total du point */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-xl font-bold text-[#76bc21]">{point.total} kg</p>
                </div>
              </div>

              {/* Détails des stocks */}
              <div className="space-y-3 mb-4">
                {/* Feuilles */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 group-hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700">Feuilles</span>
                  </div>
                  <span className="font-bold text-green-800">{point.feuilles} kg</span>
                </div>

                {/* Griffes */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 group-hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">Griffes</span>
                  </div>
                  <span className="font-bold text-blue-800">{point.griffes} kg</span>
                </div>

                {/* Clous */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 group-hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-purple-700">Clous</span>
                  </div>
                  <span className="font-bold text-purple-800">{point.clous} kg</span>
                </div>
              </div>

              {/* Indicateur de performance */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Remplissage</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {Math.round((point.total / 120) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-[#76bc21] to-[#5aa017] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((point.total / 120) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Résumé global */}
      <Card className="border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Performance Globale</h3>
                <p className="text-sm text-gray-600">Synthèse de tous les points de collecte</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Stock moyen par point</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(totalGlobal / collectionPoints.length)} kg
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Taux d'activité</p>
                <p className="text-xl font-bold text-green-600">
                  {Math.round((collectionPoints.filter(p => p.status === "Actif").length / collectionPoints.length) * 100)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Capacité utilisée</p>
                <p className="text-xl font-bold text-blue-600">
                  {Math.round((totalGlobal / (collectionPoints.length * 120)) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
