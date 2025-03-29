import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function fixImportErrors() {
  try {
    // Kulübü olmayan takımları kontrol et
    const teamsWithoutClub = await prisma.team.findMany({
      where: {
        club: null,
      },
      select: {
        id: true,
        name: true,
        clubId: true,
      },
    })

    if (teamsWithoutClub.length > 0) {
      console.log(`${teamsWithoutClub.length} takımın kulübü bulunamadı.`)

      // Varsayılan bir kulüp oluştur veya mevcut bir kulübü kullan
      let defaultClub = await prisma.club.findFirst()

      if (!defaultClub) {
        defaultClub = await prisma.club.create({
          data: {
            name: "Varsayılan Kulüp",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Varsayılan kulüp oluşturuldu: ${defaultClub.name} (ID: ${defaultClub.id})`)
      }

      // Kulübü olmayan takımları düzelt
      for (const team of teamsWithoutClub) {
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
    } else {
      console.log("Tüm takımların kulüpleri mevcut.")
    }

    // Diğer hata kontrolleri ve düzeltmeleri buraya eklenebilir
  } catch (error) {
    console.error("Hata düzeltme sırasında hata oluştu:", error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImportErrors()

