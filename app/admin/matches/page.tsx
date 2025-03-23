import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/db"

export default async function MatchesPage() {
  // Tüm maçları getir
  const matches = await prisma.match.findMany({
    include: {
      stage: {
        include: {
          league: true,
        },
      },
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
    orderBy: [{ matchDate: "desc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Maçlar</h1>
        <Link href="/admin/matches/new">
          <Button>Yeni Maç Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Maçlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Lig / Etap</TableHead>
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
                  <TableCell>
                    <div>{match.stage.league.name}</div>
                    <div className="text-sm text-muted-foreground">{match.stage.name}</div>
                  </TableCell>
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
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/matches/${match.id}`}>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                      <Link href={`/admin/matches/${match.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {matches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Henüz maç bulunmuyor. Yeni bir maç ekleyin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

