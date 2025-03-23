"use client"

import React, { useState, useEffect } from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Stage {
  id: string
  name: string
  league: {
    name: string
  }
}

interface Team {
  id: string
  name: string
  club: {
    name: string
  }
}

interface Match {
  id: string
  stageId: string
  homeTeamId: string
  awayTeamId: string
  matchDate: string
  location: string | null
  status: string
}

export default function EditMatchPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stages, setStages] = useState<Stage[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [formData, setFormData] = useState<Match>({
    id: "",
    stageId: "",
    homeTeamId: "",
    awayTeamId: "",
    matchDate: "",
    location: "",
    status: "",
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Maç verilerini getir
    const fetchMatch = async () => {
      try {
        const response = await fetch(`/api/matches/${id}`)

        if (!response.ok) {
          throw new Error("Maç bilgileri alınamadı")
        }

        const match = await response.json()

        // Tarihi input için uygun formata çevir (YYYY-MM-DDThh:mm)
        const matchDate = new Date(match.matchDate).toISOString().slice(0, 16)

        setFormData({
          id: match.id,
          stageId: match.stageId,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          matchDate,
          location: match.location || "",
          status: match.status,
        })
      } catch (error) {
        console.error("Maç getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Maç bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }

    // Etapları getir
    const fetchStages = async () => {
      try {
        const response = await fetch("/api/stages")
        const data = await response.json()
        setStages(data)
      } catch (err) {
        console.error("Etapları getirme hatası:", err)
      }
    }

    // Takımları getir
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams")
        const data = await response.json()
        setTeams(data)
      } catch (err) {
        console.error("Takımları getirme hatası:", err)
      }
    }

    Promise.all([fetchMatch(), fetchStages(), fetchTeams()])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))
  }, [id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.homeTeamId === formData.awayTeamId) {
      toast({
        title: "Hata",
        description: "Ev sahibi ve deplasman takımları aynı olamaz.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Maç güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Maç güncellendi",
        description: "Maç bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/matches")
    } catch (error) {
      console.error("Maç güncelleme hatası:", error)
      toast({
        title: "Maç güncellenemedi",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Maç Düzenle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Maç Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stageId">Etap</Label>
              <Select
                value={formData.stageId}
                onValueChange={(value) => handleSelectChange("stageId", value)}
                disabled={isLoading || stages.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Etap seçin" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.league.name} - {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {stages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Önce bir etap eklemelisiniz.{" "}
                  <Link href="/admin/stages/new" className="text-primary hover:underline">
                    Etap Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeamId">Ev Sahibi Takım</Label>
                <Select
                  value={formData.homeTeamId}
                  onValueChange={(value) => handleSelectChange("homeTeamId", value)}
                  disabled={isLoading || teams.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ev sahibi takım seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.club.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awayTeamId">Deplasman Takımı</Label>
                <Select
                  value={formData.awayTeamId}
                  onValueChange={(value) => handleSelectChange("awayTeamId", value)}
                  disabled={isLoading || teams.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Deplasman takımı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.club.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchDate">Maç Tarihi</Label>
                <Input
                  id="matchDate"
                  name="matchDate"
                  type="datetime-local"
                  required
                  value={formData.matchDate}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Planlandı</SelectItem>
                    <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                    <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Konum</Label>
              <Input
                id="location"
                name="location"
                placeholder="Maç konumu (opsiyonel)"
                value={formData.location || ""}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || !formData.stageId || !formData.homeTeamId || !formData.awayTeamId || !formData.matchDate
              }
            >
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

