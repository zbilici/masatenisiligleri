import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function verifyImport() {
  try {
    // Kulüpleri kontrol et
    const clubCount = await prisma.club.count()
    console.log(`Toplam ${clubCount} kulüp bulundu.`)

    // Takımları kontrol et
    const teamCount = await prisma.team.count()
    console.log(`Toplam ${teamCount} takım bulundu.`)

    // Oyuncuları kontrol et
    const playerCount = await prisma.player.count()
    console.log(`Toplam ${playerCount} oyuncu bulundu.`)

    // Ligleri kontrol et
    const leagueCount = await prisma.league.count()
    console.log(`Toplam ${leagueCount} lig bulundu.`)

    // Sezonları kontrol et
    const seasonCount = await prisma.season.count()
    console.log(`Toplam ${seasonCount} sezon bulundu.`)

    // Cinsiyetleri kontrol et
    const genderCount = await prisma.gender.count()
    console.log(`Toplam ${genderCount} cinsiyet bulundu.`)

    // Lig tiplerini kontrol et
    const leagueTypeCount = await prisma.leagueType.count()
    console.log(`Toplam ${leagueTypeCount} lig tipi bulundu.`)

    // Oyuncu-takım ilişkilerini kontrol et
    const playerTeamCount = await prisma.playerTeam.count()
    console.log(`Toplam ${playerTeamCount} oyuncu-takım ilişkisi bulundu.`)
  } catch (error) {
    console.error("Doğrulama sırasında hata oluştu:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyImport()

