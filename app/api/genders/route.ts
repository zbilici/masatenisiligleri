import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const genders = await prisma.gender.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            leagues: true,
          },
        },
      },
    })
    return NextResponse.json(genders)
  } catch (error) {
    console.error("Cinsiyet kategorilerini getirme hatası:", error)
    return NextResponse.json({ error: "Cinsiyet kategorileri yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    const gender = await prisma.gender.create({
      data: {
        name,
      },
    })

    return NextResponse.json(gender)
  } catch (error) {
    console.error("Cinsiyet kategorisi oluşturma hatası:", error)
    return NextResponse.json({ error: "Cinsiyet kategorisi oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

