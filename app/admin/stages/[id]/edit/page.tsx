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

interface Stage {
  id: number
  name: string
  order: number
  leagueId: number | null
  subLeagueId: number | null
  startDate: string
  endDate: string
}

export default function EditStagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [stage, setStage] = useState<Stage | null>(null)
  const [leagues, setLeagues] = useState<League[]>([])
  const [subLeagues, setSubLeagues] = useState<SubLeague[]>([])
  const [filteredSubLeagues, setFilteredSubLeagues] = useState<SubLeague[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Etap bilgilerini getir
        const stageResponse = await fetch(`/api/stages/${params.id}`)
        if (!stageResponse.ok) {
          const errorData = await stageResponse.json()
          throw new Error(errorData.error || "Etap bilgileri alınamadı")
        }
        const stageData = await stageResponse.json()

        // Tarih formatını düzelt
        const formattedStage = {
          ...stageData,
          startDate: new Date(stageData.startDate).toISOString().split("T")[0],
          endDate: new Date(stageData.endDate).toISOString().split("T")[0],
        }

        setStage(formattedStage)

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

        // Eğer etap bir lige bağlıysa, o lige ait alt ligleri filtrele
        if (stageData.leagueId) {
          const filtered = subLeaguesData.filter((sl: SubLeague) => sl.league.id === stageData.leagueId)
          setFilteredSubLeagues(filtered)
        }
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

  // Lig seçildiğinde alt ligleri filtrele
  useEffect(() => {
    if (stage?.leagueId) {
      const filtered = subLeagues.filter((sl) => sl.league.id === stage.leagueId)
      setFilteredSubLeagues(filtered)

      // Eğer seçili alt lig, filtrelenmiş alt liglerde yoksa, seçimi temizle
      if (stage.subLeagueId && !filtered.some((sl) => sl.id === stage.subLeagueId)) {
        setStage((prev) => (prev ? { ...prev, subLeagueId: null } : null))
      }
    } else {
      setFilteredSubLeagues([])
    }
  }, [stage?.leagueId, subLeagues])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stage) return

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
      const response = await fetch(`/api/stages/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: stage.name,
          order: stage.order || 1,
          leagueId: stage.leagueId,
          subLeagueId: stage.subLeagueId,
          startDate: new Date(stage.startDate).toISOString(),
          endDate: new Date(stage.endDate).toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Etap güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Etap başarıyla güncellendi.",
      })

      router.push("/admin/stages")
    } catch (error) {
      console.error("Etap güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Etap güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStage((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "leagueId") {
      setStage((prev) =>
        prev
          ? {
              ...prev,
              [name]: value ? Number.parseInt(value) : null,
              subLeagueId: null, // Lig değiştiğinde alt lig seçimini temizle
            }
          : null,
      )
    } else if (name === "subLeagueId") {
      setStage((prev) =>
        prev
          ? {
              ...prev,
              [name]: value ? Number.parseInt(value) : null,
              leagueId: null, // Alt lig seçildiğinde lig seçimini temizle
            }
          : null,
      )
    } else {
      setStage((prev) => (prev ? { ...prev, [name]: value ? Number.parseInt(value) : null } : null))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!stage) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Etap bulunamadı.</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Etap Düzenle</h1>
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
              <Select
                value={stage.leagueId?.toString() || ""}
                onValueChange={(value) => handleSelectChange("leagueId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
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
                value={stage.subLeagueId?.toString() || ""}
                onValueChange={(value) => handleSelectChange("subLeagueId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alt lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
                  {filteredSubLeagues.map((subLeague) => (
                    <SelectItem key={subLeague.id} value={subLeague.id.toString()}>
                      {subLeague.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Alt lig seçerseniz, lig seçimi temizlenecektir.</p>
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
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

