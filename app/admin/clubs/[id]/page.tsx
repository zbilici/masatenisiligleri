import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Edit, ExternalLink } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function ClubDetailPage({ params }: { params: { id: string } }) {
  // Kulüp detaylarını getir
  const club = await prisma.club.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!club) {
    notFound()
  }

  // Kulübe ait takımları getir
  const teams = await prisma.team.findMany({
    where: {
      clubId: club.id,
    },
    include: {
      league: true,
      _count: {
        select: {
          playerTeams: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/clubs">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{club.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/clubs/${club.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kulüp Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {club.logo && (
              <div className="flex justify-center mb-4">
                <img src={club.logo || "/placeholder.svg"} alt={club.name} className="h-32 w-32 object-contain" />
              </div>
            )}

            {club.address && (
              <div>
                <h3 className="text-sm font-medium">Adres</h3>
                <p className="text-sm text-muted-foreground">{club.address}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {club.phone && (
                <div>
                  <h3 className="text-sm font-medium">Telefon</h3>
                  <p className="text-sm text-muted-foreground">{club.phone}</p>
                </div>
              )}

              {club.email && (
                <div>
                  <h3 className="text-sm font-medium">E-posta</h3>
                  <p className="text-sm text-muted-foreground">{club.email}</p>
                </div>
              )}

              {club.website && (
                <div>
                  <h3 className="text-sm font-medium">Web Sitesi</h3>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      {club.website}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Takımlar ({teams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {teams.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Takım Adı</TableHead>
                    <TableHead>Lig</TableHead>
                    <TableHead className="text-center">Oyuncular</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>
                        {team.league ? team.league.name : <span className="text-muted-foreground text-sm">-</span>}
                      </TableCell>
                      <TableCell className="text-center">{team._count.playerTeams}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/teams/${team.id}`}>Görüntüle</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">Bu kulübe ait takım bulunmuyor.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

