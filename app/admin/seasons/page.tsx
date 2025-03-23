import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/db"

export default async function SeasonsPage() {
  // Tüm sezonları getir
  const seasons = await prisma.season.findMany({
    orderBy: {
      startDate: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sezonlar</h1>
        <Link href="/admin/seasons/new">
          <Button>Yeni Sezon Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Sezonlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sezon Adı</TableHead>
                <TableHead>Başlangıç Tarihi</TableHead>
                <TableHead>Bitiş Tarihi</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons.map((season) => (
                <TableRow key={season.id}>
                  <TableCell className="font-medium">{season.name}</TableCell>
                  <TableCell>{new Date(season.startDate).toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell>{new Date(season.endDate).toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell>
                    <Badge variant={season.isActive ? "default" : "secondary"}>
                      {season.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/seasons/${season.id}`}>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                      <Link href={`/admin/seasons/${season.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {seasons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Henüz sezon bulunmuyor. Yeni bir sezon ekleyin.
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

