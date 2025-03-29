"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash, Eye } from "lucide-react"

interface Club {
  id: number
  name: string
  _count: {
    teams: number
  }
}

export default function ClubsPage() {
  const { toast } = useToast()
  const [clubs, setClubs] = useState<Club[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs")
        if (!response.ok) {
          throw new Error("Kulüpler yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setClubs(data)
      } catch (error) {
        console.error("Kulüpleri getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Kulüpler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClubs()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kulübü silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/clubs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Kulüp silinemedi")
      }

      setClubs((prev) => prev.filter((club) => club.id !== id))

      toast({
        title: "Kulüp silindi",
        description: "Kulüp başarıyla silindi.",
      })
    } catch (error) {
      console.error("Kulüp silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Kulüp silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Kulüpler</h1>
        <Link href="/admin/clubs/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Kulüp
          </Button>
        </Link>
      </div>

      {clubs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz kulüp bulunmuyor.</p>
              <Link href="/admin/clubs/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Kulüp Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Kulüpler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Kulüp Adı</th>
                    <th className="text-left py-3 px-4">Takım Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {clubs.map((club) => (
                    <tr key={club.id} className="border-b">
                      <td className="py-3 px-4">{club.name}</td>
                      <td className="py-3 px-4">{club._count.teams}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/clubs/${club.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/clubs/${club.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(club.id)}>
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

