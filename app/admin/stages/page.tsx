import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/db"

export default async function StagesPage() {
  // Tüm etapları getir
  const stages = await prisma.stage.findMany({
    include: {
      league: {
        include: {
          season: true,
          gender: true,
          leagueType: true,
        },
      },
      _count: {
        select: {
          matches: true,
        },
      },
    },
    orderBy: [{ leagueId: "asc" }, { order: "asc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Etaplar</h1>
        <Link href="/admin/stages/new">
          <Button>Yeni Etap Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Etaplar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etap Adı</TableHead>
                <TableHead>Lig</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead>Başlangıç Tarihi</TableHead>
                <TableHead>Bitiş Tarihi</TableHead>
                <TableHead className="text-center">Maçlar</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages.map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell className="font-medium">{stage.name}</TableCell>
                  <TableCell>{stage.league.name}</TableCell>
                  <TableCell>{stage.order}</TableCell>
                  <TableCell>{new Date(stage.startDate).toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell>{new Date(stage.endDate).toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell className="text-center">{stage._count.matches}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/stages/${stage.id}`}>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                      <Link href={`/admin/stages/${stage.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {stages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Henüz etap bulunmuyor. Yeni bir etap ekleyin.
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

