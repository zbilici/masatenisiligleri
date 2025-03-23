import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const clubId = searchParams.get("clubId")
    const leagueId = searchParams.get("leagueId")

    const where: any = {}

    if (clubId) where.clubId = clubId
    if (leagueId) where.leagueId = leagueId

    const teams = await prisma.team.findMany({
      where,
      include: {
        club: true,
        league: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Takımları getirme hatası:", error)
    return NextResponse.json({ error: "Takımlar getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, clubId, leagueId } = await req.json()

    // Kulüp kontrolü
    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    })

    if (!club) {
      return NextResponse.json({ error: "Kulüp bulunamadı." }, { status: 404 })
    }

    // Lig kontrolü (opsiyonel)
    if (leagueId && leagueId !== "none") {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
      })

      if (!league) {
        return NextResponse.json({ error: "Lig bulunamadı." }, { status: 404 })
      }
    }

    // Takım kontrolü - SQLite için büyük/küçük harf duyarsız arama
    const existingTeam = await prisma.team.findFirst({
      where: {
        name: {
          contains: name,
        },
        clubId,
      },
    })

    // Eğer aynı isimde bir takım varsa (büyük/küçük harf duyarsız)
    if (existingTeam && existingTeam.name.toLowerCase() === name.toLowerCase()) {
      return NextResponse.json({ error: "Bu kulüpte aynı isimde bir takım zaten mevcut." }, { status: 400 })
    }

    // leagueId "none" ise null olarak ayarla
    const finalLeagueId = leagueId === "none" ? null : leagueId || null

    // Yeni takım oluştur
    const team = await prisma.team.create({
      data: {
        name,
        clubId,
        leagueId: finalLeagueId,
      },
      include: {
        club: true,
        league: true,
      },
    })

    return NextResponse.json({ team, message: "Takım başarıyla oluşturuldu." }, { status: 201 })
  } catch (error) {
    console.error("Takım oluşturma hatası:", error)

    if (error instanceof Error) {
      if (error.message === "Yönetici izni gerekli") {
        return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
      }

      // Hata mesajını JSON olarak döndür
      return NextResponse.json({ error: error.message || "Takım oluşturulurken bir hata oluştu." }, { status: 500 })
    }

    return NextResponse.json({ error: "Takım oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

