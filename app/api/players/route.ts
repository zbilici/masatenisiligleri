import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")
    const seasonId = searchParams.get("seasonId")

    let players = []

    if (teamId && seasonId) {
      // Belirli bir takım ve sezon için oyuncuları getir
      players = await prisma.player.findMany({
        where: {
          playerTeams: {
            some: {
              teamId,
              seasonId,
            },
          },
        },
        include: {
          playerTeams: {
            where: {
              teamId,
              seasonId,
            },
            include: {
              team: {
                include: {
                  club: true,
                },
              },
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
      })
    } else {
      // Tüm oyuncuları getir
      players = await prisma.player.findMany({
        include: {
          playerTeams: {
            include: {
              team: {
                include: {
                  club: true,
                },
              },
              season: true,
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
      })
    }

    return NextResponse.json(players)
  } catch (error) {
    console.error("Oyuncuları getirme hatası:", error)
    return NextResponse.json({ error: "Oyuncular getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { firstName, lastName, birthDate, gender, licenseNumber, photo } = await req.json()

    // Lisans numarası kontrolü (opsiyonel)
    if (licenseNumber) {
      const existingPlayer = await prisma.player.findFirst({
        where: {
          licenseNumber,
        },
      })

      if (existingPlayer) {
        return NextResponse.json({ error: "Bu lisans numarasına sahip bir oyuncu zaten mevcut." }, { status: 400 })
      }
    }

    // Yeni oyuncu oluştur
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

    return NextResponse.json({ player, message: "Oyuncu başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Oyuncu oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Oyuncu oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

