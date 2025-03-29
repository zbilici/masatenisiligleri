"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Round {
  id: number
  name: string
  order: number
  startDate: string
  endDate: string
  stage: {
    name: string
    league?: {
      name: string
    } | null
    subLeague?: {
      name: string
    } | null
  }
  _count?: {
    matches: number
  }
}

export default function RoundsPage() {
  const { toast } = useToast()
  const [rounds, setRounds] = useState<Round[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await fetch("/api/rounds")
        if (!response.ok) {
          throw new Error("Turlar yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setRounds(data)
      } catch (error) {
        console.error("Turları getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Turlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRounds()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu turu silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/rounds/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Tur silinemedi")
      }

      setRounds((prev) => prev.filter((round) => round.id !== id))

      toast({
        title: "Tur silindi",
        description: "Tur başarıyla silindi.",
      })
    } catch (error) {
      console.error("Tur silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Tur silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Turlar</h1>
        <Link href="/admin/rounds/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Tur
          </Button>
        </Link>
      </div>

      {rounds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz tur bulunmuyor.</p>
              <Link href="/admin/rounds/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tur Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Turlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tur Adı</th>
                    <th className="text-left py-3 px-4">Etap</th>
                    <th className="text-left py-3 px-4">Lig/Alt Lig</th>
                    <th className="text-left py-3 px-4">Başlangıç</th>
                    <th className="text-left py-3 px-4">Bitiş</th>
                    <th className="text-left py-3 px-4">Maç Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round) => (
                    <tr key={round.id} className="border-b">
                      <td className="py-3 px-4">{round.name}</td>
                      <td className="py-3 px-4">{round.stage.name}</td>
                      <td className="py-3 px-4">{round.stage.league?.name || round.stage.subLeague?.name || "-"}</td>
                      <td className="py-3 px-4">{formatDate(round.startDate)}</td>
                      <td className="py-3 px-4">{formatDate(round.endDate)}</td>
                      <td className="py-3 px-4">{round._count?.matches || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/rounds/${round.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(round.id)}>
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

