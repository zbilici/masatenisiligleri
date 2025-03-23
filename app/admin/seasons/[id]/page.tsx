import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function SeasonDetailPage({ params }: { params: { id: string } }) {
  // Sezon detaylarını getir
  const season = await prisma.season.findUnique({
    where: {
      id: params.id,
    },
    include: {
      _count: {
        select: {
          leagues: true,
        },
      },
    },
  })

  if (!season) {
    notFound()
  }

  // Sezona ait ligleri getir
  const leagues = await prisma.league.findMany({
    where: {
      seasonId: season.id,
    },
    include: {
      gender: true,
      leagueType: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/seasons">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{season.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/seasons/${season.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Başlangıç Tarihi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{new Date(season.startDate).toLocaleDateString("tr-TR")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bitiş Tarihi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{new Date(season.endDate).toLocaleDateString("tr-TR")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Durum</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={season.isActive ? "default" : "secondary"}>{season.isActive ? "Aktif" : "Pasif"}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ligler ({season._count.leagues})</CardTitle>
        </CardHeader>
        <CardContent>
          {leagues.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {leagues.map((league) => (
                <Link
                  key={league.id}
                  href={`/admin/leagues/${league.id}`}
                  className="block p-4 border rounded-md hover:bg-muted transition-colors"
                >
                  <div className="font-medium">{league.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {league.gender.name} - {league.leagueType.name}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Bu sezona ait lig bulunmuyor.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

