import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center py-24">
        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-balance leading-16">Empowering Future <span className="text-primary">Innovators</span> & <span className="text-primary">Leaders</span></h1>
          <h2 className="text-xl font-medium text-balance">Building tomorrow's technology leaders through innovation, education, and collaboration.</h2>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#">Explore</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
