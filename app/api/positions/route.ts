import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            playerPositions: true,
          },
        },
      },
    })
    return NextResponse.json(positions)
  } catch (error) {
    console.error("Pozisyonları getirme hatası:", error)
    return NextResponse.json({ error: "Pozisyonlar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const position = await prisma.position.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("Pozisyon oluşturma hatası:", error)
    return NextResponse.json({ error: "Pozisyon oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

