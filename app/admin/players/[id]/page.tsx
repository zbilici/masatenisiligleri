"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Player {
  id: string
  firstName: string
  lastName: string
  birthDate: string | null
  gender: string
  licenseNumber: string | null
  photo: string | null
  playerTeams: {
    id: string
    team: {
      name: string
      club: {
        name: string
      }
    }
    season: {
      name: string
    }
    joinDate: string
    leaveDate: string | null
  }[]
}

export default function PlayerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [player, setPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`/api/players/${params.id}`)
        if (!response.ok) {
          throw new Error("Oyuncu yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setPlayer(data)
      } catch (error) {
        console.error("Oyuncu getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Oyuncu yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayer()
  }, [params.id, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Oyuncu bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/players">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {player.firstName} {player.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Oyuncu Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ad</p>
                  <p>{player.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Soyad</p>
                  <p>{player.lastName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Doğum Tarihi</p>
                  <p>{player.birthDate ? format(new Date(player.birthDate), "dd MMMM yyyy", { locale: tr }) : "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cinsiyet</p>
                  <p>{player.gender === "Erkek" ? "Erkek" : "Kadın"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Lisans Numarası</p>
                <p>{player.licenseNumber || "-"}</p>
              </div>

              {player.photo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fotoğraf</p>
                  <img
                    src={player.photo || "/placeholder.svg"}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="mt-2 max-w-full h-auto max-h-64 rounded-md"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Takım Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            {player.playerTeams.length === 0 ? (
              <p className="text-muted-foreground">Oyuncunun henüz bir takım geçmişi bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {player.playerTeams.map((playerTeam) => (
                  <div key={playerTeam.id} className="border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Takım</p>
                        <p>{playerTeam.team.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kulüp</p>
                        <p>{playerTeam.team.club.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sezon</p>
                        <p>{playerTeam.season.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Katılım Tarihi</p>
                        <p>{format(new Date(playerTeam.joinDate), "dd MMMM yyyy", { locale: tr })}</p>
                      </div>
                    </div>

                    {playerTeam.leaveDate && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-muted-foreground">Ayrılış Tarihi</p>
                        <p>{format(new Date(playerTeam.leaveDate), "dd MMMM yyyy", { locale: tr })}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Link href={`/admin/players/${player.id}/edit`}>
          <Button>Düzenle</Button>
        </Link>
      </div>
    </div>
  )
}

