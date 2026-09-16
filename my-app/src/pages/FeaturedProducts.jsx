import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GET_ALL_PRODUCTS } from "../gqloperation/queries";
import { useNavigate } from "react-router-dom";

function FeaturedProducts() {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  const products = data?.products || [];

  // 4 cards per row × 2 rows = 8 visible
  const productsToShow = 8;

  const [startIndex, setStartIndex] = useState(0);

  // NEXT → only 1 product forward
  const nextSlide = () => {
    if (products.length <= productsToShow) return;

    setStartIndex((prev) => {
      return (prev + 1) % products.length;
    });
  };

  // PREVIOUS → only 1 product backward
  const previousSlide = () => {
    if (products.length <= productsToShow) return;

    setStartIndex((prev) => {
      return (prev - 1 + products.length) % products.length;
    });
  };

  // 8 products visible at one time
  const visibleProducts = Array.from(
    {
      length: Math.min(productsToShow, products.length),
    },
    (_, index) => {
      return products[(startIndex + index) % products.length];
    },
  );

  if (loading) {
    return (
      <section className="w-full px-6 py-12">
        <p className="text-gray-600">Loading featured products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 py-12">
        <p className="text-red-500">Error: {error.message}</p>
      </section>
    );
  }

  return (
  <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
  {/* SOFT LIGHT GLOW ACCENTS */}
  <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-violet-200/40 blur-[100px] pointer-events-none" />
  <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-amber-200/30 blur-[100px] pointer-events-none" />

  <div className="relative">
    {/* HEADER */}
    <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Our Collection
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Featured <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">Products</span>
        </h2>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={previousSlide}
          disabled={products.length <= productsToShow}
          aria-label="Previous products"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/20 active:scale-90 disabled:opacity-30 disabled:hover:border-slate-200/80 disabled:hover:bg-white/90 disabled:hover:text-slate-700"
        >
          <FiChevronLeft className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          disabled={products.length <= productsToShow}
          aria-label="Next products"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/20 active:scale-90 disabled:opacity-30 disabled:hover:border-slate-200/80 disabled:hover:bg-white/90 disabled:hover:text-slate-700"
        >
          <FiChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>

    {/* PRODUCTS GRID */}
    {products.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <div
            key={product.documentId}
            className="group relative flex h-[230px] overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]"
          >
            {/* IMAGE - LEFT */}
            <div className="relative flex w-5/12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/40 p-3">
              <img
                src={
                  product.images?.[0]?.url?.startsWith("/")
                    ? `http://localhost:1337${product.images[0].url}`
                    : product.images?.[0]?.url
                }
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            {/* CONTENT - RIGHT */}
            <div className="flex w-7/12 flex-col justify-between p-3 pl-4">
              <div>
                <span className="inline-block rounded-md bg-violet-50 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-violet-600 border border-violet-100">
                  Featured
                </span>

                <h3 
                  title={product.name}
                  className="mt-2 line-clamp-2 text-xs font-bold leading-relaxed text-slate-800 transition-colors duration-200 group-hover:text-violet-600"
                >
                  {product.name}
                </h3>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  ₹{product.price}
                </span>

                <button
                  type="button"
                  onClick={() => navigate(`/products/${product.documentId}`)}
                  className="flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-95"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center backdrop-blur-md">
        <h3 className="text-base font-semibold text-slate-700">
          No Featured Products Found
        </h3>
      </div>
    )}
  </div>
</section>
  );
}

export default FeaturedProducts;
