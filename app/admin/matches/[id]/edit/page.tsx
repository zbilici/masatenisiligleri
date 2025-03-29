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

interface Stage {
  id: number
  name: string
  league?: {
    id: number
    name: string
  } | null
  subLeague?: {
    id: number
    name: string
  } | null
}

interface Round {
  id: number
  name: string
  stageId: number
}

interface Team {
  id: number
  name: string
  club: {
    name: string
  }
  leagueId?: number | null
  subLeagues?: Array<{ id: number }> | null
}

interface Playground {
  id: number
  name: string
}

interface MatchSystem {
  id: number
  name: string
}

interface Match {
  id: number
  stageId: number
  roundId: number | null
  homeTeamId: number
  awayTeamId: number
  matchSystemId: number | null
  playgroundId: number | null
  matchDate: string
  location: string | null
  status: string
  homeScore: number | null
  awayScore: number | null
  stage: Stage
  round: Round | null
  homeTeam: Team
  awayTeam: Team
  matchSystem: MatchSystem | null
  playground: Playground | null
}

export default function EditMatchPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [match, setMatch] = useState<Match | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([])
  const [matchSystems, setMatchSystems] = useState<MatchSystem[]>([])
  const [filteredRounds, setFilteredRounds] = useState<Round[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    stageId: "",
    roundId: "",
    homeTeamId: "",
    awayTeamId: "",
    matchSystemId: "",
    playgroundId: "",
    matchDate: "",
    location: "",
    status: "SCHEDULED",
    homeScore: "",
    awayScore: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Maç bilgilerini getir
        const matchResponse = await fetch(`/api/matches/${params.id}`)
        if (!matchResponse.ok) {
          throw new Error("Maç bilgileri yüklenirken bir hata oluştu")
        }
        const matchData = await matchResponse.json()
        setMatch(matchData)

        // Form verilerini ayarla
        setFormData({
          stageId: matchData.stageId.toString(),
          roundId: matchData.roundId ? matchData.roundId.toString() : "",
          homeTeamId: matchData.homeTeamId.toString(),
          awayTeamId: matchData.awayTeamId.toString(),
          matchSystemId: matchData.matchSystemId ? matchData.matchSystemId.toString() : "",
          playgroundId: matchData.playgroundId ? matchData.playgroundId.toString() : "",
          matchDate: new Date(matchData.matchDate).toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
          location: matchData.location || "",
          status: matchData.status,
          homeScore: matchData.homeScore !== null ? matchData.homeScore.toString() : "",
          awayScore: matchData.awayScore !== null ? matchData.awayScore.toString() : "",
        })

        // Etapları getir
        const stagesResponse = await fetch("/api/stages")
        if (!stagesResponse.ok) {
          throw new Error("Etaplar yüklenirken bir hata oluştu")
        }
        const stagesData = await stagesResponse.json()
        setStages(stagesData)

        // Turları getir
        const roundsResponse = await fetch("/api/rounds")
        if (!roundsResponse.ok) {
          throw new Error("Turlar yüklenirken bir hata oluştu")
        }
        const roundsData = await roundsResponse.json()
        setRounds(roundsData)

        // Etaba bağlı turları filtrele
        const filteredRounds = roundsData.filter((round: Round) => round.stageId === matchData.stageId)
        setFilteredRounds(filteredRounds)

        // Takımları getir
        const teamsResponse = await fetch("/api/teams")
        if (!teamsResponse.ok) {
          throw new Error("Takımlar yüklenirken bir hata oluştu")
        }
        const teamsData = await teamsResponse.json()
        setTeams(teamsData)

        // Etaba bağlı takımları filtrele
        const selectedStage = stagesData.find((stage: Stage) => stage.id === matchData.stageId)
        if (selectedStage) {
          let leagueId: number | undefined
          let subLeagueId: number | undefined

          if (selectedStage.league) {
            leagueId = selectedStage.league.id
          } else if (selectedStage.subLeague) {
            subLeagueId = selectedStage.subLeague.id
          }

          // Takımları filtrele
          const filteredTeams = teamsData.filter((team: Team) => {
            if (leagueId && team.leagueId === leagueId) {
              return true
            }
            if (subLeagueId && team.subLeagues && team.subLeagues.some((sl) => sl.id === subLeagueId)) {
              return true
            }
            // Mevcut maçın takımlarını her zaman dahil et
            if (team.id === matchData.homeTeamId || team.id === matchData.awayTeamId) {
              return true
            }
            return false
          })

          setFilteredTeams(filteredTeams)
        }

        // Sahaları getir
        try {
          const playgroundsResponse = await fetch("/api/playgrounds")
          if (playgroundsResponse.ok) {
            const playgroundsData = await playgroundsResponse.json()
            setPlaygrounds(playgroundsData)
          } else {
            console.error("Sahalar yüklenemedi")
            setPlaygrounds([])
          }
        } catch (error) {
          console.error("Sahaları getirme hatası:", error)
          setPlaygrounds([])
        }

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
          setMatchSystems([])
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

  // Etap seçildiğinde turları filtrele
  useEffect(() => {
    if (formData.stageId) {
      const filtered = rounds.filter((round) => round.stageId === Number.parseInt(formData.stageId))
      setFilteredRounds(filtered)

      // Eğer seçili tur, filtrelenmiş turlarda yoksa, seçimi temizle
      if (formData.roundId && !filtered.some((round) => round.id.toString() === formData.roundId)) {
        setFormData((prev) => ({ ...prev, roundId: "" }))
      }

      // Etaba bağlı takımları filtrele
      const selectedStage = stages.find((stage) => stage.id.toString() === formData.stageId)
      if (selectedStage) {
        let leagueId: number | undefined
        let subLeagueId: number | undefined

        if (selectedStage.league) {
          leagueId = selectedStage.league.id
        } else if (selectedStage.subLeague) {
          subLeagueId = selectedStage.subLeague.id
        }

        // Takımları filtrele
        const filtered = teams.filter((team) => {
          if (leagueId && team.leagueId === leagueId) {
            return true
          }
          if (subLeagueId && team.subLeagues && team.subLeagues.some((sl) => sl.id === subLeagueId)) {
            return true
          }
          // Mevcut maçın takımlarını her zaman dahil et
          if (match && (team.id === match.homeTeamId || team.id === match.awayTeamId)) {
            return true
          }
          return false
        })

        setFilteredTeams(filtered)

        // Eğer seçili takımlar, filtrelenmiş takımlarda yoksa, seçimleri temizle
        if (formData.homeTeamId && !filtered.some((team) => team.id.toString() === formData.homeTeamId)) {
          setFormData((prev) => ({ ...prev, homeTeamId: "" }))
        }
        if (formData.awayTeamId && !filtered.some((team) => team.id.toString() === formData.awayTeamId)) {
          setFormData((prev) => ({ ...prev, awayTeamId: "" }))
        }
      }
    } else {
      setFilteredRounds([])
      setFilteredTeams([])
    }
  }, [formData.stageId, rounds, stages, teams, match])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.stageId || !formData.homeTeamId || !formData.awayTeamId || !formData.matchDate) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    if (formData.homeTeamId === formData.awayTeamId) {
      toast({
        title: "Hata",
        description: "Ev sahibi ve deplasman takımları aynı olamaz.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/matches/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId: Number.parseInt(formData.stageId),
          roundId: formData.roundId ? Number.parseInt(formData.roundId) : null,
          homeTeamId: Number.parseInt(formData.homeTeamId),
          awayTeamId: Number.parseInt(formData.awayTeamId),
          matchSystemId:
            formData.matchSystemId && formData.matchSystemId !== "-1" ? Number.parseInt(formData.matchSystemId) : null,
          playgroundId:
            formData.playgroundId && formData.playgroundId !== "-1" ? Number.parseInt(formData.playgroundId) : null,
          matchDate: new Date(formData.matchDate).toISOString(),
          location: formData.location || null,
          status: formData.status,
          homeScore: formData.homeScore ? Number.parseInt(formData.homeScore) : null,
          awayScore: formData.awayScore ? Number.parseInt(formData.awayScore) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Maç güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Maç başarıyla güncellendi.",
      })

      router.push("/admin/matches")
    } catch (error) {
      console.error("Maç güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Maç güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Maç bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/matches">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Maç Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maç Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stageId">Etap</Label>
              <Select value={formData.stageId} onValueChange={(value) => handleSelectChange("stageId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Etap seçin" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id.toString()}>
                      {stage.name} - {stage.league?.name || stage.subLeague?.name || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roundId">Tur (Opsiyonel)</Label>
              <Select
                value={formData.roundId}
                onValueChange={(value) => handleSelectChange("roundId", value)}
                disabled={filteredRounds.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tur seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
                  {filteredRounds.map((round) => (
                    <SelectItem key={round.id} value={round.id.toString()}>
                      {round.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeamId">Ev Sahibi Takım</Label>
                <Select
                  value={formData.homeTeamId}
                  onValueChange={(value) => handleSelectChange("homeTeamId", value)}
                  disabled={filteredTeams.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ev sahibi takım seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.map((team) => (
                      <SelectItem key={`home-${team.id}`} value={team.id.toString()}>
                        {team.club?.name} - {team.name}
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
                  disabled={filteredTeams.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Deplasman takımı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.map((team) => (
                      <SelectItem key={`away-${team.id}`} value={team.id.toString()}>
                        {team.club?.name} - {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeScore">Ev Sahibi Skoru</Label>
                <Input
                  id="homeScore"
                  name="homeScore"
                  type="number"
                  value={formData.homeScore}
                  onChange={handleChange}
                  min="0"
                  placeholder="Skor girilmemiş"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="awayScore">Deplasman Skoru</Label>
                <Input
                  id="awayScore"
                  name="awayScore"
                  type="number"
                  value={formData.awayScore}
                  onChange={handleChange}
                  min="0"
                  placeholder="Skor girilmemiş"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="matchSystemId">Maç Sistemi (Opsiyonel)</Label>
              <Select
                value={formData.matchSystemId}
                onValueChange={(value) => handleSelectChange("matchSystemId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Maç sistemi seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
                  {matchSystems.map((matchSystem) => (
                    <SelectItem key={matchSystem.id} value={matchSystem.id.toString()}>
                      {matchSystem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playgroundId">Saha (Opsiyonel)</Label>
              <Select
                value={formData.playgroundId}
                onValueChange={(value) => handleSelectChange("playgroundId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Saha seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
                  {playgrounds.map((playground) => (
                    <SelectItem key={playground.id} value={playground.id.toString()}>
                      {playground.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchDate">Maç Tarihi ve Saati</Label>
              <Input
                id="matchDate"
                name="matchDate"
                type="datetime-local"
                value={formData.matchDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Konum (Opsiyonel)</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/matches">
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

