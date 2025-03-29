import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Takımlar getiriliyor...")

    // Önce tüm takımları getir (ilişkisiz)
    const teams = await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },
    })

    console.log(`${teams.length} takım başarıyla getirildi.`)

    // Kulüp bilgilerini ayrı bir sorgu ile getir
    const clubIds = [...new Set(teams.map((team) => team.clubId))]
    const clubs = await prisma.club.findMany({
      where: {
        id: {
          in: clubIds,
        },
      },
    })

    // Kulüp ID'lerini bir map'e dönüştür
    const clubMap = new Map(clubs.map((club) => [club.id, club]))

    // Takımlara kulüp bilgilerini ekle
    const teamsWithClubs = teams.map((team) => {
      const club = clubMap.get(team.clubId)
      return {
        ...team,
        club: club || null,
      }
    })

    // Kulübü olmayan takımları logla
    const teamsWithoutClub = teamsWithClubs.filter((team) => !team.club)
    if (teamsWithoutClub.length > 0) {
      console.log(`${teamsWithoutClub.length} takımın kulübü bulunamadı:`)
      teamsWithoutClub.forEach((team) => {
        console.log(`Takım ID: ${team.id}, Adı: ${team.name}, Kulüp ID: ${team.clubId}`)
      })
    }

    return NextResponse.json(teamsWithClubs)
  } catch (error) {
    console.error("Takımları getirme hatası:", error)
    return NextResponse.json(
      {
        error: "Takımlar yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, clubId, leagueId } = body

    console.log("Yeni takım oluşturuluyor:", { name, clubId, leagueId })

    // Kulübün var olup olmadığını kontrol et
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    })

    if (!club) {
      console.log(`Kulüp bulunamadı, ID: ${clubId}`)
      return NextResponse.json({ error: "Belirtilen kulüp bulunamadı" }, { status: 400 })
    }

    // Lig belirtilmişse, var olup olmadığını kontrol et
    if (leagueId) {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
      })

      if (!league) {
        console.log(`Lig bulunamadı, ID: ${leagueId}`)
        return NextResponse.json({ error: "Belirtilen lig bulunamadı" }, { status: 400 })
      }
    }

    const team = await prisma.team.create({
      data: {
        name,
        clubId,
        leagueId: leagueId || null,
      },
    })

    console.log("Takım başarıyla oluşturuldu:", team)
    return NextResponse.json(team)
  } catch (error) {
    console.error("Takım oluşturma hatası:", error)
    return NextResponse.json(
      {
        error: "Takım oluşturulurken bir hata oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    )
  }
}

