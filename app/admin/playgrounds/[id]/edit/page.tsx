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

interface Playground {
  id: number
  name: string
  address: string | null
  city: string | null
  capacity: number | null
}

export default function EditPlaygroundPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [playground, setPlayground] = useState<Playground | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchPlayground = async () => {
      try {
        const response = await fetch(`/api/playgrounds/${params.id}`)
        if (!response.ok) {
          throw new Error("Saha yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setPlayground(data)
      } catch (error) {
        console.error("Saha getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Saha yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayground()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!playground) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/playgrounds/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playground),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Saha güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Saha başarıyla güncellendi.",
      })

      router.push("/admin/playgrounds")
    } catch (error) {
      console.error("Saha güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Saha güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPlayground((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!playground) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Saha bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/playgrounds">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Saha Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saha Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Saha Adı</Label>
              <Input id="name" name="name" value={playground.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input id="address" name="address" value={playground.address || ""} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <Input id="city" name="city" value={playground.city || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasite</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={playground.capacity || ""}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/playgrounds">
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

