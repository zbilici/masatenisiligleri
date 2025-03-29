import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const playerPositions = await prisma.playerPosition.findMany({
      where: {
        playerId: Number.parseInt(params.id),
      },
      include: {
        position: true,
      },
    })

    return NextResponse.json(playerPositions)
  } catch (error) {
    console.error("Oyuncu pozisyonlarını getirme hatası:", error)
    return NextResponse.json({ error: "Oyuncu pozisyonları yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { positionIds } = body

    // Önce mevcut ilişkileri temizle
    await prisma.playerPosition.deleteMany({
      where: {
        playerId: Number.parseInt(params.id),
      },
    })

    // Yeni ilişkileri ekle
    const playerPositions = await Promise.all(
      positionIds.map(async (item: { id: number; isPrimary: boolean }) => {
        return prisma.playerPosition.create({
          data: {
            playerId: Number.parseInt(params.id),
            positionId: item.id,
            isPrimary: item.isPrimary,
          },
        })
      }),
    )

    return NextResponse.json(playerPositions)
  } catch (error) {
    console.error("Oyuncu pozisyonlarını güncelleme hatası:", error)
    return NextResponse.json({ error: "Oyuncu pozisyonları güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

