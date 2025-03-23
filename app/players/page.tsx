import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search } from "lucide-react"

export default function PlayersPage() {
  // Örnek oyuncu verileri
  const players = [
    { id: 1, name: "Ahmet Yılmaz", team: "Yıldızlar SK", age: 28, wins: 15, losses: 5 },
    { id: 2, name: "Mehmet Demir", team: "Şimşekler SK", age: 24, wins: 12, losses: 8 },
    { id: 3, name: "Ayşe Kaya", team: "Kartallar SK", age: 22, wins: 10, losses: 10 },
    { id: 4, name: "Fatma Çelik", team: "Aslanlar SK", age: 26, wins: 14, losses: 6 },
    { id: 5, name: "Ali Öztürk", team: "Kaplanlar SK", age: 30, wins: 8, losses: 12 },
    { id: 6, name: "Zeynep Aydın", team: "Boğalar SK", age: 25, wins: 9, losses: 11 },
    { id: 7, name: "Mustafa Şahin", team: "Atmacalar SK", age: 27, wins: 16, losses: 4 },
    { id: 8, name: "Elif Yıldız", team: "Şahinler SK", age: 23, wins: 13, losses: 7 },
  ]

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Oyuncular</h1>
        <Button>Yeni Oyuncu Ekle</Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Oyuncu ara..." className="w-full pl-8" />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>En İyi Oyuncular</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {players.slice(0, 4).map((player) => (
              <div key={player.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.team}</p>
                  <div className="text-sm mt-1">
                    <span className="text-green-600 font-medium">{player.wins}G</span>
                    {" / "}
                    <span className="text-red-600 font-medium">{player.losses}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Oyuncular</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyuncu</TableHead>
                <TableHead>Takım</TableHead>
                <TableHead className="text-center">Yaş</TableHead>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">M</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {player.name}
                    </div>
                  </TableCell>
                  <TableCell>{player.team}</TableCell>
                  <TableCell className="text-center">{player.age}</TableCell>
                  <TableCell className="text-center">{player.wins}</TableCell>
                  <TableCell className="text-center">{player.losses}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/players/${player.id}`}>
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

