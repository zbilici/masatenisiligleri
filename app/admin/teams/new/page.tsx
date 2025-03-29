"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function NewTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [team, setTeam] = useState({
    name: "",
    clubId: "",
    leagueId: "",
  })
  const [clubs, setClubs] = useState<Club[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kulüpleri getir
        const clubsResponse = await fetch("/api/clubs")
        if (!clubsResponse.ok) {
          throw new Error("Kulüpler yüklenirken bir hata oluştu")
        }
        const clubsData = await clubsResponse.json()

        // Ligleri getir
        const leaguesResponse = await fetch("/api/leagues")
        if (!leaguesResponse.ok) {
          throw new Error("Ligler yüklenirken bir hata oluştu")
        }
        const leaguesData = await leaguesResponse.json()

        setClubs(clubsData)
        setLeagues(leaguesData)
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
  }, [toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!team.name || !team.clubId) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: team.name,
          clubId: Number.parseInt(team.clubId),
          leagueId: team.leagueId ? Number.parseInt(team.leagueId) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Takım oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Takım başarıyla oluşturuldu.",
      })

      router.push("/admin/teams")
    } catch (error) {
      console.error("Takım oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Takım oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTeam((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setTeam((prev) => ({ ...prev, [name]: value }))
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
      <div className="flex items-center gap-2">
        <Link href="/admin/teams">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Takım</h1>
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
              <Select value={team.clubId} onValueChange={(value) => handleSelectChange("clubId", value)}>
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
              <Select value={team.leagueId} onValueChange={(value) => handleSelectChange("leagueId", value)}>
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
                {isSaving ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

