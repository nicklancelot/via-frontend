"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Area } from "recharts"
import { TrendingUp, BarChart3, Target, Award, Calendar } from "lucide-react"

const data = [
  { name: "Vangaindrano", feuilles: 30, griffes: 20, clous: 10, total: 60 },
  { name: "Manambondro", feuilles: 35, griffes: 25, clous: 15, total: 75 },
  { name: "Vohipeno", feuilles: 40, griffes: 30, clous: 20, total: 90 },
  { name: "Manakara", feuilles: 20, griffes: 15, clous: 25, total: 60 },
  { name: "Matangy", feuilles: 50, griffes: 35, clous: 30, total: 115 },
  { name: "Ampasimandreva", feuilles: 45, griffes: 40, clous: 35, total: 120 },
]

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-semibold text-gray-900">{entry.value} kg</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-200 mt-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" />
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-purple-700">
              {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)} kg
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

// Custom Legend
const renderLegend = (props: any) => {
  const { payload } = props
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function PerformanceChart() {
  const totalFeuilles = data.reduce((sum, item) => sum + item.feuilles, 0)
  const totalGriffes = data.reduce((sum, item) => sum + item.griffes, 0)
  const totalClous = data.reduce((sum, item) => sum + item.clous, 0)
  const totalGlobal = totalFeuilles + totalGriffes + totalClous

  return (
    <div className="space-y-6 p-4">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#76bc21] to-[#5aa017] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PERFORMANCE DES POINTS DE COLLECTE</h2>
            <p className="text-sm text-gray-600">Évolution des stocks par localité</p>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl border border-green-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Total collecté</span>
            </div>
            <p className="text-xl font-bold text-green-800 mt-1">{totalGlobal} kg</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Points de collecte</span>
            </div>
            <p className="text-xl font-bold text-blue-800 mt-1">{data.length}</p>
          </div>
        </div>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 bg-gradient-to-r from-green-50 to-green-100/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Feuilles</p>
                <p className="text-2xl font-bold text-green-800">{totalFeuilles} kg</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-700 border-green-200">
                  {Math.round((totalFeuilles / totalGlobal) * 100)}%
                </Badge>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🍃</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Griffes</p>
                <p className="text-2xl font-bold text-blue-800">{totalGriffes} kg</p>
                <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-700 border-blue-200">
                  {Math.round((totalGriffes / totalGlobal) * 100)}%
                </Badge>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🌿</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Clous</p>
                <p className="text-2xl font-bold text-purple-800">{totalClous} kg</p>
                <Badge variant="outline" className="mt-1 bg-purple-100 text-purple-700 border-purple-200">
                  {Math.round((totalClous / totalGlobal) * 100)}%
                </Badge>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📍</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique principal */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {/* Gradient pour les aires */}
                  <linearGradient id="colorFeuilles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76bc21" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#76bc21" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGriffes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#124734" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#124734" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClous" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#089a8d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#089a8d" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#f3f4f6" 
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                  padding={{ left: 20, right: 20 }}
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />

                {/* Aire pour Feuilles */}
                <Area
                  type="monotone"
                  dataKey="feuilles"
                  stroke="none"
                  fill="url(#colorFeuilles)"
                  fillOpacity={1}
                />

                {/* Aire pour Griffes */}
                <Area
                  type="monotone"
                  dataKey="griffes"
                  stroke="none"
                  fill="url(#colorGriffes)"
                  fillOpacity={1}
                />

                {/* Aire pour Clous */}
                <Area
                  type="monotone"
                  dataKey="clous"
                  stroke="none"
                  fill="url(#colorClous)"
                  fillOpacity={1}
                />

                {/* Lignes principales */}
                <Line
                  type="monotone"
                  dataKey="feuilles"
                  stroke="#76bc21"
                  strokeWidth={3}
                  dot={{ fill: "#76bc21", strokeWidth: 2, r: 5, stroke: "#fff" }}
                  activeDot={{ r: 7, stroke: "#76bc21", strokeWidth: 2, fill: "#fff" }}
                />

                <Line
                  type="monotone"
                  dataKey="griffes"
                  stroke="#124734"
                  strokeWidth={3}
                  dot={{ fill: "#124734", strokeWidth: 2, r: 5, stroke: "#fff" }}
                  activeDot={{ r: 7, stroke: "#124734", strokeWidth: 2, fill: "#fff" }}
                />

                <Line
                  type="monotone"
                  dataKey="clous"
                  stroke="#089a8d"
                  strokeWidth={3}
                  dot={{ fill: "#089a8d", strokeWidth: 2, r: 5, stroke: "#fff" }}
                  activeDot={{ r: 7, stroke: "#089a8d", strokeWidth: 2, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Meilleur Performeur</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">Ampasimandreva</p>
                <p className="text-sm text-gray-600">120 kg collectés</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                🏆 Leader
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Tendance Mensuelle</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">+15%</p>
                <p className="text-sm text-gray-600">Croissance ce mois</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
