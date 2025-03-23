import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"

export default async function AdminDashboard() {
  const user = await getSession()

  // Veritabanından özet bilgileri al
  const seasonCount = await prisma.season.count()
  const leagueCount = await prisma.league.count()
  const clubCount = await prisma.club.count()
  const teamCount = await prisma.team.count()
  const playerCount = await prisma.player.count()
  const matchCount = await prisma.match.count()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yönetim Paneli</h1>
        <p className="text-muted-foreground">
          Hoş geldiniz, {user?.name}! Masa Tenisi Ligi yönetim sistemi istatistikleri.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sezonlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seasonCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ligler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leagueCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kulüpler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clubCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Takımlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oyuncular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maçlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
            <CardDescription>Sık kullanılan işlemler</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <a href="/admin/seasons/new" className="text-primary hover:underline">
              + Yeni Sezon Ekle
            </a>
            <a href="/admin/leagues/new" className="text-primary hover:underline">
              + Yeni Lig Ekle
            </a>
            <a href="/admin/clubs/new" className="text-primary hover:underline">
              + Yeni Kulüp Ekle
            </a>
            <a href="/admin/teams/new" className="text-primary hover:underline">
              + Yeni Takım Ekle
            </a>
            <a href="/admin/players/new" className="text-primary hover:underline">
              + Yeni Oyuncu Ekle
            </a>
            <a href="/admin/matches/new" className="text-primary hover:underline">
              + Yeni Maç Ekle
            </a>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sistem Durumu</CardTitle>
            <CardDescription>Genel bakış</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Aktif Sezon</p>
                <p className="text-sm text-muted-foreground">2024-2025 Sezonu</p>
              </div>
              <div>
                <p className="text-sm font-medium">Son Güncelleme</p>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleString("tr-TR")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Sistem Versiyonu</p>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

