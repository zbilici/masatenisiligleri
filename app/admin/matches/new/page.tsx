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

export default function NewMatchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [match, setMatch] = useState({
    stageId: "",
    roundId: "",
    homeTeamId: "",
    awayTeamId: "",
    matchSystemId: "",
    playgroundId: "",
    matchDate: "",
    location: "",
  })
  const [stages, setStages] = useState<Stage[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([])
  const [matchSystems, setMatchSystems] = useState<MatchSystem[]>([])
  const [filteredRounds, setFilteredRounds] = useState<Round[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Takımları getir
        const teamsResponse = await fetch("/api/teams")
        if (!teamsResponse.ok) {
          throw new Error("Takımlar yüklenirken bir hata oluştu")
        }
        const teamsData = await teamsResponse.json()
        setTeams(teamsData)

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
  }, [toast])

  // Etap seçildiğinde turları filtrele
  useEffect(() => {
    if (match.stageId) {
      const filtered = rounds.filter((round) => round.stageId === Number.parseInt(match.stageId))
      setFilteredRounds(filtered)

      // Eğer seçili tur, filtrelenmiş turlarda yoksa, seçimi temizle
      if (match.roundId && !filtered.some((round) => round.id.toString() === match.roundId)) {
        setMatch((prev) => ({ ...prev, roundId: "" }))
      }

      // Etaba bağlı takımları filtrele
      const selectedStage = stages.find((stage) => stage.id.toString() === match.stageId)
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
          return false
        })

        setFilteredTeams(filtered)

        // Eğer seçili takımlar, filtrelenmiş takımlarda yoksa, seçimleri temizle
        if (match.homeTeamId && !filtered.some((team) => team.id.toString() === match.homeTeamId)) {
          setMatch((prev) => ({ ...prev, homeTeamId: "" }))
        }
        if (match.awayTeamId && !filtered.some((team) => team.id.toString() === match.awayTeamId)) {
          setMatch((prev) => ({ ...prev, awayTeamId: "" }))
        }
      }
    } else {
      setFilteredRounds([])
      setFilteredTeams([])
    }
  }, [match.stageId, rounds, stages, teams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!match.stageId || !match.homeTeamId || !match.awayTeamId || !match.matchDate) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    if (match.homeTeamId === match.awayTeamId) {
      toast({
        title: "Hata",
        description: "Ev sahibi ve deplasman takımları aynı olamaz.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId: Number.parseInt(match.stageId),
          roundId: match.roundId ? Number.parseInt(match.roundId) : null,
          homeTeamId: Number.parseInt(match.homeTeamId),
          awayTeamId: Number.parseInt(match.awayTeamId),
          matchSystemId:
            match.matchSystemId && match.matchSystemId !== "-1" ? Number.parseInt(match.matchSystemId) : null,
          playgroundId: match.playgroundId && match.playgroundId !== "-1" ? Number.parseInt(match.playgroundId) : null,
          matchDate: new Date(match.matchDate).toISOString(),
          location: match.location || null,
          status: "SCHEDULED",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Maç oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Maç başarıyla oluşturuldu.",
      })

      router.push("/admin/matches")
    } catch (error) {
      console.error("Maç oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Maç oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMatch((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setMatch((prev) => ({ ...prev, [name]: value }))
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
        <Link href="/admin/matches">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Maç</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maç Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stageId">Etap</Label>
              <Select value={match.stageId} onValueChange={(value) => handleSelectChange("stageId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Etap seçin" />
                </SelectTrigger>
                <SelectContent>
                  {stages.length > 0 ? (
                    stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name} - {stage.league?.name || stage.subLeague?.name || ""}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="-1" disabled>
                      Etap bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {stages.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Etap bulunamadı. Lütfen önce bir etap ekleyin.
                  <Link href="/admin/stages/new" className="ml-1 text-blue-500 hover:underline">
                    Etap Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roundId">Tur (Opsiyonel)</Label>
              <Select
                value={match.roundId}
                onValueChange={(value) => handleSelectChange("roundId", value)}
                disabled={!match.stageId || filteredRounds.length === 0}
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
                  value={match.homeTeamId}
                  onValueChange={(value) => handleSelectChange("homeTeamId", value)}
                  disabled={!match.stageId || filteredTeams.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ev sahibi takım seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map((team) => (
                        <SelectItem key={`home-${team.id}`} value={team.id.toString()}>
                          {team.club?.name} - {team.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="-1" disabled>
                        Takım bulunamadı
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awayTeamId">Deplasman Takımı</Label>
                <Select
                  value={match.awayTeamId}
                  onValueChange={(value) => handleSelectChange("awayTeamId", value)}
                  disabled={!match.stageId || filteredTeams.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Deplasman takımı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map((team) => (
                        <SelectItem key={`away-${team.id}`} value={team.id.toString()}>
                          {team.club?.name} - {team.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="-1" disabled>
                        Takım bulunamadı
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchSystemId">Maç Sistemi (Opsiyonel)</Label>
              <Select value={match.matchSystemId} onValueChange={(value) => handleSelectChange("matchSystemId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Maç sistemi seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
                  {matchSystems.length > 0 ? (
                    matchSystems.map((matchSystem) => (
                      <SelectItem key={matchSystem.id} value={matchSystem.id.toString()}>
                        {matchSystem.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="-2" disabled>
                      Maç sistemi bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playgroundId">Saha (Opsiyonel)</Label>
              <Select value={match.playgroundId} onValueChange={(value) => handleSelectChange("playgroundId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Saha seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Seçilmedi</SelectItem>
                  {playgrounds.length > 0 ? (
                    playgrounds.map((playground) => (
                      <SelectItem key={playground.id} value={playground.id.toString()}>
                        {playground.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="-2" disabled>
                      Saha bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {playgrounds.length === 0 && (
                <p className="text-sm text-yellow-500 mt-1">
                  Saha bulunamadı. Saha eklemek için önce Sahalar sayfasını oluşturmalısınız.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchDate">Maç Tarihi ve Saati</Label>
              <Input
                id="matchDate"
                name="matchDate"
                type="datetime-local"
                value={match.matchDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Konum (Opsiyonel)</Label>
              <Input id="location" name="location" value={match.location} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/matches">
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

