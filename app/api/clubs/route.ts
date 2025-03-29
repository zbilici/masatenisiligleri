import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
      orderBy: [
        {
          name: "asc",
        },
      ],
    })
    return NextResponse.json(clubs)
  } catch (error) {
    console.error("Kulüpleri getirme hatası:", error)
    return NextResponse.json({ error: "Kulüpler yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, logo, address, phone, email, website } = body

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

    return NextResponse.json(club)
  } catch (error) {
    console.error("Kulüp oluşturma hatası:", error)
    return NextResponse.json({ error: "Kulüp oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

