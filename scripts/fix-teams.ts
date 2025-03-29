import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function fixTeams() {
  try {
    // Var olmayan kulüplere referans veren takımları bul
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
      },
    })

    const clubIds = new Set(clubs.map((club) => club.id))

    const teamsWithInvalidClub = await prisma.team.findMany({
      where: {
        NOT: {
          clubId: {
            in: Array.from(clubIds),
          },
        },
      },
      select: {
        id: true,
        name: true,
        clubId: true,
      },
    })

    if (teamsWithInvalidClub.length > 0) {
      console.log(`${teamsWithInvalidClub.length} takım var olmayan kulüplere referans veriyor.`)

      // Varsayılan bir kulüp oluştur
      const defaultClub = await prisma.club.create({
        data: {
          name: "Varsayılan Kulüp",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      console.log(`Varsayılan kulüp oluşturuldu. ID: ${defaultClub.id}`)

      // Hatalı takımları düzelt
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

      console.log("Tüm hatalı takımlar düzeltildi.")
    } else {
      console.log("Düzeltilecek takım bulunamadı.")
    }
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixTeams()

