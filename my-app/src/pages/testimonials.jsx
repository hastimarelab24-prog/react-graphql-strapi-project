import React, { useState } from "react";

function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Happy Customer",
      message:
        "Amazing products and excellent quality. I really loved my shopping experience.",
    },
    {
      id: 2,
      name: "Rahul Patel",
      role: "Verified Customer",
      message:
        "Great quality products and fast delivery. I will definitely shop again.",
    },
    {
      id: 3,
      name: "Neha Mehta",
      role: "Happy Customer",
      message:
        "Beautiful collection and excellent service. Highly recommended!",
    },
    {
      id: 4,
      name: "Ananya Roy",
      role: "Verified Buyer",
      message:
        "Top-notch customer support and high-quality materials. Extremely satisfied!",
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Happy Customer",
      message:
        "The delivery was super fast and packaging was secure. Will order more soon.",
    },
    {
      id: 6,
      name: "Pooja Verma",
      role: "Verified Customer",
      message:
        "Exceeded my expectations in every way. The craftsmanship is wonderful.",
    },
  ];

  // Number of cards visible at once on desktop
  const cardsToShow = 3;

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previousSlide = () => {
    setStartIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  // Helper to retrieve the 3 visible testimonials with seamless loop wrapping
  const visibleTestimonials = Array.from({ length: cardsToShow }, (_, i) => {
    return testimonials[(startIndex + i) % testimonials.length];
  });

  return (
     <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-16">
  {/* SOFT BACKGROUND GLOWS */}
  <div className="absolute top-1/2 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-200/30 blur-[100px] pointer-events-none" />
  <div className="absolute top-1/2 right-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-200/30 blur-[100px] pointer-events-none" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* HEADING SECTION */}
    <div className="mb-10 flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-6 md:flex-row md:items-end">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-violet-600">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          Testimonials
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
          What Our <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">Customers Say</span>
        </h2>
      </div>
      <p className="text-xs font-semibold text-slate-500 sm:text-sm">
        Customer reviews provide valuable feedback & insights
      </p>
    </div>

    {/* CAROUSEL WRAPPER */}
    <div className="relative px-2 sm:px-4">
      {/* 3 CARDS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visibleTestimonials.map((item) => (
          <div
            key={item.id}
            className="group relative flex min-h-[300px] flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.12)]"
          >
            <div>
              {/* QUOTE ICON */}
              <div className="mb-4 text-4xl font-black text-violet-400/60 transition-transform duration-300 group-hover:scale-110">
                “
              </div>

              {/* MESSAGE */}
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                {item.message}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              {/* RATING STARS */}
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* NAME & ROLE */}
              <h3 className="mt-2 text-base font-bold text-slate-900 transition-colors duration-200 group-hover:text-violet-600">
                {item.name}
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                {item.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIOUS BUTTON */}
      <button
        onClick={previousSlide}
        aria-label="Previous Slide"
        className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 bg-white p-3 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-violet-500/25 active:scale-95 sm:-left-5"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* NEXT BUTTON */}
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 bg-white p-3 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-violet-500/25 active:scale-95 sm:-right-5"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    {/* PAGINATION DOTS */}
    <div className="mt-10 flex justify-center gap-2">
      {testimonials.slice(0, testimonials.length - 2).map((_, index) => (
        <button
          key={index}
          onClick={() => setStartIndex(index)}
          aria-label={`Go to slide ${index + 1}`}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            startIndex === index
              ? "w-8 bg-violet-600 shadow-md shadow-violet-500/30"
              : "w-2.5 bg-slate-200 hover:bg-slate-300"
          }`}
        />
      ))}
    </div>
  </div>
</section>
  );
}

export default Testimonials;
