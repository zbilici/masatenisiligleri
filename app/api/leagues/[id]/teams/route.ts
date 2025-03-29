import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const teams = await prisma.team.findMany({
      where: {
        leagueId: params.id,
      },
      include: {
        club: true,
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Lig takımlarını getirme hatası:", error)
    return NextResponse.json({ error: "Lig takımları yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

