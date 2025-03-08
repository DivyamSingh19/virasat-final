"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex min-h-screen">
        <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-3">
            <div className="flex items-center justify-between py-2">
              <SidebarTrigger />
              <span className="capitalize bg-secondary border border-primary/20 py-1 px-2 rounded-md text-primary text-sm flex items-center gap-1"><User className="w-4 h-4" />Admin</span>
            </div>
            {children}
        </main>
        </SidebarProvider>       
    </div>
  );
}