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

interface Gender {
  id: number
  name: string
}

export default function EditGenderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [gender, setGender] = useState<Gender | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await fetch(`/api/genders/${params.id}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Cinsiyet kategorisi bilgileri alınamadı")
        }
        const data = await response.json()
        setGender(data)
      } catch (error) {
        console.error("Cinsiyet kategorisi getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Cinsiyet kategorisi bilgileri alınamadı",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGender()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!gender) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/genders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gender),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Cinsiyet kategorisi güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Cinsiyet kategorisi başarıyla güncellendi.",
      })

      router.push("/admin/genders")
    } catch (error) {
      console.error("Cinsiyet kategorisi güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Cinsiyet kategorisi güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGender((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!gender) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Cinsiyet kategorisi bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/genders">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Cinsiyet Kategorisi Düzenle</h1>
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
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

