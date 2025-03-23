import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/db"

export default async function PlayersPage() {
  // Tüm oyuncuları getir
  const players = await prisma.player.findMany({
    include: {
      playerTeams: {
        include: {
          team: {
            include: {
              club: true,
            },
          },
          season: true,
        },
        orderBy: {
          joinDate: "desc",
        },
        take: 1,
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Oyuncular</h1>
        <Link href="/admin/players/new">
          <Button>Yeni Oyuncu Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Oyuncular</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyuncu</TableHead>
                <TableHead>Lisans No</TableHead>
                <TableHead>Doğum Tarihi</TableHead>
                <TableHead>Cinsiyet</TableHead>
                <TableHead>Güncel Takım</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => {
                const currentTeam = player.playerTeams[0]?.team

                return (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {player.photo ? (
                            <AvatarImage src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                          ) : null}
                          <AvatarFallback>
                            {player.firstName[0]}
                            {player.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {player.lastName} {player.firstName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {player.licenseNumber || <span className="text-muted-foreground text-sm">-</span>}
                    </TableCell>
                    <TableCell>
                      {player.birthDate ? (
                        new Date(player.birthDate).toLocaleDateString("tr-TR")
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{player.gender}</Badge>
                    </TableCell>
                    <TableCell>
                      {currentTeam ? (
                        <div>
                          <div>{currentTeam.name}</div>
                          <div className="text-sm text-muted-foreground">{currentTeam.club.name}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Takım yok</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/players/${player.id}`}>
                          <Button variant="ghost" size="sm">
                            Görüntüle
                          </Button>
                        </Link>
                        <Link href={`/admin/players/${player.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Düzenle
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {players.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Henüz oyuncu bulunmuyor. Yeni bir oyuncu ekleyin.
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

