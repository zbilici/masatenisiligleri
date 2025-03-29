"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

export default function NewPlaygroundPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [playground, setPlayground] = useState({
    name: "",
    address: "",
    city: "",
    capacity: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!playground.name) {
      toast({
        title: "Hata",
        description: "Lütfen saha adını girin.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/playgrounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playground),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Saha oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Saha başarıyla oluşturuldu.",
      })

      router.push("/admin/playgrounds")
    } catch (error) {
      console.error("Saha oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Saha oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPlayground((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/playgrounds">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Saha</h1>
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
              <Input id="address" name="address" value={playground.address} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <Input id="city" name="city" value={playground.city} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasite</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={playground.capacity}
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
                {isSaving ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

