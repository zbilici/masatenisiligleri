import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`Takım getiriliyor, ID: ${params.id}, Tip: ${typeof params.id}`)

    // ID'yi integer'a dönüştür
    const teamId = Number.parseInt(params.id)
    console.log(`Dönüştürülmüş ID: ${teamId}, Tip: ${typeof teamId}`)

    // Takımı getir
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    })

    console.log("Takım sorgusu sonucu:", team ? "Bulundu" : "Bulunamadı")

    if (!team) {
      console.log("Takım bulunamadı, 404 dönülüyor")
      return NextResponse.json({ error: "Takım bulunamadı" }, { status: 404 })
    }

    // Kulüp bilgisini ayrı bir sorgu ile getir
    let club = null
    try {
      club = await prisma.club.findUnique({
        where: {
          id: team.clubId,
        },
      })
    } catch (error) {
      console.log(`Kulüp bilgisi alınamadı, ID: ${team.clubId}`, error)
    }

    // Lig bilgisini ayrı bir sorgu ile getir (eğer varsa)
    let league = null
    if (team.leagueId) {
      try {
        league = await prisma.league.findUnique({
          where: {
            id: team.leagueId,
          },
        })
      } catch (error) {
        console.log(`Lig bilgisi alınamadı, ID: ${team.leagueId}`, error)
      }
    }

    // Takım, kulüp ve lig bilgilerini birleştir
    const teamWithRelations = {
      ...team,
      club,
      league,
    }

    console.log("Takım başarıyla döndürülüyor")
    return NextResponse.json(teamWithRelations)
  } catch (error) {
    console.error("Takım getirme hatası:", error)
    return NextResponse.json(
      {
        error: "Takım yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, clubId, leagueId } = body

    // Kulübün var olup olmadığını kontrol et
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    })

    if (!club) {
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
        return NextResponse.json({ error: "Belirtilen lig bulunamadı" }, { status: 400 })
      }
    }

    const team = await prisma.team.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        clubId,
        leagueId: leagueId || null,
      },
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error("Takım güncelleme hatası:", error)
    return NextResponse.json(
      {
        error: "Takım güncellenirken bir hata oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Takıma bağlı oyuncuları kontrol et
    const playerTeamsCount = await prisma.playerTeam.count({
      where: {
        teamId: Number.parseInt(params.id),
      },
    })

    if (playerTeamsCount > 0) {
      return NextResponse.json(
        { error: "Bu takıma bağlı oyuncular bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Takıma bağlı maçları kontrol et
    const homeMatchesCount = await prisma.match.count({
      where: {
        homeTeamId: Number.parseInt(params.id),
      },
    })

    const awayMatchesCount = await prisma.match.count({
      where: {
        awayTeamId: Number.parseInt(params.id),
      },
    })

    if (homeMatchesCount > 0 || awayMatchesCount > 0) {
      return NextResponse.json(
        { error: "Bu takıma bağlı maçlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.team.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Takım silme hatası:", error)
    return NextResponse.json(
      {
        error: "Takım silinirken bir hata oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    )
  }
}

