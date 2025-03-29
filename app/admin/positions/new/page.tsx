"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

export default function NewPositionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [position, setPosition] = useState({
    name: "",
    description: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!position.name) {
      toast({
        title: "Hata",
        description: "Lütfen pozisyon adını girin.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(position),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Pozisyon oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Pozisyon başarıyla oluşturuldu.",
      })

      router.push("/admin/positions")
    } catch (error) {
      console.error("Pozisyon oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Pozisyon oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPosition((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/positions">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Pozisyon</h1>
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
                value={position.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/positions">
                <Button variant="outline">İptal</Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

