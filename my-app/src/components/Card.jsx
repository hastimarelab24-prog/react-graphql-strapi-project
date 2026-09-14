import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

function Card({ documentId, name, price, imageUrl }) {
  const navigate = useNavigate();

  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `http://localhost:1337${imageUrl}`
    : "";

  // viwe
  const viewProduct = (e) => {
    e.stopPropagation();
    navigate(`/products/${documentId}`);
  };

  // addtocard
  const addToCart = (e) => {
    e.stopPropagation();
    // login to first
    const token = localStorage.getItem("token");
    if (!token) {
      alert("please Login first to add products to cart");
      navigate("/login");
      return;
    }

    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

    const productExist = oldCart.find((item) => item.documentId === documentId);

    if (productExist) {
      alert("Product already added to cart");
      return;
    }

    const newProduct = {
      documentId,
      name,
      price,
      image: fullImageUrl,
      qty: 1,
    };

    localStorage.setItem("cart", JSON.stringify([...oldCart, newProduct]));

    alert("Product added to cart");
  };

  // wishlist
  const addToWishlist = (e) => {
    e.stopPropagation();

    // login to first
    const token = localStorage.getItem("token");
    if (!token) {
      alert("please Login first to add products to cart");
      navigate("/login");
      return;
    }

    const oldWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const productExist = oldWishlist.find(
      (item) => item.documentId === documentId,
    );

    if (productExist) {
      alert("Product already added to wishlist");
      return;
    }

    const newWishlistProduct = {
      documentId,
      name,
      price,
      image: fullImageUrl,
    };

    localStorage.setItem(
      "wishlist",
      JSON.stringify([...oldWishlist, newWishlistProduct]),
    );

    alert("Product added to wishlist");
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-2xl">
      {/* IMAGE */}
      <div className="relative h-72 overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={name || "Product"}
            className="h-full w-full object-contain p-6 transition-all duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No Image Available
          </div>
        )}

        {/* SALE */}
        <span className="absolute left-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Sale
        </span>

        {/* HOVER ICONS */}
        <div className="absolute right-4 top-4 flex translate-x-8 flex-col gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          {/* WISHLIST */}
          <button
            type="button"
            onClick={addToWishlist}
            title="Wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-rose-500 hover:text-white"
          >
            <FiHeart />
          </button>

          {/* VIEW */}
          <button
            type="button"
            onClick={viewProduct}
            title="View Product"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-indigo-600 hover:text-white"
          >
            <FiEye />
          </button>
        </div>

        {/* QUICK CART - HOVER */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-20 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={addToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:bg-indigo-600"
          >
            <FiShoppingCart />
            Add to Cart
          </button>
        </div>
      </div>

      {/* PRODUCT CONTENT */}
      <div className="p-4">
        {/* RATING */}
        <div className="mb-2 flex items-center gap-1">
          <FaStar className="text-xs text-amber-400" />
          <FaStar className="text-xs text-amber-400" />
          <FaStar className="text-xs text-amber-400" />
          <FaStar className="text-xs text-amber-400" />
          <FaStar className="text-xs text-amber-400" />

          <span className="ml-1 text-xs text-slate-400">(5.0)</span>
        </div>

        {/* NAME */}
        <h2
          title={name}
          className="min-h-[48px] line-clamp-2 text-[16px] font-semibold leading-6 text-slate-800 transition-colors duration-300 group-hover:text-indigo-600"
        >
          {name}
        </h2>

        {/* PRICE */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-slate-400 line-through">
            ₹{Math.round(Number(price || 0) * 1.05)}
          </span>

          <span className="text-xl font-bold text-slate-900">
            ₹{price ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
