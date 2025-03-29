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

export default function NewGenderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [gender, setGender] = useState({
    name: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!gender.name) {
      toast({
        title: "Hata",
        description: "Lütfen kategori adını girin.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/genders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gender),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Cinsiyet kategorisi oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Cinsiyet kategorisi başarıyla oluşturuldu.",
      })

      router.push("/admin/genders")
    } catch (error) {
      console.error("Cinsiyet kategorisi oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Cinsiyet kategorisi oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGender((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/genders">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Cinsiyet Kategorisi</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kategori Adı</Label>
              <Input id="name" name="name" value={gender.name} onChange={handleChange} required />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/genders">
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

