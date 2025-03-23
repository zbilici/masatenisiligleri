import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit, Plus, Calendar } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function StageDetailPage({ params }: { params: { id: string } }) {
  // Etap detaylarını getir
  const stage = await prisma.stage.findUnique({
    where: {
      id: params.id,
    },
    include: {
      league: {
        include: {
          season: true,
          gender: true,
          leagueType: true,
        },
      },
    },
  })

  if (!stage) {
    notFound()
  }

  // Etaba ait maçları getir
  const matches = await prisma.match.findMany({
    where: {
      stageId: stage.id,
    },
    include: {
      homeTeam: {
        include: {
          club: true,
        },
      },
      awayTeam: {
        include: {
          club: true,
        },
      },
      _count: {
        select: {
          matchScores: true,
        },
      },
    },
    orderBy: {
      matchDate: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/stages">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{stage.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/stages/${stage.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lig</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/admin/leagues/${stage.league.id}`} className="text-primary hover:underline">
              {stage.league.name}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Başlangıç Tarihi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(stage.startDate).toLocaleDateString("tr-TR")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bitiş Tarihi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(stage.endDate).toLocaleDateString("tr-TR")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Maçlar ({matches.length})</CardTitle>
          <Button size="sm" asChild>
            <Link href={`/admin/matches/new?stageId=${stage.id}`}>
              <Plus className="h-4 w-4 mr-2" />
              Maç Ekle
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {matches.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Ev Sahibi</TableHead>
                  <TableHead>Deplasman</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-center">Skorlar</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{new Date(match.matchDate).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell className="font-medium">{match.homeTeam.name}</TableCell>
                    <TableCell className="font-medium">{match.awayTeam.name}</TableCell>
                    <TableCell>
                      <Badge variant={match.status === "COMPLETED" ? "default" : "secondary"}>
                        {match.status === "COMPLETED"
                          ? "Tamamlandı"
                          : match.status === "CANCELLED"
                            ? "İptal Edildi"
                            : "Planlandı"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{match._count.matchScores}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/matches/${match.id}`}>Görüntüle</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Bu etaba ait maç bulunmuyor.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

