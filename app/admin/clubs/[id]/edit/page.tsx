"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Club {
  id: string
  name: string
  logo: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
}

export default function EditClubPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Club>({
    id: "",
    name: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  })

  // React.use() ile params.id'yi çözelim
  const id = React.use(params).id

  useEffect(() => {
    // Kulüp verilerini getir
    const fetchClub = async () => {
      try {
        const response = await fetch(`/api/clubs/${id}`)

        if (!response.ok) {
          throw new Error("Kulüp bilgileri alınamadı")
        }

        const club = await response.json()

        setFormData({
          id: club.id,
          name: club.name,
          logo: club.logo || "",
          address: club.address || "",
          phone: club.phone || "",
          email: club.email || "",
          website: club.website || "",
        })
      } catch (error) {
        console.error("Kulüp getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Kulüp bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClub()
  }, [id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/clubs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Kulüp güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Kulüp güncellendi",
        description: "Kulüp bilgileri başarıyla güncellendi.",
      })

      router.push("/admin/clubs")
    } catch (error) {
      console.error("Kulüp güncelleme hatası:", error)
      toast({
        title: "Kulüp güncellenemedi",
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
        <h1 className="text-3xl font-bold tracking-tight">Kulüp Düzenle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Kulüp Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kulüp Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Kulüp adı"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                placeholder="Logo URL (opsiyonel)"
                value={formData.logo || ""}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Adres (opsiyonel)"
                value={formData.address || ""}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Telefon (opsiyonel)"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-posta (opsiyonel)"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Web Sitesi</Label>
              <Input
                id="website"
                name="website"
                placeholder="Web sitesi (opsiyonel)"
                value={formData.website || ""}
                onChange={handleChange}
                disabled={isLoading}
              />
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

