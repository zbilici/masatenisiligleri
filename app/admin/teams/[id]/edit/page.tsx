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

interface Club {
  id: string
  name: string
}

interface League {
  id: string
  name: string
  season: {
    name: string
  }
}

interface Team {
  id: string
  name: string
  clubId: string
  leagueId: string | null
}

export default function EditTeamPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [clubs, setClubs] = useState<Club[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [formData, setFormData] = useState<Team>({
    id: "",
    name: "",
    clubId: "",
    leagueId: "",
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Takım verilerini getir
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${id}`)

        if (!response.ok) {
          throw new Error("Takım bilgileri alınamadı")
        }

        const team = await response.json()

        setFormData({
          id: team.id,
          name: team.name,
          clubId: team.clubId,
          leagueId: team.leagueId || "none",
        })
      } catch (error) {
        console.error("Takım getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Takım bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }

    // Kulüpleri getir
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs")
        const data = await response.json()
        setClubs(data)
      } catch (err) {
        console.error("Kulüpleri getirme hatası:", err)
      }
    }

    // Ligleri getir
    const fetchLeagues = async () => {
      try {
        const response = await fetch("/api/leagues")
        const data = await response.json()
        setLeagues(data)
      } catch (err) {
        console.error("Ligleri getirme hatası:", err)
      }
    }

    Promise.all([fetchTeam(), fetchClubs(), fetchLeagues()])
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
    setIsLoading(true)

    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          leagueId: formData.leagueId === "none" ? null : formData.leagueId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Takım güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Takım güncellendi",
        description: "Takım bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/teams")
    } catch (error) {
      console.error("Takım güncelleme hatası:", error)
      toast({
        title: "Takım güncellenemedi",
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
        <h1 className="text-3xl font-bold tracking-tight">Takım Düzenle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Takım Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clubId">Kulüp</Label>
              <Select
                value={formData.clubId}
                onValueChange={(value) => handleSelectChange("clubId", value)}
                disabled={isLoading || clubs.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kulüp seçin" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clubs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Önce bir kulüp eklemelisiniz.{" "}
                  <Link href="/admin/clubs/new" className="text-primary hover:underline">
                    Kulüp Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Takım Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Takım adı"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leagueId">Lig (Opsiyonel)</Label>
              <Select
                value={formData.leagueId || "none"}
                onValueChange={(value) => handleSelectChange("leagueId", value)}
                disabled={isLoading || leagues.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Lig seçilmedi</SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Takımın katılacağı ligi seçebilirsiniz.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || !formData.clubId || !formData.name}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

