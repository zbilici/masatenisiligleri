import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const subLeagues = await prisma.subLeague.findMany({
      include: {
        league: {
          include: {
            season: true,
            gender: true,
            leagueType: true,
          },
        },
        parent: true,
        matchSystem: true,
        _count: {
          select: {
            children: true,
            stages: true,
            teams: true,
          },
        },
      },
      orderBy: [
        {
          league: {
            season: {
              startDate: "desc",
            },
          },
        },
        {
          name: "asc",
        },
      ],
    })
    return NextResponse.json(subLeagues)
  } catch (error) {
    console.error("Alt ligleri getirme hatası:", error)
    return NextResponse.json({ error: "Alt ligler yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, leagueId, parentId, matchSystemId } = body

    const subLeague = await prisma.subLeague.create({
      data: {
        name,
        leagueId: Number.parseInt(leagueId),
        parentId: parentId ? Number.parseInt(parentId) : null,
        matchSystemId: matchSystemId ? Number.parseInt(matchSystemId) : null,
      },
    })

    return NextResponse.json(subLeague)
  } catch (error) {
    console.error("Alt lig oluşturma hatası:", error)
    return NextResponse.json({ error: "Alt lig oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

