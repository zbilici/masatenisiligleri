"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface SubLeague {
  id: number
  name: string
  league: {
    name: string
    season: {
      name: string
    }
    gender: {
      name: string
    }
    leagueType: {
      name: string
    }
  }
  parent?: {
    id: number
    name: string
  } | null
  _count?: {
    children: number
    stages: number
    teams: number
  }
}

export default function SubLeaguesPage() {
  const { toast } = useToast()
  const [subLeagues, setSubLeagues] = useState<SubLeague[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSubLeagues = async () => {
      try {
        const response = await fetch("/api/sub-leagues")
        if (!response.ok) {
          throw new Error("Alt ligler yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setSubLeagues(data)
      } catch (error) {
        console.error("Alt ligleri getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Alt ligler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubLeagues()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu alt ligi silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/sub-leagues/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Alt lig silinemedi")
      }

      setSubLeagues((prev) => prev.filter((subLeague) => subLeague.id !== id))

      toast({
        title: "Alt lig silindi",
        description: "Alt lig başarıyla silindi.",
      })
    } catch (error) {
      console.error("Alt lig silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Alt lig silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Alt Ligler</h1>
        <Link href="/admin/sub-leagues/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Alt Lig
          </Button>
        </Link>
      </div>

      {subLeagues.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz alt lig bulunmuyor.</p>
              <Link href="/admin/sub-leagues/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Alt Lig Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Alt Ligler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Alt Lig Adı</th>
                    <th className="text-left py-3 px-4">Bağlı Olduğu Lig</th>
                    <th className="text-left py-3 px-4">Üst Alt Lig</th>
                    <th className="text-left py-3 px-4">Alt Lig Sayısı</th>
                    <th className="text-left py-3 px-4">Etap Sayısı</th>
                    <th className="text-left py-3 px-4">Takım Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {subLeagues.map((subLeague) => (
                    <tr key={subLeague.id} className="border-b">
                      <td className="py-3 px-4">{subLeague.name}</td>
                      <td className="py-3 px-4">{subLeague.league.name}</td>
                      <td className="py-3 px-4">{subLeague.parent?.name || "-"}</td>
                      <td className="py-3 px-4">{subLeague._count?.children || 0}</td>
                      <td className="py-3 px-4">{subLeague._count?.stages || 0}</td>
                      <td className="py-3 px-4">{subLeague._count?.teams || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/sub-leagues/${subLeague.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(subLeague.id)}>
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

