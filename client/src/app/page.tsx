import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function Home() {
  return (
    <>
      <Header />
      <section className="flex items-center justify-center py-10">
        <h1 className="text-5xl font-bold">Landing Page</h1>
      </section>
      <Footer />
    </>
  );
}
