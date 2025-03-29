"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Plus, Trash } from "lucide-react"

interface Club {
  id: number
  name: string
}

interface Team {
  id: number
  name: string
  tempId?: string
}

export default function ClubTeamsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [club, setClub] = useState<Club | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeams, setNewTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`/api/clubs/${params.id}`)
        if (!response.ok) {
          throw new Error("Kulüp yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setClub(data)
        setTeams(data.teams || [])
      } catch (error) {
        console.error("Kulüp getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Kulüp yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClub()
  }, [params.id, toast])

  const handleAddNewTeam = () => {
    const tempId = Date.now().toString()
    setNewTeams([...newTeams, { id: 0, name: "", tempId }])
  }

  const handleNewTeamChange = (tempId: string, name: string) => {
    setNewTeams(newTeams.map((team) => (team.tempId === tempId ? { ...team, name } : team)))
  }

  const handleRemoveNewTeam = (tempId: string) => {
    setNewTeams(newTeams.filter((team) => team.tempId !== tempId))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!club) return

    setIsSaving(true)

    try {
      // Yeni takımları ekle
      for (const team of newTeams) {
        if (team.name.trim()) {
          await fetch("/api/teams", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: team.name,
              clubId: Number.parseInt(params.id as string),
            }),
          })
        }
      }

      toast({
        title: "Başarılı",
        description: "Takımlar başarıyla güncellendi.",
      })

      router.push(`/admin/clubs/${params.id}`)
    } catch (error) {
      console.error("Takım güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Takımlar güncellenirken bir hata oluştu.",
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

  if (!club) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Kulüp bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/admin/clubs/${params.id}`}>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{club.name} - Takımlar</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Takımlar</CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <p className="text-muted-foreground">Bu kulübe ait takım bulunmuyor.</p>
          ) : (
            <div className="space-y-2">
              {teams.map((team) => (
                <div key={team.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{team.name}</p>
                    <Link href={`/admin/teams/${team.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Takım Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {newTeams.map((team) => (
              <div key={team.tempId} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={team.name}
                    onChange={(e) => handleNewTeamChange(team.tempId!, e.target.value)}
                    placeholder="Takım adı"
                  />
                </div>
                <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveNewTeam(team.tempId!)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddNewTeam}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Takım Ekle
            </Button>

            <div className="flex justify-end gap-2">
              <Link href={`/admin/clubs/${params.id}`}>
                <Button variant="outline">İptal</Button>
              </Link>
              <Button type="submit" disabled={isSaving || newTeams.length === 0}>
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

