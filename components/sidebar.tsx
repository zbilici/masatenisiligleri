"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Home,
  Users,
  Trophy,
  Flag,
  Layers,
  Building,
  User,
  Map,
  Compass,
  Award,
  CalendarIcon,
  Settings,
} from "lucide-react"

const items = [
  {
    title: "Ana Sayfa",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Sezonlar",
    href: "/admin/seasons",
    icon: Calendar,
  },
  {
    title: "Cinsiyet Kategorileri",
    href: "/admin/genders",
    icon: Users,
  },
  {
    title: "Lig Tipleri",
    href: "/admin/league-types",
    icon: Trophy,
  },
  {
    title: "Ligler",
    href: "/admin/leagues",
    icon: Flag,
  },
  {
    title: "Alt Ligler",
    href: "/admin/sub-leagues",
    icon: Layers,
  },
  {
    title: "Etaplar",
    href: "/admin/stages",
    icon: CalendarIcon,
  },
  {
    title: "Turlar",
    href: "/admin/rounds",
    icon: Compass,
  },
  {
    title: "Kulüpler",
    href: "/admin/clubs",
    icon: Building,
  },
  {
    title: "Takımlar",
    href: "/admin/teams",
    icon: Users,
  },
  {
    title: "Oyuncular",
    href: "/admin/players",
    icon: User,
  },
  {
    title: "Pozisyonlar",
    href: "/admin/positions",
    icon: Award,
  },
  {
    title: "Sahalar",
    href: "/admin/playgrounds",
    icon: Map,
  },
  {
    title: "Maçlar",
    href: "/admin/matches",
    icon: Calendar,
  },
  {
    title: "Maç Sistemleri",
    href: "/admin/match-systems",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full space-y-2 py-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            pathname === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </div>
  )
}

