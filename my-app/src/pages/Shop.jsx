import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_PRODUCTS } from "../gqloperation/queries";
import Card from "../components/Card";
import { FiChevronDown, FiGrid, FiList, FiMinus } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import useProductFilters from "../hook/useProductFilters";
import useProductSearch from "../hook/useProductSearch";

function Shop() {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);
  // search
  const allProducts = data?.products || [];

// call search hook first
    const {
    search,
    setSearch,
    clearSearch,
    products: searchProducts,
    loading: searchLoading,
    error: searchError,
  } = useProductSearch();


    // search hoy to search products, nahi to all products
  const activeProducts = search.trim() !== "" ? searchProducts : allProducts;

  // PRODUCTS
  // const products = data?.products || [];

  // pass activeProducts into useProductsFilter last
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    categories,
    filteredProducts,
  } = useProductFilters(activeProducts);



  // // PRICE LOW TO HIGH
  // if (sortBy === "price-low") {
  //   result.sort(
  //     (a, b) =>
  //       Number(a.price || 0) -
  //       Number(b.price || 0)
  //   );
  // }

  // // PRICE HIGH TO LOW
  // if (sortBy === "price-high") {
  //   result.sort(
  //     (a, b) =>
  //       Number(b.price || 0) -
  //       Number(a.price || 0)
  //   );
  // }

  // // NAME
  // if (sortBy === "name") {
  //   result.sort((a, b) =>
  //     (a.name || "").localeCompare(
  //       b.name || ""
  //     )
  //   );
  // }

  // return result;

  // LOADING

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>

          <p className="text-lg font-semibold text-gray-600">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="max-w-xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">
            Error loading products
          </h2>

          <p className="mt-3 text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white  mt-24">
      {/* //   HEADER */}
      <div className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Electronics Store
          </p>

          <h1 className="text-4xl font-bold text-gray-900">Shop</h1>

          <p className="mt-2 text-gray-500">Discover our latest products</p>
        </div>
      </div>

      {/* 
          SHOP AREA
       */}
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* 
              SIDEBAR
           */}
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            {/* CATEGORIES */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between bg-gray-100 px-5 py-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Shop By Categories
                </h2>

                <FiMinus className="text-gray-700" />
              </div>

              <div className="p-4">
                {/* ALL PRODUCTS */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All Products")}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-gray-50"
                >
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded border ${
                      selectedCategory === "All Products"
                        ? "border-yellow-400 bg-yellow-400"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedCategory === "All Products" && (
                      <span className="h-2 w-2 bg-white" />
                    )}
                  </span>

                  <span
                    className={`text-sm ${
                      selectedCategory === "All Products"
                        ? "font-semibold text-yellow-500"
                        : "text-gray-600"
                    }`}
                  >
                    Our Store ({allProducts.length})
                  </span>
                </button>

                {/* CATEGORIES */}
                {categories.map(([categoryName, count]) => (
                  <button
                    key={categoryName}
                    type="button"
                    onClick={() => setSelectedCategory(categoryName)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-gray-50"
                  >
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded border ${
                        selectedCategory === categoryName
                          ? "border-yellow-400 bg-yellow-400"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedCategory === categoryName && (
                        <span className="h-2 w-2 bg-white" />
                      )}
                    </span>

                    <span
                      className={`text-sm ${
                        selectedCategory === categoryName
                          ? "font-semibold text-yellow-500"
                          : "text-gray-600"
                      }`}
                    >
                      {categoryName} ({count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* HIGHLIGHT */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between bg-gray-100 px-5 py-4">
                <h2 className="text-lg font-bold text-gray-900">Highlight</h2>

                <FiMinus className="text-gray-700" />
              </div>

              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All Products")}
                  className="block w-full rounded px-2 py-2 text-left text-sm font-semibold text-yellow-500 hover:bg-gray-50"
                >
                  All Products
                </button>

                <button
                  type="button"
                  className="block w-full rounded px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-500"
                >
                  Best Seller
                </button>

                <button
                  type="button"
                  className="block w-full rounded px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-500"
                >
                  New Arrivals
                </button>

                <button
                  type="button"
                  className="block w-full rounded px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-500"
                >
                  Special Offers
                </button>

                <button
                  type="button"
                  className="block w-full rounded px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-500"
                >
                  Hot Items
                </button>
              </div>
            </div>
          </aside>

          {/* 
              PRODUCTS AREA
           */}
          <main className="min-w-0 flex-1">
            {/* TOP BAR */}
            <div className="mb-7 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              {/* serach */}
              <div className="mb-7 max-w-2xl">
                <div className="relative">
                  <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className=" w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm text-gray-800 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 "
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className=" absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {search && (
                  <p className="mt-2 text-sm text-gray-500">
                    Search results for "{search}"
                  </p>
                )}


                {searchLoading&& search.trim()!==""&&(
                  <p className="mt-2 text-sm text-gray-500">
                    Searching products....
                  </p>
                )}

                {
                  searchError && (
                    <p className="mt-2 text-sm text-red-100">
                      {searchError.message}
                    </p>
                  )
                }
              </div>

              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filteredProducts.length > 0 ? 1 : 0}-
                  {filteredProducts.length}
                </span>
                of
                <span className="font-semibold text-gray-800">
                  {activeProducts.length}
                </span>
                results
              </p>

              <div className="flex items-center gap-3">
                {/* SORT */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className=" h-11 w-52 appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-600 outline-none transition focus:border-yellow-400
                    "
                  >
                    <option value="default">Default sorting</option>

                    <option value="price-low">Price: Low to High</option>

                    <option value="price-high">Price: High to Low</option>

                    <option value="name">Name</option>
                  </select>

                  <FiChevronDown
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />
                </div>

                {/* GRID */}
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border transition ${
                    viewMode === "grid"
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-yellow-400"
                  }`}
                >
                  <FiGrid className="text-lg" />
                </button>

                {/* LIST */}
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border transition ${
                    viewMode === "list"
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-yellow-400"
                  }`}
                >
                  <FiList className="text-lg" />
                </button>
              </div>
            </div>

            {/* 
                PRODUCTS
             */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? `
                      grid
                      grid-cols-1
                      gap-x-6
                      gap-y-10
                      sm:grid-cols-2
                      md:grid-cols-3
                      lg:grid-cols-4
                    `
                    : `
                      grid
                      grid-cols-3
                      gap-6
                    `
                }
              >
                {filteredProducts.map((product) => (
                  <Card
                    key={product.documentId || product.id}
                    documentId={product.documentId || product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.images?.[0]?.url}
                  />
                ))}
              </div>
            ) : (
              //   NO PRODUCT
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-700">
                    No Products Found
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Please select another category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {setSelectedCategory("All Products");
                      clearSearch()
                     } }
                   
                    className="
                      mt-5
                      rounded-lg
                      bg-yellow-400
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-black
                      transition
                      hover:bg-yellow-500
                      hover:shadow-md
                      active:scale-95
                    "
                  >
                    View All Products
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
