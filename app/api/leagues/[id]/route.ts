import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const league = await prisma.league.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        season: true,
        gender: true,
        leagueType: true,
        matchSystem: true,
        teams: {
          include: {
            club: true,
          },
        },
        stages: true,
        subLeagues: true,
      },
    })

    if (!league) {
      return NextResponse.json({ error: "Lig bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(league)
  } catch (error) {
    console.error("Lig getirme hatası:", error)
    return NextResponse.json({ error: "Lig bilgileri alınamadı" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, seasonId, genderId, leagueTypeId, matchSystemId } = body

    const league = await prisma.league.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        seasonId,
        genderId,
        leagueTypeId,
        matchSystemId: matchSystemId || null,
      },
    })

    return NextResponse.json(league)
  } catch (error) {
    console.error("Lig güncelleme hatası:", error)
    return NextResponse.json({ error: "Lig güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Lige bağlı takımları kontrol et
    const teamsCount = await prisma.team.count({
      where: {
        leagueId: Number.parseInt(params.id),
      },
    })

    if (teamsCount > 0) {
      return NextResponse.json(
        { error: "Bu lige bağlı takımlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Lige bağlı etapları kontrol et
    const stagesCount = await prisma.stage.count({
      where: {
        leagueId: Number.parseInt(params.id),
      },
    })

    if (stagesCount > 0) {
      return NextResponse.json(
        { error: "Bu lige bağlı etaplar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Lige bağlı alt ligleri kontrol et
    const subLeaguesCount = await prisma.subLeague.count({
      where: {
        leagueId: Number.parseInt(params.id),
      },
    })

    if (subLeaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu lige bağlı alt ligler bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.league.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lig silme hatası:", error)
    return NextResponse.json({ error: "Lig silinirken bir hata oluştu" }, { status: 500 })
  }
}

