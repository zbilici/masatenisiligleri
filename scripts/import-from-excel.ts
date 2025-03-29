import * as XLSX from "xlsx"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Excel dosya yolunu belirtin
const EXCEL_FILE_PATH = "./data/veri.xlsx" // Bu yolu kendi Excel dosyanızın yoluna göre değiştirin

async function importFromExcel() {
  try {
    console.log(`Excel dosyası okunuyor: ${EXCEL_FILE_PATH}`)

    // Excel dosyasını oku
    const workbook = XLSX.readFile(EXCEL_FILE_PATH)

    // Tüm sheet'leri listele
    const sheetNames = workbook.SheetNames
    console.log(`Excel dosyasında bulunan sheet'ler: ${sheetNames.join(", ")}`)

    // Kulüpleri içe aktar (örnek olarak ilk sheet'i kullanıyoruz)
    if (sheetNames.includes("Kulüpler")) {
      await importClubs(workbook.Sheets["Kulüpler"])
    } else {
      console.log("Kulüpler sheet'i bulunamadı. İlk sheet kullanılıyor.")
      await importClubs(workbook.Sheets[sheetNames[0]])
    }

    // Takımları içe aktar
    if (sheetNames.includes("Takımlar")) {
      await importTeams(workbook.Sheets["Takımlar"])
    }

    // Oyuncuları içe aktar
    if (sheetNames.includes("Oyuncular")) {
      await importPlayers(workbook.Sheets["Oyuncular"])
    }

    // Ligleri içe aktar
    if (sheetNames.includes("Ligler")) {
      await importLeagues(workbook.Sheets["Ligler"])
    }

    console.log("Veri aktarımı tamamlandı!")
  } catch (error) {
    console.error("Veri aktarımı sırasında hata oluştu:", error)
  } finally {
    await prisma.$disconnect()
  }
}

