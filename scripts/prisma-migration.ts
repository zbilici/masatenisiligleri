// Bu dosyayı oluşturun ve aşağıdaki komutları çalıştırın:
// 1. npx prisma migrate reset --force
// 2. npx prisma migrate dev --name change_id_to_autoincrement
// 3. npx prisma generate

// Bu komutlar, şema değişikliklerini veritabanına uygulayacak ve Prisma Client'ı güncelleyecektir.
// NOT: migrate reset komutu tüm veritabanını sıfırlayacaktır, bu nedenle önemli verileriniz varsa önce yedekleyin!

// Eğer mevcut verileri korumak istiyorsanız, aşağıdaki adımları izleyin:
// 1. Mevcut veritabanınızı yedekleyin
// 2. Yeni bir veritabanı oluşturun
// 3. Yeni veritabanı için .env dosyasını güncelleyin
// 4. npx prisma migrate dev --name change_id_to_autoincrement
// 5. Eski veritabanından yeni veritabanına veri aktarımı yapın

