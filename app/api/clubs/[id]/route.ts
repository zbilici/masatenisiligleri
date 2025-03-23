import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const club = await prisma.club.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!club) {
      return NextResponse.json({ error: "Kulüp bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error("Kulüp detaylarını getirme hatası:", error)
    return NextResponse.json({ error: "Kulüp detayları getirilirken bir hata oluştu." }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    const { name, logo, address, phone, email, website } = await req.json()

    // Kulüp kontrolü
    const existingClub = await prisma.club.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingClub) {
      return NextResponse.json({ error: "Kulüp bulunamadı." }, { status: 404 })
    }

    // Kulübü güncelle
    const club = await prisma.club.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        logo,
        address,
        phone,
        email,
        website,
      },
    })

    return NextResponse.json({ club, message: "Kulüp başarıyla güncellendi." })
  } catch (error) {
    console.error("Kulüp güncelleme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Kulüp güncellenirken bir hata oluştu." }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Admin kontrolü
    await requireAdmin()

    // İlişkili verileri kontrol et
    const teamsCount = await prisma.team.count({
      where: {
        clubId: params.id,
      },
    })

    if (teamsCount > 0) {
      return NextResponse.json(
        { error: "Bu kulübe bağlı takımlar bulunmaktadır. Önce bunları silmelisiniz." },
        { status: 400 },
      )
    }

    // Kulübü sil
    await prisma.club.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Kulüp başarıyla silindi." })
  } catch (error) {
    console.error("Kulüp silme hatası:", error)

    if (error instanceof Error && error.message === "Yönetici izni gerekli") {
      return NextResponse.json({ error: "Bu işlem için yönetici izni gereklidir." }, { status: 403 })
    }

    return NextResponse.json({ error: "Kulüp silinirken bir hata oluştu." }, { status: 500 })
  }
}

