import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import prisma from "./db"

// Hata ayıklama için getSession ve requireAdmin fonksiyonlarını güncelleyelim
export async function getSession() {
  try {
    // cookies() fonksiyonunu await ile kullanmalıyız
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as {
      id: string
      email: string
      role: string
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Oturum doğrulama hatası:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getSession()

  if (!user) {
    throw new Error("Kimlik doğrulama gerekli")
  }

  return user
}

export async function requireAdmin() {
  try {
    const user = await requireAuth()

    if (user.role !== "ADMIN") {
      throw new Error("Yönetici izni gerekli")
    }

    return user
  } catch (error) {
    console.error("Yönetici izni hatası:", error)
    throw error
  }
}

