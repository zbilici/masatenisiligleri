import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const leagueTypes = await prisma.leagueType.findMany({
      orderBy: {
        level: "asc",
      },
    })

    return NextResponse.json(leagueTypes)
  } catch (error) {
    console.error("Lig tiplerini getirme hatası:", error)
    return NextResponse.json({ error: "Lig tipleri getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, level } = await req.json()

    // Lig tipi kontrolü - SQLite için büyük/küçük harf duyarsız arama
    const existingLeagueType = await prisma.leagueType.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    })

    // Eğer aynı isimde bir lig tipi varsa (büyük/küçük harf duyarsız)
    if (existingLeagueType && existingLeagueType.name.toLowerCase() === name.toLowerCase()) {
      return NextResponse.json({ error: "Bu lig tipi zaten mevcut." }, { status: 400 })
    }

    // Yeni lig tipi oluştur
    const leagueType = await prisma.leagueType.create({
      data: {
        name,
        level,
      },
    })

    return NextResponse.json({ leagueType, message: "Lig tipi başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Lig tipi oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Lig tipi oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

