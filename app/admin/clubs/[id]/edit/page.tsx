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

interface Club {
  id: number
  name: string
  logo: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
}

export default function EditClubPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [club, setClub] = useState<Club | null>(null)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!club) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/clubs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(club),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Kulüp güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Kulüp başarıyla güncellendi.",
      })

      router.push(`/admin/clubs/${params.id}`)
    } catch (error) {
      console.error("Kulüp güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Kulüp güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClub((prev) => (prev ? { ...prev, [name]: value } : null))
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
        <h1 className="text-3xl font-bold tracking-tight">Kulüp Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kulüp Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kulüp Adı</Label>
              <Input id="name" name="name" value={club.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={club.logo || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input id="address" name="address" value={club.address || ""} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" value={club.phone || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" name="email" type="email" value={club.email || ""} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={club.website || ""}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Link href={`/admin/clubs/${params.id}`}>
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

