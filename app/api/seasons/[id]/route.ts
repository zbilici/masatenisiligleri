import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const season = await prisma.season.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    if (!season) {
      return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(season)
  } catch (error) {
    console.error("Sezon getirme hatası:", error)
    return NextResponse.json({ error: "Sezon bilgileri alınamadı" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, startDate, endDate, isActive } = body

    // Eğer sezon aktif olarak işaretlendiyse, diğer tüm sezonları pasif yap
    if (isActive) {
      await prisma.season.updateMany({
        where: {
          id: {
            not: Number.parseInt(params.id),
          },
        },
        data: {
          isActive: false,
        },
      })
    }

    const season = await prisma.season.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    })

    return NextResponse.json(season)
  } catch (error) {
    console.error("Sezon güncelleme hatası:", error)
    return NextResponse.json({ error: "Sezon güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Sezona bağlı ligleri kontrol et
    const leaguesCount = await prisma.league.count({
      where: {
        seasonId: Number.parseInt(params.id),
      },
    })

    if (leaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu sezona bağlı ligler bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Sezona bağlı oyuncu-takım ilişkilerini kontrol et
    const playerTeamsCount = await prisma.playerTeam.count({
      where: {
        seasonId: Number.parseInt(params.id),
      },
    })

    if (playerTeamsCount > 0) {
      return NextResponse.json(
        { error: "Bu sezona bağlı oyuncu-takım ilişkileri bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.season.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sezon silme hatası:", error)
    return NextResponse.json({ error: "Sezon silinirken bir hata oluştu" }, { status: 500 })
  }
}

