import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const seasonId = searchParams.get("seasonId")
    const genderId = searchParams.get("genderId")
    const leagueTypeId = searchParams.get("leagueTypeId")

    const where: any = {}

    if (seasonId) where.seasonId = seasonId
    if (genderId) where.genderId = genderId
    if (leagueTypeId) where.leagueTypeId = leagueTypeId

    const leagues = await prisma.league.findMany({
      where,
      include: {
        season: true,
        gender: true,
        leagueType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(leagues)
  } catch (error) {
    console.error("Ligleri getirme hatası:", error)
    return NextResponse.json({ error: "Ligler getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, seasonId, genderId, leagueTypeId } = await req.json()

    // Lig kontrolü
    const existingLeague = await prisma.league.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        seasonId,
      },
    })

    if (existingLeague) {
      return NextResponse.json({ error: "Bu isimde bir lig zaten mevcut." }, { status: 400 })
    }

    // Yeni lig oluştur
    const league = await prisma.league.create({
      data: {
        name,
        seasonId,
        genderId,
        leagueTypeId,
      },
      include: {
        season: true,
        gender: true,
        leagueType: true,
      },
    })

    return NextResponse.json({ league, message: "Lig başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Lig oluşturma hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Lig oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

