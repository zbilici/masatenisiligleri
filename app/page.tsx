import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TableIcon as TableTennisIcon, Trophy, Users, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold">
            <TableTennisIcon className="h-6 w-6" />
            <span>Masa Tenisi Ligi</span>
          </div>
          <nav className="ml-auto flex gap-4">
            <Link href="/" className="text-sm font-medium">
              Ana Sayfa
            </Link>
            <Link href="/leagues" className="text-sm font-medium">
              Ligler
            </Link>
            <Link href="/teams" className="text-sm font-medium">
              Takımlar
            </Link>
            <Link href="/players" className="text-sm font-medium">
              Oyuncular
            </Link>
            <Link href="/matches" className="text-sm font-medium">
              Maçlar
            </Link>
          </nav>
          <div className="ml-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Giriş
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Masa Tenisi Ligi Yönetim Sistemi
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Liglerinizi, takımlarınızı, oyuncularınızı ve maçlarınızı kolayca yönetin ve takip edin.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button>Başlayın</Button>
                <Button variant="outline">Daha Fazla Bilgi</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ligler</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Aktif ligler</p>
                </CardContent>
                <CardFooter>
                  <Link href="/leagues" className="text-xs text-blue-500 hover:underline">
                    Tüm ligleri görüntüle
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Takımlar</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Kayıtlı takımlar</p>
                </CardContent>
                <CardFooter>
                  <Link href="/teams" className="text-xs text-blue-500 hover:underline">
                    Tüm takımları görüntüle
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Oyuncular</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">Kayıtlı oyuncular</p>
                </CardContent>
                <CardFooter>
                  <Link href="/players" className="text-xs text-blue-500 hover:underline">
                    Tüm oyuncuları görüntüle
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maçlar</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Bu haftaki maçlar</p>
                </CardContent>
                <CardFooter>
                  <Link href="/matches" className="text-xs text-blue-500 hover:underline">
                    Tüm maçları görüntüle
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Yaklaşan Maçlar</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Bu haftanın öne çıkan karşılaşmaları
                </p>
              </div>
              <div className="mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
                {[1, 2, 3].map((match) => (
                  <Card key={match}>
                    <CardHeader>
                      <CardTitle>A Ligi - 3. Hafta</CardTitle>
                      <CardDescription>12 Nisan 2025, 15:00</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="font-bold">Yıldızlar SK</div>
                        </div>
                        <div className="text-center text-2xl font-bold">vs</div>
                        <div className="text-center">
                          <div className="font-bold">Şimşekler SK</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="outline" size="sm">
                        Detaylar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <Button variant="outline">Tüm Maçları Görüntüle</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            © 2025 Masa Tenisi Ligi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              İletişim
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Gizlilik Politikası
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

