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

interface League {
  id: number
  name: string
  season: {
    name: string
  }
}

interface SubLeague {
  id: number
  name: string
  league: {
    id: number
    name: string
  }
}

export default function NewStagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [stage, setStage] = useState({
    name: "",
    order: "",
    leagueId: "",
    subLeagueId: "",
    startDate: "",
    endDate: "",
  })
  const [leagues, setLeagues] = useState<League[]>([])
  const [subLeagues, setSubLeagues] = useState<SubLeague[]>([])
  const [filteredSubLeagues, setFilteredSubLeagues] = useState<SubLeague[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ligleri getir
        const leaguesResponse = await fetch("/api/leagues")
        if (!leaguesResponse.ok) {
          throw new Error("Ligler yüklenirken bir hata oluştu")
        }
        const leaguesData = await leaguesResponse.json()
        setLeagues(leaguesData)

        // Alt ligleri getir
        const subLeaguesResponse = await fetch("/api/sub-leagues")
        if (!subLeaguesResponse.ok) {
          throw new Error("Alt ligler yüklenirken bir hata oluştu")
        }
        const subLeaguesData = await subLeaguesResponse.json()
        setSubLeagues(subLeaguesData)
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

  // Lig seçildiğinde alt ligleri filtrele
  useEffect(() => {
    if (stage.leagueId) {
      const leagueId = Number.parseInt(stage.leagueId)
      const filtered = subLeagues.filter((sl) => sl.league.id === leagueId)
      setFilteredSubLeagues(filtered)

      // Eğer seçili alt lig, filtrelenmiş alt liglerde yoksa, seçimi temizle
      if (stage.subLeagueId && !filtered.some((sl) => sl.id.toString() === stage.subLeagueId)) {
        setStage((prev) => ({ ...prev, subLeagueId: "" }))
      }
    } else {
      setFilteredSubLeagues([])
    }
  }, [stage.leagueId, subLeagues])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stage.name || !stage.startDate || !stage.endDate || (!stage.leagueId && !stage.subLeagueId)) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun. Lig veya alt lig seçmelisiniz.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/stages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: stage.name,
          order: stage.order ? Number.parseInt(stage.order) : 1,
          leagueId: stage.leagueId ? Number.parseInt(stage.leagueId) : null,
          subLeagueId: stage.subLeagueId ? Number.parseInt(stage.subLeagueId) : null,
          startDate: new Date(stage.startDate).toISOString(),
          endDate: new Date(stage.endDate).toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Etap oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Etap başarıyla oluşturuldu.",
      })

      router.push("/admin/stages")
    } catch (error) {
      console.error("Etap oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Etap oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStage((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setStage((prev) => ({ ...prev, [name]: value }))

    // Eğer lig seçildiyse, alt lig seçimini temizle
    if (name === "leagueId") {
      setStage((prev) => ({ ...prev, [name]: value, subLeagueId: "" }))
    }
    // Eğer alt lig seçildiyse, lig seçimini temizle
    else if (name === "subLeagueId" && value) {
      setStage((prev) => ({ ...prev, [name]: value, leagueId: "" }))
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
      <div className="flex items-center gap-2">
        <Link href="/admin/stages">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Etap</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Etap Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Etap Adı</Label>
              <Input id="name" name="name" value={stage.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Sıra</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={stage.order}
                onChange={handleChange}
                min="1"
                placeholder="1"
              />
              <p className="text-sm text-muted-foreground">Boş bırakırsanız 1 olarak ayarlanacaktır.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leagueId">Lig</Label>
              <Select value={stage.leagueId} onValueChange={(value) => handleSelectChange("leagueId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Seçilmedi</SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id.toString()}>
                      {league.season?.name} - {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Lig veya alt lig seçmelisiniz. İkisini birden seçemezsiniz.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subLeagueId">Alt Lig</Label>
              <Select
                value={stage.subLeagueId}
                onValueChange={(value) => handleSelectChange("subLeagueId", value)}
                disabled={!stage.leagueId && filteredSubLeagues.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alt lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Seçilmedi</SelectItem>
                  {filteredSubLeagues.map((subLeague) => (
                    <SelectItem key={subLeague.id} value={subLeague.id.toString()}>
                      {subLeague.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Önce bir lig seçmelisiniz. Alt lig seçerseniz, lig seçimi temizlenecektir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={stage.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input id="endDate" name="endDate" type="date" value={stage.endDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/stages">
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

