import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        stage: {
          include: {
            league: true,
            subLeague: true,
          },
        },
        round: true, // Şimdi round ilişkisi tanımlı olduğu için bunu ekleyebiliriz
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
        _count: {
          select: {
            individualMatches: true,
            doublesMatches: true,
          },
        },
      },
      orderBy: [
        {
          matchDate: "desc",
        },
      ],
    })
    return NextResponse.json(matches)
  } catch (error) {
    console.error("Maçları getirme hatası:", error)
    return NextResponse.json({ error: "Maçlar yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { stageId, roundId, homeTeamId, awayTeamId, matchSystemId, playgroundId, matchDate, location, status } = body

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
      include: {
        subLeagues: true,
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
      include: {
        subLeagues: true,
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

    // Takımların etaba ait olup olmadığını kontrol et
    const isHomeTeamInStage = await isTeamInStage(homeTeam, stage)
    const isAwayTeamInStage = await isTeamInStage(awayTeam, stage)

    if (!isHomeTeamInStage) {
      return NextResponse.json({ error: "Ev sahibi takım bu etaba ait değil" }, { status: 400 })
    }

    if (!isAwayTeamInStage) {
      return NextResponse.json({ error: "Deplasman takımı bu etaba ait değil" }, { status: 400 })
    }

    const match = await prisma.match.create({
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
      },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error("Maç oluşturma hatası:", error)
    return NextResponse.json({ error: "Maç oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}

// Yardımcı fonksiyon: Takımın etaba ait olup olmadığını kontrol eder
async function isTeamInStage(team: any, stage: any) {
  // Etap bir lige aitse
  if (stage.leagueId) {
    // Takım doğrudan bu lige aitse
    if (team.leagueId === stage.leagueId) {
      return true
    }
  }

  // Etap bir alt lige aitse
  if (stage.subLeagueId) {
    // Takım bu alt lige aitse
    if (team.subLeagues && team.subLeagues.some((sl: any) => sl.id === stage.subLeagueId)) {
      return true
    }
  }

  return false
}

