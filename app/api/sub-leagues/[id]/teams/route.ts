import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const subLeague = await prisma.subLeague.findUnique({
      where: {
        id: params.id,
      },
      include: {
        teams: {
          include: {
            club: true,
          },
        },
      },
    })

    if (!subLeague) {
      return NextResponse.json({ error: "Alt lig bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(subLeague.teams)
  } catch (error) {
    console.error("Alt lig takımlarını getirme hatası:", error)
    return NextResponse.json({ error: "Alt lig takımları yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { teamIds } = body

    // Önce mevcut ilişkileri temizle
    await prisma.subLeague.update({
      where: {
        id: params.id,
      },
      data: {
        teams: {
          set: [],
        },
      },
    })

    // Yeni ilişkileri ekle
    const subLeague = await prisma.subLeague.update({
      where: {
        id: params.id,
      },
      data: {
        teams: {
          connect: teamIds.map((id: string) => ({ id })),
        },
      },
      include: {
        teams: true,
      },
    })

    return NextResponse.json(subLeague)
  } catch (error) {
    console.error("Alt lig takımlarını güncelleme hatası:", error)
    return NextResponse.json({ error: "Alt lig takımları güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

