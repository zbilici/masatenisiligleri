"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface Position {
  id: number
  name: string
  description: string | null
  _count?: {
    playerPositions: number
  }
}

export default function PositionsPage() {
  const { toast } = useToast()
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch("/api/positions")
        if (!response.ok) {
          throw new Error("Pozisyonlar yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setPositions(data)
      } catch (error) {
        console.error("Pozisyonları getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Pozisyonlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPositions()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu pozisyonu silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/positions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Pozisyon silinemedi")
      }

      setPositions((prev) => prev.filter((position) => position.id !== id))

      toast({
        title: "Pozisyon silindi",
        description: "Pozisyon başarıyla silindi.",
      })
    } catch (error) {
      console.error("Pozisyon silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Pozisyon silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Pozisyonlar</h1>
        <Link href="/admin/positions/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Pozisyon
          </Button>
        </Link>
      </div>

      {positions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz pozisyon bulunmuyor.</p>
              <Link href="/admin/positions/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Pozisyon Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Pozisyonlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pozisyon Adı</th>
                    <th className="text-left py-3 px-4">Açıklama</th>
                    <th className="text-left py-3 px-4">Oyuncu Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.id} className="border-b">
                      <td className="py-3 px-4">{position.name}</td>
                      <td className="py-3 px-4">{position.description || "-"}</td>
                      <td className="py-3 px-4">{position._count?.playerPositions || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/positions/${position.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(position.id)}>
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

