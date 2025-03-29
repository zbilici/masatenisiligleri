import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const matchSystems = await prisma.matchSystem.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            leagues: true,
            subLeagues: true,
            matches: true,
          },
        },
      },
    })
    return NextResponse.json(matchSystems)
  } catch (error) {
    console.error("Maç sistemlerini getirme hatası:", error)
    return NextResponse.json({ error: "Maç sistemleri yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, totalMatches, singlesCount, doublesCount, matchOrder, description } = body

    const matchSystem = await prisma.matchSystem.create({
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
    console.error("Maç sistemi oluşturma hatası:", error)
    return NextResponse.json({ error: "Maç sistemi oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

