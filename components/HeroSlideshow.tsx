"useClient";
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "/images/hero-praise.jpg",
    title: "Faith & Worship",
    subtitle: "Opening Praise & Worship Day"
  },
  {
    image: "/images/hero-sports.jpg",
    title: "Competition & Unity",
    subtitle: "Sports Day & Inter-Team Battles"
  },
  {
    image: "/images/hero-picnic.jpg",
    title: "The Grand Picnic",
    subtitle: "4 Teams · One Federation Field"
  },
  {
    image: "/images/schedule-monastery.jpg",
    title: "Serenity & Reflection",
    subtitle: "Thanksgiving & Monastery Visitation"
  }
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] overflow-hidden rounded-md border border-border shadow-2xl mb-12 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Images */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center scale-105 transition-transform duration-[7000ms] ease-out"
            priority={idx === 0}
          />
          {/* Gradient Overlay for visual warmth and contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-jet/90 via-jet/50 to-jet/30" />
        </div>
      ))}

      {/* Foreground Content inside Slideshow */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-14 text-paper-soft pointer-events-none">
        <div className="max-w-[640px]">
          <span className="inline-block bg-accent/90 text-paper-soft text-[10px] sm:text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm mb-3 backdrop-blur">
            {SLIDES[current].subtitle}
          </span>
          <h2 className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl text-paper-soft drop-shadow-md leading-tight">
            {SLIDES[current].title}
          </h2>
        </div>
      </div>

      {/* Manual Slide Controls */}
      <button
        onClick={prev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-jet/60 text-paper-soft hover:bg-accent transition-colors backdrop-blur border border-white/10 opacity-80 group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-jet/60 text-paper-soft hover:bg-accent transition-colors backdrop-blur border border-white/10 opacity-80 group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-5 right-6 sm:right-10 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? "w-7 bg-accent" : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
