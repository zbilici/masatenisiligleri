"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash, Eye } from "lucide-react"

interface Player {
  id: string
  firstName: string
  lastName: string
  gender: string
  licenseNumber: string | null
  _count: {
    playerTeams: number
  }
}

export default function PlayersPage() {
  const { toast } = useToast()
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/players")
        if (!response.ok) {
          throw new Error("Oyuncular yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setPlayers(data)
      } catch (error) {
        console.error("Oyuncuları getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Oyuncular yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [toast])

  const handleDelete = async (id: string) => {
    if (!confirm("Bu oyuncuyu silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/players/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Oyuncu silinemedi")
      }

      setPlayers((prev) => prev.filter((player) => player.id !== id))

      toast({
        title: "Oyuncu silindi",
        description: "Oyuncu başarıyla silindi.",
      })
    } catch (error) {
      console.error("Oyuncu silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Oyuncu silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Oyuncular</h1>
        <Link href="/admin/players/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Oyuncu
          </Button>
        </Link>
      </div>

      {players.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz oyuncu bulunmuyor.</p>
              <Link href="/admin/players/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Oyuncu Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Oyuncular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Ad</th>
                    <th className="text-left py-3 px-4">Soyad</th>
                    <th className="text-left py-3 px-4">Cinsiyet</th>
                    <th className="text-left py-3 px-4">Lisans No</th>
                    <th className="text-left py-3 px-4">Takım Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b">
                      <td className="py-3 px-4">{player.firstName}</td>
                      <td className="py-3 px-4">{player.lastName}</td>
                      <td className="py-3 px-4">{player.gender}</td>
                      <td className="py-3 px-4">{player.licenseNumber || "-"}</td>
                      <td className="py-3 px-4">{player._count.playerTeams}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/players/${player.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/players/${player.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(player.id)}>
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

