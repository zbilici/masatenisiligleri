"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

export default function NewSeasonPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [season, setSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isActive: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!season.name || !season.startDate || !season.endDate) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(season),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Sezon oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Sezon başarıyla oluşturuldu.",
      })

      router.push("/admin/seasons")
    } catch (error) {
      console.error("Sezon oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Sezon oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSeason((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setSeason((prev) => ({ ...prev, isActive: checked }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/seasons">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Sezon</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sezon Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sezon Adı</Label>
              <Input id="name" name="name" value={season.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={season.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={season.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={season.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Aktif Sezon</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/seasons">
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

