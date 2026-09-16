import React, { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Card from "../components/Card";
import Search from "../components/Search";
import { useNavigate } from "react-router-dom";
import Testimonials from "./testimonials";
import FeaturedProducts from "./FeaturedProducts";
import Blog from "../components/Blog";
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

      <section className="mb-12 p-6">
        {/* Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600"></p>
            <h2 className="text-3xl font-bold text-gray-900">
              Shop By Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className=" font-semibold text-blue-600 transition hover:text-blue-800 "
          >
            View All →
          </button>
        </div>
        {/* categroy grid 6 colume on desktop */}
        <div className=" grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-6 max-h-80 ">
          {/* laptop */}
          <div
            onClick={() => navigate("/Category/laptops")}
            className=" group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
          >
            <div className="h-60 overflow-hidden bg-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeBApw9lO-7QnpmjzMVd8xOTC9817YKGdnOZbx-soxlQ&s=10"
                alt="Laptops"
                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-bold text-gray-900">Laptops</h3>
              <p className="mt-1 text-xs text-gray-500">
                Laptops & Desktop PCs
              </p>
            </div>
          </div>
          {/* Smartphone */}
          <div
            onClick={() => navigate("/Category/smartphones")}
            className=" group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
          >
            <div className="h-60  overflow-hidden bg-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbq7uyxdQ3CZISpWehx7p28Y5_h2PQpa4Bat_uwYnw_w&s=10"
                alt="Smartphones"
                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-bold text-gray-900">Smartphones</h3>
              <p className="mt-1 text-xs text-gray-500">Latest Smartphones</p>
            </div>
          </div>
          {/* heandphone */}
          <div
            onClick={() => navigate("/Category/headphones")}
            className=" group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
          >
            <div className="h-60  overflow-hidden bg-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPaNoWbovWr4KwXAqjcTO0qQ6ISgJG-prN1E1wRFwdrQ&s=10"
                alt="Headphones"
                className=" h-60  w-full object-cover transition duration-500 group-hover:scale-110 "
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-bold text-gray-900">Headphones</h3>
              <p className="mt-1 text-xs text-gray-500">Audio & Accessories</p>
            </div>
          </div>
          {/* camera */}
          <div
            onClick={() => navigate("/Category/cam")}
            className=" group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
          >
            <div className="h-60  overflow-hidden bg-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnFKKbgkkBD7Ku9P5MXoJP6__Mbng53dQfntt9QCUpCg&s=10"
                alt="Camera"
                className=" h-full w-full object-cover transition duration-500 group-hover:scale-110 "
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-bold text-gray-900">Camera</h3>
              <p className="mt-1 text-xs text-gray-500">Digital Cameras</p>
            </div>
          </div>
          {/* mixer grinder */}
          <div
            onClick={() => navigate("/Category/mix-grinder")}
            className=" group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
          >
            <div className="h-60  overflow-hidden bg-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjnZk7q6HTHLTv2Rn9yTghI1U4mio-o3GCGsXlhvwmAg&s=10"
                alt="Mixer Grinder"
                className=" h-full w-full object-cover transition duration-500 group-hover:scale-110 "
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-bold text-gray-900">
                Mixer Grinder
              </h3>
              <p className="mt-1 text-xs text-gray-500">Kitchen Appliances</p>
            </div>
          </div>
          {/* Air buds */}
          <div
            onClick={() => navigate("/Category/air-buds")}
            className=" group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl "
          >
            <div className="h-60  overflow-hidden bg-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0kFqUOI3Rvk9I88FF0meFMgrbYI2tHSSa8Ne9spV00w&s=10"
                alt="Air Buds"
                className=" h-full w-full object-cover transition duration-500 group-hover:scale-110 "
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-base font-bold text-gray-900">Air Buds</h3>
              <p className="mt-1 text-xs text-gray-500">Wireless Audio</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <div id="products " className="p-6">
        <div className=" flex justify-between">
          <h2 className="text-2xl font-bold text-black mb-6">Products </h2>
          <button onClick={() => navigate("/shop")}> View All → </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

      {/* Silder auto OfferSlider */}
      {/* OFFER SLIDER */}

      <div className="w-full overflow-hidden bg-yellow-400 py-2 mt-5">
        <div className="flex h-6 items-center justify-center overflow-hidden">
          <div
            key={current}
            className="
        whitespace-nowrap
        text-center
        text-sm
        font-semibold
        text-black
        transition-all
        duration-700
        ease-in-out
      "
          >
            {offers[current]}
          </div>
        </div>
      </div>

      {/* card */}
      <div className="mx-auto grid grid-cols-1 gap-6 px-6 py-10 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-lg">
          <img
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/sub-banner-1.jpg"
            alt="Wireless Headphone"
            className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h1 className="text-3xl font-bold uppercase text-gray-900">
              Flat 30% Off
            </h1>

            <p className="mt-2 text-lg text-gray-700">
              Best Wireless Headphone
            </p>

            <button
              className="mt-5 w-fit  text-sm font-semibold underline hover:no-underline letter-sp
                   text-black transition hover:text-gray-900"
            >
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-lg">
          <img
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/sub-banner-2.jpg"
            alt="Android Smart"
            className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h1 className="text-3xl font-bold uppercase text-gray-900">
              Flat 20% Off
            </h1>

            <p className="mt-2 text-lg text-gray-700">Android Smart</p>

            <button
              className="mt-5 w-fit  text-sm font-semibold underline hover:no-underline letter-sp
                   text-black transition hover:text-gray-900"
            >
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-lg">
          <img
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/sub-banner-3.jpg"
            alt="Apple iPhone 12"
            className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h1 className="text-3xl font-bold uppercase text-gray-900">
              Flat 10% Off
            </h1>

            <p className="mt-2 text-lg text-gray-700">Apple iPhone 12 Blue</p>

            <button
              className="mt-5 w-fit  text-sm font-semibold underline hover:no-underline letter-sp
                   text-black transition hover:text-gray-900"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Testimonial page */}
      <Testimonials />

      {/* Benner section */}
      <div className="relative">
        <img
          src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/offer-banner-1.jpg"
          alt="Up to 40% off big discount"
          className="h-[350px] w-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Up to 40% off
          </p>

          <h2 className="mt-2 max-w-md text-3xl font-bold text-gray-900">
            Big Discount
          </h2>

          <p className="mt-3 max-w-md text-lg font-semibold text-gray-800">
            Chicbuy Laptop Computer 15.6"
          </p>

          <p className="mt-1 text-sm text-gray-600">12GB DDR4 • 512GB SSD</p>

          <button className="mt-6 w-fit rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-400 hover:text-black">
            Shop Now
          </button>
        </div>
      </div>

      {/* Favourite Brands  section*/}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Favourite Brands
            </h2>

            <p className="mt-3 text-gray-500">
              Discover the brands our customers love the most
            </p>
          </div>

          {/* Brands */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* Brand 1 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/01-2.png"
                alt="Brand 1"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Brand 2 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/02-2.png"
                alt="Brand 2"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Brand 3 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/03-2.png"
                alt="Brand 3"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Brand 4 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/04-2.png"
                alt="Brand 4"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Brand 5 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/05-1.png"
                alt="Brand 5"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Brand 6 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/06.png"
                alt="Brand 6"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Brand 7 */}
            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/07.png"
                alt="Brand 7"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/10.png"
                alt="Brand 8"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/08.png"
                alt="Brand 9"
                className="max-h-14 max-w-[130px] object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                // src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/09.png"
                alt="Brand 10"
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/10.png"
              />
            </div>

            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/11.png"
                alt="Brand 11"
                // className="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/11.png"
              />
            </div>

            <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                // src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/09.png"
                alt="Brand 12"
                src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2025/09/12-removebg-preview.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BLog section */}
      <Blog />
    </div>
  );
}

export default Home;
