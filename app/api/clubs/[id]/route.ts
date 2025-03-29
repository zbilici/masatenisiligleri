import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const club = await prisma.club.findUnique({
      where: {
        id: Number.parseInt(params.id), // String'i Int'e dönüştür
      },
      include: {
        teams: true,
      },
    })

    if (!club) {
      return NextResponse.json({ error: "Kulüp bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error("Kulüp getirme hatası:", error)
    return NextResponse.json({ error: "Kulüp yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, logo, address, phone, email, website } = body

    const club = await prisma.club.update({
      where: {
        id: Number.parseInt(params.id), // String'i Int'e dönüştür
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

    return NextResponse.json(club)
  } catch (error) {
    console.error("Kulüp güncelleme hatası:", error)
    return NextResponse.json({ error: "Kulüp güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Önce kulübe bağlı takımları kontrol et
    const teamsCount = await prisma.team.count({
      where: {
        clubId: Number.parseInt(params.id), // String'i Int'e dönüştür
      },
    })

    if (teamsCount > 0) {
      return NextResponse.json(
        { error: "Bu kulübe bağlı takımlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.club.delete({
      where: {
        id: Number.parseInt(params.id), // String'i Int'e dönüştür
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Kulüp silme hatası:", error)
    return NextResponse.json({ error: "Kulüp silinirken bir hata oluştu" }, { status: 500 })
  }
}

