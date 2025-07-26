
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Trophy, Image as ImageIcon, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Rate Pigeons', icon: Camera },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/leaderboard', label: 'Top Birds', icon: Trophy },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        <Link href="/" className="flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-600">Pigeon Palooza</span>
            <span className="text-xs text-gray-500">NYC Bird Rating</span>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={isActive ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Link href={item.href} className="flex items-center space-x-1">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
