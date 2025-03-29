import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const matchSystem = await prisma.matchSystem.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        leagues: true,
        subLeagues: true,
        matches: true,
      },
    })

    if (!matchSystem) {
      return NextResponse.json({ error: "Maç sistemi bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(matchSystem)
  } catch (error) {
    console.error("Maç sistemi getirme hatası:", error)
    return NextResponse.json({ error: "Maç sistemi bilgileri alınamadı" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, type, totalMatches, singlesCount, doublesCount, matchOrder, description } = body

    const matchSystem = await prisma.matchSystem.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        type,
        totalMatches: Number.parseInt(totalMatches),
        singlesCount: Number.parseInt(singlesCount),
        doublesCount: Number.parseInt(doublesCount),
        matchOrder,
        description,
      },
    })

    return NextResponse.json(matchSystem)
  } catch (error) {
    console.error("Maç sistemi güncelleme hatası:", error)
    return NextResponse.json({ error: "Maç sistemi güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Maç sistemine bağlı ligleri kontrol et
    const leaguesCount = await prisma.league.count({
      where: {
        matchSystemId: Number.parseInt(params.id),
      },
    })

    if (leaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu maç sistemine bağlı ligler bulunmaktadır. Önce onları güncelleyin." },
        { status: 400 },
      )
    }

    // Maç sistemine bağlı alt ligleri kontrol et
    const subLeaguesCount = await prisma.subLeague.count({
      where: {
        matchSystemId: Number.parseInt(params.id),
      },
    })

    if (subLeaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu maç sistemine bağlı alt ligler bulunmaktadır. Önce onları güncelleyin." },
        { status: 400 },
      )
    }

    // Maç sistemine bağlı maçları kontrol et
    const matchesCount = await prisma.match.count({
      where: {
        matchSystemId: Number.parseInt(params.id),
      },
    })

    if (matchesCount > 0) {
      return NextResponse.json(
        { error: "Bu maç sistemine bağlı maçlar bulunmaktadır. Önce onları güncelleyin." },
        { status: 400 },
      )
    }

    await prisma.matchSystem.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Maç sistemi silme hatası:", error)
    return NextResponse.json({ error: "Maç sistemi silinirken bir hata oluştu" }, { status: 500 })
  }
}

