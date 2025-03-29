import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const match = await prisma.match.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        stage: {
          include: {
            league: true,
            subLeague: true,
          },
        },
        round: true,
        homeTeam: {
          include: {
            club: true,
          },
        },
        awayTeam: {
          include: {
            club: true,
          },
        },
        matchSystem: true,
        playground: true,
        individualMatches: {
          include: {
            player: true,
            opponent: true,
            sets: true,
          },
        },
        doublesMatches: {
          include: {
            homePlayer1: true,
            homePlayer2: true,
            awayPlayer1: true,
            awayPlayer2: true,
            sets: true,
          },
        },
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Maç bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error("Maç getirme hatası:", error)
    return NextResponse.json({ error: "Maç yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      stageId,
      roundId,
      homeTeamId,
      awayTeamId,
      matchSystemId,
      playgroundId,
      matchDate,
      location,
      status,
      homeScore,
      awayScore,
    } = body

    // Etabın var olup olmadığını kontrol et
    const stage = await prisma.stage.findUnique({
      where: {
        id: stageId,
      },
    })

    if (!stage) {
      return NextResponse.json({ error: "Belirtilen etap bulunamadı" }, { status: 400 })
    }

    // Turun var olup olmadığını kontrol et (eğer belirtilmişse)
    if (roundId) {
      const round = await prisma.round.findUnique({
        where: {
          id: roundId,
        },
      })

      if (!round) {
        return NextResponse.json({ error: "Belirtilen tur bulunamadı" }, { status: 400 })
      }

      // Turun etaba ait olup olmadığını kontrol et
      if (round.stageId !== stageId) {
        return NextResponse.json({ error: "Belirtilen tur bu etaba ait değil" }, { status: 400 })
      }
    }

    // Ev sahibi takımın var olup olmadığını kontrol et
    const homeTeam = await prisma.team.findUnique({
      where: {
        id: homeTeamId,
      },
    })

    if (!homeTeam) {
      return NextResponse.json({ error: "Belirtilen ev sahibi takım bulunamadı" }, { status: 400 })
    }

    // Deplasman takımının var olup olmadığını kontrol et
    const awayTeam = await prisma.team.findUnique({
      where: {
        id: awayTeamId,
      },
    })

    if (!awayTeam) {
      return NextResponse.json({ error: "Belirtilen deplasman takımı bulunamadı" }, { status: 400 })
    }

    // Maç sisteminin var olup olmadığını kontrol et (eğer belirtilmişse)
    if (matchSystemId) {
      const matchSystem = await prisma.matchSystem.findUnique({
        where: {
          id: matchSystemId,
        },
      })

      if (!matchSystem) {
        return NextResponse.json({ error: "Belirtilen maç sistemi bulunamadı" }, { status: 400 })
      }
    }

    // Sahanın var olup olmadığını kontrol et (eğer belirtilmişse)
    if (playgroundId) {
      const playground = await prisma.playground.findUnique({
        where: {
          id: playgroundId,
        },
      })

      if (!playground) {
        return NextResponse.json({ error: "Belirtilen saha bulunamadı" }, { status: 400 })
      }
    }

    // Takımların aynı olup olmadığını kontrol et
    if (homeTeamId === awayTeamId) {
      return NextResponse.json({ error: "Ev sahibi takım ve deplasman takımı aynı olamaz" }, { status: 400 })
    }

    const match = await prisma.match.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        stageId,
        roundId,
        homeTeamId,
        awayTeamId,
        matchSystemId,
        playgroundId,
        matchDate: new Date(matchDate),
        location,
        status,
        homeScore,
        awayScore,
      },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error("Maç güncelleme hatası:", error)
    return NextResponse.json({ error: "Maç güncellenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Maça bağlı bireysel maçları kontrol et
    const individualMatchesCount = await prisma.individualMatch.count({
      where: {
        matchId: Number.parseInt(params.id),
      },
    })

    if (individualMatchesCount > 0) {
      return NextResponse.json(
        { error: "Bu maça bağlı bireysel maçlar bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    // Maça bağlı çiftler maçlarını kontrol et
    const doublesMatchesCount = await prisma.doublesMatch.count({
      where: {
        matchId: Number.parseInt(params.id),
      },
    })

    if (doublesMatchesCount > 0) {
      return NextResponse.json(
        { error: "Bu maça bağlı çiftler maçları bulunmaktadır. Önce onları silmelisiniz." },
        { status: 400 },
      )
    }

    await prisma.match.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Maç silme hatası:", error)
    return NextResponse.json({ error: "Maç silinirken bir hata oluştu" }, { status: 500 })
  }
}

