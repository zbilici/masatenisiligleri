import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    // Önceden tanımlanmış maç sistemleri
    const predefinedSystems = [
      {
        name: "Swaythling Cup",
        type: "PREDEFINED",
        totalMatches: 9,
        singlesCount: 9,
        doublesCount: 0,
        matchOrder: JSON.stringify(["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"]),
        description:
          "9 tekli maçtan oluşan sistem. Her takımdan 3 oyuncu, karşı takımın her oyuncusuyla birer maç yapar.",
      },
      {
        name: "Corbillon Cup",
        type: "PREDEFINED",
        totalMatches: 5,
        singlesCount: 4,
        doublesCount: 1,
        matchOrder: JSON.stringify(["S1", "S2", "D1", "S3", "S4"]),
        description: "4 tekli ve 1 çiftli maçtan oluşan sistem.",
      },
      {
        name: "Olympic",
        type: "PREDEFINED",
        totalMatches: 7,
        singlesCount: 6,
        doublesCount: 1,
        matchOrder: JSON.stringify(["S1", "S2", "S3", "D1", "S4", "S5", "S6"]),
        description: "6 tekli ve 1 çiftli maçtan oluşan sistem.",
      },
      {
        name: "Düsseldorf",
        type: "PREDEFINED",
        totalMatches: 5,
        singlesCount: 5,
        doublesCount: 0,
        matchOrder: JSON.stringify(["S1", "S2", "S3", "S4", "S5"]),
        description: "5 tekli maçtan oluşan sistem.",
      },
    ]

    // Veritabanına ekle
    for (const system of predefinedSystems) {
      await prisma.matchSystem.upsert({
        where: { name: system.name },
        update: system,
        create: system,
      })
    }

    return NextResponse.json({ success: true, message: "Örnek maç sistemleri başarıyla eklendi." })
  } catch (error) {
    console.error("Örnek maç sistemleri ekleme hatası:", error)
    return NextResponse.json({ error: "Örnek maç sistemleri eklenirken bir hata oluştu" }, { status: 500 })
  }
}

