import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const player = await prisma.player.findUnique({
      where: {
        id: params.id,
      },
      include: {
        playerTeams: {
          include: {
            team: {
              include: {
                club: true,
              },
            },
            season: true,
          },
        },
      },
    })

    if (!player) {
      return NextResponse.json({ error: "Oyuncu bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error("Oyuncu getirme hatası:", error)
    return NextResponse.json({ error: "Oyuncu yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { firstName, lastName, birthDate, gender, licenseNumber, photo } = body

    const player = await prisma.player.update({
      where: {
        id: params.id,
      },
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        licenseNumber,
        photo,
      },
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error("Oyuncu güncelleme hatası:", error)
    return NextResponse.json({ error: "Oyuncu güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Önce oyuncunun takım ilişkilerini kontrol et
    const playerTeamsCount = await prisma.playerTeam.count({
      where: {
        playerId: params.id,
      },
    })

    if (playerTeamsCount > 0) {
      return NextResponse.json(
        { error: "Bu oyuncunun takım ilişkileri bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Oyuncunun maç ilişkilerini kontrol et
    const individualMatchesCount = await prisma.individualMatch.count({
      where: {
        OR: [{ playerId: params.id }, { opponentId: params.id }],
      },
    })

    const doublesMatchesCount = await prisma.doublesMatch.count({
      where: {
        OR: [
          { homePlayer1Id: params.id },
          { homePlayer2Id: params.id },
          { awayPlayer1Id: params.id },
          { awayPlayer2Id: params.id },
        ],
      },
    })

    if (individualMatchesCount > 0 || doublesMatchesCount > 0) {
      return NextResponse.json(
        { error: "Bu oyuncunun maç kayıtları bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.player.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Oyuncu silme hatası:", error)
    return NextResponse.json({ error: "Oyuncu silinirken bir hata oluştu" }, { status: 500 })
  }
}

