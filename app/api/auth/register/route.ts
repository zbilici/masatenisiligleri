import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanılıyor." }, { status: 400 })
    }

    // Şifre hashleme
    const hashedPassword = await hash(password, 10)

    // İlk kullanıcıyı admin olarak ayarla
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "ADMIN" : "USER"

    // Kullanıcı oluşturma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: "Kullanıcı başarıyla oluşturuldu." },
      { status: 201 },
    )
  } catch (error) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json({ error: "Kullanıcı oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}

