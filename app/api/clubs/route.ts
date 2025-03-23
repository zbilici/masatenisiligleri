import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: {
          select: {
            teams: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(clubs)
  } catch (error) {
    console.error("Kulüpleri getirme hatası:", error)
    return NextResponse.json({ error: "Kulüpler getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, logo, address, phone, email, website } = await req.json()

    // Kulüp kontrolü - SQLite için büyük/küçük harf duyarsız arama
    const existingClub = await prisma.club.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    })

    // Eğer aynı isimde bir kulüp varsa (büyük/küçük harf duyarsız)
    if (existingClub && existingClub.name.toLowerCase() === name.toLowerCase()) {
      return NextResponse.json({ error: "Bu isimde bir kulüp zaten mevcut." }, { status: 400 })
    }

    // Yeni kulüp oluştur
    const club = await prisma.club.create({
      data: {
        name,
        logo,
        address,
        phone,
        email,
        website,
      },
    })

    return NextResponse.json({ club, message: "Kulüp başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Kulüp oluşturma hatası:", error)

    if (error instanceof Error) {
      if (error.message === "Yönetici izni gerekli") {
        return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
      }

      // Hata mesajını JSON olarak döndür
      return NextResponse.json({ error: error.message || "Kulüp oluşturulurken bir hata oluştu." }, { status: 500 })
    }

    return NextResponse.json({ error: "Kulüp oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