async function importClubs(sheet: XLSX.WorkSheet) {
  try {
    // Sheet'i JSON'a dönüştür
    const clubs = XLSX.utils.sheet_to_json(sheet)
    console.log(`${clubs.length} kulüp verisi bulundu.`)

    // Her bir kulüp için
    for (const club of clubs) {
      // Excel'deki sütun adlarını Prisma modeline eşleştir
      // Burada Excel'deki sütun adlarına göre düzenleme yapmanız gerekebilir
      const clubData = {
        name: club["Kulüp Adı"] || club["KulupAdi"] || club["name"],
        logo: club["Logo"] || club["logo"] || null,
        address: club["Adres"] || club["address"] || null,
        phone: club["Telefon"] || club["phone"] || null,
        email: club["E-posta"] || club["email"] || null,
        website: club["Website"] || club["website"] || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Kulüp adı boş değilse ekle
      if (clubData.name) {
        // Aynı isimde kulüp var mı kontrol et
        const existingClub = await prisma.club.findFirst({
          where: {
            name: clubData.name,
          },
        })

        if (existingClub) {
          console.log(`Kulüp zaten mevcut: ${clubData.name}`)
        } else {
          // Kulübü ekle
          const newClub = await prisma.club.create({
            data: clubData,
          })
          console.log(`Kulüp eklendi: ${newClub.name} (ID: ${newClub.id})`)
        }
      } else {
        console.log("Geçersiz kulüp verisi, isim alanı boş:", club)
      }
    }

    console.log("Kulüp aktarımı tamamlandı.")
  } catch (error) {
    console.error("Kulüp aktarımı sırasında hata oluştu:", error)
  }
}

async function importTeams(sheet: XLSX.WorkSheet) {
  try {
    // Sheet'i JSON'a dönüştür
    const teams = XLSX.utils.sheet_to_json(sheet)
    console.log(`${teams.length} takım verisi bulundu.`)

    // Her bir takım için
    for (const team of teams) {
      // Kulüp adını al
      const clubName = team["Kulüp Adı"] || team["KulupAdi"] || team["club"]

      if (!clubName) {
        console.log("Geçersiz takım verisi, kulüp adı boş:", team)
        continue
      }

      // Kulübü bul
      const club = await prisma.club.findFirst({
        where: {
          name: clubName,
        },
      })

      if (!club) {
        console.log(`Kulüp bulunamadı: ${clubName}. Yeni kulüp oluşturuluyor...`)
        // Kulüp yoksa oluştur
        const newClub = await prisma.club.create({
          data: {
            name: clubName,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })

        console.log(`Yeni kulüp oluşturuldu: ${newClub.name} (ID: ${newClub.id})`)

        // Takım verilerini hazırla
        const teamData = {
          name: team["Takım Adı"] || team["TakimAdi"] || team["name"],
          clubId: newClub.id,
          leagueId: null, // Lig ID'si daha sonra güncellenebilir
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Takım adı boş değilse ekle
        if (teamData.name) {
          // Aynı isimde takım var mı kontrol et
          const existingTeam = await prisma.team.findFirst({
            where: {
              name: teamData.name,
              clubId: newClub.id,
            },
          })

          if (existingTeam) {
            console.log(`Takım zaten mevcut: ${teamData.name}`)
          } else {
            // Takımı ekle
            const newTeam = await prisma.team.create({
              data: teamData,
            })
            console.log(`Takım eklendi: ${newTeam.name} (ID: ${newTeam.id})`)
          }
        } else {
          console.log("Geçersiz takım verisi, isim alanı boş:", team)
        }
      } else {
        // Takım verilerini hazırla
        const teamData = {
          name: team["Takım Adı"] || team["TakimAdi"] || team["name"],
          clubId: club.id,
          leagueId: null, // Lig ID'si daha sonra güncellenebilir
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Takım adı boş değilse ekle
        if (teamData.name) {
          // Aynı isimde takım var mı kontrol et
          const existingTeam = await prisma.team.findFirst({
            where: {
              name: teamData.name,
              clubId: club.id,
            },
          })

          if (existingTeam) {
            console.log(`Takım zaten mevcut: ${teamData.name}`)
          } else {
            // Takımı ekle
            const newTeam = await prisma.team.create({
              data: teamData,
            })
            console.log(`Takım eklendi: ${newTeam.name} (ID: ${newTeam.id})`)
          }
        } else {
          console.log("Geçersiz takım verisi, isim alanı boş:", team)
        }
      }
    }

    console.log("Takım aktarımı tamamlandı.")
  } catch (error) {
    console.error("Takım aktarımı sırasında hata oluştu:", error)
  }
}

async function importPlayers(sheet: XLSX.WorkSheet) {
  try {
    // Sheet'i JSON'a dönüştür
    const players = XLSX.utils.sheet_to_json(sheet)
    console.log(`${players.length} oyuncu verisi bulundu.`)

    // Her bir oyuncu için
    for (const player of players) {
      // Oyuncu verilerini hazırla
      const playerData = {
        firstName: player["Ad"] || player["Adı"] || player["firstName"],
        lastName: player["Soyad"] || player["Soyadı"] || player["lastName"],
        birthDate: player["Doğum Tarihi"] ? new Date(player["Doğum Tarihi"]) : null,
        gender: player["Cinsiyet"] || player["gender"] || "Erkek", // Varsayılan değer
        licenseNumber: player["Lisans No"] || player["licenseNumber"] || null,
        photo: player["Fotoğraf"] || player["photo"] || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Ad ve soyad boş değilse ekle
      if (playerData.firstName && playerData.lastName) {
        // Aynı ad ve soyada sahip oyuncu var mı kontrol et
        const existingPlayer = await prisma.player.findFirst({
          where: {
            firstName: playerData.firstName,
            lastName: playerData.lastName,
          },
        })

        if (existingPlayer) {
          console.log(`Oyuncu zaten mevcut: ${playerData.firstName} ${playerData.lastName}`)
        } else {
          // Oyuncuyu ekle
          const newPlayer = await prisma.player.create({
            data: playerData,
          })
          console.log(`Oyuncu eklendi: ${newPlayer.firstName} ${newPlayer.lastName} (ID: ${newPlayer.id})`)

          // Takım bilgisi varsa, oyuncu-takım ilişkisi oluştur
          const teamName = player["Takım"] || player["Takım Adı"] || player["team"]
          if (teamName) {
            const team = await prisma.team.findFirst({
              where: {
                name: teamName,
              },
            })

            if (team) {
              // Aktif sezonu bul veya oluştur
              let activeSeason = await prisma.season.findFirst({
                where: {
                  isActive: true,
                },
              })

              if (!activeSeason) {
                // Aktif sezon yoksa oluştur
                const currentYear = new Date().getFullYear()
                activeSeason = await prisma.season.create({
                  data: {
                    name: `${currentYear}-${currentYear + 1} Sezonu`,
                    startDate: new Date(`${currentYear}-09-01`),
                    endDate: new Date(`${currentYear + 1}-06-30`),
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                })
                console.log(`Aktif sezon oluşturuldu: ${activeSeason.name} (ID: ${activeSeason.id})`)
              }

              // Oyuncu-takım ilişkisi oluştur
              const playerTeam = await prisma.playerTeam.create({
                data: {
                  playerId: newPlayer.id,
                  teamId: team.id,
                  seasonId: activeSeason.id,
                  joinDate: new Date(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              })

              console.log(
                `Oyuncu-takım ilişkisi oluşturuldu: ${newPlayer.firstName} ${newPlayer.lastName} - ${team.name}`,
              )
            } else {
              console.log(`Takım bulunamadı: ${teamName}`)
            }
          }
        }
      } else {
        console.log("Geçersiz oyuncu verisi, ad veya soyad alanı boş:", player)
      }
    }

    console.log("Oyuncu aktarımı tamamlandı.")
  } catch (error) {
    console.error("Oyuncu aktarımı sırasında hata oluştu:", error)
  }
}

async function importLeagues(sheet: XLSX.WorkSheet) {
  try {
    // Sheet'i JSON'a dönüştür
    const leagues = XLSX.utils.sheet_to_json(sheet)
    console.log(`${leagues.length} lig verisi bulundu.`)

    // Her bir lig için
    for (const league of leagues) {
      // Sezon bilgisini al
      const seasonName =
        league["Sezon"] || league["season"] || `${new Date().getFullYear()}-${new Date().getFullYear() + 1} Sezonu`

      // Sezon var mı kontrol et, yoksa oluştur
      let season = await prisma.season.findFirst({
        where: {
          name: seasonName,
        },
      })

      if (!season) {
        const currentYear = new Date().getFullYear()
        season = await prisma.season.create({
          data: {
            name: seasonName,
            startDate: new Date(`${currentYear}-09-01`),
            endDate: new Date(`${currentYear + 1}-06-30`),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Sezon oluşturuldu: ${season.name} (ID: ${season.id})`)
      }

      // Cinsiyet bilgisini al
      const genderName = league["Cinsiyet"] || league["gender"] || "Erkekler"

      // Cinsiyet var mı kontrol et, yoksa oluştur
      let gender = await prisma.gender.findFirst({
        where: {
          name: genderName,
        },
      })

      if (!gender) {
        gender = await prisma.gender.create({
          data: {
            name: genderName,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Cinsiyet oluşturuldu: ${gender.name} (ID: ${gender.id})`)
      }

      // Lig tipi bilgisini al
      const leagueTypeName = league["Lig Tipi"] || league["leagueType"] || "Süper Lig"
      const leagueTypeLevel = league["Seviye"] || league["level"] || 1

      // Lig tipi var mı kontrol et, yoksa oluştur
      let leagueType = await prisma.leagueType.findFirst({
        where: {
          name: leagueTypeName,
        },
      })

      if (!leagueType) {
        leagueType = await prisma.leagueType.create({
          data: {
            name: leagueTypeName,
            level: typeof leagueTypeLevel === "number" ? leagueTypeLevel : Number.parseInt(leagueTypeLevel),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Lig tipi oluşturuldu: ${leagueType.name} (ID: ${leagueType.id})`)
      }

      // Lig verilerini hazırla
      const leagueName = league["Lig Adı"] || league["name"] || `${season.name} ${gender.name} ${leagueType.name}`

      // Aynı isimde lig var mı kontrol et
      const existingLeague = await prisma.league.findFirst({
        where: {
          name: leagueName,
          seasonId: season.id,
          genderId: gender.id,
          leagueTypeId: leagueType.id,
        },
      })

      if (existingLeague) {
        console.log(`Lig zaten mevcut: ${leagueName}`)
      } else {
        // Ligi ekle
        const newLeague = await prisma.league.create({
          data: {
            name: leagueName,
            seasonId: season.id,
            genderId: gender.id,
            leagueTypeId: leagueType.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Lig eklendi: ${newLeague.name} (ID: ${newLeague.id})`)
      }
    }

    console.log("Lig aktarımı tamamlandı.")
  } catch (error) {
    console.error("Lig aktarımı sırasında hata oluştu:", error)
  }
}

// Scripti çalıştır
importFromExcel()

