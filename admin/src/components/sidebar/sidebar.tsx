"use client"
import { BriefcaseBusiness, Calendar, ChartLine, ChevronUp, Home, Inbox, LogOut, NewspaperIcon, Search, Settings, User, User2, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"

// const router = useRouter();

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Manage Jobs",
    url: "/manage-jobs",
    icon: BriefcaseBusiness,
  },
  // {
  //   title: "Analytics",
  //   url: "#",
  //   icon: ChartLine,
  // },
  {
    title: "Manage News",
    url: "#",
    icon: NewspaperIcon,
  },
  {
    title: "Manage Users",
    url: "/manage-users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]


export function AppSidebar() {

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   router.push("/login");
  // }

  
  return (
    <Sidebar>
        <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 py-2">
          <Image src="/logo.png" width={30} height={30} alt="logo" />
          <span className="font-semibold text-lg ">Virasat</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> <span className="truncate">Username</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="flex items-center">
                  <User /> <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <LogOut /> <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
