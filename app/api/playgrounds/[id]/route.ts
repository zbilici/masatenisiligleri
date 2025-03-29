import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const playground = await prisma.playground.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        _count: {
          select: {
            matches: true,
          },
        },
      },
    })

    if (!playground) {
      return NextResponse.json({ error: "Saha bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(playground)
  } catch (error) {
    console.error("Saha getirme hatası:", error)
    return NextResponse.json({ error: "Saha yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, address, city, capacity } = body

    const playground = await prisma.playground.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        address,
        city,
        capacity: capacity ? Number.parseInt(capacity) : null,
      },
    })

    return NextResponse.json(playground)
  } catch (error) {
    console.error("Saha güncelleme hatası:", error)
    return NextResponse.json({ error: "Saha güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Sahaya bağlı maçları kontrol et
    const matchesCount = await prisma.match.count({
      where: {
        playgroundId: Number.parseInt(params.id),
      },
    })

    if (matchesCount > 0) {
      return NextResponse.json(
        { error: "Bu sahada oynanmış maçlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.playground.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Saha silme hatası:", error)
    return NextResponse.json({ error: "Saha silinirken bir hata oluştu" }, { status: 500 })
  }
}

