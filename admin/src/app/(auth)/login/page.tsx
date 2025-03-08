"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/user/admin", {
        email,
        password,
      });
      if (res.status === 200) {
        localStorage.setItem("authToken", res.data.token); // Fix: Ensure it's "authToken"
        toast("Login success");
        router.push("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.error || "Invalid credentials");
      } else {
        setError("Login failed");
      }
    }
  };
  

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
              <div>{error && <p className="text-red-500">{error}</p>}</div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                
                </div>
                 
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
