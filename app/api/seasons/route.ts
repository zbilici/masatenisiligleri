import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: {
        startDate: "desc",
      },
    })

    return NextResponse.json(seasons)
  } catch (error) {
    console.error("Sezonları getirme hatası:", error)
    return NextResponse.json({ error: "Sezonlar getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, startDate, endDate, isActive } = await req.json()

    // Aktif sezon kontrolü
    if (isActive) {
      // Diğer aktif sezonları pasif yap
      await prisma.season.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      })
    }

    // Yeni sezonu oluştur
    const season = await prisma.season.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    })

    return NextResponse.json({ season, message: "Sezon başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Sezon oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Sezon oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

