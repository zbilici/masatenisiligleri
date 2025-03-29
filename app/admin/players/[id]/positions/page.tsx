"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Player {
  id: number
  firstName: string
  lastName: string
}

interface Position {
  id: number
  name: string
  description: string | null
  selected?: boolean
  isPrimary?: boolean
}

export default function PlayerPositionsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [player, setPlayer] = useState<Player | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Oyuncu bilgilerini getir
        const playerResponse = await fetch(`/api/players/${params.id}`)
        if (!playerResponse.ok) {
          throw new Error("Oyuncu yüklenirken bir hata oluştu")
        }
        const playerData = await playerResponse.json()
        setPlayer(playerData)

        // Tüm pozisyonları getir
        const positionsResponse = await fetch("/api/positions")
        if (!positionsResponse.ok) {
          throw new Error("Pozisyonlar yüklenirken bir hata oluştu")
        }
        const positionsData = await positionsResponse.json()

        // Oyuncunun pozisyonlarını getir
        const playerPositionsResponse = await fetch(`/api/players/${params.id}/positions`)
        if (!playerPositionsResponse.ok) {
          throw new Error("Oyuncu pozisyonları yüklenirken bir hata oluştu")
        }
        const playerPositionsData = await playerPositionsResponse.json()

        // Pozisyonları işaretle
        const playerPositionIds = new Map(
          playerPositionsData.map((pp: { position: { id: number }; isPrimary: boolean }) => [
            pp.position.id,
            pp.isPrimary,
          ]),
        )

        const positionsWithSelection = positionsData.map((position: Position) => ({
          ...position,
          selected: playerPositionIds.has(position.id),
          isPrimary: playerPositionIds.get(position.id) || false,
        }))

        setPositions(positionsWithSelection)
      } catch (error) {
        console.error("Veri getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Veriler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handlePositionToggle = (positionId: number) => {
    setPositions((prevPositions) =>
      prevPositions.map((position) =>
        position.id === positionId ? { ...position, selected: !position.selected } : position,
      ),
    )
  }

  const handlePrimaryToggle = (positionId: number) => {
    setPositions((prevPositions) =>
      prevPositions.map((position) =>
        position.id === positionId ? { ...position, isPrimary: !position.isPrimary } : position,
      ),
    )
  }

  const handleSave = async () => {
    if (!player) return

    setIsSaving(true)

    try {
      // Seçili pozisyonları hazırla
      const selectedPositions = positions
        .filter((position) => position.selected)
        .map((position) => ({
          id: position.id,
          isPrimary: position.isPrimary || false,
        }))

      const response = await fetch(`/api/players/${params.id}/positions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ positionIds: selectedPositions }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Pozisyonlar kaydedilirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Oyuncu pozisyonları başarıyla kaydedildi.",
      })

      router.push(`/admin/players/${params.id}`)
    } catch (error) {
      console.error("Pozisyonları kaydetme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Pozisyonlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

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
        <Link href={`/admin/players/${params.id}`}>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {player.firstName} {player.lastName} - Pozisyonlar
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pozisyonları Seçin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Oyuncunun oynayabileceği pozisyonları seçin ve ana pozisyonunu belirleyin.
            </p>

            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Seç</th>
                    <th className="text-left py-3 px-4">Pozisyon Adı</th>
                    <th className="text-left py-3 px-4">Açıklama</th>
                    <th className="text-left py-3 px-4">Ana Pozisyon</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.id} className="border-b">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={position.selected}
                          onCheckedChange={() => handlePositionToggle(position.id)}
                        />
                      </td>
                      <td className="py-3 px-4">{position.name}</td>
                      <td className="py-3 px-4">{position.description || "-"}</td>
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={position.selected && position.isPrimary}
                          disabled={!position.selected}
                          onCheckedChange={() => handlePrimaryToggle(position.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <Link href={`/admin/players/${params.id}`}>
                <Button variant="outline">İptal</Button>
              </Link>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

