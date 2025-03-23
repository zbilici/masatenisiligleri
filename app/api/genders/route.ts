import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const genders = await prisma.gender.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(genders)
  } catch (error) {
    console.error("Cinsiyet verilerini getirme hatası:", error)
    return NextResponse.json({ error: "Cinsiyet verileri getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name } = await req.json()

    // Cinsiyet kontrolü - SQLite için büyük/küçük harf duyarsız arama
    const existingGender = await prisma.gender.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    })

    // Eğer aynı isimde bir cinsiyet kategorisi varsa (büyük/küçük harf duyarsız)
    if (existingGender && existingGender.name.toLowerCase() === name.toLowerCase()) {
      return NextResponse.json({ error: "Bu cinsiyet kategorisi zaten mevcut." }, { status: 400 })
    }

    // Yeni cinsiyet kategorisi oluştur
    const gender = await prisma.gender.create({
      data: {
        name,
      },
    })

    return NextResponse.json({ gender, message: "Cinsiyet kategorisi başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Cinsiyet oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Cinsiyet kategorisi oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

