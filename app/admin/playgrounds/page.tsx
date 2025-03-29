"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface Playground {
  id: number
  name: string
  address: string | null
  city: string | null
  capacity: number | null
  _count?: {
    matches: number
  }
}

export default function PlaygroundsPage() {
  const { toast } = useToast()
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await fetch("/api/playgrounds")
        if (!response.ok) {
          throw new Error("Sahalar yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setPlaygrounds(data)
      } catch (error) {
        console.error("Sahaları getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Sahalar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaygrounds()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu sahayı silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/playgrounds/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Saha silinemedi")
      }

      setPlaygrounds((prev) => prev.filter((playground) => playground.id !== id))

      toast({
        title: "Saha silindi",
        description: "Saha başarıyla silindi.",
      })
    } catch (error) {
      console.error("Saha silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Saha silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Sahalar</h1>
        <Link href="/admin/playgrounds/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Saha
          </Button>
        </Link>
      </div>

      {playgrounds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz saha bulunmuyor.</p>
              <Link href="/admin/playgrounds/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Saha Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Sahalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Saha Adı</th>
                    <th className="text-left py-3 px-4">Şehir</th>
                    <th className="text-left py-3 px-4">Kapasite</th>
                    <th className="text-left py-3 px-4">Maç Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {playgrounds.map((playground) => (
                    <tr key={playground.id} className="border-b">
                      <td className="py-3 px-4">{playground.name}</td>
                      <td className="py-3 px-4">{playground.city || "-"}</td>
                      <td className="py-3 px-4">{playground.capacity || "-"}</td>
                      <td className="py-3 px-4">{playground._count?.matches || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/playgrounds/${playground.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(playground.id)}>
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

