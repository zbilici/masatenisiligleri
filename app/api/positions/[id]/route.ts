import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const position = await prisma.position.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        playerPositions: {
          include: {
            player: true,
          },
        },
        _count: {
          select: {
            playerPositions: true,
          },
        },
      },
    })

    if (!position) {
      return NextResponse.json({ error: "Pozisyon bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(position)
  } catch (error) {
    console.error("Pozisyon getirme hatası:", error)
    return NextResponse.json({ error: "Pozisyon yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description } = body

    const position = await prisma.position.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("Pozisyon güncelleme hatası:", error)
    return NextResponse.json({ error: "Pozisyon güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Pozisyona bağlı oyuncuları kontrol et
    const playerPositionsCount = await prisma.playerPosition.count({
      where: {
        positionId: Number.parseInt(params.id),
      },
    })

    if (playerPositionsCount > 0) {
      return NextResponse.json(
        { error: "Bu pozisyona sahip oyuncular bulunmaktadır. Önce bu ilişkileri silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.position.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Pozisyon silme hatası:", error)
    return NextResponse.json({ error: "Pozisyon silinirken bir hata oluştu" }, { status: 500 })
  }
}

