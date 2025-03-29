"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Match {
  id: number
  matchDate: string
  status: string
  homeScore: number | null
  awayScore: number | null
  stage: {
    name: string
    league?: {
      name: string
    } | null
    subLeague?: {
      name: string
    } | null
  }
  round?: {
    name: string
  } | null
  homeTeam: {
    name: string
    club: {
      name: string
    }
  }
  awayTeam: {
    name: string
    club: {
      name: string
    }
  }
  _count?: {
    individualMatches: number
    doublesMatches: number
  }
}

export default function MatchesPage() {
  const { toast } = useToast()
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches")
        if (!response.ok) {
          throw new Error("Maçlar yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setMatches(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Maçları getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Maçlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
        // Hata durumunda boş dizi ata
        setMatches([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu maçı silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Maç silinemedi")
      }

      setMatches((prev) => prev.filter((match) => match.id !== id))

      toast({
        title: "Maç silindi",
        description: "Maç başarıyla silindi.",
      })
    } catch (error) {
      console.error("Maç silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Maç silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: tr })
    } catch (error) {
      return "Geçersiz tarih"
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: tr })
    } catch (error) {
      return "Geçersiz saat"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Planlandı</span>
      case "COMPLETED":
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Tamamlandı</span>
      case "CANCELLED":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">İptal Edildi</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>
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
        <h1 className="text-3xl font-bold tracking-tight">Maçlar</h1>
        <Link href="/admin/matches/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Maç
          </Button>
        </Link>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz maç bulunmuyor.</p>
              <Link href="/admin/matches/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Maç Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Maçlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tarih</th>
                    <th className="text-left py-3 px-4">Saat</th>
                    <th className="text-left py-3 px-4">Etap</th>
                    <th className="text-left py-3 px-4">Tur</th>
                    <th className="text-left py-3 px-4">Lig/Alt Lig</th>
                    <th className="text-left py-3 px-4">Ev Sahibi</th>
                    <th className="text-left py-3 px-4">Deplasman</th>
                    <th className="text-left py-3 px-4">Skor</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {formatDate(match.matchDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {formatTime(match.matchDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4">{match.stage?.name || "-"}</td>
                      <td className="py-3 px-4">{match.round?.name || "-"}</td>
                      <td className="py-3 px-4">{match.stage?.league?.name || match.stage?.subLeague?.name || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{match.homeTeam?.club?.name || "-"}</div>
                        <div className="text-sm text-gray-500">{match.homeTeam?.name || "-"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{match.awayTeam?.club?.name || "-"}</div>
                        <div className="text-sm text-gray-500">{match.awayTeam?.name || "-"}</div>
                      </td>
                      <td className="py-3 px-4">
                        {match.homeScore !== null && match.awayScore !== null
                          ? `${match.homeScore} - ${match.awayScore}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(match.status)}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/matches/${match.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(match.id)}>
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

