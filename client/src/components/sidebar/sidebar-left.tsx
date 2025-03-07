"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Briefcase,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircle,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Users,
  Video,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Jobs",
      url: "#",
      icon: Search,
    },
    {
      title: "Events",
      url: "#",
      icon: Calendar,
      badge: "10",
    },
    {
      title: "Connections",
      url: "#",
      icon: Users,
    },
    {
      title: "Live Sessions",
      url: "#",
      icon: Video,
    },
    {
      title: "Forums",
      url: "#",
      icon: MessageCircle,
    },
    {
      title: "Opportunities",
      url: "#",
      icon: Briefcase,
    },
  ],
  navSecondary: [
    {
      title: "Memberships",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 py-2">
          <Image src="/logo.jpg" width={30} height={30} alt="logo" />
          <span className="font-semibold text-lg ">Virasat</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
