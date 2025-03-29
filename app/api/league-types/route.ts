import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const leagueTypes = await prisma.leagueType.findMany({
      orderBy: {
        level: "asc",
      },
      include: {
        _count: {
          select: {
            leagues: true,
          },
        },
      },
    })
    return NextResponse.json(leagueTypes)
  } catch (error) {
    console.error("Lig tiplerini getirme hatası:", error)
    return NextResponse.json({ error: "Lig tipleri yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, level } = body

    const leagueType = await prisma.leagueType.create({
      data: {
        name,
        level: Number.parseInt(level),
      },
    })

    return NextResponse.json(leagueType)
  } catch (error) {
    console.error("Lig tipi oluşturma hatası:", error)
    return NextResponse.json({ error: "Lig tipi oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

