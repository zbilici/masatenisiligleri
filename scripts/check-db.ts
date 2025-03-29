import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log("Veritabanı bağlantısı kontrol ediliyor...")

    // Basit bir sorgu ile veritabanı bağlantısını kontrol et
    const userCount = await prisma.user.count()
    console.log(`Kullanıcı sayısı: ${userCount}`)

    // Takımları kontrol et
    const teamCount = await prisma.team.count()
    console.log(`Takım sayısı: ${teamCount}`)

    if (teamCount > 0) {
      // İlk 5 takımı getir
      const teams = await prisma.team.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          clubId: true,
          leagueId: true,
        },
      })

      console.log("İlk 5 takım:")
      teams.forEach((team) => {
        console.log(`ID: ${team.id}, Adı: ${team.name}, Kulüp ID: ${team.clubId}, Lig ID: ${team.leagueId}`)
      })
    }

    // Kulüpleri kontrol et
    const clubCount = await prisma.club.count()
    console.log(`Kulüp sayısı: ${clubCount}`)

    if (clubCount > 0) {
      // İlk 5 kulübü getir
      const clubs = await prisma.club.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
        },
      })

      console.log("İlk 5 kulüp:")
      clubs.forEach((club) => {
        console.log(`ID: ${club.id}, Adı: ${club.name}`)
      })
    }

    console.log("Veritabanı bağlantısı başarılı.")
  } catch (error) {
    console.error("Veritabanı bağlantı hatası:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

