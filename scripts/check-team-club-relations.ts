import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkTeamClubRelations() {
  try {
    console.log("Takım-Kulüp ilişkilerini kontrol ediyorum...")

    // Tüm takımları getir
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        clubId: true,
      },
    })

    console.log(`Toplam ${teams.length} takım bulundu.`)

    // Tüm kulüpleri getir
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    console.log(`Toplam ${clubs.length} kulüp bulundu.`)

    // Kulüp ID'lerini bir set'e ekle
    const clubIds = new Set(clubs.map((club) => club.id))

    // Geçersiz kulüp ID'sine sahip takımları bul
    const teamsWithInvalidClub = teams.filter((team) => !clubIds.has(team.clubId))

    if (teamsWithInvalidClub.length > 0) {
      console.log(`${teamsWithInvalidClub.length} takım geçersiz kulüp ID'sine sahip:`)
      teamsWithInvalidClub.forEach((team) => {
        console.log(`Takım ID: ${team.id}, Adı: ${team.name}, Kulüp ID: ${team.clubId}`)
      })
    } else {
      console.log("Tüm takımlar geçerli kulüp ID'lerine sahip.")
    }

    // Örnek bir takımı kulübüyle birlikte getir
    if (teams.length > 0) {
      const sampleTeamId = teams[0].id
      console.log(`Örnek takım ID: ${sampleTeamId} için ilişki kontrolü yapılıyor...`)

      const teamWithClub = await prisma.team.findUnique({
        where: {
          id: sampleTeamId,
        },
        include: {
          club: true,
        },
      })

      if (teamWithClub?.club) {
        console.log("İlişki başarılı! Takım ve kulüp bilgileri:")
        console.log(`Takım: ${teamWithClub.name} (ID: ${teamWithClub.id})`)
        console.log(`Kulüp: ${teamWithClub.club.name} (ID: ${teamWithClub.club.id})`)
      } else {
        console.log("İlişki başarısız! Takım kulüp bilgisi getirilemedi.")
        console.log("Takım:", teamWithClub)
      }
    }
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTeamClubRelations()

