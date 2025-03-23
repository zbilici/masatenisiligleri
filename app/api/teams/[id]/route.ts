import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: params.id,
      },
      include: {
        club: true,
        league: {
          include: {
            season: true,
            gender: true,
            leagueType: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Takım detaylarını getirme hatası:", error)
    return NextResponse.json({ error: "Takım detayları getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, clubId, leagueId } = await req.json()

    // Takım kontrolü
    const existingTeam = await prisma.team.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTeam) {
      return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 })
    }

    // Kulüp kontrolü
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    })

    if (!club) {
      return NextResponse.json({ error: "Kulüp bulunamadı." }, { status: 404 })
    }

    // Lig kontrolü (opsiyonel)
    if (leagueId) {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
      })

      if (!league) {
        return NextResponse.json({ error: "Lig bulunamadı." }, { status: 404 })
      }
    }

    // Takımı güncelle
    const team = await prisma.team.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        clubId,
        leagueId,
      },
      include: {
        club: true,
        league: true,
      },
    })

    return NextResponse.json({ team, message: "Takım başarıyla güncellendi." })
  } catch (error) {
    console.error("Takım güncelleme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Takım güncellenirken bir hata oluştu." }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    // İlişkili verileri kontrol et
    const playerTeamsCount = await prisma.playerTeam.count({
      where: {
        teamId: params.id,
      },
    })

    const homeMatchesCount = await prisma.match.count({
      where: {
        homeTeamId: params.id,
      },
    })

    const awayMatchesCount = await prisma.match.count({
      where: {
        awayTeamId: params.id,
      },
    })

    if (playerTeamsCount > 0 || homeMatchesCount > 0 || awayMatchesCount > 0) {
      return NextResponse.json(
        { error: "Bu takıma bağlı oyuncular veya maçlar bulunmaktadır. Önce bunları silmelisiniz." },
        { status: 400 },
      )
    }

    // Takımı sil
    await prisma.team.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Takım başarıyla silindi." })
  } catch (error) {
    console.error("Takım silme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Takım silinirken bir hata oluştu." }, { status: 500 })
  }
}

