import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ChevronRight } from "lucide-react"

export default function LeaguesPage() {
  // Örnek lig verileri
  const leagues = [
    {
      id: 1,
      name: "A Ligi",
      season: "2025 Bahar",
      teams: 6,
      matches: 30,
      status: "Devam Ediyor",
    },
    {
      id: 2,
      name: "B Ligi",
      season: "2025 Bahar",
      teams: 8,
      matches: 56,
      status: "Devam Ediyor",
    },
    {
      id: 3,
      name: "C Ligi",
      season: "2025 Bahar",
      teams: 4,
      matches: 12,
      status: "Yakında Başlayacak",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ligler</h1>
        <Button>Yeni Lig Oluştur</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <Card key={league.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{league.name}</CardTitle>
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{league.season}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Takımlar</span>
                  <span className="font-medium">{league.teams}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Maçlar</span>
                  <span className="font-medium">{league.matches}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-muted-foreground">Durum</span>
                  <span className="font-medium">{league.status}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/leagues/${league.id}`} className="w-full">
                <Button variant="outline" className="w-full flex justify-between">
                  <span>Detaylar</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

