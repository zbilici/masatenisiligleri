import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function fixAllTeams() {
  try {
    console.log("Tüm takımlar kontrol ediliyor...")

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

    if (clubs.length === 0) {
      console.log("Hiç kulüp bulunamadı. Varsayılan bir kulüp oluşturuluyor...")

      const defaultClub = await prisma.club.create({
        data: {
          name: "Varsayılan Kulüp",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      console.log(`Varsayılan kulüp oluşturuldu. ID: ${defaultClub.id}`)

      // Tüm takımları varsayılan kulübe bağla
      for (const team of teams) {
        await prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            clubId: defaultClub.id,
          },
        })
      }

      console.log("Tüm takımlar varsayılan kulübe bağlandı.")
      return
    }

    // Kulüp ID'lerini bir set'e ekle
    const clubIds = new Set(clubs.map((club) => club.id))

    // Geçersiz kulüp ID'sine sahip takımları bul
    const teamsWithInvalidClub = teams.filter((team) => !clubIds.has(team.clubId))

    if (teamsWithInvalidClub.length > 0) {
      console.log(`${teamsWithInvalidClub.length} takım geçersiz kulüp ID'sine sahip.`)

      // İlk kulübü varsayılan olarak kullan
      const defaultClub = clubs[0]
      console.log(`Varsayılan kulüp olarak "${defaultClub.name}" (ID: ${defaultClub.id}) kullanılacak.`)

      // Geçersiz kulüp ID'sine sahip takımları düzelt
      for (const team of teamsWithInvalidClub) {
        await prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            clubId: defaultClub.id,
          },
        })

        console.log(`Takım düzeltildi: ${team.name} (ID: ${team.id})`)
      }

      console.log("Tüm takımlar düzeltildi.")
    } else {
      console.log("Tüm takımlar geçerli kulüp ID'lerine sahip.")
    }
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAllTeams()

