"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Club {
  id: number
  name: string
}

interface League {
  id: number
  name: string
}

interface Team {
  id: number
  name: string
  clubId: number
  leagueId: number | null
}

export default function EditTeamPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [team, setTeam] = useState<Team | null>(null)
  const [clubs, setClubs] = useState<Club[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Takım ID:", params.id, "Tip:", typeof params.id)

        // Takım bilgilerini getir
        console.log("Takım bilgileri getiriliyor...")
        const teamResponse = await fetch(`/api/teams/${params.id}`)

        console.log("API yanıtı:", teamResponse.status, teamResponse.statusText)

        if (!teamResponse.ok) {
          const errorData = await teamResponse.json()
          console.error("API hata yanıtı:", errorData)
          throw new Error(errorData.error || "Takım bilgileri alınamadı")
        }

        const teamData = await teamResponse.json()
        console.log("Takım verileri:", teamData)

        // Kulüpleri getir
        console.log("Kulüpler getiriliyor...")
        const clubsResponse = await fetch("/api/clubs")
        if (!clubsResponse.ok) {
          throw new Error("Kulüpler yüklenirken bir hata oluştu")
        }
        const clubsData = await clubsResponse.json()
        console.log(`${clubsData.length} kulüp bulundu`)

        // Ligleri getir
        console.log("Ligler getiriliyor...")
        const leaguesResponse = await fetch("/api/leagues")
        if (!leaguesResponse.ok) {
          throw new Error("Ligler yüklenirken bir hata oluştu")
        }
        const leaguesData = await leaguesResponse.json()
        console.log(`${leaguesData.length} lig bulundu`)

        setTeam(teamData)
        setClubs(clubsData)
        setLeagues(leaguesData)
        setError(null)
      } catch (error) {
        console.error("Veri getirme hatası:", error)
        setError(error instanceof Error ? error.message : "Veriler yüklenirken bir hata oluştu")
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!team) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/teams/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(team),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Takım güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Takım başarıyla güncellendi.",
      })

      router.push("/admin/teams")
    } catch (error) {
      console.error("Takım güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Takım güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTeam((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    setTeam((prev) => {
      if (!prev) return null

      if (name === "leagueId" && value === "-1") {
        return { ...prev, [name]: null }
      }

      return { ...prev, [name]: Number.parseInt(value) }
    })
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
        <div className="flex items-center gap-2">
          <Link href="/admin/teams">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Hata</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-red-500">Hata: {error}</p>
              <p>Takım ID: {params.id}</p>
              <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
              <Link href="/admin/teams">
                <Button variant="outline" className="ml-2">
                  Takımlara Dön
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Takım bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/teams">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Takım Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Takım Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Takım Adı</Label>
              <Input id="name" name="name" value={team.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clubId">Kulüp</Label>
              <Select value={team.clubId.toString()} onValueChange={(value) => handleSelectChange("clubId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kulüp seçin" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id.toString()}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leagueId">Lig</Label>
              <Select
                value={team.leagueId?.toString() || "-1"}
                onValueChange={(value) => handleSelectChange("leagueId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Lig seçilmedi</SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id.toString()}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/teams">
                <Button variant="outline">İptal</Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

