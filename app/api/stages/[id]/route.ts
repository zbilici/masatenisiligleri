import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const stage = await prisma.stage.findUnique({
      where: {
        id: params.id,
      },
      include: {
        league: true,
      },
    })

    if (!stage) {
      return NextResponse.json({ error: "Etap bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(stage)
  } catch (error) {
    console.error("Etap detaylarını getirme hatası:", error)
    return NextResponse.json({ error: "Etap detayları getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, order, startDate, endDate, leagueId } = await req.json()

    // Etap kontrolü
    const existingStage = await prisma.stage.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingStage) {
      return NextResponse.json({ error: "Etap bulunamadı." }, { status: 404 })
    }

    // Lig kontrolü
    const league = await prisma.league.findUnique({
      where: {
        id: leagueId,
      },
    })

    if (!league) {
      return NextResponse.json({ error: "Lig bulunamadı." }, { status: 404 })
    }

    // Etap sıra kontrolü
    const stageWithSameOrder = await prisma.stage.findFirst({
      where: {
        leagueId,
        order,
        id: {
          not: params.id,
        },
      },
    })

    if (stageWithSameOrder) {
      return NextResponse.json({ error: "Bu sırada bir etap zaten mevcut." }, { status: 400 })
    }

    // Etabı güncelle
    const stage = await prisma.stage.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        order,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leagueId,
      },
      include: {
        league: true,
      },
    })

    return NextResponse.json({ stage, message: "Etap başarıyla güncellendi." })
  } catch (error) {
    console.error("Etap güncelleme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Etap güncellenirken bir hata oluştu." }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    // İlişkili verileri kontrol et
    const matchesCount = await prisma.match.count({
      where: {
        stageId: params.id,
      },
    })

    if (matchesCount > 0) {
      return NextResponse.json(
        { error: "Bu etaba bağlı maçlar bulunmaktadır. Önce bunları silmelisiniz." },
        { status: 400 },
      )
    }

    // Etabı sil
    await prisma.stage.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Etap başarıyla silindi." })
  } catch (error) {
    console.error("Etap silme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Etap silinirken bir hata oluştu." }, { status: 500 })
  }
}

