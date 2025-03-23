const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcrypt")

const prisma = new PrismaClient()

async function main() {
  // Admin kullanıcısı oluştur
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log("Admin kullanıcısı oluşturuldu:", admin.email)

  // Cinsiyet kategorileri oluştur
  const erkekler = await prisma.gender.upsert({
    where: { id: "clg1" },
    update: {},
    create: {
      id: "clg1",
      name: "Erkekler",
    },
  })

  const kadinlar = await prisma.gender.upsert({
    where: { id: "clg2" },
    update: {},
    create: {
      id: "clg2",
      name: "Kadınlar",
    },
  })

  console.log("Cinsiyet kategorileri oluşturuldu")

  // Lig tipleri oluştur
  const superLig = await prisma.leagueType.upsert({
    where: { id: "clt1" },
    update: {},
    create: {
      id: "clt1",
      name: "Süper Lig",
      level: 1,
    },
  })

  const birinciLig = await prisma.leagueType.upsert({
    where: { id: "clt2" },
    update: {},
    create: {
      id: "clt2",
      name: "1. Lig",
      level: 2,
    },
  })

  const ikinciLig = await prisma.leagueType.upsert({
    where: { id: "clt3" },
    update: {},
    create: {
      id: "clt3",
      name: "2. Lig",
      level: 3,
    },
  })

  const ucuncuLig = await prisma.leagueType.upsert({
    where: { id: "clt4" },
    update: {},
    create: {
      id: "clt4",
      name: "3. Lig",
      level: 4,
    },
  })

  console.log("Lig tipleri oluşturuldu")

  // Örnek sezon oluştur
  const sezon = await prisma.season.upsert({
    where: { id: "cls1" },
    update: {},
    create: {
      id: "cls1",
      name: "2024-2025 Sezonu",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
      isActive: true,
    },
  })

  console.log("Sezon oluşturuldu:", sezon.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

