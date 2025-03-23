import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const match = await prisma.match.findUnique({
      where: {
        id: params.id,
      },
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
    })

    if (!match) {
      return NextResponse.json({ error: "Maç bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error("Maç detaylarını getirme hatası:", error)
    return NextResponse.json({ error: "Maç detayları getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { stageId, homeTeamId, awayTeamId, matchDate, location, status } = await req.json()

    // Maç kontrolü
    const existingMatch = await prisma.match.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingMatch) {
      return NextResponse.json({ error: "Maç bulunamadı." }, { status: 404 })
    }

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

    // Maçı güncelle
    const match = await prisma.match.update({
      where: {
        id: params.id,
      },
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

    return NextResponse.json({ match, message: "Maç başarıyla güncellendi." })
  } catch (error) {
    console.error("Maç güncelleme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Maç güncellenirken bir hata oluştu." }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    // İlişkili verileri kontrol et
    const matchScoresCount = await prisma.matchScore.count({
      where: {
        matchId: params.id,
      },
    })

    if (matchScoresCount > 0) {
      return NextResponse.json(
        { error: "Bu maça bağlı skorlar bulunmaktadır. Önce bunları silmelisiniz." },
        { status: 400 },
      )
    }

    // Maçı sil
    await prisma.match.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Maç başarıyla silindi." })
  } catch (error) {
    console.error("Maç silme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Maç silinirken bir hata oluştu." }, { status: 500 })
  }
}

