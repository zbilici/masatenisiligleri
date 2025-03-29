import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkTeams() {
  try {
    // Tüm takımları getir
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        clubId: true,
        club: true,
      },
    })

    console.log(`Toplam ${teams.length} takım bulundu.`)

    // Kulübü olmayan takımları bul
    const teamsWithoutClub = teams.filter((team) => team.club === null)

    if (teamsWithoutClub.length > 0) {
      console.log(`${teamsWithoutClub.length} takımın kulübü bulunamadı:`)
      teamsWithoutClub.forEach((team) => {
        console.log(`ID: ${team.id}, Takım: ${team.name}, ClubID: ${team.clubId}`)
      })
    } else {
      console.log("Tüm takımların kulüpleri mevcut.")
    }

    // Kulüpleri kontrol et
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    console.log(`Toplam ${clubs.length} kulüp bulundu.`)

    // Var olmayan kulüplere referans veren takımları bul
    const clubIds = new Set(clubs.map((club) => club.id))
    const teamsWithInvalidClub = teams.filter((team) => !clubIds.has(team.clubId))

    if (teamsWithInvalidClub.length > 0) {
      console.log(`${teamsWithInvalidClub.length} takım var olmayan kulüplere referans veriyor:`)
      teamsWithInvalidClub.forEach((team) => {
        console.log(`ID: ${team.id}, Takım: ${team.name}, ClubID: ${team.clubId}`)
      })
    } else {
      console.log("Tüm takımlar geçerli kulüplere referans veriyor.")
    }
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTeams()

