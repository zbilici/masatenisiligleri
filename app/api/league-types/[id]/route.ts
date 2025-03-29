import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const leagueType = await prisma.leagueType.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        leagues: true,
      },
    })

    if (!leagueType) {
      return NextResponse.json({ error: "Lig tipi bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(leagueType)
  } catch (error) {
    console.error("Lig tipi getirme hatası:", error)
    return NextResponse.json({ error: "Lig tipi bilgileri alınamadı" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, level } = body

    const leagueType = await prisma.leagueType.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        level: Number.parseInt(level),
      },
    })

    return NextResponse.json(leagueType)
  } catch (error) {
    console.error("Lig tipi güncelleme hatası:", error)
    return NextResponse.json({ error: "Lig tipi güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Lig tipine bağlı ligleri kontrol et
    const leaguesCount = await prisma.league.count({
      where: {
        leagueTypeId: Number.parseInt(params.id),
      },
    })

    if (leaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu lig tipine bağlı ligler bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.leagueType.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lig tipi silme hatası:", error)
    return NextResponse.json({ error: "Lig tipi silinirken bir hata oluştu" }, { status: 500 })
  }
}

