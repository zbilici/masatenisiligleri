import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const stages = await prisma.stage.findMany({
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
        _count: {
          select: {
            matches: true,
            rounds: true,
          },
        },
      },
      orderBy: [
        {
          startDate: "desc",
        },
      ],
    })
    return NextResponse.json(stages)
  } catch (error) {
    console.error("Etapları getirme hatası:", error)
    return NextResponse.json({ error: "Etaplar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const stage = await prisma.stage.create({
      data: {
        name,
        order: order || 1,
        leagueId: leagueId ? Number.parseInt(leagueId) : null,
        subLeagueId: subLeagueId ? Number.parseInt(subLeagueId) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })

    return NextResponse.json(stage)
  } catch (error) {
    console.error("Etap oluşturma hatası:", error)
    return NextResponse.json({ error: "Etap oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

