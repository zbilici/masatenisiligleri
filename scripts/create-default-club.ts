import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function createDefaultClub() {
  try {
    console.log("Varsayılan kulüp oluşturuluyor...")

    // Kulüp sayısını kontrol et
    const clubCount = await prisma.club.count()
    console.log(`Mevcut kulüp sayısı: ${clubCount}`)

    if (clubCount > 0) {
      console.log("Veritabanında zaten kulüp(ler) mevcut. Yeni bir varsayılan kulüp oluşturulmayacak.")
      return
    }

    // Varsayılan kulüp oluştur
    const defaultClub = await prisma.club.create({
      data: {
        name: "Varsayılan Kulüp",
        address: "Varsayılan Adres",
        phone: "555-555-5555",
        email: "info@varsayilankulup.com",
        website: "www.varsayilankulup.com",
      },
    })

    console.log(`Varsayılan kulüp başarıyla oluşturuldu: ${defaultClub.name} (ID: ${defaultClub.id})`)
  } catch (error) {
    console.error("Hata:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Scripti çalıştır
createDefaultClub()

