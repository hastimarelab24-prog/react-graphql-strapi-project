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
       <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">

          {/* Heading */}
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-3xl font-semibold uppercase tracking-widest text-yellow-500">
              Our Testimonials
            </p>

            <p className="text-sm font-bold text-gray-900">
              Customer Reviews also provide valuable feedback
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">

            {/* 3 Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {visibleTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="flex min-h-[280px] flex-col justify-between rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <div className="mb-4 text-4xl text-yellow-400">
                      "
                    </div>

                    <p className="leading-relaxed text-gray-600">
                      {item.message}
                    </p>
                  </div>

                  <div>
                    <div className="mt-4 text-lg text-yellow-400">
                      ★★★★★
                    </div>

                    <h3 className="mt-3 font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Button */}
            <button
              onClick={previousSlide}
              aria-label="Previous Slide"
              className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 p-3 text-white shadow-lg transition-colors hover:bg-yellow-400 hover:text-gray-900 md:-left-6"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 p-3 text-white shadow-lg transition-colors hover:bg-yellow-400 hover:text-gray-900 md:-right-6"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7-7 7 7"
                />
              </svg>
            </button>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.slice(0, testimonials.length - 2).map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  startIndex === index
                    ? "w-8 bg-yellow-400"
                    : "w-2.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
  );
}

export default Testimonials;
