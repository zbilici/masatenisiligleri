import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Plus } from "lucide-react"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"

export default async function LeagueDetailsPage({ params }: { params: { id: string } }) {
  // Lig detaylarını getir
  const league = await prisma.league.findUnique({
    where: {
      id: params.id,
    },
    include: {
      season: true,
      gender: true,
      leagueType: true,
      stages: {
        orderBy: {
          order: "asc",
        },
      },
      teams: {
        include: {
          club: true,
        },
      },
    },
  })

  if (!league) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/admin/leagues">
          <Button variant="ghost" size="sm" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sezon</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{league.season.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{league.gender.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lig Tipi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{league.leagueType.name}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams">Takımlar</TabsTrigger>
          <TabsTrigger value="stages">Etaplar</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Takımlar</CardTitle>
              <Link href={`/admin/leagues/${league.id}/teams/add`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Takım Ekle
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Takım Adı</TableHead>
                    <TableHead>Kulüp</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {league.teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.club.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/teams/${team.id}`}>
                            <Button variant="ghost" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                          <Link href={`/admin/leagues/${league.id}/teams/${team.id}/remove`}>
                            <Button variant="ghost" size="sm">
                              Kaldır
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {league.teams.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        Bu lige henüz takım eklenmemiş.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Etaplar</CardTitle>
              <Link href={`/admin/leagues/${league.id}/stages/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Etap Ekle
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sıra</TableHead>
                    <TableHead>Etap Adı</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {league.stages.map((stage) => (
                    <TableRow key={stage.id}>
                      <TableCell>{stage.order}</TableCell>
                      <TableCell className="font-medium">{stage.name}</TableCell>
                      <TableCell>{new Date(stage.startDate).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell>{new Date(stage.endDate).toLocaleDateString("tr-TR")}</TableCell>
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

                  {league.stages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Bu lige henüz etap eklenmemiş.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

