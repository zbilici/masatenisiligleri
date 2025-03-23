import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const player = await prisma.player.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!player) {
      return NextResponse.json({ error: "Oyuncu bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error("Oyuncu detaylarını getirme hatası:", error)
    return NextResponse.json({ error: "Oyuncu detayları getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { firstName, lastName, birthDate, gender, licenseNumber, photo } = await req.json()

    // Oyuncu kontrolü
    const existingPlayer = await prisma.player.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingPlayer) {
      return NextResponse.json({ error: "Oyuncu bulunamadı." }, { status: 404 })
    }

    // Lisans numarası kontrolü (opsiyonel)
    if (licenseNumber && licenseNumber !== existingPlayer.licenseNumber) {
      const playerWithLicense = await prisma.player.findFirst({
        where: {
          licenseNumber,
          id: {
            not: params.id,
          },
        },
      })

      if (playerWithLicense) {
        return NextResponse.json(
          { error: "Bu lisans numarasına sahip başka bir oyuncu bulunmaktadır." },
          { status: 400 },
        )
      }
    }

    // Oyuncuyu güncelle
    const player = await prisma.player.update({
      where: {
        id: params.id,
      },
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        licenseNumber: licenseNumber || null,
        photo: photo || null,
      },
    })

    return NextResponse.json({ player, message: "Oyuncu başarıyla güncellendi." })
  } catch (error) {
    console.error("Oyuncu güncelleme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Oyuncu güncellenirken bir hata oluştu." }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    // İlişkili verileri kontrol et
    const playerTeamsCount = await prisma.playerTeam.count({
      where: {
        playerId: params.id,
      },
    })

    const matchScoresCount = await prisma.matchScore.count({
      where: {
        playerId: params.id,
      },
    })

    if (playerTeamsCount > 0 || matchScoresCount > 0) {
      return NextResponse.json(
        { error: "Bu oyuncuya bağlı takım üyelikleri veya maç skorları bulunmaktadır. Önce bunları silmelisiniz." },
        { status: 400 },
      )
    }

    // Oyuncuyu sil
    await prisma.player.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Oyuncu başarıyla silindi." })
  } catch (error) {
    console.error("Oyuncu silme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Oyuncu silinirken bir hata oluştu." }, { status: 500 })
  }
}

