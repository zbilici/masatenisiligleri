import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Edit, Calendar } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  // Oyuncu detaylarını getir
  const player = await prisma.player.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!player) {
    notFound()
  }

  // Oyuncunun takım geçmişini getir
  const playerTeams = await prisma.playerTeam.findMany({
    where: {
      playerId: player.id,
    },
    include: {
      team: {
        include: {
          club: true,
          league: true,
        },
      },
      season: true,
    },
    orderBy: [{ season: { startDate: "desc" } }, { joinDate: "desc" }],
  })

  // Oyuncunun maç skorlarını getir
  const matchScores = await prisma.matchScore.findMany({
    where: {
      playerId: player.id,
    },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          stage: {
            include: {
              league: true,
            },
          },
        },
      },
    },
    orderBy: {
      match: {
        matchDate: "desc",
      },
    },
    take: 10, // Son 10 maç
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/players">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {player.lastName} {player.firstName}
          </h1>
        </div>
        <Button asChild>
          <Link href={`/admin/players/${player.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Oyuncu Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                {player.photo ? (
                  <AvatarImage src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {player.firstName[0]}
                  {player.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Ad</h3>
                <p>{player.firstName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Soyad</h3>
                <p>{player.lastName}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Cinsiyet</h3>
              <Badge variant="outline">{player.gender}</Badge>
            </div>

            {player.birthDate && (
              <div>
                <h3 className="text-sm font-medium">Doğum Tarihi</h3>
                <p className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(player.birthDate).toLocaleDateString("tr-TR")}
                </p>
              </div>
            )}

            {player.licenseNumber && (
              <div>
                <h3 className="text-sm font-medium">Lisans Numarası</h3>
                <p>{player.licenseNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Takım Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            {playerTeams.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sezon</TableHead>
                    <TableHead>Takım</TableHead>
                    <TableHead>Kulüp</TableHead>
                    <TableHead>Katılım Tarihi</TableHead>
                    <TableHead>Ayrılış Tarihi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerTeams.map((playerTeam) => (
                    <TableRow key={playerTeam.id}>
                      <TableCell>{playerTeam.season.name}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/admin/teams/${playerTeam.team.id}`} className="hover:underline">
                          {playerTeam.team.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/clubs/${playerTeam.team.club.id}`} className="hover:underline">
                          {playerTeam.team.club.name}
                        </Link>
                      </TableCell>
                      <TableCell>{new Date(playerTeam.joinDate).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell>
                        {playerTeam.leaveDate ? (
                          new Date(playerTeam.leaveDate).toLocaleDateString("tr-TR")
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">Bu oyuncunun takım geçmişi bulunmuyor.</p>
            )}
          </CardContent>
        </Card>

        {matchScores.length > 0 && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Son Maçlar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Lig / Etap</TableHead>
                    <TableHead>Maç</TableHead>
                    <TableHead>Setler</TableHead>
                    <TableHead>Sonuç</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchScores.map((score) => (
                    <TableRow key={score.id}>
                      <TableCell>{new Date(score.match.matchDate).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell>
                        <div>{score.match.stage.league.name}</div>
                        <div className="text-xs text-muted-foreground">{score.match.stage.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={score.isHomeTeam ? "font-bold" : ""}>{score.match.homeTeam.name}</span>
                          <span>vs</span>
                          <span className={!score.isHomeTeam ? "font-bold" : ""}>{score.match.awayTeam.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{score.sets}</TableCell>
                      <TableCell>
                        <Badge variant={score.result === "W" ? "default" : "destructive"}>
                          {score.result === "W" ? "Kazandı" : "Kaybetti"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

