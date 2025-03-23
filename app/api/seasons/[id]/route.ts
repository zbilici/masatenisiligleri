import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const season = await prisma.season.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!season) {
      return NextResponse.json({ error: "Sezon bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(season)
  } catch (error) {
    console.error("Sezon detaylarını getirme hatası:", error)
    return NextResponse.json({ error: "Sezon detayları getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, startDate, endDate, isActive } = await req.json()

    // Sezon kontrolü
    const existingSeason = await prisma.season.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingSeason) {
      return NextResponse.json({ error: "Sezon bulunamadı." }, { status: 404 })
    }

    // Aktif sezon kontrolü
    if (isActive) {
      // Diğer aktif sezonları pasif yap
      await prisma.season.updateMany({
        where: {
          isActive: true,
          id: {
            not: params.id,
          },
        },
        data: {
          isActive: false,
        },
      })
    }

    // Sezonu güncelle
    const season = await prisma.season.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    })

    return NextResponse.json({ season, message: "Sezon başarıyla güncellendi." })
  } catch (error) {
    console.error("Sezon güncelleme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Sezon güncellenirken bir hata oluştu." }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    // İlişkili verileri kontrol et
    const leaguesCount = await prisma.league.count({
      where: {
        seasonId: params.id,
      },
    })

    if (leaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu sezona bağlı ligler bulunmaktadır. Önce bunları silmelisiniz." },
        { status: 400 },
      )
    }

    // Sezonu sil
    await prisma.season.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Sezon başarıyla silindi." })
  } catch (error) {
    console.error("Sezon silme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Sezon silinirken bir hata oluştu." }, { status: 500 })
  }
}

