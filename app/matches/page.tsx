import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter } from "lucide-react"

export default function MatchesPage() {
  // Örnek maç verileri
  const matches = [
    {
      id: 1,
      league: "A Ligi",
      homeTeam: "Yıldızlar SK",
      awayTeam: "Şimşekler SK",
      date: "10 Nisan 2025",
      score: "3-2",
      status: "Tamamlandı",
    },
    {
      id: 2,
      league: "A Ligi",
      homeTeam: "Kartallar SK",
      awayTeam: "Aslanlar SK",
      date: "10 Nisan 2025",
      score: "1-3",
      status: "Tamamlandı",
    },
    {
      id: 3,
      league: "A Ligi",
      homeTeam: "Kaplanlar SK",
      awayTeam: "Boğalar SK",
      date: "11 Nisan 2025",
      score: "3-1",
      status: "Tamamlandı",
    },
    {
      id: 4,
      league: "B Ligi",
      homeTeam: "Atmacalar SK",
      awayTeam: "Şahinler SK",
      date: "12 Nisan 2025",
      score: "3-0",
      status: "Tamamlandı",
    },
    {
      id: 5,
      league: "A Ligi",
      homeTeam: "Yıldızlar SK",
      awayTeam: "Kartallar SK",
      date: "17 Nisan 2025",
      score: "-",
      status: "Planlandı",
    },
    {
      id: 6,
      league: "A Ligi",
      homeTeam: "Şimşekler SK",
      awayTeam: "Kaplanlar SK",
      date: "17 Nisan 2025",
      score: "-",
      status: "Planlandı",
    },
    {
      id: 7,
      league: "B Ligi",
      homeTeam: "Şahinler SK",
      awayTeam: "Atmacalar SK",
      date: "18 Nisan 2025",
      score: "-",
      status: "Planlandı",
    },
    {
      id: 8,
      league: "A Ligi",
      homeTeam: "Boğalar SK",
      awayTeam: "Aslanlar SK",
      date: "18 Nisan 2025",
      score: "-",
      status: "Planlandı",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Maçlar</h1>
        <Button>Yeni Maç Ekle</Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Yaklaşan Maçlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches
                .filter((m) => m.status === "Planlandı")
                .slice(0, 3)
                .map((match) => (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      {match.league} • {match.date}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <div className="font-bold truncate">{match.homeTeam}</div>
                      </div>
                      <div className="text-center px-4">
                        <div className="text-2xl font-bold">vs</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="font-bold truncate">{match.awayTeam}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Link href={`/matches/${match.id}`}>
                        <Button variant="outline" size="sm">
                          Detaylar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tüm Maçlar</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Maçlar</SelectItem>
                  <SelectItem value="completed">Tamamlanan Maçlar</SelectItem>
                  <SelectItem value="upcoming">Yaklaşan Maçlar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lig</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Ev Sahibi</TableHead>
                  <TableHead>Deplasman</TableHead>
                  <TableHead className="text-center">Skor</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{match.league}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell className="font-medium">{match.homeTeam}</TableCell>
                    <TableCell className="font-medium">{match.awayTeam}</TableCell>
                    <TableCell className="text-center font-bold">{match.score}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          match.status === "Tamamlandı" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {match.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/matches/${match.id}`}>
                        <Button variant="ghost" size="sm">
                          Detaylar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

