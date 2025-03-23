import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Users, Search, ChevronRight } from "lucide-react"

export default function TeamsPage() {
  // Örnek takım verileri
  const teams = [
    { id: 1, name: "Yıldızlar SK", league: "A Ligi", players: 8, wins: 8, losses: 2 },
    { id: 2, name: "Şimşekler SK", league: "A Ligi", players: 7, wins: 7, losses: 3 },
    { id: 3, name: "Kartallar SK", league: "A Ligi", players: 6, wins: 5, losses: 5 },
    { id: 4, name: "Aslanlar SK", league: "A Ligi", players: 8, wins: 5, losses: 5 },
    { id: 5, name: "Kaplanlar SK", league: "A Ligi", players: 6, wins: 3, losses: 7 },
    { id: 6, name: "Boğalar SK", league: "A Ligi", players: 7, wins: 2, losses: 8 },
    { id: 7, name: "Atmacalar SK", league: "B Ligi", players: 8, wins: 9, losses: 1 },
    { id: 8, name: "Şahinler SK", league: "B Ligi", players: 7, wins: 8, losses: 2 },
  ]

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Takımlar</h1>
        <Button>Yeni Takım Ekle</Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Takım ara..." className="w-full pl-8" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {teams.slice(0, 4).map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Lig</span>
                  <span className="font-medium">{team.league}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Oyuncular</span>
                  <span className="font-medium">{team.players}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Galibiyet</span>
                  <span className="font-medium">{team.wins}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Mağlubiyet</span>
                  <span className="font-medium">{team.losses}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/teams/${team.id}`} className="w-full">
                <Button variant="outline" className="w-full flex justify-between">
                  <span>Detaylar</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
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
                <TableHead>Lig</TableHead>
                <TableHead className="text-center">Oyuncular</TableHead>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">M</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.league}</TableCell>
                  <TableCell className="text-center">{team.players}</TableCell>
                  <TableCell className="text-center">{team.wins}</TableCell>
                  <TableCell className="text-center">{team.losses}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/teams/${team.id}`}>
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
  )
}

