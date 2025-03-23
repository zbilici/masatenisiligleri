import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const leagueId = searchParams.get("leagueId")

    const where: any = {}
    if (leagueId) where.leagueId = leagueId

    const stages = await prisma.stage.findMany({
      where,
      include: {
        league: true,
      },
      orderBy: [{ leagueId: "asc" }, { order: "asc" }],
    })

    return NextResponse.json(stages)
  } catch (error) {
    console.error("Etapları getirme hatası:", error)
    return NextResponse.json({ error: "Etaplar getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, order, startDate, endDate, leagueId } = await req.json()

    // Lig kontrolü
    const league = await prisma.league.findUnique({
      where: {
        id: leagueId,
      },
    })

    if (!league) {
      return NextResponse.json({ error: "Lig bulunamadı." }, { status: 404 })
    }

    // Etap sıra kontrolü
    const existingStage = await prisma.stage.findFirst({
      where: {
        leagueId,
        order,
      },
    })

    if (existingStage) {
      return NextResponse.json({ error: "Bu sırada bir etap zaten mevcut." }, { status: 400 })
    }

    // Yeni etap oluştur
    const stage = await prisma.stage.create({
      data: {
        name,
        order,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leagueId,
      },
      include: {
        league: true,
      },
    })

    return NextResponse.json({ stage, message: "Etap başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Etap oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Etap oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

