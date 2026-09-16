import React, { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Card from "../components/Card";
import Search from "../components/Search";
import { useNavigate } from "react-router-dom";
import Testimonials from "./testimonials";
import FeaturedProducts from "./FeaturedProducts";
import Blog from "../components/Blog";
import { brands } from "./Details";
import { GET_ALL_PRODUCTS } from "../gqloperation/queries";
// import Card from "../components/Card";

function Home() {
  const navigate = useNavigate();

  // offer
  const offers = [
    "SUMMER SALE_GET 50% OFF",
    "NEW USERS GET $100 WORTH OF MAGICPONTS ONsignup",
    "Get cashback on Minimum order of 349",
    "FREE SHIPPING FOR ALL ORDERS FROM $60+",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  if (loading) return <div className="p-6 text-white">Loading products...</div>;

  if (error)
    return (
      <div className="p-6 text-red-500">
        Error loading products: {error.message}
      </div>
    );

  return (
    <div className="w-full mt-24 ">
      {/* HERO BANNER */}
      <div
        className="relative h-[350px] md:h-[450px] rounded-xl overflow-hidden mb-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://transvelo.github.io/mediacenter-html/assets/images/sliders/slider01.jpg)",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Banner Content */}
        <div className="relative z-10 h-full flex items-center ">
          <div className="text-white px-8 md:px-16 max-w-xl">
            <p className="text-lg md:text-xl font-semibold mb-3">BIG SALE</p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Save up to <span className="text-yellow-400">40%</span>
            </h1>

            <p className="text-xl md:text-2xl font-semibold mb-2">
              Laptops & Desktop PCs
            </p>

            <p className="text-lg mb-6">Smart Phones & Electronics</p>

            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg transition duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Shop by categroy   */}

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
        {/* BACKGROUND GLOW ACCENTS */}
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-violet-200/30 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-indigo-200/30 blur-[90px] pointer-events-none" />

        <div className="relative ">
          {/* HEADING */}
          <div className="mb-8 flex items-end justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-violet-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                Explore Collections
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Shop By{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                  Category
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
            >
              View All
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* CATEGORY GRID */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {/* LAPTOPS */}
            <div
              onClick={() => navigate("/Category/laptops")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeBApw9lO-7QnpmjzMVd8xOTC9817YKGdnOZbx-soxlQ&s=10"
                  alt="Laptops"
                  className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-600">
                  Laptops
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Laptops & PCs
                </p>
              </div>
            </div>

            {/* SMARTPHONES */}
            <div
              onClick={() => navigate("/Category/smartphones")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbq7uyxdQ3CZISpWehx7p28Y5_h2PQpa4Bat_uwYnw_w&s=10"
                  alt="Smartphones"
                  className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-600">
                  Smartphones
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Latest Phones
                </p>
              </div>
            </div>

            {/* HEADPHONES */}
            <div
              onClick={() => navigate("/Category/headphones")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPaNoWbovWr4KwXAqjcTO0qQ6ISgJG-prN1E1wRFwdrQ&s=10"
                  alt="Headphones"
                  className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-600">
                  Headphones
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Audio & Gear
                </p>
              </div>
            </div>

            {/* CAMERA */}
            <div
              onClick={() => navigate("/Category/cam")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnFKKbgkkBD7Ku9P5MXoJP6__Mbng53dQfntt9QCUpCg&s=10"
                  alt="Camera"
                  className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-600">
                  Camera
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Digital Cameras
                </p>
              </div>
            </div>

            {/* MIXER GRINDER */}
            <div
              onClick={() => navigate("/Category/mix-grinder")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjnZk7q6HTHLTv2Rn9yTghI1U4mio-o3GCGsXlhvwmAg&s=10"
                  alt="Mixer Grinder"
                  className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-600">
                  Mixer Grinder
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Kitchen Appliances
                </p>
              </div>
            </div>

            {/* AIR BUDS */}
            <div
              onClick={() => navigate("/Category/air-buds")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0kFqUOI3Rvk9I88FF0meFMgrbYI2tHSSa8Ne9spV00w&s=10"
                  alt="Air Buds"
                  className="h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="pt-3 pb-1 text-center">
                <h3 className="text-sm font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-600">
                  Air Buds
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Wireless Audio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* SOFT LIGHT GLOW ACCENTS */}
        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-violet-200/30 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-indigo-200/30 blur-[90px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-8 flex items-end justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-amber-700 shadow-sm backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Fresh Arrivals
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Explore Our{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
            >
              View All
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {data?.products?.map((product) => (
              <Card
                key={product.documentId}
                documentId={product.documentId}
                name={product.name}
                price={product.price}
                imageUrl={product.images?.[0]?.url}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Silder auto OfferSlider */}
      {/* OFFER SLIDER */}

   <div className="relative my-6 w-full overflow-hidden border-y border-amber-200/60 bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 py-2.5 shadow-sm">
  {/* AMBIENT GLOW */}
  <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

  <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
    {/* ANIMATED PULSE BADGE */}
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-900 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-900" />
    </span>

    {/* ANNOUNCEMENT CONTENT */}
    <div className="flex h-6 items-center justify-center overflow-hidden">
      <p
        key={current}
        className="animate-fade-in whitespace-nowrap text-center text-xs font-extrabold uppercase tracking-widest text-slate-900 transition-all duration-700 ease-in-out sm:text-sm"
      >
        {offers[current]}
      </p>
    </div>
  </div>
</div>

      {/* card */}
      <div className="grid  grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
          <img
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/sub-banner-1.jpg"
            alt="Wireless Headphone"
            className="h-[260px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-[300px]"
          />

          {/* GRADIENT OVERLAY FOR READABILITY */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent p-6 sm:p-8 flex flex-col justify-center">
            <span className="inline-block w-fit rounded-full bg-violet-600/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-violet-600 border border-violet-200/50">
              Limited Deal
            </span>

            <h2 className="mt-2 text-2xl font-black uppercase text-slate-900 sm:text-3xl">
              Flat 30% Off
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-700 sm:text-base">
              Best Wireless Headphone
            </p>

            <button
              type="button"
              className="mt-5 flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-95"
            >
              Shop Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
          <img
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/sub-banner-2.jpg"
            alt="Android Smart"
            className="h-[260px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-[300px]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent p-6 sm:p-8 flex flex-col justify-center">
            <span className="inline-block w-fit rounded-full bg-indigo-600/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 border border-indigo-200/50">
              Smart Tech
            </span>

            <h2 className="mt-2 text-2xl font-black uppercase text-slate-900 sm:text-3xl">
              Flat 20% Off
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-700 sm:text-base">
              Android Smart
            </p>

            <button
              type="button"
              className="mt-5 flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-95"
            >
              Shop Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
          <img
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/sub-banner-3.jpg"
            alt="Apple iPhone 12"
            className="h-[260px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-[300px]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent p-6 sm:p-8 flex flex-col justify-center">
            <span className="inline-block w-fit rounded-full bg-amber-600/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-700 border border-amber-200/50">
              Special Offer
            </span>

            <h2 className="mt-2 text-2xl font-black uppercase text-slate-900 sm:text-3xl">
              Flat 10% Off
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-700 sm:text-base">
              Apple iPhone 12 Blue
            </p>

            <button
              type="button"
              className="mt-5 flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-95"
            >
              Shop Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Testimonial page */}
      <Testimonials />

      {/* Benner section */}
   <section className="relative w-full my-10 mx-auto max-w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-xl transition-all duration-500 hover:shadow-2xl">
  {/* BANNER IMAGE */}
  <img
    src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/offer-banner-1.jpg"
    alt="Up to 40% off big discount"
    className="h-[320px] w-full object-cover transition-transform duration-700 ease-out hover:scale-105 sm:h-[400px]"
  />

  {/* GRADIENT OVERLAY FOR READABILITY */}
  <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent p-6 sm:p-12 flex flex-col justify-center">
    <div className="max-w-xl">
      {/* DISCOUNT BADGE */}
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-500/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-700 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        Up to 40% Off
      </span>

      {/* HEADING */}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
        Big <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">Discount</span>
      </h2>

      {/* PRODUCT TITLE */}
      <p className="mt-3 text-base font-bold text-slate-800 sm:text-xl">
        Chicbuy Laptop Computer 15.6"
      </p>

      {/* SPECS BADGES */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
        <span className="rounded-md bg-slate-100/80 px-2.5 py-1 backdrop-blur-sm border border-slate-200/60">
          12GB DDR4
        </span>
        <span className="text-slate-300">•</span>
        <span className="rounded-md bg-slate-100/80 px-2.5 py-1 backdrop-blur-sm border border-slate-200/60">
          512GB SSD
        </span>
      </div>

      {/* CTA BUTTON */}
      <button
        type="button"
        className="group mt-6 flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-95 sm:text-sm"
      >
        Shop Now
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </div>
  </div>
</section>

      {/* Favourite Brands  section*/}
   <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-violet-600">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              Trusted Partners
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Favourite <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">Brands</span>
            </h2>
          </div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            Discover the brands our customers love the most
          </p>
        </div>

        {/* BRANDS GRID */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group relative flex h-24 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-[0_15px_30px_-10px_rgba(124,58,237,0.12)]"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className="max-h-12 max-w-[110px] object-contain transition-all duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
      {/* BLog section */}
      <Blog />
    </div>
  );
}

export default Home;
