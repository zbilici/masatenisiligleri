import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function fixTeamClubRelations() {
  try {
    console.log("Takım-Kulüp ilişkilerini düzeltme işlemi başlatılıyor...")

    // Tüm takımları getir
    const teams = await prisma.team.findMany()
    console.log(`Toplam ${teams.length} takım bulundu.`)

    // Tüm kulüpleri getir
    const clubs = await prisma.club.findMany()
    console.log(`Toplam ${clubs.length} kulüp bulundu.`)

    if (clubs.length === 0) {
      console.log("Hiç kulüp bulunamadı! Önce en az bir kulüp oluşturulmalı.")
      return
    }

    // Kulüp ID'lerini bir set'e ekle
    const clubIds = new Set(clubs.map((club) => club.id))

    // Geçersiz kulüp ID'sine sahip takımları bul
    const teamsWithInvalidClub = teams.filter((team) => !clubIds.has(team.clubId))

    if (teamsWithInvalidClub.length === 0) {
      console.log("Tüm takımlar geçerli kulüp ID'lerine sahip. Düzeltilecek bir şey yok.")
      return
    }

    console.log(`${teamsWithInvalidClub.length} takım geçersiz kulüp ID'sine sahip. Düzeltiliyor...`)

    // Varsayılan kulüp olarak ilk kulübü kullan
    const defaultClub = clubs[0]
    console.log(`Varsayılan kulüp olarak "${defaultClub.name}" (ID: ${defaultClub.id}) kullanılacak.`)

    // Geçersiz kulüp ID'sine sahip takımları düzelt
    for (const team of teamsWithInvalidClub) {
      console.log(
        `Takım düzeltiliyor: ${team.name} (ID: ${team.id}), Eski Kulüp ID: ${team.clubId} -> Yeni Kulüp ID: ${defaultClub.id}`,
      )

      await prisma.team.update({
        where: {
          id: team.id,
        },
        data: {
          clubId: defaultClub.id,
        },
      })
    }

    console.log("Takım-Kulüp ilişkileri başarıyla düzeltildi!")
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Scripti çalıştır
fixTeamClubRelations()

