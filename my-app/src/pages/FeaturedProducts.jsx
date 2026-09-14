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
    <section className="w-full px-6 py-12">
      {/* HEADER */}
      <div className="mb-8 flex items-end justify-between">
        {/* TITLE */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Our Collection
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
        </div>

        {/* PREVIOUS / NEXT */}
        <div className="flex gap-2">
          {/* PREVIOUS */}
          <button
            type="button"
            onClick={previousSlide}
            disabled={products.length <= productsToShow}
            aria-label="Previous products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition duration-300 hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={22} />
          </button>

          {/* NEXT */}
          <button
            type="button"
            onClick={nextSlide}
            disabled={products.length <= productsToShow}
            aria-label="Next products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition duration-300 hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <div
              key={product.documentId}
              className="group flex h-[230px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* IMAGE - LEFT */}
              <div className="relative w-1/2 overflow-hidden bg-gray-100">
                <img
                  src={
                    product.images?.[0]?.url?.startsWith("/")
                      ? `http://localhost:1337${product.images[0].url}`
                      : product.images?.[0]?.url
                  }
                  alt={product.name}
                  className="h-[150px] w-[200px] object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* TEXT - RIGHT */}
              <div className="flex w-1/2 flex-col justify-center p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-yellow-500">
                  Featured
                </p>

                <h3 className="line-clamp-3 text-sm font-bold leading-5 text-gray-900">
                  {product.name}
                </h3>

                <p className="mt-3 text-lg font-bold text-gray-900">
                  ₹{product.price}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(`/products/${product.documentId}`)}
                  className="mt-4 w-fit rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-yellow-400 hover:text-black"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-16 text-center">
          <h2 className="text-xl font-bold text-gray-700">
            No Featured Products
          </h2>
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
