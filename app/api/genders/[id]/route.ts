import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const gender = await prisma.gender.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        leagues: true,
      },
    })

    if (!gender) {
      return NextResponse.json({ error: "Cinsiyet kategorisi bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(gender)
  } catch (error) {
    console.error("Cinsiyet kategorisi getirme hatası:", error)
    return NextResponse.json({ error: "Cinsiyet kategorisi bilgileri alınamadı" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name } = body

    const gender = await prisma.gender.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
      },
    })

    return NextResponse.json(gender)
  } catch (error) {
    console.error("Cinsiyet kategorisi güncelleme hatası:", error)
    return NextResponse.json({ error: "Cinsiyet kategorisi güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Cinsiyet kategorisine bağlı ligleri kontrol et
    const leaguesCount = await prisma.league.count({
      where: {
        genderId: Number.parseInt(params.id),
      },
    })

    if (leaguesCount > 0) {
      return NextResponse.json(
        { error: "Bu cinsiyet kategorisine bağlı ligler bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.gender.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cinsiyet kategorisi silme hatası:", error)
    return NextResponse.json({ error: "Cinsiyet kategorisi silinirken bir hata oluştu" }, { status: 500 })
  }
}

