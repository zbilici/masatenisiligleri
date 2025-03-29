import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Edit } from "lucide-react"
import { prisma } from "@/lib/prisma"

interface ClubDetailPageProps {
  params: {
    id: string
  }
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  // Kulüp detaylarını getir
  const club = await prisma.club.findUnique({
    where: {
      id: Number.parseInt(params.id), // String'i Int'e dönüştür
    },
    include: {
      teams: true,
      _count: {
        select: {
          teams: true,
        },
      },
    },
  })

  if (!club) {
    return (
      <div className="flex items-center justify-center h-48">
        <p>Kulüp bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/clubs">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{club.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kulüp Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {club.logo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Logo</p>
                  <img
                    src={club.logo || "/placeholder.svg"}
                    alt={club.name}
                    className="mt-2 max-w-full h-auto max-h-64 rounded-md"
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Adres</p>
                <p>{club.address || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                  <p>{club.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">E-posta</p>
                  <p>{club.email || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p>
                  {club.website ? (
                    <a
                      href={club.website.startsWith("http") ? club.website : `http://${club.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {club.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Takımlar ({club._count.teams})</CardTitle>
            <Link href={`/admin/clubs/${club.id}/teams`}>
              <Button variant="outline" size="sm">
                Takımları Yönet
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {club.teams.length === 0 ? (
              <p className="text-muted-foreground">Bu kulübe ait takım bulunmuyor.</p>
            ) : (
              <div className="space-y-2">
                {club.teams.map((team) => (
                  <div key={team.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{team.name}</p>
                      <Link href={`/admin/teams/${team.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Link href={`/admin/clubs/${club.id}/edit`}>
          <Button>Düzenle</Button>
        </Link>
      </div>
    </div>
  )
}

