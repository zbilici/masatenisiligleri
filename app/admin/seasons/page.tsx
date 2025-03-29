"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Season {
  id: number
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export default function SeasonsPage() {
  const { toast } = useToast()
  const [seasons, setSeasons] = useState<Season[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch("/api/seasons")
        if (!response.ok) {
          throw new Error("Sezonlar yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setSeasons(data)
      } catch (error) {
        console.error("Sezonları getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Sezonlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeasons()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu sezonu silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/seasons/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Sezon silinemedi")
      }

      setSeasons((prev) => prev.filter((season) => season.id !== id))

      toast({
        title: "Sezon silindi",
        description: "Sezon başarıyla silindi.",
      })
    } catch (error) {
      console.error("Sezon silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Sezon silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: tr })
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
        <h1 className="text-3xl font-bold tracking-tight">Sezonlar</h1>
        <Link href="/admin/seasons/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Sezon
          </Button>
        </Link>
      </div>

      {seasons.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz sezon bulunmuyor.</p>
              <Link href="/admin/seasons/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Sezon Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Sezonlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sezon Adı</th>
                    <th className="text-left py-3 px-4">Başlangıç</th>
                    <th className="text-left py-3 px-4">Bitiş</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((season) => (
                    <tr key={season.id} className="border-b">
                      <td className="py-3 px-4">{season.name}</td>
                      <td className="py-3 px-4">{formatDate(season.startDate)}</td>
                      <td className="py-3 px-4">{formatDate(season.endDate)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            season.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {season.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/seasons/${season.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(season.id)}>
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

