import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
    return (
        <header className="flex gap-6 items-center justify-between p-4 border-b border-b-accent">
            {/* Logo Here */}
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" width="35" height="35" alt="" className="filter" />
                <span className="font-bold text-xl">Virasat</span>
            </Link>

            {/* Navbar here */}
            <div className="flex gap-6">
                <Link href="/" className="text-neutral-600 hover:text-black">Home</Link>
                <Link href="/login" className="text-neutral-600 hover:text-black">Login</Link>
                <Link href="/register" className="text-neutral-600 hover:text-black">Register</Link>
            </div>

            {/* Navbtns here */}
            <div className="flex gap-2">
                <Button size="sm" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" variant="secondary" asChild>
                    <Link href="/signup">Signup</Link>
                </Button>
            </div>
        </header>
    )
}