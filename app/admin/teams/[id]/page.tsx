import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, Edit, Plus } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  // Takım detaylarını getir
  const team = await prisma.team.findUnique({
    where: {
      id: params.id,
    },
    include: {
      club: true,
      league: {
        include: {
          season: true,
          gender: true,
          leagueType: true,
        },
      },
    },
  })

  if (!team) {
    notFound()
  }

  // Aktif sezonu bul
  const activeSeason = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  })

  // Takıma ait oyuncuları getir
  const playerTeams = await prisma.playerTeam.findMany({
    where: {
      teamId: team.id,
      seasonId: activeSeason?.id, // Aktif sezon varsa, o sezona ait oyuncuları getir
    },
    include: {
      player: true,
      season: true,
    },
    orderBy: [{ player: { lastName: "asc" } }, { player: { firstName: "asc" } }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/teams">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/teams/${team.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Takım Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Kulüp</h3>
              <p>
                <Link href={`/admin/clubs/${team.club.id}`} className="text-primary hover:underline">
                  {team.club.name}
                </Link>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Lig</h3>
              {team.league ? (
                <p>
                  <Link href={`/admin/leagues/${team.league.id}`} className="text-primary hover:underline">
                    {team.league.name}
                  </Link>
                </p>
              ) : (
                <p className="text-muted-foreground">Lig atanmamış</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Oyuncular ({playerTeams.length})</CardTitle>
            <Button size="sm" asChild>
              <Link href={`/admin/teams/${team.id}/players/add`}>
                <Plus className="h-4 w-4 mr-2" />
                Oyuncu Ekle
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {playerTeams.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oyuncu</TableHead>
                    <TableHead>Sezon</TableHead>
                    <TableHead>Katılım Tarihi</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerTeams.map((playerTeam) => (
                    <TableRow key={playerTeam.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {playerTeam.player.firstName[0]}
                              {playerTeam.player.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {playerTeam.player.lastName} {playerTeam.player.firstName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {playerTeam.player.licenseNumber || "Lisans No: -"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{playerTeam.season.name}</TableCell>
                      <TableCell>{new Date(playerTeam.joinDate).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/players/${playerTeam.player.id}`}>Görüntüle</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">Bu takıma ait oyuncu bulunmuyor.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

