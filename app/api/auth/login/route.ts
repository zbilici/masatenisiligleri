import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import prisma from "@/lib/db"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 })
    }

    // Şifre kontrolü
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Geçersiz şifre." }, { status: 401 })
    }

    // JWT token oluştur
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" },
    )

    // Cookie'ye token'ı kaydet
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 gün
    })

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Giriş başarılı.",
    })
  } catch (error) {
    console.error("Giriş hatası:", error)
    return NextResponse.json({ error: "Giriş yapılırken bir hata oluştu." }, { status: 500 })
  }
}

