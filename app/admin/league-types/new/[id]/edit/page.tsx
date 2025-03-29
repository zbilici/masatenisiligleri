"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface LeagueType {
  id: number
  name: string
  level: number
}

export default function EditLeagueTypePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [leagueType, setLeagueType] = useState<LeagueType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchLeagueType = async () => {
      try {
        const response = await fetch(`/api/league-types/${params.id}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Lig tipi bilgileri alınamadı")
        }
        const data = await response.json()
        setLeagueType(data)
      } catch (error) {
        console.error("Lig tipi getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Lig tipi bilgileri alınamadı",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeagueType()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!leagueType) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/league-types/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leagueType),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Lig tipi güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Lig tipi başarıyla güncellendi.",
      })

      router.push("/admin/league-types")
    } catch (error) {
      console.error("Lig tipi güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Lig tipi güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLeagueType((prev) => (prev ? { ...prev, [name]: name === "level" ? Number.parseInt(value) : value } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!leagueType) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Lig tipi bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/league-types">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Lig Tipi Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lig Tipi Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Lig Tipi Adı</Label>
              <Input id="name" name="name" value={leagueType.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Seviye</Label>
              <Input
                id="level"
                name="level"
                type="number"
                value={leagueType.level}
                onChange={handleChange}
                min="1"
                required
              />
              <p className="text-sm text-muted-foreground">
                Seviye, lig tiplerinin sıralanması için kullanılır. Örneğin: Süper Lig = 1, 1. Lig = 2, vb.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/league-types">
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

