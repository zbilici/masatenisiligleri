"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Trophy, Home, Settings, LogOut, Layers, Flag, Building, User, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      window.location.href = "/login"
    } catch (error) {
      console.error("Çıkış hatası:", error)
    }
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/seasons", label: "Sezonlar", icon: Calendar },
    { href: "/admin/leagues", label: "Ligler", icon: Trophy },
    { href: "/admin/sub-leagues", label: "Alt Ligler", icon: GitBranch },
    { href: "/admin/stages", label: "Etaplar", icon: Layers },
    { href: "/admin/clubs", label: "Kulüpler", icon: Building },
    { href: "/admin/teams", label: "Takımlar", icon: Flag },
    { href: "/admin/players", label: "Oyuncular", icon: User },
    { href: "/admin/matches", label: "Maçlar", icon: Calendar },
    { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  ]

  return (
    <div className="w-64 bg-muted/40 border-r min-h-screen p-4">
      <div className="flex items-center gap-2 font-bold mb-8 p-2">
        <Trophy className="h-6 w-6" />
        <span>Admin Panel</span>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 w-52">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  )
}

