import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: [
        {
          startDate: "desc",
        },
      ],
    })
    return NextResponse.json(seasons)
  } catch (error) {
    console.error("Sezonları getirme hatası:", error)
    return NextResponse.json({ error: "Sezonlar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, startDate, endDate, isActive } = body

    // Eğer yeni sezon aktif olarak işaretlendiyse, diğer tüm sezonları pasif yap
    if (isActive) {
      await prisma.season.updateMany({
        data: {
          isActive: false,
        },
      })
    }

    const season = await prisma.season.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive || false,
      },
    })

    return NextResponse.json(season)
  } catch (error) {
    console.error("Sezon oluşturma hatası:", error)
    return NextResponse.json({ error: "Sezon oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

