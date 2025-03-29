import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const stage = await prisma.stage.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        league: {
          include: {
            season: true,
            gender: true,
            leagueType: true,
          },
        },
        subLeague: {
          include: {
            league: true,
          },
        },
        matches: {
          include: {
            homeTeam: {
              include: {
                club: true,
              },
            },
            awayTeam: {
              include: {
                club: true,
              },
            },
          },
        },
        rounds: true,
      },
    })

    if (!stage) {
      return NextResponse.json({ error: "Etap bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(stage)
  } catch (error) {
    console.error("Etap getirme hatası:", error)
    return NextResponse.json({ error: "Etap yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, order, leagueId, subLeagueId, startDate, endDate } = body

    // Hem lig hem de alt lig seçilmişse hata döndür
    if (leagueId && subLeagueId) {
      return NextResponse.json(
        { error: "Bir etap hem lige hem de alt lige bağlanamaz. Sadece birini seçin." },
        { status: 400 },
      )
    }

    // Ne lig ne de alt lig seçilmemişse hata döndür
    if (!leagueId && !subLeagueId) {
      return NextResponse.json(
        { error: "Bir etap ya lige ya da alt lige bağlı olmalıdır. Lütfen birini seçin." },
        { status: 400 },
      )
    }

    const stage = await prisma.stage.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        order: order || 1,
        leagueId: leagueId || null,
        subLeagueId: subLeagueId || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })

    return NextResponse.json(stage)
  } catch (error) {
    console.error("Etap güncelleme hatası:", error)
    return NextResponse.json({ error: "Etap güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Etaba bağlı maçları kontrol et
    const matchesCount = await prisma.match.count({
      where: {
        stageId: Number.parseInt(params.id),
      },
    })

    if (matchesCount > 0) {
      return NextResponse.json(
        { error: "Bu etaba bağlı maçlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Etaba bağlı turları kontrol et
    const roundsCount = await prisma.round.count({
      where: {
        stageId: Number.parseInt(params.id),
      },
    })

    if (roundsCount > 0) {
      return NextResponse.json(
        { error: "Bu etaba bağlı turlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.stage.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Etap silme hatası:", error)
    return NextResponse.json({ error: "Etap silinirken bir hata oluştu" }, { status: 500 })
  }
}

