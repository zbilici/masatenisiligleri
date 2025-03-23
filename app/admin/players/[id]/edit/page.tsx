"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Player {
  id: string
  firstName: string
  lastName: string
  birthDate: string | null
  gender: string
  licenseNumber: string | null
  photo: string | null
}

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Player>({
    id: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    licenseNumber: "",
    photo: "",
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Oyuncu verilerini getir
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`/api/players/${id}`)

        if (!response.ok) {
          throw new Error("Oyuncu bilgileri alınamadı")
        }

        const player = await response.json()

        // Tarihi input için uygun formata çevir (YYYY-MM-DD)
        const birthDate = player.birthDate ? new Date(player.birthDate).toISOString().split("T")[0] : null

        setFormData({
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          birthDate,
          gender: player.gender,
          licenseNumber: player.licenseNumber || "",
          photo: player.photo || "",
        })
      } catch (error) {
        console.error("Oyuncu getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Oyuncu bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayer()
  }, [id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/players/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Oyuncu güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Oyuncu güncellendi",
        description: "Oyuncu bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/players")
    } catch (error) {
      console.error("Oyuncu güncelleme hatası:", error)
      toast({
        title: "Oyuncu güncellenemedi",
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
        <h1 className="text-3xl font-bold tracking-tight">Oyuncu Düzenle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Oyuncu Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Adı</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Adı"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Soyadı</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Soyadı"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Doğum Tarihi</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate || ""}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Cinsiyet</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cinsiyet seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Erkek">Erkek</SelectItem>
                    <SelectItem value="Kadın">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Lisans Numarası</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                placeholder="Lisans numarası (opsiyonel)"
                value={formData.licenseNumber || ""}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Fotoğraf URL</Label>
              <Input
                id="photo"
                name="photo"
                placeholder="Fotoğraf URL (opsiyonel)"
                value={formData.photo || ""}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || !formData.firstName || !formData.lastName || !formData.gender}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

