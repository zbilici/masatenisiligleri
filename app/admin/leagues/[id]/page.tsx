import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export default async function LeagueDetailsPage({ params }: { params: { id: string } }) {
  // Lig detaylarını getir
  const league = await prisma.league.findUnique({
    where: {
      id: Number.parseInt(params.id),
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
    return (
      <div className="flex items-center justify-center h-48">
        <p>Lig bulunamadı.</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: tr })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/leagues">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lig Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Sezon</dt>
                <dd>{league.season.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Cinsiyet Kategorisi</dt>
                <dd>{league.gender.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Lig Tipi</dt>
                <dd>{league.leagueType.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Maç Sistemi</dt>
                <dd>{league.matchSystem?.name || "Belirtilmemiş"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Etaplar</CardTitle>
          </CardHeader>
          <CardContent>
            {league.stages.length === 0 ? (
              <p className="text-sm text-gray-500">Henüz etap bulunmuyor.</p>
            ) : (
              <ul className="space-y-2">
                {league.stages.map((stage) => (
                  <li key={stage.id} className="border-b pb-2">
                    <div className="font-medium">{stage.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(stage.startDate.toString())} - {formatDate(stage.endDate.toString())}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <Link href="/admin/stages/new">
                <Button variant="outline" size="sm">
                  Etap Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Takımlar</CardTitle>
          </CardHeader>
          <CardContent>
            {league.teams.length === 0 ? (
              <p className="text-sm text-gray-500">Henüz takım bulunmuyor.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Takım Adı</th>
                      <th className="text-left py-3 px-4">Kulüp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {league.teams.map((team) => (
                      <tr key={team.id} className="border-b">
                        <td className="py-3 px-4">{team.name}</td>
                        <td className="py-3 px-4">{team.club.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4">
              <Link href="/admin/teams/new">
                <Button variant="outline" size="sm">
                  Takım Ekle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

