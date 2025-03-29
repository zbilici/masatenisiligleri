import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const leagues = await prisma.league.findMany({
      include: {
        season: true,
        gender: true,
        leagueType: true,
        matchSystem: true,
        _count: {
          select: {
            teams: true,
            stages: true,
            subLeagues: true,
          },
        },
      },
      orderBy: [
        {
          season: {
            startDate: "desc",
          },
        },
        {
          leagueType: {
            level: "asc",
          },
        },
      ],
    })
    return NextResponse.json(leagues)
  } catch (error) {
    console.error("Ligleri getirme hatası:", error)
    return NextResponse.json({ error: "Ligler yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, seasonId, genderId, leagueTypeId, matchSystemId } = body

    const league = await prisma.league.create({
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
    console.error("Lig oluşturma hatası:", error)
    return NextResponse.json({ error: "Lig oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

