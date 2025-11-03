"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"

// Types génériques pour la table
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

export interface TableAction<T> {
  label: string
  icon: React.ReactNode
  onClick: (item: T) => void
  isDisabled?: (item: T) => boolean
  isVisible?: (item: T) => boolean
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (term: string) => void
  onAdd?: () => void
  onExport?: () => void
  onDelivery?: () => void
  addButtonLabel?: string
  addButtonDisabled?: boolean    // <-- new prop
  className?: string
  renderCustomActions?: (item: T) => React.ReactNode
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = "Rechercher...",
  onSearch,
  onAdd,
  onExport,
  onDelivery,
  addButtonLabel = "Ajouter",
  addButtonDisabled = false,    // <-- default
  className = "",
  renderCustomActions
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    onSearch?.(term)
  }

  const toggleMenu = (item: T) => {
    setOpenMenuId(openMenuId === item.id ? null : item.id)
  }

  const handleActionClick = (action: TableAction<T>, item: T) => {
    action.onClick(item)
    setOpenMenuId(null)
  }

  const renderCell = (column: TableColumn<T>, item: T) => {
    const value = column.key in item ? item[column.key as keyof T] : ""
    
    if (column.render) {
      return column.render(value, item)
    }
    
    return value as React.ReactNode
  }

  const shouldShowAction = (action: TableAction<T>, item: T) => {
    if (action.isVisible && !action.isVisible(item)) return false
    return true
  }

  const isActionDisabled = (action: TableAction<T>, item: T) => {
    if (action.isDisabled) return action.isDisabled(item)
    return false
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          {onAdd && (
            <Button 
              onClick={onAdd} 
              size="sm" 
              className={`bg-[#76bc21] text-white hover:bg-[#5aa017] cursor-pointer ${addButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={addButtonDisabled}    // disable when requested
              aria-disabled={addButtonDisabled}
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonLabel}
            </Button>
          )}
          {onExport && (
            <Button onClick={onExport} variant="outline" size="sm" className="cursor-pointer">
              Exporter
            </Button>
          )}
          {onDelivery && (
            <Button variant="outline" size="sm" className="cursor-pointer">
              Livraison
            </Button>
          )}
        </div>
        
        {searchable && (
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-70"
          />
        )}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map((column) => (
                  <th 
                    key={column.key as string} 
                    className={`p-3 font-medium ${column.className || ""}`}
                  >
                    {column.label}
                  </th>
                ))}
                {(actions.length > 0 || renderCustomActions) && (
                  <th className="p-3 font-medium">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100 transition-colors">
                  {columns.map((column) => (
                    <td 
                      key={column.key as string} 
                      className={`p-3 ${column.className || ""}`}
                    >
                      {renderCell(column, item)}
                    </td>
                  ))}
                  
                  {(actions.length > 0 || renderCustomActions) && (
                    <td className="p-3 relative">
                      {renderCustomActions ? (
                        renderCustomActions(item)
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-1 cursor-pointer"
                            onClick={() => toggleMenu(item)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {openMenuId === item.id && (
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border rounded shadow-lg z-10">
                              {actions
                                .filter(action => shouldShowAction(action, item))
                                .map((action, index) => (
                                  <button
                                    key={index}
                                    className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 ${
                                      isActionDisabled(action, item) 
                                        ? "cursor-not-allowed opacity-50" 
                                        : "cursor-pointer"
                                    }`}
                                    onClick={() => !isActionDisabled(action, item) && handleActionClick(action, item)}
                                    disabled={isActionDisabled(action, item)}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))
                              }
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {data.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" /> Prec
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suiv <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default Table
