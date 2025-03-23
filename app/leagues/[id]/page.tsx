import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Calendar, Users, Trophy } from "lucide-react"

export default function LeagueDetailsPage({ params }: { params: { id: string } }) {
  // Örnek lig verileri
  const league = {
    id: params.id,
    name: "A Ligi",
    season: "2025 Bahar",
    teams: [
      { id: 1, name: "Yıldızlar SK", played: 10, won: 8, lost: 2, points: 16 },
      { id: 2, name: "Şimşekler SK", played: 10, won: 7, lost: 3, points: 14 },
      { id: 3, name: "Kartallar SK", played: 10, won: 5, lost: 5, points: 10 },
      { id: 4, name: "Aslanlar SK", played: 10, won: 5, lost: 5, points: 10 },
      { id: 5, name: "Kaplanlar SK", played: 10, won: 3, lost: 7, points: 6 },
      { id: 6, name: "Boğalar SK", played: 10, won: 2, lost: 8, points: 4 },
    ],
    matches: [
      {
        id: 1,
        homeTeam: "Yıldızlar SK",
        awayTeam: "Şimşekler SK",
        date: "10 Nisan 2025",
        score: "3-2",
        status: "Tamamlandı",
      },
      {
        id: 2,
        homeTeam: "Kartallar SK",
        awayTeam: "Aslanlar SK",
        date: "10 Nisan 2025",
        score: "1-3",
        status: "Tamamlandı",
      },
      {
        id: 3,
        homeTeam: "Kaplanlar SK",
        awayTeam: "Boğalar SK",
        date: "11 Nisan 2025",
        score: "3-1",
        status: "Tamamlandı",
      },
      {
        id: 4,
        homeTeam: "Yıldızlar SK",
        awayTeam: "Kartallar SK",
        date: "17 Nisan 2025",
        score: "-",
        status: "Planlandı",
      },
      {
        id: 5,
        homeTeam: "Şimşekler SK",
        awayTeam: "Kaplanlar SK",
        date: "17 Nisan 2025",
        score: "-",
        status: "Planlandı",
      },
    ],
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/leagues">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{league.name}</h1>
        <span className="text-muted-foreground ml-2">{league.season}</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Takımlar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{league.teams.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maçlar</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{league.matches.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lider</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{league.teams[0].name}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="standings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standings">Puan Durumu</TabsTrigger>
            <TabsTrigger value="matches">Maçlar</TabsTrigger>
            <TabsTrigger value="stats">İstatistikler</TabsTrigger>
          </TabsList>
          <TabsContent value="standings" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Sıra</TableHead>
                      <TableHead>Takım</TableHead>
                      <TableHead className="text-center">O</TableHead>
                      <TableHead className="text-center">G</TableHead>
                      <TableHead className="text-center">M</TableHead>
                      <TableHead className="text-center">P</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {league.teams.map((team, index) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{team.name}</TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center font-bold">{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="matches" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Maç Programı</h3>
                  <Button>Yeni Maç Ekle</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Ev Sahibi</TableHead>
                      <TableHead>Deplasman</TableHead>
                      <TableHead className="text-center">Skor</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {league.matches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>{match.date}</TableCell>
                        <TableCell>{match.homeTeam}</TableCell>
                        <TableCell>{match.awayTeam}</TableCell>
                        <TableCell className="text-center font-medium">{match.score}</TableCell>
                        <TableCell>{match.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Detaylar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Takım İstatistikleri</h3>
                <p className="text-muted-foreground">Bu bölümde takımların detaylı istatistikleri gösterilecektir.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

