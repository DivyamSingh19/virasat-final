"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PARTNER_LOGOS = [
  {
    name: "Company One",
    logo: "/logo.png",
  },
  {
    name: "Company Two",
    logo: "/logo.png",
  },
  {
    name: "Company Three",
    logo: "/logo.png",
  },
  {
    name: "Company Four",
    logo: "/logo.png",
  },
  {
    name: "Company Five",
    logo: "/logo.png",
  },
];

export function PartnerSlider() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current || !innerScrollerRef.current) return;

    const scrollerContent = Array.from(innerScrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      if (innerScrollerRef.current) {
        innerScrollerRef.current.appendChild(duplicatedItem);
      }
    });

    const scrollWidth = scrollerRef.current.offsetWidth;
    const scrollSpeed = 1;
    let scrollPos = 0;

    const scroll = () => {
      if (!scrollerRef.current || !innerScrollerRef.current) return;
      
      scrollPos += scrollSpeed;
      if (scrollPos >= scrollWidth) {
        scrollPos = 0;
      }
      innerScrollerRef.current.style.transform = `translateX(-${scrollPos}px)`;
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white py-10">
      <div className="relative w-full">
        <div
          ref={scrollerRef}
          className="scroller relative z-20 flex w-full overflow-hidden"
        >
          <div
            ref={innerScrollerRef}
            className="flex items-center gap-4 py-4"
          >
            {PARTNER_LOGOS.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex min-w-[200px] items-center justify-center px-6"
              >
                <div className="relative h-16 w-40">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 200px) 100vw, 200px"
                    className="object-contain brightness-0 grayscale transition-all duration-300 hover:brightness-100 hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-24 bg-gradient-to-r from-white" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-24 bg-gradient-to-l from-white" />
      </div>
    </div>
  );
}