"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

export default function NewMatchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [stages, setStages] = useState<Stage[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [formData, setFormData] = useState({
    stageId: "",
    homeTeamId: "",
    awayTeamId: "",
    matchDate: "",
    location: "",
    status: "SCHEDULED",
  })

  useEffect(() => {
    // Etapları getir
    fetch("/api/stages")
      .then((res) => res.json())
      .then((data) => setStages(data))
      .catch((err) => console.error("Etapları getirme hatası:", err))

    // Takımları getir
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Takımları getirme hatası:", err))
  }, [])

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
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Maç oluşturulurken bir hata oluştu.")
      }

      toast({
        title: "Maç oluşturuldu",
        description: "Yeni maç başarıyla oluşturuldu.",
      })

      router.push("/admin/matches")
    } catch (error) {
      console.error("Maç oluşturma hatası:", error)
      toast({
        title: "Maç oluşturulamadı",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Maç Ekle</h1>
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
                value={formData.location}
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

