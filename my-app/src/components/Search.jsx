


import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { CiSearch } from "react-icons/ci";


import Card from "./Card";
import { SEARCH_PRODUCTS } from "../gqloperation/queries";
import useProductSearch from "../hook/useProductSearch";

function Search() {
const{search,setSearch,products,loading,error,clearSearch,
}=useProductSearch()
  return (
    <div className="mx-auto mt-16 max-w-7xl p-6">

      {/*  SEARCH BAR  */}

      <div className="mx-auto max-w-2xl">

        <div className="relative">

          {/* Search Icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                   <CiSearch />
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="
              w-full
              rounded-2xl
              border
              border-stone-300
              bg-white
              py-4
              pl-12
              pr-12
              text-lg
              text-stone-800
              outline-none
              transition
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-200
            "
          />

          {/* Clear Button */}
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-xl
                text-stone-400
                hover:text-red-500
              "
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/*  SEARCH TEXT  */}

      {search && (
        <h2 className="mt-8 text-2xl font-bold text-stone-800">
          Search results for "{search}"
        </h2>
      )}

      {/*  LOADING  */}

      {loading && (
        <div className="mt-8 text-center">
          <p className="text-lg text-stone-500">
            Searching products...
          </p>
        </div>
      )}

      {/*  ERROR  */}

      {error && (
        <div className="mt-8 rounded-xl bg-red-100 p-4 text-red-600">
          <p className="font-semibold">
            Search Error
          </p>

          <p>{error.message}</p>
        </div>
      )}

      {/*  NO PRODUCTS  */}

      {!loading &&
        !error &&
        search.trim() !== "" &&
        products.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-xl font-semibold text-stone-700">
              No products found
            </p>

            <p className="mt-2 text-stone-500">
              Try another product name.
            </p>
          </div>
        )}

      {/*  PRODUCTS  */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {products.map((product) => {
              const imageUrl =
                product.images?.[0]?.url || "";

              return (
             <Card
  documentId={product.documentId}
  name={product.name}
  price={product.price}
  stock={product.stock}
  imageUrl={product.images?.[0]?.url}

  isDiscountActive={product.isDiscountActive}
  discountType={product.discountType}
  discountValue={product.discountValue}

  categoryIsDiscountActive={
    product.category?.isDiscountActive
  }
  categoryDiscountType={
    product.category?.discountType
  }
  categoryDiscountValue={
    product.category?.discountValue
  }
/>
              );
            })}
          </div>
        )}

    </div>
  );
}

export default Search;

