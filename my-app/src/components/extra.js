import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingCart,
  FiHeart,
  FiArrowLeft,
  FiSearch,
  FiX,
  FiArrowUpRight,
  FiPackage,
  FiShoppingBag,
  FiCheck,
  FiSliders,
} from "react-icons/fi";

import CartSuccessModal from "../components/CartSuccessModal";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);

  // Load wishlist from localStorage.
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        setWishlistItems(
          Array.isArray(savedWishlist) ? savedWishlist : []
        );
      } catch (error) {
        console.error("Unable to load wishlist:", error);
        setWishlistItems([]);
      }
    };

    loadWishlist();

    window.addEventListener("wishlistChange", loadWishlist);

    return () => {
      window.removeEventListener("wishlistChange", loadWishlist);
    };
  }, []);

  // Persist wishlist changes.
  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem("wishlist", JSON.stringify(items));
    window.dispatchEvent(new Event("wishlistChange"));
  };

  // Remove one wishlist item.
  const handleRemove = (documentId) => {
    setRemovingId(documentId);

    const updatedWishlist = wishlistItems.filter(
      (item) => item.documentId !== documentId
    );

    saveWishlist(updatedWishlist);
    setRemovingId(null);
  };

  // Remove all wishlist items.
  const handleClearAll = () => {
    if (wishlistItems.length === 0) return;

    saveWishlist([]);
    setSearch("");
  };

  // Add product to cart.
  const handleAddToCart = (e, item) => {
    e.stopPropagation();

    // Your project stores the authentication token as "token".
    // Keep "jwt" as a fallback for older login implementations.
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt");

    if (!token) {
      navigate("/login", {
        state: { from: window.location.pathname },
      });
      return;
    }

    let oldCart = [];

    try {
      const parsedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      oldCart = Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
      oldCart = [];
    }

    const productExists = oldCart.some(
      (cartItem) => cartItem.documentId === item.documentId
    );

    if (productExists) {
      setSuccessMessage("This product is already in your cart.");
      setSuccessModal(true);
      return;
    }

    const newProduct = {
      documentId: item.documentId,
      name: item.name,
      price: item.price ?? 0,
      image: item.image || item.imageUrl || "",
      qty: 1,
    };

    const updatedCart = [...oldCart, newProduct];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartChange"));

    setSuccessMessage("Product added to your cart successfully!");
    setSuccessModal(true);
  };

  // Search and sort wishlist products.
  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = wishlistItems.filter((item) =>
      (item.name || "").toLowerCase().includes(normalizedSearch)
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      return 0;
    });
  }, [wishlistItems, search, sortBy]);

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-16 pt-24">
      <CartSuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        message={successMessage}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Premium Header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-100 backdrop-blur">
                <FiHeart className="text-rose-300" />
                YOUR PERSONAL COLLECTION
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                My Wishlist<span className="text-violet-300">.</span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                Your favorite tech, all in one place. Keep the products you
                love close and shop them whenever you're ready.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur">
                  <FiHeart className="text-rose-300" />
                  <span className="text-sm font-semibold">
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "Favorite" : "Favorites"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-indigo-100"
                >
                  Explore Shop
                  <FiArrowUpRight />
                </button>
              </div>
            </div>

            <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 md:flex">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400/30 to-violet-400/30">
                <FiHeart className="h-12 w-12 fill-rose-400 text-rose-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Search, Sort and Actions */}
        {wishlistItems.length > 0 && (
          <section className="mb-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Saved Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Find your next favorite in seconds.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-64">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your wishlist..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <FiSliders className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort wishlist products"
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 sm:w-48"
                  >
                    <option value="recent">Default Order</option>
                    <option value="name">Name: A to Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                >
                  <FiTrash2 />
                  Clear All
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Product Count */}
        {wishlistItems.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredItems.length}
              </span>{" "}
              of {wishlistItems.length} products
            </p>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <FiCheck />
              Saved for later
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const imageUrl = item.image || item.imageUrl || "";

              return (
                <article
                  key={item.documentId}
                  onClick={() =>
                    navigate(`/products/${item.documentId}`)
                  }
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5"
                >
                  {/* Product Image */}
                  <div className="relative m-3 mb-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/60">
                    <div className="flex aspect-square items-center justify-center p-5">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name || "Wishlist product"}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <FiPackage className="h-12 w-12" />
                          <span className="text-xs">Image unavailable</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute left-3 top-3 rounded-full border border-rose-100 bg-white/95 px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm backdrop-blur">
                      <span className="inline-flex items-center gap-1.5">
                        <FiHeart className="fill-rose-500" />
                        Favorite
                      </span>
                    </div>

                    {/* Remove Favorite */}
                    <button
                      type="button"
                      title="Remove from wishlist"
                      aria-label={`Remove ${item.name || "product"} from wishlist`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.documentId);
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white/95 text-slate-500 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-rose-500 hover:text-white"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full justify-center bg-gradient-to-t from-slate-900/60 to-transparent pb-4 pt-8 transition-transform duration-300 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        View Details
                        <FiArrowUpRight />
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col p-4">
                    <h2
                      title={item.name || "Product"}
                      className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-indigo-600"
                    >
                      {item.name || "Unnamed Product"}
                    </h2>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Price
                        </p>
                        <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                          ₹{Number(item.price ?? 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                        <FiArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Cart Action */}
                    <div className="mt-auto pt-5">
                      <button
                        type="button"
                        disabled={removingId === item.documentId}
                        onClick={(e) => handleAddToCart(e, item)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition duration-200 hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50"
                      >
                        <FiShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : wishlistItems.length > 0 ? (
          /* No Search Results */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <FiSearch className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              We couldn't find any saved products matching "{search}".
              Try another product name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Empty Wishlist */
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-rose-100/50 blur-3xl" />

            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-50 to-indigo-100 text-rose-500 shadow-inner">
              <FiHeart className="h-11 w-11" />
            </div>

            <p className="relative mt-7 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
              Your collection starts here
            </p>

            <h2 className="relative mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Nothing saved just yet.
            </h2>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
              Found something you love? Tap the heart on any product to save
              it here. Your favorite electronics will be waiting for you.
            </p>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="relative mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
            >
              <FiShoppingBag className="h-4 w-4" />
              Explore Products
              <FiArrowUpRight className="h-4 w-4" />
            </button>

            <div className="relative mt-5">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
              >
                <FiArrowLeft />
                Back to Home
              </button>
            </div>
          </section>
        )}

        {/* Bottom Shopping Link */}
        {wishlistItems.length > 0 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:px-7">
            <div>
              <h3 className="font-bold text-slate-900">
                Still looking for something?
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Discover more products for your collection.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:w-auto"
            >
              Continue Shopping
              <FiArrowLeft className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
