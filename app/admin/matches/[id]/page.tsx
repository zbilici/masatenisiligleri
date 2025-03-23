import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, Edit, Plus, Calendar, MapPin } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  // Maç detaylarını getir
  const match = await prisma.match.findUnique({
    where: {
      id: params.id,
    },
    include: {
      stage: {
        include: {
          league: {
            include: {
              season: true,
              gender: true,
              leagueType: true,
            },
          },
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
      matchScores: {
        include: {
          player: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  })

  if (!match) {
    notFound()
  }

  // Maç skorlarını ev sahibi ve deplasman olarak ayır
  const homeScores = match.matchScores.filter((score) => score.isHomeTeam)
  const awayScores = match.matchScores.filter((score) => !score.isHomeTeam)

  // Toplam skoru hesapla
  const homeWins = homeScores.filter((score) => score.result === "W").length
  const awayWins = awayScores.filter((score) => score.result === "W").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/matches">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Maç Detayları</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/matches/${match.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Maç Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium mb-2">Lig / Etap</h3>
                <div>
                  <Link href={`/admin/leagues/${match.stage.league.id}`} className="text-primary hover:underline">
                    {match.stage.league.name}
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Link href={`/admin/stages/${match.stage.id}`} className="hover:underline">
                    {match.stage.name}
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tarih</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(match.matchDate).toLocaleDateString("tr-TR")}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(match.matchDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Durum</h3>
                <Badge variant={match.status === "COMPLETED" ? "default" : "secondary"}>
                  {match.status === "COMPLETED"
                    ? "Tamamlandı"
                    : match.status === "CANCELLED"
                      ? "İptal Edildi"
                      : "Planlandı"}
                </Badge>
                {match.location && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{match.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Takımlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border rounded-lg">
              <div className="text-center md:text-left md:flex-1">
                <h3 className="text-xl font-bold">
                  <Link href={`/admin/teams/${match.homeTeam.id}`} className="hover:underline">
                    {match.homeTeam.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground">
                  <Link href={`/admin/clubs/${match.homeTeam.club.id}`} className="hover:underline">
                    {match.homeTeam.club.name}
                  </Link>
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold mb-2">
                  {match.status === "COMPLETED" ? `${homeWins} - ${awayWins}` : "vs"}
                </div>
                <Badge variant={match.status === "COMPLETED" ? "default" : "outline"}>
                  {match.status === "COMPLETED"
                    ? homeWins > awayWins
                      ? "Ev Sahibi Kazandı"
                      : "Deplasman Kazandı"
                    : "Henüz Oynanmadı"}
                </Badge>
              </div>

              <div className="text-center md:text-right md:flex-1">
                <h3 className="text-xl font-bold">
                  <Link href={`/admin/teams/${match.awayTeam.id}`} className="hover:underline">
                    {match.awayTeam.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground">
                  <Link href={`/admin/clubs/${match.awayTeam.club.id}`} className="hover:underline">
                    {match.awayTeam.club.name}
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Maç Skorları</CardTitle>
            {match.status !== "CANCELLED" && (
              <Button size="sm" asChild>
                <Link href={`/admin/matches/${match.id}/scores/add`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Skor Ekle
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {match.matchScores.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oyuncu</TableHead>
                    <TableHead>Takım</TableHead>
                    <TableHead>Setler</TableHead>
                    <TableHead>Sonuç</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {match.matchScores.map((score) => (
                    <TableRow key={score.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {score.player.firstName[0]}
                              {score.player.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {score.player.lastName} {score.player.firstName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{score.isHomeTeam ? match.homeTeam.name : match.awayTeam.name}</TableCell>
                      <TableCell>{score.sets}</TableCell>
                      <TableCell>
                        <Badge variant={score.result === "W" ? "default" : "destructive"}>
                          {score.result === "W" ? "Kazandı" : "Kaybetti"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/matches/${match.id}/scores/${score.id}/edit`}>Düzenle</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">Bu maça ait skor bulunmuyor.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

