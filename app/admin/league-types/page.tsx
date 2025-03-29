"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface LeagueType {
  id: number
  name: string
  level: number
  _count?: {
    leagues: number
  }
}

export default function LeagueTypesPage() {
  const { toast } = useToast()
  const [leagueTypes, setLeagueTypes] = useState<LeagueType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeagueTypes = async () => {
      try {
        const response = await fetch("/api/league-types")
        if (!response.ok) {
          throw new Error("Lig tipleri yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setLeagueTypes(data)
      } catch (error) {
        console.error("Lig tiplerini getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Lig tipleri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeagueTypes()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu lig tipini silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/league-types/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Lig tipi silinemedi")
      }

      setLeagueTypes((prev) => prev.filter((leagueType) => leagueType.id !== id))

      toast({
        title: "Lig tipi silindi",
        description: "Lig tipi başarıyla silindi.",
      })
    } catch (error) {
      console.error("Lig tipi silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Lig tipi silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Lig Tipleri</h1>
        <Link href="/admin/league-types/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Lig Tipi
          </Button>
        </Link>
      </div>

      {leagueTypes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz lig tipi bulunmuyor.</p>
              <Link href="/admin/league-types/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Lig Tipi Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Lig Tipleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Lig Tipi Adı</th>
                    <th className="text-left py-3 px-4">Seviye</th>
                    <th className="text-left py-3 px-4">Lig Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueTypes.map((leagueType) => (
                    <tr key={leagueType.id} className="border-b">
                      <td className="py-3 px-4">{leagueType.name}</td>
                      <td className="py-3 px-4">{leagueType.level}</td>
                      <td className="py-3 px-4">{leagueType._count?.leagues || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/league-types/${leagueType.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(leagueType.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

