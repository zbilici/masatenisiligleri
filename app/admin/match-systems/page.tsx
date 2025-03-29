"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface MatchSystem {
  id: number
  name: string
  type: string
  totalMatches: number
  singlesCount: number
  doublesCount: number
  _count?: {
    leagues: number
    subLeagues: number
    matches: number
  }
}

export default function MatchSystemsPage() {
  const { toast } = useToast()
  const [matchSystems, setMatchSystems] = useState<MatchSystem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMatchSystems = async () => {
      try {
        const response = await fetch("/api/match-systems")
        if (!response.ok) {
          throw new Error("Maç sistemleri yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setMatchSystems(data)
      } catch (error) {
        console.error("Maç sistemlerini getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Maç sistemleri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatchSystems()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu maç sistemini silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/match-systems/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Maç sistemi silinemedi")
      }

      setMatchSystems((prev) => prev.filter((matchSystem) => matchSystem.id !== id))

      toast({
        title: "Maç sistemi silindi",
        description: "Maç sistemi başarıyla silindi.",
      })
    } catch (error) {
      console.error("Maç sistemi silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Maç sistemi silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Maç Sistemleri</h1>
        <Link href="/admin/match-systems/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Maç Sistemi
          </Button>
        </Link>
      </div>

      {matchSystems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz maç sistemi bulunmuyor.</p>
              <Link href="/admin/match-systems/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Maç Sistemi Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Maç Sistemleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sistem Adı</th>
                    <th className="text-left py-3 px-4">Tip</th>
                    <th className="text-left py-3 px-4">Toplam Maç</th>
                    <th className="text-left py-3 px-4">Tekli Maç</th>
                    <th className="text-left py-3 px-4">Çiftli Maç</th>
                    <th className="text-left py-3 px-4">Kullanım</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {matchSystems.map((matchSystem) => (
                    <tr key={matchSystem.id} className="border-b">
                      <td className="py-3 px-4">{matchSystem.name}</td>
                      <td className="py-3 px-4">{matchSystem.type === "PREDEFINED" ? "Öntanımlı" : "Özel"}</td>
                      <td className="py-3 px-4">{matchSystem.totalMatches}</td>
                      <td className="py-3 px-4">{matchSystem.singlesCount}</td>
                      <td className="py-3 px-4">{matchSystem.doublesCount}</td>
                      <td className="py-3 px-4">
                        {(matchSystem._count?.leagues || 0) +
                          (matchSystem._count?.subLeagues || 0) +
                          (matchSystem._count?.matches || 0)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/match-systems/${matchSystem.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(matchSystem.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

