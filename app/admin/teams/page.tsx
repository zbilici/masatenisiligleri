import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/db"

export default async function TeamsPage() {
  // Tüm takımları getir
  const teams = await prisma.team.findMany({
    include: {
      club: true,
      league: {
        include: {
          season: true,
        },
      },
      _count: {
        select: {
          playerTeams: true,
        },
      },
    },
    orderBy: [{ clubId: "asc" }, { name: "asc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Takımlar</h1>
        <Link href="/admin/teams/new">
          <Button>Yeni Takım Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Takımlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Takım Adı</TableHead>
                <TableHead>Kulüp</TableHead>
                <TableHead>Lig</TableHead>
                <TableHead className="text-center">Oyuncular</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.club.name}</TableCell>
                  <TableCell>
                    {team.league ? (
                      <Badge variant="outline">{team.league.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Lig yok</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{team._count.playerTeams}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/teams/${team.id}`}>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                      <Link href={`/admin/teams/${team.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {teams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Henüz takım bulunmuyor. Yeni bir takım ekleyin.
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

