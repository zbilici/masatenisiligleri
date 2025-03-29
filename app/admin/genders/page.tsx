"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Edit, Trash } from "lucide-react"

interface Gender {
  id: number
  name: string
  _count?: {
    leagues: number
  }
}

export default function GendersPage() {
  const { toast } = useToast()
  const [genders, setGenders] = useState<Gender[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await fetch("/api/genders")
        if (!response.ok) {
          throw new Error("Cinsiyet kategorileri yüklenirken bir hata oluştu")
        }
        const data = await response.json()
        setGenders(data)
      } catch (error) {
        console.error("Cinsiyet kategorilerini getirme hatası:", error)
        toast({
          title: "Hata",
          description: "Cinsiyet kategorileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGenders()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Bu cinsiyet kategorisini silmek istediğinize emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/genders/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Cinsiyet kategorisi silinemedi")
      }

      setGenders((prev) => prev.filter((gender) => gender.id !== id))

      toast({
        title: "Cinsiyet kategorisi silindi",
        description: "Cinsiyet kategorisi başarıyla silindi.",
      })
    } catch (error) {
      console.error("Cinsiyet kategorisi silme hatası:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Cinsiyet kategorisi silinirken bir hata oluştu.",
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
        <h1 className="text-3xl font-bold tracking-tight">Cinsiyet Kategorileri</h1>
        <Link href="/admin/genders/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Kategori
          </Button>
        </Link>
      </div>

      {genders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p>Henüz cinsiyet kategorisi bulunmuyor.</p>
              <Link href="/admin/genders/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Kategori Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tüm Cinsiyet Kategorileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Kategori Adı</th>
                    <th className="text-left py-3 px-4">Lig Sayısı</th>
                    <th className="text-right py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {genders.map((gender) => (
                    <tr key={gender.id} className="border-b">
                      <td className="py-3 px-4">{gender.name}</td>
                      <td className="py-3 px-4">{gender._count?.leagues || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/genders/${gender.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(gender.id)}>
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

