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

interface Season {
  id: number
  name: string
  isActive: boolean
}

interface Gender {
  id: number
  name: string
}

interface LeagueType {
  id: number
  name: string
}

interface MatchSystem {
  id: number
  name: string
}

export default function NewLeaguePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [league, setLeague] = useState({
    name: "",
    seasonId: "",
    genderId: "",
    leagueTypeId: "",
    matchSystemId: "",
  })
  const [seasons, setSeasons] = useState<Season[]>([])
  const [genders, setGenders] = useState<Gender[]>([])
  const [leagueTypes, setLeagueTypes] = useState<LeagueType[]>([])
  const [matchSystems, setMatchSystems] = useState<MatchSystem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sezonları getir
        const seasonsResponse = await fetch("/api/seasons")
        if (!seasonsResponse.ok) {
          throw new Error("Sezonlar yüklenirken bir hata oluştu")
        }
        const seasonsData = await seasonsResponse.json()
        setSeasons(seasonsData)

        // Cinsiyet kategorilerini getir
        const gendersResponse = await fetch("/api/genders")
        if (!gendersResponse.ok) {
          throw new Error("Cinsiyet kategorileri yüklenirken bir hata oluştu")
        }
        const gendersData = await gendersResponse.json()
        setGenders(gendersData)

        // Lig tiplerini getir
        const leagueTypesResponse = await fetch("/api/league-types")
        if (!leagueTypesResponse.ok) {
          throw new Error("Lig tipleri yüklenirken bir hata oluştu")
        }
        const leagueTypesData = await leagueTypesResponse.json()
        setLeagueTypes(leagueTypesData)

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

        // Aktif sezonu varsayılan olarak seç
        const activeSeason = seasonsData.find((season: Season) => season.isActive)
        if (activeSeason) {
          setLeague((prev) => ({ ...prev, seasonId: activeSeason.id.toString() }))
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!league.name || !league.seasonId || !league.genderId || !league.leagueTypeId) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/leagues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: league.name,
          seasonId: Number.parseInt(league.seasonId),
          genderId: Number.parseInt(league.genderId),
          leagueTypeId: Number.parseInt(league.leagueTypeId),
          matchSystemId:
            league.matchSystemId && league.matchSystemId !== "none" ? Number.parseInt(league.matchSystemId) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Lig oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Lig başarıyla oluşturuldu.",
      })

      router.push("/admin/leagues")
    } catch (error) {
      console.error("Lig oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Lig oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLeague((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setLeague((prev) => ({ ...prev, [name]: value }))
  }

  // Lig adını otomatik oluştur
  useEffect(() => {
    if (league.seasonId && league.genderId && league.leagueTypeId) {
      const selectedSeason = seasons.find((s) => s.id.toString() === league.seasonId)
      const selectedGender = genders.find((g) => g.id.toString() === league.genderId)
      const selectedLeagueType = leagueTypes.find((lt) => lt.id.toString() === league.leagueTypeId)

      if (selectedSeason && selectedGender && selectedLeagueType) {
        const autoName = `${selectedSeason.name} ${selectedGender.name} ${selectedLeagueType.name}`
        setLeague((prev) => ({ ...prev, name: autoName }))
      }
    }
  }, [league.seasonId, league.genderId, league.leagueTypeId, seasons, genders, leagueTypes])

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
        <Link href="/admin/leagues">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Lig</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lig Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seasonId">Sezon</Label>
              <Select value={league.seasonId} onValueChange={(value) => handleSelectChange("seasonId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sezon seçin" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.length > 0 ? (
                    seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id.toString()}>
                        {season.name} {season.isActive ? "(Aktif)" : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Sezon bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {seasons.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Sezon bulunamadı. Lütfen önce bir sezon ekleyin.
                  <Link href="/admin/seasons/new" className="ml-1 text-blue-500 hover:underline">
                    Sezon Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genderId">Cinsiyet Kategorisi</Label>
              <Select value={league.genderId} onValueChange={(value) => handleSelectChange("genderId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Cinsiyet kategorisi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {genders.length > 0 ? (
                    genders.map((gender) => (
                      <SelectItem key={gender.id} value={gender.id.toString()}>
                        {gender.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Cinsiyet kategorisi bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {genders.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Cinsiyet kategorisi bulunamadı. Lütfen önce bir cinsiyet kategorisi ekleyin.
                  <Link href="/admin/genders/new" className="ml-1 text-blue-500 hover:underline">
                    Kategori Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="leagueTypeId">Lig Tipi</Label>
              <Select value={league.leagueTypeId} onValueChange={(value) => handleSelectChange("leagueTypeId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Lig tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {leagueTypes.length > 0 ? (
                    leagueTypes.map((leagueType) => (
                      <SelectItem key={leagueType.id} value={leagueType.id.toString()}>
                        {leagueType.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Lig tipi bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {leagueTypes.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Lig tipi bulunamadı. Lütfen önce bir lig tipi ekleyin.
                  <Link href="/admin/league-types/new" className="ml-1 text-blue-500 hover:underline">
                    Lig Tipi Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Lig Adı</Label>
              <Input id="name" name="name" value={league.name} onChange={handleChange} required />
              <p className="text-sm text-muted-foreground">
                Lig adı, seçilen sezon, cinsiyet kategorisi ve lig tipine göre otomatik oluşturulur. İsterseniz
                değiştirebilirsiniz.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchSystemId">Maç Sistemi (Opsiyonel)</Label>
              <Select
                value={league.matchSystemId}
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
              {matchSystems.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Maç sistemi bulunamadı. Lütfen önce bir maç sistemi ekleyin.
                  <Link href="/admin/match-systems/new" className="ml-1 text-blue-500 hover:underline">
                    Maç Sistemi Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/leagues">
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

