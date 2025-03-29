import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const matchSystems = [
    {
      name: "Swaythling Cup",
      type: "PREDEFINED",
      totalMatches: 9,
      singlesCount: 9,
      doublesCount: 0,
      matchOrder: JSON.stringify(["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"]),
      description: "9 tekli maçtan oluşan klasik sistem. Her takımdan 3 oyuncu, karşı takımın her oyuncusuyla oynar.",
    },
    {
      name: "Corbillon Cup",
      type: "PREDEFINED",
      totalMatches: 5,
      singlesCount: 4,
      doublesCount: 1,
      matchOrder: JSON.stringify(["S1", "S2", "D1", "S3", "S4"]),
      description: "4 tekli ve 1 çiftli maçtan oluşan sistem. Her takımdan 2-4 oyuncu katılabilir.",
    },
    {
      name: "Olympic",
      type: "PREDEFINED",
      totalMatches: 5,
      singlesCount: 4,
      doublesCount: 1,
      matchOrder: JSON.stringify(["D1", "S1", "S2", "S3", "S4"]),
      description: "Çiftler maçı önce oynanır, ardından 4 tekli maç yapılır. Seyirci dostu bir formattır.",
    },
    {
      name: "Düsseldorf",
      type: "PREDEFINED",
      totalMatches: 6,
      singlesCount: 6,
      doublesCount: 0,
      matchOrder: JSON.stringify(["S1", "S2", "S3", "S4", "S5", "S6"]),
      description:
        "6 tekli maçtan oluşan, kulüp maçlarında yaygın kullanılan bir sistem. Her takımdan 3-6 oyuncu katılabilir.",
    },
  ]

  for (const system of matchSystems) {
    await prisma.matchSystem.upsert({
      where: { name: system.name },
      update: system,
      create: system,
    })
  }

  console.log("Maç sistemleri başarıyla eklendi.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

