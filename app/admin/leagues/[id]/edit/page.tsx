"use client"

import React, { useState, useEffect } from "react"

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

interface League {
  id: string
  name: string
  seasonId: string
  genderId: string
  leagueTypeId: string
}

export default function EditLeaguePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [genders, setGenders] = useState<Gender[]>([])
  const [leagueTypes, setLeagueTypes] = useState<LeagueType[]>([])
  const [formData, setFormData] = useState<League>({
    id: "",
    name: "",
    seasonId: "",
    genderId: "",
    leagueTypeId: "",
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Lig verilerini getir
    const fetchLeague = async () => {
      try {
        const response = await fetch(`/api/leagues/${id}`)

        if (!response.ok) {
          throw new Error("Lig bilgileri alınamadı")
        }

        const league = await response.json()

        setFormData({
          id: league.id,
          name: league.name,
          seasonId: league.seasonId,
          genderId: league.genderId,
          leagueTypeId: league.leagueTypeId,
        })
      } catch (error) {
        console.error("Lig getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Lig bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }

    // Sezonları getir
    const fetchSeasons = async () => {
      try {
        const response = await fetch("/api/seasons")
        const data = await response.json()
        setSeasons(data)
      } catch (err) {
        console.error("Sezonları getirme hatası:", err)
      }
    }

    // Cinsiyet kategorilerini getir
    const fetchGenders = async () => {
      try {
        const response = await fetch("/api/genders")
        const data = await response.json()
        setGenders(data)
      } catch (err) {
        console.error("Cinsiyet kategorilerini getirme hatası:", err)
      }
    }

    // Lig tiplerini getir
    const fetchLeagueTypes = async () => {
      try {
        const response = await fetch("/api/league-types")
        const data = await response.json()
        setLeagueTypes(data)
      } catch (err) {
        console.error("Lig tiplerini getirme hatası:", err)
      }
    }

    Promise.all([fetchLeague(), fetchSeasons(), fetchGenders(), fetchLeagueTypes()])
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))
  }, [id, toast])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/leagues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Lig güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Lig güncellendi",
        description: "Lig bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/leagues")
    } catch (error) {
      console.error("Lig güncelleme hatası:", error)
      toast({
        title: "Lig güncellenemedi",
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
        <h1 className="text-3xl font-bold tracking-tight">Lig Düzenle</h1>
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

