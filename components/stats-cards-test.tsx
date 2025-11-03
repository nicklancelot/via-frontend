import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { 
    title: "H.E Feuilles", 
    value: "50 kg", 
    bgColor: "#76bc21",
    icon: "🍃",
    progress: 75
  },
]

interface StatsCardsProps {
  showTitle?: boolean
}

export function StatsCardsTest({ showTitle = true }: StatsCardsProps) {
  return (
    <div className="space-y-6 p-4">
      {/* Titre simple */}
      {showTitle && (
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Solde actuel : <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">2000 Ar</span>
          </h1>
          <p className="text-gray-500 text-sm">Stock HE Feuilles</p>
        </div>
      )}

      {/* Carte simple et équilibrée */}
      <div className="max-w-md mx-auto">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Icône */}
                <div 
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <span className="text-xl">{stat.icon}</span>
                </div>

                {/* Contenu principal */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  
                  {/* Barre de progression */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: stat.bgColor,
                          width: `${stat.progress}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {stat.progress}%
                    </span>
                  </div>
                </div>

                {/* Statut */}
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                    Disponible
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
