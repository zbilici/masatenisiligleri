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
  leagueId: number
}

interface MatchSystem {
  id: number
  name: string
}

export default function NewSubLeaguePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [subLeague, setSubLeague] = useState({
    name: "",
    leagueId: "",
    parentId: "",
    matchSystemId: "",
  })
  const [leagues, setLeagues] = useState<League[]>([])
  const [subLeagues, setSubLeagues] = useState<SubLeague[]>([])
  const [filteredSubLeagues, setFilteredSubLeagues] = useState<SubLeague[]>([])
  const [matchSystems, setMatchSystems] = useState<MatchSystem[]>([])
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

        // Maç sistemlerini getir
        try {
          const matchSystemsResponse = await fetch("/api/match-systems")
          if (matchSystemsResponse.ok) {
            const matchSystemsData = await matchSystemsResponse.json()
            setMatchSystems(matchSystemsData)
          } else {
            console.error("Maç sistemleri yüklenemedi, örnek veri ekleniyor...")
            // Örnek maç sistemleri ekle
            await fetch("/api/match-systems/seed", { method: "POST" })

            // Tekrar dene
            const retryResponse = await fetch("/api/match-systems")
            if (retryResponse.ok) {
              const retryData = await retryResponse.json()
              setMatchSystems(retryData)
            }
          }
        } catch (error) {
          console.error("Maç sistemleri getirme hatası:", error)
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
  }, [toast])

  // Lig seçildiğinde alt ligleri filtrele
  useEffect(() => {
    if (subLeague.leagueId) {
      const filtered = subLeagues.filter((sl) => sl.leagueId === Number.parseInt(subLeague.leagueId))
      setFilteredSubLeagues(filtered)

      // Eğer seçili üst alt lig, filtrelenmiş alt liglerde yoksa, seçimi temizle
      if (subLeague.parentId && !filtered.some((sl) => sl.id.toString() === subLeague.parentId)) {
        setSubLeague((prev) => ({ ...prev, parentId: "" }))
      }
    } else {
      setFilteredSubLeagues([])
    }
  }, [subLeague.leagueId, subLeagues])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!subLeague.name || !subLeague.leagueId) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/sub-leagues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subLeague.name,
          leagueId: subLeague.leagueId,
          parentId: subLeague.parentId || null,
          matchSystemId: subLeague.matchSystemId && subLeague.matchSystemId !== "none" ? subLeague.matchSystemId : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Alt lig oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Alt lig başarıyla oluşturuldu.",
      })

      router.push("/admin/sub-leagues")
    } catch (error) {
      console.error("Alt lig oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Alt lig oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSubLeague((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSubLeague((prev) => ({ ...prev, [name]: value }))
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
        <Link href="/admin/sub-leagues">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Alt Lig</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alt Lig Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leagueId">Bağlı Olduğu Lig</Label>
              <Select value={subLeague.leagueId} onValueChange={(value) => handleSelectChange("leagueId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.length > 0 ? (
                    leagues.map((league) => (
                      <SelectItem key={league.id} value={league.id.toString()}>
                        {league.season.name} - {league.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Lig bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {leagues.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Lig bulunamadı. Lütfen önce bir lig ekleyin.
                  <Link href="/admin/leagues/new" className="ml-1 text-blue-500 hover:underline">
                    Lig Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Üst Alt Lig (Opsiyonel)</Label>
              <Select
                value={subLeague.parentId}
                onValueChange={(value) => handleSelectChange("parentId", value)}
                disabled={!subLeague.leagueId || filteredSubLeagues.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Üst alt lig seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Seçilmedi</SelectItem>
                  {filteredSubLeagues.map((sl) => (
                    <SelectItem key={sl.id} value={sl.id.toString()}>
                      {sl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Alt Lig Adı</Label>
              <Input id="name" name="name" value={subLeague.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchSystemId">Maç Sistemi (Opsiyonel)</Label>
              <Select
                value={subLeague.matchSystemId}
                onValueChange={(value) => handleSelectChange("matchSystemId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Maç sistemi seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Seçilmedi</SelectItem>
                  {matchSystems.length > 0 ? (
                    matchSystems.map((matchSystem) => (
                      <SelectItem key={matchSystem.id} value={matchSystem.id.toString()}>
                        {matchSystem.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Maç sistemi bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/sub-leagues">
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

