"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface Team {
  id: number
  name: string
  clubId: number
  club?: {
    name: string
  }
  leagueId: number | null
  league?: {
    name: string
  }
}

export default function TeamsPage() {
  const { toast } = useToast()
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log("Takımlar getiriliyor...")
        const response = await fetch("/api/teams")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Takımlar yüklenirken bir hata oluştu")
        }

        const data = await response.json()
        console.log("Takımlar başarıyla getirildi:", data.length)
        setTeams(data)
        setError(null)
      } catch (error) {
        console.error("Takımları getirme hatası:", error)
        setError(error instanceof Error ? error.message : "Takımlar yüklenirken bir hata oluştu")
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Takımlar yüklenirken bir hata oluştu",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu takımı silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Takım silinemedi")
      }

      setTeams((prev) => prev.filter((team) => team.id !== id))

      toast({
        title: "Takım silindi",
        description: "Takım başarıyla silindi.",
      })
    } catch (error) {
      console.error("Takım silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Takım silinirken bir hata oluştu.",
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Takımlar</h1>
          <Link href="/admin/teams/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Yeni Takım
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 text-red-500">
              <p>Hata: {error}</p>
              <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Takımlar</h1>
        <Link href="/admin/teams/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Takım
          </Button>
        </Link>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz takım bulunmuyor.</p>
              <Link href="/admin/teams/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Takım Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Takımlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Takım Adı</th>
                    <th className="text-left py-3 px-4">Kulüp</th>
                    <th className="text-left py-3 px-4">Lig</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b">
                      <td className="py-3 px-4">{team.id}</td>
                      <td className="py-3 px-4">{team.name}</td>
                      <td className="py-3 px-4">{team.club?.name || `Kulüp ID: ${team.clubId}`}</td>
                      <td className="py-3 px-4">{team.league?.name || "-"}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/teams/${team.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(team.id)}>
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

