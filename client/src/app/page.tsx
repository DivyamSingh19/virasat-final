import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import JobCard from "@/components/landing/job-card";
import Testimonials from "@/components/landing/testimonials";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import {
  ArrowRight,
  CircleArrowRight,
  Lightbulb,
  Telescope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      {/* Header */}
      <Header />

      {/* Home Section */}
      <section className="flex py-16 relative">
        <Container>
          <div className="grid grid-cols-2 items-start pl-4">
            <div className="flex flex-col gap-2 z-10">
              <h1 className="text-5xl font-bold">
                Welcome to <span className="text-primary">Virasat</span>
              </h1>
              <h2 className="text-4xl font-semibold">Connect, Learn, Grow.</h2>
              <p className="text-xl mt-4 mb-8">
                Building lifelong connections through a seamless alumni
                networking experience.
              </p>
              <Button size="lg" className="rounded-full w-44 p-6 hover:shadow-md" asChild>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-lg">Get Started</span>
                  <CircleArrowRight className="-rotate-45" />
                </Link>
              </Button>
            </div>
            <div className="z-10">
              <Image
                src="/hero-img.png"
                alt="hero image"
                width="600"
                height="600"
              />
            </div>
          </div>
          <div className="absolute bottom-4 left-0 w-full bg-no-repeat bg-cover bg-[url(/gradient-landing.svg)] h-[500px]"></div>

          <div className="">
            <div className="grid grid-cols-8 grid-rows-4 gap-4 p-4 -mt-56">
              <Link href="#" className="col-span-2 row-span-4 bg-background/30 backdrop-blur-lg p-4 text-xl font-medium rounded-xl border border-white/20 hover:bg-background/40">
                One-on-One Mentorship with Alumni
                <Image src="/mask.png" alt="" width="500" height="500" />
              </Link>
              <Link
                href="#jobs"
                className="relative bg-background/30 backdrop-blur-lg p-4 text-xl col-span-2 row-span-2 col-start-3 font-medium rounded-xl border border-white/20 hover:bg-background/40"
              >
                Exclusive Job & Internship Opportunities
                <Image
                  src="/Jobs.png"
                  alt=""
                  width="120"
                  height="120"
                  className="absolute bottom-0 right-0"
                />
              </Link>
              <Link href="#" className="relative bg-background/30 backdrop-blur-lg p-4 text-xl col-span-2 row-span-2 col-start-3 font-medium row-start-3 rounded-xl border border-white/20 hover:bg-background/40">
                Engage in Meaningful Discussions
                <Image
                  src="/forums.png"
                  alt=""
                  width="100"
                  height="100"
                  className="absolute bottom-0 right-0"
                />
              </Link>
              <Link href="#events" className="relative bg-background/30 backdrop-blur-lg p-4 text-xl col-span-2 row-span-2 col-start-5 font-medium row-start-3 rounded-xl border border-white/20 hover:bg-background/40">
                Live Events & Webinars
                <Image
                  src="/live-events.png"
                  alt=""
                  width="80"
                  height="80"
                  className="absolute bottom-3 right-3"
                />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Latest Jobs/Internships
                </h2>
                <p className="text-gray-600 text-lg">
                  We provide the tools, resources, and community support needed
                  to turn innovative ideas into reality. Join us in shaping the
                  future of technology and leadership.
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-[#448aff] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View All Opportunities <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <JobCard
                title="Frontend Developer"
                company="Tech Solutions Inc."
                type="Full-time"
              />
              <JobCard
                title="UX Design Intern"
                company="Creative Labs"
                type="Internship"
              />
              <JobCard
                title="Product Manager"
                company="Innovation Hub"
                type="Remote"
              />
              <Link
                href="/jobs"
                className="bg-[#448aff]/10 rounded-2xl p-6 flex items-center justify-center hover:bg-[#448aff]/15 transition-colors"
              >
                <div className="text-lg font-semibold text-[#448aff] flex items-center gap-2">
                  View More Opportunities <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">
                Upcoming Events
              </h2>
              <p className="text-gray-600 text-lg">
                We provide the tools, resources, and community support needed to
                turn innovative ideas into reality. Join us in shaping the
                future of technology and leadership.
              </p>
              <button className="flex items-center gap-2 bg-[#448aff] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Learn More <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#448aff]/5 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <Lightbulb className="w-16 h-16 text-[#448aff]" />
              </div>
              <div className="bg-[#448aff]/5 rounded-2xl p-6 aspect-square flex items-center justify-center">
                <Telescope className="w-16 h-16 text-[#448aff]" />
              </div>
              <div className="bg-[#448aff]/10 rounded-2xl p-6 aspect-square flex items-center justify-center col-span-2">
                <div className="text-2xl font-bold text-[#448aff]">
                  Innovation Hub
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-24 bg-white">
        <Testimonials />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
