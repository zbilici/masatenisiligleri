import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const playgrounds = await prisma.playground.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return NextResponse.json(playgrounds)
  } catch (error) {
    console.error("Sahaları getirme hatası:", error)
    return NextResponse.json({ error: "Sahalar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, address, city, capacity } = body

    const playground = await prisma.playground.create({
      data: {
        name,
        address,
        city,
        capacity: capacity ? Number.parseInt(capacity) : null,
      },
    })

    return NextResponse.json(playground)
  } catch (error) {
    console.error("Saha oluşturma hatası:", error)
    return NextResponse.json({ error: "Saha oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

