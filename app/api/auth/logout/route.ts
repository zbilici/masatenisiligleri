import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Auth cookie'sini sil
    cookies().delete("auth_token")

    return NextResponse.json({
      message: "Çıkış başarılı.",
    })
  } catch (error) {
    console.error("Çıkış hatası:", error)
    return NextResponse.json({ error: "Çıkış yapılırken bir hata oluştu." }, { status: 500 })
  }
}

