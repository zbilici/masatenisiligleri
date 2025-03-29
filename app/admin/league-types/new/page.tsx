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

export default function NewLeagueTypePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [leagueType, setLeagueType] = useState({
    name: "",
    level: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!leagueType.name || !leagueType.level) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/league-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leagueType),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Lig tipi oluşturulurken bir hata oluştu")
      }

      toast({
        title: "Başarılı",
        description: "Lig tipi başarıyla oluşturuldu.",
      })

      router.push("/admin/league-types")
    } catch (error) {
      console.error("Lig tipi oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Lig tipi oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLeagueType((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/league-types">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Lig Tipi</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lig Tipi Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Lig Tipi Adı</Label>
              <Input id="name" name="name" value={leagueType.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Seviye</Label>
              <Input
                id="level"
                name="level"
                type="number"
                value={leagueType.level}
                onChange={handleChange}
                min="1"
                required
              />
              <p className="text-sm text-muted-foreground">
                Seviye, lig tiplerinin sıralanması için kullanılır. Örneğin: Süper Lig = 1, 1. Lig = 2, vb.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/admin/league-types">
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

