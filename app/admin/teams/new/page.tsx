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

interface Club {
  id: string
  name: string
}

interface League {
  id: string
  name: string
  season: {
    name: string
  }
}

export default function NewTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clubs, setClubs] = useState<Club[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [formData, setFormData] = useState({
    name: "",
    clubId: "",
    leagueId: "",
  })

  useEffect(() => {
    // Kulüpleri getir
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error("Kulüpleri getirme hatası:", err))

    // Ligleri getir
    fetch("/api/leagues")
      .then((res) => res.json())
      .then((data) => setLeagues(data))
      .catch((err) => console.error("Ligleri getirme hatası:", err))
  }, [])

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
      const response = await fetch("/api/teams", {
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
        throw new Error(data.error || "Takım oluşturulurken bir hata oluştu.")
      }

      toast({
        title: "Takım oluşturuldu",
        description: "Yeni takım başarıyla oluşturuldu.",
      })

      router.push("/admin/teams")
    } catch (error) {
      console.error("Takım oluşturma hatası:", error)
      toast({
        title: "Takım oluşturulamadı",
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
        <h1 className="text-3xl font-bold tracking-tight">Yeni Takım Ekle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Takım Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clubId">Kulüp</Label>
              <Select
                value={formData.clubId}
                onValueChange={(value) => handleSelectChange("clubId", value)}
                disabled={isLoading || clubs.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kulüp seçin" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clubs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Önce bir kulüp eklemelisiniz.{" "}
                  <Link href="/admin/clubs/new" className="text-primary hover:underline">
                    Kulüp Ekle
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Takım Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Takım adı"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leagueId">Lig (Opsiyonel)</Label>
              <Select
                value={formData.leagueId}
                onValueChange={(value) => handleSelectChange("leagueId", value)}
                disabled={isLoading || leagues.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Lig seçilmedi</SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Takımın katılacağı ligi seçebilirsiniz. Daha sonra da ekleyebilirsiniz.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || !formData.clubId || !formData.name}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

