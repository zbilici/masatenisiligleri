"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

export default function NewStagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    order: 1,
    startDate: "",
    endDate: "",
    leagueId: params.id,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/stages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Etap oluşturulurken bir hata oluştu.")
      }

      toast({
        title: "Etap oluşturuldu",
        description: "Yeni etap başarıyla oluşturuldu.",
      })

      router.push(`/admin/leagues/${params.id}?tab=stages`)
    } catch (error) {
      console.error("Etap oluşturma hatası:", error)
      toast({
        title: "Etap oluşturulamadı",
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
        <h1 className="text-3xl font-bold tracking-tight">Yeni Etap Ekle</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Etap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Etap Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Örn: 1. Etap"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Sıra</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="1"
                required
                value={formData.order}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
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

