"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface Stage {
  id: number
  name: string
  league?: {
    name: string
  } | null
  subLeague?: {
    name: string
  } | null
}

interface Round {
  id: number
  name: string
  order: number
  stageId: number
  startDate: string
  endDate: string
}

export default function EditRoundPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [round, setRound] = useState<Round | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tur bilgilerini getir
        const roundResponse = await fetch(`/api/rounds/${params.id}`)
        if (!roundResponse.ok) {
          throw new Error("Tur yüklenirken bir hata oluştu")
        }
        const roundData = await roundResponse.json()

        // Etapları getir
        const stagesResponse = await fetch("/api/stages")
        if (!stagesResponse.ok) {
          throw new Error("Etaplar yüklenirken bir hata oluştu")
        }
        const stagesData = await stagesResponse.json()

        // Tarih formatını düzelt
        const formattedRound = {
          ...roundData,
          startDate: new Date(roundData.startDate).toISOString().split("T")[0],
          endDate: new Date(roundData.endDate).toISOString().split("T")[0],
        }

        setRound(formattedRound)
        setStages(stagesData)
      } catch (error) {
        console.error("Veri getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Veriler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!round) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/rounds/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(round),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Tur güncellenirken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Tur başarıyla güncellendi.",
      })

      router.push("/admin/rounds")
    } catch (error) {
      console.error("Tur güncelleme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Tur güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRound((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    setRound((prev) => (prev ? { ...prev, [name]: Number.parseInt(value) } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!round) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Tur bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/rounds">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Tur Düzenle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tur Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tur Adı</Label>
              <Input id="name" name="name" value={round.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Sıra</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={round.order}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stageId">Etap</Label>
              <Select value={round.stageId.toString()} onValueChange={(value) => handleSelectChange("stageId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Etap seçin" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id.toString()}>
                      {stage.name} - {stage.league?.name || stage.subLeague?.name || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={round.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input id="endDate" name="endDate" type="date" value={round.endDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/rounds">
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

