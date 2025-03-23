"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface League {
  id: string
  name: string
}

interface Stage {
  id: string
  name: string
  order: number
  startDate: string
  endDate: string
  leagueId: string
}

export default function EditStagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [leagues, setLeagues] = useState<League[]>([])
  const [formData, setFormData] = useState<Stage>({
    id: "",
    name: "",
    order: 1,
    startDate: "",
    endDate: "",
    leagueId: "",
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Etap verilerini getir
    const fetchStage = async () => {
      try {
        const response = await fetch(`/api/stages/${id}`)

        if (!response.ok) {
          throw new Error("Etap bilgileri alınamadı")
        }

        const stage = await response.json()

        // Tarihleri input için uygun formata çevir (YYYY-MM-DD)
        const startDate = new Date(stage.startDate).toISOString().split("T")[0]

        const endDate = new Date(stage.endDate).toISOString().split("T")[0]

        setFormData({
          id: stage.id,
          name: stage.name,
          order: stage.order,
          startDate,
          endDate,
          leagueId: stage.leagueId,
        })
      } catch (error) {
        console.error("Etap getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Etap bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }

    // Ligleri getir
    const fetchLeagues = async () => {
      try {
        const response = await fetch("/api/leagues")
        const data = await response.json()
        setLeagues(data)
      } catch (err) {
        console.error("Ligleri getirme hatası:", err)
      }
    }

    Promise.all([fetchStage(), fetchLeagues()])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))
  }, [id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/stages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Etap güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Etap güncellendi",
        description: "Etap bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/stages")
    } catch (error) {
      console.error("Etap güncelleme hatası:", error)
      toast({
        title: "Etap güncellenemedi",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Etap Düzenle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Etap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leagueId">Lig</Label>
              <Select
                value={formData.leagueId}
                onValueChange={(value) => handleSelectChange("leagueId", value)}
                disabled={isLoading || leagues.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {leagues.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Önce bir lig eklemelisiniz.{" "}
                  <Link href="/admin/leagues/new" className="text-primary hover:underline">
                    Lig Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Etap Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Örn: 1. Etap"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Sıra</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="1"
                required
                value={formData.order}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || !formData.leagueId || !formData.name}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

