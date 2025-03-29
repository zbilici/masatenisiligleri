"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Position {
  id: number
  name: string
  description: string | null
}

export default function EditPositionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [position, setPosition] = useState<Position | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await fetch(`/api/positions/${params.id}`)
        if (!response.ok) {
          throw new Error("Pozisyon yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setPosition(data)
      } catch (error) {
        console.error("Pozisyon getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Pozisyon yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosition()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!position) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/positions/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(position),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Pozisyon güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Pozisyon başarıyla güncellendi.",
      })

      router.push("/admin/positions")
    } catch (error) {
      console.error("Pozisyon güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Pozisyon güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPosition((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Pozisyon bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/positions">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Pozisyon Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pozisyon Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pozisyon Adı</Label>
              <Input id="name" name="name" value={position.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={position.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/positions">
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

