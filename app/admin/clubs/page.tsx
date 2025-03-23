import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/db"

export default async function ClubsPage() {
  // Tüm kulüpleri getir
  const clubs = await prisma.club.findMany({
    include: {
      _count: {
        select: {
          teams: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Kulüpler</h1>
        <Link href="/admin/clubs/new">
          <Button>Yeni Kulüp Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Kulüpler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kulüp Adı</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead className="text-center">Takımlar</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map((club) => (
                <TableRow key={club.id}>
                  <TableCell className="font-medium">{club.name}</TableCell>
                  <TableCell>
                    {club.email && <div className="text-sm">{club.email}</div>}
                    {club.phone && <div className="text-sm text-muted-foreground">{club.phone}</div>}
                  </TableCell>
                  <TableCell className="text-center">{club._count.teams}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/clubs/${club.id}`}>
                        <Button variant="ghost" size="sm">
                          Görüntüle
                        </Button>
                      </Link>
                      <Link href={`/admin/clubs/${club.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {clubs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Henüz kulüp bulunmuyor. Yeni bir kulüp ekleyin.
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

