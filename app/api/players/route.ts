import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: {
        _count: {
          select: {
            playerTeams: true,
          },
        },
      },
      orderBy: [
        {
          lastName: "asc",
        },
        {
          firstName: "asc",
        },
      ],
    })
    return NextResponse.json(players)
  } catch (error) {
    console.error("Oyuncuları getirme hatası:", error)
    return NextResponse.json({ error: "Oyuncular yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, birthDate, gender, licenseNumber, photo } = body

    const player = await prisma.player.create({
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        licenseNumber,
        photo,
      },
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error("Oyuncu oluşturma hatası:", error)
    return NextResponse.json({ error: "Oyuncu oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

