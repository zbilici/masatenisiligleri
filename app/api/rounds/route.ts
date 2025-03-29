import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const rounds = await prisma.round.findMany({
      include: {
        stage: {
          include: {
            league: true,
            subLeague: true,
          },
        },
        _count: {
          select: {
            matches: true,
          },
        },
      },
      orderBy: [
        {
          stage: {
            startDate: "desc",
          },
        },
        {
          order: "asc",
        },
      ],
    })
    return NextResponse.json(rounds)
  } catch (error) {
    console.error("Turları getirme hatası:", error)
    return NextResponse.json({ error: "Turlar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const round = await prisma.round.create({
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
    console.error("Tur oluşturma hatası:", error)
    return NextResponse.json({ error: "Tur oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

