"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function NewRoundPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [round, setRound] = useState({
    name: "",
    order: "",
    stageId: "",
    startDate: "",
    endDate: "",
  })
  const [stages, setStages] = useState<Stage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await fetch("/api/stages")
        if (!response.ok) {
          throw new Error("Etaplar yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setStages(data)
      } catch (error) {
        console.error("Etapları getirme hatası:", error)
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Etaplar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStages()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!round.name || !round.stageId || !round.startDate || !round.endDate) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/rounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(round),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Tur oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Tur başarıyla oluşturuldu.",
      })

      router.push("/admin/rounds")
    } catch (error) {
      console.error("Tur oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Tur oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRound((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setRound((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Yükleniyor...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Yeni Tur</h1>
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
              <Select value={round.stageId} onValueChange={(value) => handleSelectChange("stageId", value)}>
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
                {isSaving ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

