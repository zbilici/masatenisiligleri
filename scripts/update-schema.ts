// Bu dosyayı oluşturduktan sonra, aşağıdaki komutu çalıştırın:
// npx ts-node scripts/update-schema.ts

import { exec } from "child_process"

console.log("Prisma şeması güncelleniyor...")

// Prisma migration oluştur
exec("npx prisma migrate dev --name add_round_relation_to_match", (error, stdout, stderr) => {
  if (error) {
    console.error(`Migration hatası: ${error.message}`)
    return
  }

  if (stderr) {
    console.error(`Migration stderr: ${stderr}`)
    return
  }

  console.log(`Migration başarılı: ${stdout}`)

  // Prisma client'ı güncelle
  exec("npx prisma generate", (error, stdout, stderr) => {
    if (error) {
      console.error(`Client güncelleme hatası: ${error.message}`)
      return
    }

    if (stderr) {
      console.error(`Client güncelleme stderr: ${stderr}`)
      return
    }

    console.log(`Client güncelleme başarılı: ${stdout}`)
    console.log("İşlem tamamlandı. Uygulamayı yeniden başlatın.")
  })
})

