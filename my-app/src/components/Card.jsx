import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import CartSuccessModal from "./CartSuccessModal";

import { getDiscountedPrice } from "../services/offerService";
import { useOffer } from "../context/OfferContext";

function Card({
  documentId,
  name,
  price,
  stock,
  imageUrl,
  isDiscountActive,
  discountType,
  discountValue,
 // Category Discount
  categoryIsDiscountActive,
  categoryDiscountType,
  categoryDiscountValue,
  
}) {
  const navigate = useNavigate();

  // calculation offer discount prodcus all
  const { offer } = useOffer();

  const globalDiscount = {
    isActive: offer?.isActive === true,
    discountType: offer?.discountType,
    discountValue: offer?.discountValue,
  };

  const categoryDiscount = {
    isActive: categoryIsDiscountActive == true,
    discountType: categoryDiscountType,
    discountValue:categoryDiscountValue,
  };

  const productDiscount = {
    isActive: isDiscountActive === true,
    discountType : discountType,
    discountValue : discountValue,
  };
  const finalPrice = getDiscountedPrice(
    price,
    globalDiscount,
    categoryDiscount,
    productDiscount,
  );

  // successs modal
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successType, setSuccessType] = useState("success");
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
    if (Number(stock) <= 0) {
      setSuccessMessage("product is out of stock");
      setSuccessType("warning");
      setSuccessModal(true);
      return;
    }

    e.stopPropagation();

    // // login to first
    // const jwt = localStorage.getItem("jwt");
    // if (!jwt) {
    //   // alert("please Login first to add products to cart");
    //   navigate("/login");
    //   return;
    // }

    // get old cart
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];
    // check existing products
    const productExist = oldCart.find((item) => item.documentId === documentId);

    let updatedCart;

    // if products already exists ,increase quantity
    if (productExist) {
      updatedCart = oldCart.map((item) =>
        item.documentId === documentId
          ? {
              ...item,
              qty: (Number(item.qty) || 1) + 1,
            }
          : item,
      );
      setSuccessMessage("Product already added to cart");
    } else {
      // if products does not exist, add new product
      const newProduct = {
        documentId: documentId,
        name: name,
        price: price,
        image: fullImageUrl,
        qty: 1,
      };
      updatedCart = [...oldCart, newProduct];
      setSuccessMessage("added to cart successfully");
    }

    // save updated cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Notify navbar
    window.dispatchEvent(new Event("cartChange"));
    // show success modal
    setSuccessModal(true);
    setSuccessType("success");
  };

  // wishlist
  const addToWishlist = (e) => {
    e.stopPropagation();

    // login to first
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      // alert("please Login first to add products to cart");
      navigate("/login");
      return;
    }

    // get old wishlist
    const oldWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    // check existing product
    const productExist = oldWishlist.find(
      (item) => item.documentId === documentId,
    );
    // if product already exists
    if (productExist) {
      setSuccessMessage("Product already added to wishlist");
      setSuccessModal(true);
      setSuccessType("warning");
      return;
    }
    // create new wishlist product
    const newWishlistProduct = {
      documentId: documentId,
      name: name,
      price: price,
      image: fullImageUrl,
    };
    // add products to wishlist
    const updateWishlist = [...oldWishlist, newWishlistProduct];
    // save wishlist
    localStorage.setItem("wishlist", JSON.stringify(updateWishlist));
    //  notify other components
    window.dispatchEvent(new Event("wishlistChange"));
    // show success modal
    setSuccessMessage("Product added to wishlist");
    setSuccessModal(true);
    setSuccessType("success");
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/10">
      <CartSuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        message={successMessage}
        type={successType}
      />

      {/* IMAGE SECTION WITH GRADIENT GLOW */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/30 p-4">
        {/* Dynamic Background Aura on Hover */}
        <div className="absolute -inset-10 opacity-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent transition-opacity duration-700 group-hover:opacity-100" />

        {/* SALE BADGE */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
          </span>
          <span className="rounded-full border border-rose-200/60 bg-rose-50/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 backdrop-blur-md">
            Sale
          </span>
        </div>

        {/* QUICK ACTION BUTTONS (Floating Pill) */}
        <div className="absolute right-3 top-3 z-10 flex -translate-y-2 flex-col gap-1.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={addToWishlist}
            title="Wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95"
          >
            <FiHeart className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={viewProduct}
            title="View Product"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95"
          >
            <FiEye className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* PRODUCT IMAGE */}
        <div className="relative h-full w-full">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={name || "Product"}
              className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">
              No Image Available
            </div>
          )}
        </div>

        {/* SLIDE-UP QUICK ADD BUTTON */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={addToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xl transition-all duration-200 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-[0.98]"
          >
            <FiShoppingCart className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* PRODUCT INFO SECTION */}
      <div className="flex flex-1 flex-col justify-between px-1 pt-3 pb-1">
        <div>
          {/* RATING BADGE */}
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 border border-amber-200/50">
              <FaStar className="text-[10px] text-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">5.0</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400">
              In Stock
            </span>
          </div>

          {/* TITLE */}
          <h2
            title={name}
            className="line-clamp-2 text-xs font-bold leading-relaxed text-slate-800 transition-colors duration-200 group-hover:text-violet-600"
          >
            {name}
          </h2>
        </div>

        {/* PRICE SECTION */}

       <div className="mt-3 border-t border-slate-100 pt-3">

          {finalPrice < Number(price) ? (
            <>
              {/* Original Price */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Original Price:
                </span>

                <span className="text-xs text-slate-400 line-through">
                  ₹{Number(price).toFixed(2)}
                </span>
              </div>

              {/* Discount Price */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  Discount Price:
                </span>

                <span className="text-base font-extrabold text-slate-900">
                  ₹{finalPrice.toFixed(2)}
                </span>
              </div>

              <span className="mt-1 inline-block rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                Discount Applied
              </span>
            </>
          ) : (
            /* Original Price */
            <span className="text-base font-extrabold text-slate-900">
              ₹{Number(price).toFixed(2)}
            </span>
          )}

        </div>
      </div>
    </div>
  );
}

export default Card;
