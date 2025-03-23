"use client"

import type React from "react"

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

interface Season {
  id: string
  name: string
}

interface Gender {
  id: string
  name: string
}

interface LeagueType {
  id: string
  name: string
  level: number
}

export default function NewLeaguePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [genders, setGenders] = useState<Gender[]>([])
  const [leagueTypes, setLeagueTypes] = useState<LeagueType[]>([])
  const [formData, setFormData] = useState({
    name: "",
    seasonId: "",
    genderId: "",
    leagueTypeId: "",
  })

  useEffect(() => {
    // Sezonları getir
    fetch("/api/seasons")
      .then((res) => res.json())
      .then((data) => setSeasons(data))
      .catch((err) => console.error("Sezonları getirme hatası:", err))

    // Cinsiyet kategorilerini getir
    fetch("/api/genders")
      .then((res) => res.json())
      .then((data) => setGenders(data))
      .catch((err) => console.error("Cinsiyet kategorilerini getirme hatası:", err))

    // Lig tiplerini getir
    fetch("/api/league-types")
      .then((res) => res.json())
      .then((data) => setLeagueTypes(data))
      .catch((err) => console.error("Lig tiplerini getirme hatası:", err))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Lig adını otomatik oluştur
  useEffect(() => {
    if (formData.seasonId && formData.genderId && formData.leagueTypeId) {
      const selectedSeason = seasons.find((s) => s.id === formData.seasonId)
      const selectedGender = genders.find((g) => g.id === formData.genderId)
      const selectedLeagueType = leagueTypes.find((lt) => lt.id === formData.leagueTypeId)

      if (selectedSeason && selectedGender && selectedLeagueType) {
        const autoName = `${selectedSeason.name} ${selectedGender.name} ${selectedLeagueType.name}`
        setFormData((prev) => ({ ...prev, name: autoName }))
      }
    }
  }, [formData.seasonId, formData.genderId, formData.leagueTypeId, seasons, genders, leagueTypes])

  // handleSubmit fonksiyonunu güncelleyelim
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/leagues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Önce yanıtın JSON olup olmadığını kontrol edelim
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Sunucudan geçersiz yanıt alındı. Lütfen daha sonra tekrar deneyin.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Lig oluşturulurken bir hata oluştu.")
      }

      toast({
        title: "Lig oluşturuldu",
        description: "Yeni lig başarıyla oluşturuldu.",
      })

      router.push("/admin/leagues")
    } catch (error) {
      console.error("Lig oluşturma hatası:", error)
      toast({
        title: "Lig oluşturulamadı",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Lig Ekle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Lig Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seasonId">Sezon</Label>
              <Select
                value={formData.seasonId}
                onValueChange={(value) => handleSelectChange("seasonId", value)}
                disabled={isLoading || seasons.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sezon seçin" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {seasons.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Önce bir sezon eklemelisiniz.{" "}
                  <Link href="/admin/seasons/new" className="text-primary hover:underline">
                    Sezon Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genderId">Cinsiyet Kategorisi</Label>
              <Select
                value={formData.genderId}
                onValueChange={(value) => handleSelectChange("genderId", value)}
                disabled={isLoading || genders.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender.id} value={gender.id}>
                      {gender.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {genders.length === 0 && (
                <p className="text-sm text-muted-foreground">Önce bir cinsiyet kategorisi eklemelisiniz.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="leagueTypeId">Lig Tipi</Label>
              <Select
                value={formData.leagueTypeId}
                onValueChange={(value) => handleSelectChange("leagueTypeId", value)}
                disabled={isLoading || leagueTypes.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {leagueTypes.map((leagueType) => (
                    <SelectItem key={leagueType.id} value={leagueType.id}>
                      {leagueType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {leagueTypes.length === 0 && (
                <p className="text-sm text-muted-foreground">Önce bir lig tipi eklemelisiniz.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Lig Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Lig adı"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Lig adı seçtiğiniz sezon, kategori ve lig tipine göre otomatik oluşturulur. İsterseniz
                değiştirebilirsiniz.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.seasonId || !formData.genderId || !formData.leagueTypeId}
            >
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

