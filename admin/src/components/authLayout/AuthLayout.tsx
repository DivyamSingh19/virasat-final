"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login"); // Redirect if not authenticated
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Prevents flickering of content
  }

  return <>{children}</>;
}
