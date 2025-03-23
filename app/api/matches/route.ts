import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const stageId = searchParams.get("stageId")
    const teamId = searchParams.get("teamId")
    const status = searchParams.get("status")

    const where: any = {}

    if (stageId) where.stageId = stageId
    if (status) where.status = status
    if (teamId) {
      where.OR = [{ homeTeamId: teamId }, { awayTeamId: teamId }]
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        stage: {
          include: {
            league: true,
          },
        },
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
        matchScores: {
          include: {
            player: true,
          },
        },
      },
      orderBy: {
        matchDate: "desc",
      },
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Maçları getirme hatası:", error)
    return NextResponse.json({ error: "Maçlar getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { stageId, homeTeamId, awayTeamId, matchDate, location, status } = await req.json()

    // Etap kontrolü
    const stage = await prisma.stage.findUnique({
      where: {
        id: stageId,
      },
    })

    if (!stage) {
      return NextResponse.json({ error: "Etap bulunamadı." }, { status: 404 })
    }

    // Takım kontrolleri
    const homeTeam = await prisma.team.findUnique({
      where: {
        id: homeTeamId,
      },
    })

    if (!homeTeam) {
      return NextResponse.json({ error: "Ev sahibi takım bulunamadı." }, { status: 404 })
    }

    const awayTeam = await prisma.team.findUnique({
      where: {
        id: awayTeamId,
      },
    })

    if (!awayTeam) {
      return NextResponse.json({ error: "Deplasman takımı bulunamadı." }, { status: 404 })
    }

    // Aynı takım kontrolü
    if (homeTeamId === awayTeamId) {
      return NextResponse.json({ error: "Ev sahibi ve deplasman takımları aynı olamaz." }, { status: 400 })
    }

    // Yeni maç oluştur
    const match = await prisma.match.create({
      data: {
        stageId,
        homeTeamId,
        awayTeamId,
        matchDate: new Date(matchDate),
        location,
        status,
      },
      include: {
        stage: true,
        homeTeam: true,
        awayTeam: true,
      },
    })

    return NextResponse.json({ match, message: "Maç başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Maç oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Maç oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

