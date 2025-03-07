import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="bg-secondary flex min-h-screen justify-center items-center">
        <div className="bg-background shadow p-4 rounded-xl rounded-bl-[4rem] grid grid-cols-2">
            <div className="relative bg-primary rounded-tl-2xl rounded-tr-[4rem] rounded-bl-[3.5rem] flex items-center justify-center px-6 py-24">
                <Link href="/" className="absolute top-5 left-5 flex items-center gap-1">
                    <Image src="/logo.png" alt="logo" width={35} height={35} />
                    <span className="font-bold text-xl text-white">Virasat</span>
                </Link>
                <Image src="/login-img-3.webp" width={270} height={270} alt="Banner Image" />
            </div>
            <div className="pl-6 pr-3 py-4">{children}</div>
        </div>
      </div>
    );
  }