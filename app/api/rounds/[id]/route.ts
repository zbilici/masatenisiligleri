import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const round = await prisma.round.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        stage: {
          include: {
            league: true,
            subLeague: true,
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
      },
    })

    if (!round) {
      return NextResponse.json({ error: "Tur bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(round)
  } catch (error) {
    console.error("Tur getirme hatası:", error)
    return NextResponse.json({ error: "Tur yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, order, stageId, startDate, endDate } = body

    // Etabın var olup olmadığını kontrol et
    const stage = await prisma.stage.findUnique({
      where: {
        id: Number.parseInt(stageId),
      },
    })

    if (!stage) {
      return NextResponse.json({ error: "Belirtilen etap bulunamadı" }, { status: 400 })
    }

    const round = await prisma.round.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        order: Number.parseInt(order),
        stageId: Number.parseInt(stageId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })

    return NextResponse.json(round)
  } catch (error) {
    console.error("Tur güncelleme hatası:", error)
    return NextResponse.json({ error: "Tur güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Tura bağlı maçları kontrol et
    const matchesCount = await prisma.match.count({
      where: {
        roundId: Number.parseInt(params.id),
      },
    })

    if (matchesCount > 0) {
      return NextResponse.json(
        { error: "Bu tura bağlı maçlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.round.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tur silme hatası:", error)
    return NextResponse.json({ error: "Tur silinirken bir hata oluştu" }, { status: 500 })
  }
}

