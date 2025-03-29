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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface MatchSystem {
  id: number
  name: string
  type: string
  totalMatches: number
  singlesCount: number
  doublesCount: number
  matchOrder: string
  description: string | null
}

export default function EditMatchSystemPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [matchSystem, setMatchSystem] = useState<MatchSystem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchMatchSystem = async () => {
      try {
        const response = await fetch(`/api/match-systems/${params.id}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Maç sistemi bilgileri alınamadı")
        }
        const data = await response.json()
        setMatchSystem(data)
      } catch (error) {
        console.error("Maç sistemi getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Maç sistemi bilgileri alınamadı",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatchSystem()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!matchSystem) return

    // Toplam maç sayısı kontrolü
    const totalMatches = matchSystem.totalMatches
    const singlesCount = matchSystem.singlesCount
    const doublesCount = matchSystem.doublesCount

    if (singlesCount + doublesCount !== totalMatches) {
      toast({
        title: "Hata",
        description: "Tekli ve çiftli maç sayıları toplamı, toplam maç sayısına eşit olmalıdır.",
        variant: "destructive",
      })
      return
    }

    // Maç sırası kontrolü
    try {
      const matchOrderArray = JSON.parse(matchSystem.matchOrder)
      if (!Array.isArray(matchOrderArray) || matchOrderArray.length !== totalMatches) {
        toast({
          title: "Hata",
          description: "Maç sırası, toplam maç sayısı kadar öğe içeren bir dizi olmalıdır.",
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Maç sırası geçerli bir JSON dizisi olmalıdır.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/match-systems/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchSystem),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Maç sistemi güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Maç sistemi başarıyla güncellendi.",
      })

      router.push("/admin/match-systems")
    } catch (error) {
      console.error("Maç sistemi güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Maç sistemi güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMatchSystem((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "totalMatches" || name === "singlesCount" || name === "doublesCount"
                ? Number.parseInt(value)
                : value,
          }
        : null,
    )
  }

  const handleSelectChange = (name: string, value: string) => {
    setMatchSystem((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!matchSystem) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Maç sistemi bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/match-systems">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Maç Sistemi Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maç Sistemi Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sistem Adı</Label>
              <Input id="name" name="name" value={matchSystem.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Sistem Tipi</Label>
              <Select value={matchSystem.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sistem tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREDEFINED">Öntanımlı</SelectItem>
                  <SelectItem value="CUSTOM">Özel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalMatches">Toplam Maç Sayısı</Label>
                <Input
                  id="totalMatches"
                  name="totalMatches"
                  type="number"
                  value={matchSystem.totalMatches}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="singlesCount">Tekli Maç Sayısı</Label>
                <Input
                  id="singlesCount"
                  name="singlesCount"
                  type="number"
                  value={matchSystem.singlesCount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doublesCount">Çiftli Maç Sayısı</Label>
                <Input
                  id="doublesCount"
                  name="doublesCount"
                  type="number"
                  value={matchSystem.doublesCount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchOrder">Maç Sırası (JSON Dizisi)</Label>
              <Input
                id="matchOrder"
                name="matchOrder"
                value={matchSystem.matchOrder}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Örnek: ["S1", "S2", "D1", "S3", "S4"] (S: Tekli, D: Çiftli)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={matchSystem.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/match-systems">
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

