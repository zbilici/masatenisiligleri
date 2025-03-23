import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/db"

export default async function LeaguesPage() {
  // Tüm ligleri getir
  const leagues = await prisma.league.findMany({
    include: {
      season: true,
      gender: true,
      leagueType: true,
      _count: {
        select: {
          teams: true,
          stages: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Ligler</h1>
        <Link href="/admin/leagues/new">
          <Button>Yeni Lig Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Ligler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lig Adı</TableHead>
                <TableHead>Sezon</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lig Tipi</TableHead>
                <TableHead className="text-center">Takımlar</TableHead>
                <TableHead className="text-center">Etaplar</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagues.map((league) => (
                <TableRow key={league.id}>
                  <TableCell className="font-medium">{league.name}</TableCell>
                  <TableCell>{league.season.name}</TableCell>
                  <TableCell>{league.gender.name}</TableCell>
                  <TableCell>{league.leagueType.name}</TableCell>
                  <TableCell className="text-center">{league._count.teams}</TableCell>
                  <TableCell className="text-center">{league._count.stages}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/leagues/${league.id}`}>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                      <Link href={`/admin/leagues/${league.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {leagues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Henüz lig bulunmuyor. Yeni bir lig ekleyin.
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

