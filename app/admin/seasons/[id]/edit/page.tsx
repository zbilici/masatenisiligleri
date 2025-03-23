"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export default function EditSeasonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Season>({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    isActive: false,
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Sezon verilerini getir
    const fetchSeason = async () => {
      try {
        const response = await fetch(`/api/seasons/${id}`)

        if (!response.ok) {
          throw new Error("Sezon bilgileri alınamadı")
        }

        const season = await response.json()

        // Tarihleri input için uygun formata çevir (YYYY-MM-DD)
        const startDate = new Date(season.startDate).toISOString().split("T")[0]

        const endDate = new Date(season.endDate).toISOString().split("T")[0]

        setFormData({
          id: season.id,
          name: season.name,
          startDate,
          endDate,
          isActive: season.isActive,
        })
      } catch (error) {
        console.error("Sezon getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Sezon bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeason()
  }, [id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/seasons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Sezon güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Sezon güncellendi",
        description: "Sezon bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/seasons")
    } catch (error) {
      console.error("Sezon güncelleme hatası:", error)
      toast({
        title: "Sezon güncellenemedi",
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
        <h1 className="text-3xl font-bold tracking-tight">Sezon Düzenle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Sezon Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sezon Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Örn: 2024-2025 Sezonu"
                required
                value={formData.name}
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
                disabled={isLoading}
              />
              <Label htmlFor="isActive">Aktif Sezon</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

