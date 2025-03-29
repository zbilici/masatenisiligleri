import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const subLeague = await prisma.subLeague.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        league: {
          include: {
            season: true,
            gender: true,
            leagueType: true,
          },
        },
        parent: true,
        children: true,
        matchSystem: true,
        teams: {
          include: {
            club: true,
          },
        },
        stages: true,
      },
    })

    if (!subLeague) {
      return NextResponse.json({ error: "Alt lig bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(subLeague)
  } catch (error) {
    console.error("Alt lig getirme hatası:", error)
    return NextResponse.json({ error: "Alt lig bilgileri alınamadı" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, leagueId, parentId, matchSystemId } = body

    // Döngüsel bağımlılık kontrolü
    if (parentId && Number.parseInt(parentId) === Number.parseInt(params.id)) {
      return NextResponse.json({ error: "Bir alt lig kendisini üst lig olarak seçemez." }, { status: 400 })
    }

    // Döngüsel bağımlılık kontrolü (daha derin seviyeler için)
    if (parentId) {
      const childIds = await getChildIds(Number.parseInt(params.id))
      if (childIds.includes(Number.parseInt(parentId))) {
        return NextResponse.json(
          { error: "Bir alt lig, kendi alt liglerinden birini üst lig olarak seçemez." },
          { status: 400 },
        )
      }
    }

    const subLeague = await prisma.subLeague.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
        leagueId: Number.parseInt(leagueId),
        parentId: parentId ? Number.parseInt(parentId) : null,
        matchSystemId: matchSystemId ? Number.parseInt(matchSystemId) : null,
      },
    })

    return NextResponse.json(subLeague)
  } catch (error) {
    console.error("Alt lig güncelleme hatası:", error)
    return NextResponse.json({ error: "Alt lig güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Alt lige bağlı alt ligleri kontrol et
    const childrenCount = await prisma.subLeague.count({
      where: {
        parentId: Number.parseInt(params.id),
      },
    })

    if (childrenCount > 0) {
      return NextResponse.json(
        { error: "Bu alt lige bağlı alt ligler bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Alt lige bağlı takımları kontrol et
    const teamsCount = await prisma.team.count({
      where: {
        subLeagues: {
          some: {
            id: Number.parseInt(params.id),
          },
        },
      },
    })

    if (teamsCount > 0) {
      return NextResponse.json(
        { error: "Bu alt lige bağlı takımlar bulunmaktadır. Önce bu ilişkileri kaldırmalısınız." },
        { status: 400 },
      )
    }

    // Alt lige bağlı etapları kontrol et
    const stagesCount = await prisma.stage.count({
      where: {
        subLeagueId: Number.parseInt(params.id),
      },
    })

    if (stagesCount > 0) {
      return NextResponse.json(
        { error: "Bu alt lige bağlı etaplar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.subLeague.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Alt lig silme hatası:", error)
    return NextResponse.json({ error: "Alt lig silinirken bir hata oluştu" }, { status: 500 })
  }
}

// Yardımcı fonksiyon: Bir alt ligin tüm alt liglerinin ID'lerini getirir
async function getChildIds(subLeagueId: number): Promise<number[]> {
  const children = await prisma.subLeague.findMany({
    where: {
      parentId: subLeagueId,
    },
    select: {
      id: true,
    },
  })

  const childIds = children.map((child) => child.id)

  // Alt liglerin alt liglerini de getir (recursive)
  for (const childId of childIds) {
    const grandChildIds = await getChildIds(childId)
    childIds.push(...grandChildIds)
  }

  return childIds
}

