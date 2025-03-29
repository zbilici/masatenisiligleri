"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Team {
  id: string
  name: string
  club: {
    name: string
  }
  selected?: boolean
}

interface SubLeague {
  id: string
  name: string
  league: {
    name: string
  }
  teams: Team[]
}

export default function SubLeagueTeamsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [subLeague, setSubLeague] = useState<SubLeague | null>(null)
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Alt ligi getir
        const subLeagueResponse = await fetch(`/api/sub-leagues/${params.id}`)
        if (!subLeagueResponse.ok) {
          throw new Error("Alt lig yüklenirken bir hata oluştu")
        }
        const subLeagueData = await subLeagueResponse.json()

        // Tüm takımları getir
        const teamsResponse = await fetch("/api/teams")
        if (!teamsResponse.ok) {
          throw new Error("Takımlar yüklenirken bir hata oluştu")
        }
        const teamsData = await teamsResponse.json()

        // Alt lige ait takımları işaretle
        const subLeagueTeamIds = new Set(subLeagueData.teams.map((team: Team) => team.id))
        const teamsWithSelection = teamsData.map((team: Team) => ({
          ...team,
          selected: subLeagueTeamIds.has(team.id),
        }))

        setSubLeague(subLeagueData)
        setAllTeams(teamsWithSelection)
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

  const handleTeamToggle = (teamId: string) => {
    setAllTeams((prevTeams) =>
      prevTeams.map((team) => (team.id === teamId ? { ...team, selected: !team.selected } : team)),
    )
  }

  const handleSave = async () => {
    if (!subLeague) return

    setIsSaving(true)

    try {
      const selectedTeamIds = allTeams.filter((team) => team.selected).map((team) => team.id)

      const response = await fetch(`/api/sub-leagues/${params.id}/teams`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamIds: selectedTeamIds }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Takımlar kaydedilirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Takımlar başarıyla kaydedildi.",
      })

      router.push("/admin/sub-leagues")
    } catch (error) {
      console.error("Takımları kaydetme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Takımlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!subLeague) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Alt lig bulunamadı.</p>
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
        <h1 className="text-3xl font-bold tracking-tight">{subLeague.name} - Takımlar</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Takımları Seçin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {subLeague.league.name} ligindeki takımlardan, {subLeague.name} alt ligine dahil olacak takımları seçin.
            </p>

            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Seç</th>
                    <th className="text-left py-3 px-4">Takım Adı</th>
                    <th className="text-left py-3 px-4">Kulüp</th>
                  </tr>
                </thead>
                <tbody>
                  {allTeams.map((team) => (
                    <tr key={team.id} className="border-b">
                      <td className="py-3 px-4">
                        <Checkbox checked={team.selected} onCheckedChange={() => handleTeamToggle(team.id)} />
                      </td>
                      <td className="py-3 px-4">{team.name}</td>
                      <td className="py-3 px-4">{team.club.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/sub-leagues">
                <Button variant="outline">İptal</Button>
              </Link>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

