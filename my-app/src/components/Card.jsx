// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
// import { FaStar } from "react-icons/fa";
// import CartSuccessModal from "./CartSuccessModal";

// import { getDiscountedPrice } from "../services/offerService";
// import { useOffer } from "../context/OfferContext";

// function Card({
//   documentId,
//   name,
//   price,
//   description,
//   stock,
//   imageUrl,
//   isDiscountActive,
//   discountType,
//   discountValue,
//   // Category Discount
//   categoryIsDiscountActive,
//   categoryDiscountType,
//   categoryDiscountValue,
// }) {
//   const navigate = useNavigate();

//   // calculation offer discount prodcus all
//   const { offer } = useOffer();

//   const globalDiscount = {
//     isActive: offer?.isActive === true,
//     discountType: offer?.discountType,
//     discountValue: offer?.discountValue,
//   };

//   const categoryDiscount = {
//     isActive: categoryIsDiscountActive == true,
//     discountType: categoryDiscountType,
//     discountValue: categoryDiscountValue,
//   };

//   const productDiscount = {
//     isActive: isDiscountActive === true,
//     discountType: discountType,
//     discountValue: discountValue,
//   };
//   const finalPrice = getDiscountedPrice(
//     price,
//     globalDiscount,
//     categoryDiscount,
//     productDiscount,
//   );

//   // successs modal
//   const [successModal, setSuccessModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [successType, setSuccessType] = useState("success");
//   // stock calucation
//   const availableStock = Math.max(0,Number(stock) || 0);
//   const isOutOfStock = availableStock<=0;
//   // low stock
//    const isLowStock = availableStock > 0 && availableStock <= 5;

//   const fullImageUrl = imageUrl
//     ? imageUrl.startsWith("http")
//       ? imageUrl
//       : `http://localhost:1337${imageUrl}`
//     : "";

//   // viwe
//   const viewProduct = (e) => {
//     e.stopPropagation();
//     navigate(`/products/${documentId}`);
//   };

//   // addtocard
//   const addToCart = (e) => {
//     if (Number(stock) <= 0) {
//       setSuccessMessage("product is out of stock");
//       setSuccessType("warning");
//       setSuccessModal(true);
//       return;
//     }

//     e.stopPropagation();

//     // // login to first
//     // const jwt = localStorage.getItem("jwt");
//     // if (!jwt) {
//     //   // alert("please Login first to add products to cart");
//     //   navigate("/login");
//     //   return;
//     // }

//     // get old cart
//     const oldCart = JSON.parse(localStorage.getItem("cart")) || [];
//     // check existing products
//     const productExist = oldCart.find((item) => item.documentId === documentId);

//     let updatedCart;

//     // if products already exists ,increase quantity
//     if (productExist) {
//       updatedCart = oldCart.map((item) =>
//         item.documentId === documentId
//           ? {
//               ...item,
//               qty: (Number(item.qty) || 1) + 1,stock:availableStock,
//             }
//           : item,
//       );
//       setSuccessMessage("Product already added to cart");
//     } else {
//       // if products does not exist, add new product
//       const newProduct = {
//         documentId: documentId,
//         name: name,
//         description: description,
//         price: price,

//         image: fullImageUrl,
//         stock:availableStock,
//         qty: 1,
//       };
//       updatedCart = [...oldCart, newProduct];
//       setSuccessMessage("added to cart successfully");
//     }

//     // save updated cart
//     localStorage.setItem("cart", JSON.stringify(updatedCart));

//     // Notify navbar
//     window.dispatchEvent(new Event("cartChange"));
//     // show success modal
//     setSuccessModal(true);
//     setSuccessType("success");
//   };

//   // wishlist
//   const addToWishlist = (e) => {
//     e.stopPropagation();

//     // login to first
//     const jwt = localStorage.getItem("jwt");
//     if (!jwt) {
//       // alert("please Login first to add products to cart");
//       navigate("/login");
//       return;
//     }

//     // get old wishlist
//     const oldWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     // check existing product
//     const productExist = oldWishlist.find(
//       (item) => item.documentId === documentId,
//     );
//     // if product already exists
//     if (productExist) {
//       setSuccessMessage("Product already added to wishlist");
//       setSuccessModal(true);
//       setSuccessType("warning");
//       return;
//     }
//     // create new wishlist product
//     const newWishlistProduct = {
//       documentId: documentId,
//       name: name,
//       description: description,
//       price: price,
//       image: fullImageUrl,
//     };
//     // add products to wishlist
//     const updateWishlist = [...oldWishlist, newWishlistProduct];
//     // save wishlist
//     localStorage.setItem("wishlist", JSON.stringify(updateWishlist));
//     //  notify other components
//     window.dispatchEvent(new Event("wishlistChange"));
//     // show success modal
//     setSuccessMessage("Product added to wishlist");
//     setSuccessModal(true);
//     setSuccessType("success");
//   };

//   return (
//     <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-violet-200 hover:bg-white hover:shadow-2xl hover:shadow-violet-500/10">
//       <CartSuccessModal
//         isOpen={successModal}
//         onClose={() => setSuccessModal(false)}
//         message={successMessage}
//         type={successType}
//       />
//       {/* IMAGE SECTION WITH GRADIENT GLOW */}
//       <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl  from-slate-100 to-indigo-50/30 p-4">
//         {/* Dynamic Background Aura on Hover */}
//         <div className="absolute -inset-10 opacity-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent transition-opacity duration-700 group-hover:opacity-100" />

//         {/* SALE BADGE */}
//         <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
//           <span className="relative flex h-2 w-2">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
//             <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
//           </span>
//           <span className="rounded-full border border-rose-200/60 bg-rose-50/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 backdrop-blur-md">
//             Sale
//           </span>
//         </div>

//         {/* QUICK ACTION BUTTONS (Floating Pill) */}
//         <div className="absolute right-3 top-3 z-10 flex -translate-y-2 flex-col gap-1.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
//           <button
//             type="button"
//             onClick={addToWishlist}
//             title="Wishlist"
//             className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95"
//           >
//             <FiHeart className="h-3.5 w-3.5" />
//           </button>

//           <button
//             type="button"
//             onClick={viewProduct}
//             title="View Product"
//             className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95"
//           >
//             <FiEye className="h-3.5 w-3.5" />
//           </button>
//         </div>

//         {/* PRODUCT IMAGE */}
//         <div className="relative h-full w-full">
//           {fullImageUrl ? (
//             <img
//               src={fullImageUrl}
//               alt={name || "Product"}
//               className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
//             />
//           ) : (
//             <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">
//               No Image Available
//             </div>
//           )}
//         </div>

//         {/* SLIDE-UP QUICK ADD BUTTON */}
//         <div className="absolute inset-x-3 bottom-3 z-10 translate-y-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
//           <button
//             type="button"
//             onClick={addToCart}
//             className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xl transition-all duration-200 hover:bg-violet-600 hover:shadow-violet-500/25 active:scale-[0.98]"
//           >
//             <FiShoppingCart className="h-3.5 w-3.5" />
//             Quick Add
//           </button>
//         </div>
//       </div>
//       {/* PRODUCT INFO SECTION */}
//       <div className="flex flex-1 flex-col justify-between px-1 pt-3 pb-1">
//         <div>
//           {/* RATING BADGE */}
//           <div className="mb-1.5 flex items-center justify-between">
//             <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 border border-amber-200/50">
//               <FaStar className="text-[10px] text-amber-500" />
//               <span className="text-[10px] font-bold text-amber-700">5.0</span>
//             </div>
//             {/* stock */}
//             {isOutOfStock ? (
//               <span className="rounded-md bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-600">
//                 Out of Stock
//               </span>
//             ) : isLowStock ? (
//               <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] text-amber-700 font-semibold">
//                 Low Stock ({avalibleStock}left)
//               </span>
//             ) : (
//               <span className="text-[10px] font-medium text-emerald-600">
//                 In Stock ({avalibleStock})
//               </span>
//             )}
//           </div>

//           {/* TITLE */}
//           <h2
//             title={name}
//             className="line-clamp-2 text-xs font-bold leading-relaxed text-slate-800 transition-colors duration-200 group-hover:text-violet-600"
//           >
//             {name}
//           </h2>
//           <p title={description}>{description}</p>
//         </div>

//         {/* PRICE SECTION */}

//         <div className="mt-3 border-t border-slate-100 pt-3">
//           {finalPrice < Number(price) ? (
//             <>
//               {/* Original Price */}
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-slate-400">Original Price:</span>

//                 <span className="text-xs text-slate-400 line-through">
//                   ₹{Number(price).toFixed(2)}
//                 </span>
//               </div>

//               {/* Discount Price */}
//               <div className="flex items-center gap-2">
//                 <span className="text-xs font-medium text-slate-600">
//                   Discount Price:
//                 </span>

//                 <span className="text-base font-extrabold text-slate-900">
//                   ₹{finalPrice.toFixed(2)}
//                 </span>
//               </div>

//               <span className="mt-1 inline-block rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
//                 Discount Applied
//               </span>
//             </>
//           ) : (
//             /* Original Price */
//             <span className="text-base font-extrabold text-slate-900">
//               ₹{Number(price).toFixed(2)}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Card;

import React, { Children, useState } from "react";
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
  description,
  stock,
  imageUrl,
  isDiscountActive,
  discountType,
  discountValue,
  categoryIsDiscountActive,
  categoryDiscountType,
  categoryDiscountValue,
}) {
  const navigate = useNavigate();
  const { offer } = useOffer();

  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successType, setSuccessType] = useState("success");

  // Stock calculation
  const availableStock = Math.max(0, Number(stock) || 0);
  const isOutOfStock = availableStock <= 0;

  // Low stock threshold: 5 or fewer items
  const isLowStock = availableStock > 0 && availableStock <= 5;

  // Discount configuration
  const globalDiscount = {
    isActive: offer?.isActive === true,
    discountType: offer?.discountType,
    discountValue: offer?.discountValue,
  };

  const categoryDiscount = {
    isActive: categoryIsDiscountActive === true,
    discountType: categoryDiscountType,
    discountValue: categoryDiscountValue,
  };

  const productDiscount = {
    isActive: isDiscountActive === true,
    discountType,
    discountValue,
  };

  const originalPrice = Number(price) || 0;

  const finalPrice = getDiscountedPrice(
    originalPrice,
    globalDiscount,
    categoryDiscount,
    productDiscount,
  );

  // Resolve image URL
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `http://localhost:1337${imageUrl}`
    : "";

  // Convert Strapi Blocks or string description to readable text
  const getDescriptionText = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (!Array.isArray(value)) {
      return "";
    }

    const extractText = (children = []) =>
      children
        .map((child) => {
          if (typeof child === "string") return child;
          if (Array.isArray(child?.children)) {
            return extractText(child.children);
          }
          return child?.text || "";
        })
        .join("");

    return value
      .map((block) => {
        if (typeof block === "string") return block;
        return extractText(block?.children || []);
      })
      .filter(Boolean)
      .join(" ")
      .trim();
  };

  const descriptionText = getDescriptionText(description);

  const showMessage = (message, type = "success") => {
    setSuccessMessage(message);
    setSuccessType(type);
    setSuccessModal(true);
  };

  // View product
  const viewProduct = (e) => {
    e.stopPropagation();
    navigate(`/products/${documentId}`);
  };

  // Add product to cart
  const addToCart = (e) => {
    e.stopPropagation();

    if (isOutOfStock) {
      showMessage("This product is out of stock.", "warning");
      return;
    }

    let oldCart = [];

    try {
      oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!Array.isArray(oldCart)) {
        oldCart = [];
      }
    } catch {
      oldCart = [];
    }

    const productExist = oldCart.find((item) => item.documentId === documentId);

    let updatedCart;

    if (productExist) {
      const currentQty = Number(productExist.qty) || 1;

      if (currentQty >= availableStock) {
        showMessage(
          `Only ${availableStock} item(s) available in stock.`,
          "warning",
        );
        return;
      }

      updatedCart = oldCart.map((item) =>
        item.documentId === documentId
          ? {
              ...item,
              name,
              description: descriptionText,
              image: fullImageUrl,
              originalPrice,
              price: finalPrice,
              stock: availableStock,
              qty: currentQty + 1,
            }
          : item,
      );

      showMessage("Product quantity updated in cart.");
    } else {
      const newProduct = {
        documentId,
        name,
        description: descriptionText,
        image: fullImageUrl,
        originalPrice,
        price: finalPrice,
        stock: availableStock,
        qty: 1,
      };

      updatedCart = [...oldCart, newProduct];

      showMessage("Product added to cart successfully.");
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartChange"));
  };

  // Add product to wishlist
  const addToWishlist = (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");

    if (!token) {
      navigate("/login");
      return;
    }

    let oldWishlist = [];

    try {
      oldWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (!Array.isArray(oldWishlist)) {
        oldWishlist = [];
      }
    } catch {
      oldWishlist = [];
    }

    const productExist = oldWishlist.find(
      (item) => item.documentId === documentId,
    );

    if (productExist) {
      showMessage("Product is already in your wishlist.", "warning");
      return;
    }

    const newWishlistProduct = {
      documentId,
      name,
      description: descriptionText,
      price: finalPrice,
      originalPrice,
      image: fullImageUrl,
      stock: availableStock,
    };

    const updatedWishlist = [...oldWishlist, newWishlistProduct];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlistChange"));

    showMessage("Product added to wishlist.");
  };

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-violet-500/10">
      <CartSuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        message={successMessage}
        type={successType}
      />

      {/* IMAGE SECTION - PURE WHITE */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white p-4">
        {/* Sale badge */}
        {finalPrice < originalPrice && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>

            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Sale
            </span>
          </div>
        )}

        {/* Quick action buttons */}
        <div className="absolute right-3 top-3 z-10 flex -translate-y-2 flex-col gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={addToWishlist}
            title="Wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:scale-110 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
          >
            <FiHeart className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={viewProduct}
            title="View Product"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:scale-110 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <FiEye className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Product image */}
        <div className="relative h-full w-full bg-white">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={name || "Product"}
              className="h-full w-full bg-white object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white text-xs font-medium text-slate-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Quick add button */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={addToCart}
            disabled={isOutOfStock}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <FiShoppingCart className="h-3.5 w-3.5" />
            {isOutOfStock ? "Out of Stock" : "Quick Add"}
          </button>
        </div>
      </div>

      {/* PRODUCT INFORMATION - PURE WHITE */}
      <div className="flex flex-1 flex-col justify-between bg-white px-1 pb-1 pt-3">
        <div>
          {/* Rating and stock status */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5">
              <FaStar className="text-[10px] text-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">5.0</span>
            </div>

            {isOutOfStock ? (
              <span
                className="rounded-md bg-rose-50 px-2 py-1 text-[10px] 
              font-semibold text-rose-600"
              >
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span
                className="rounded-md bg-amber-50 px-2 py-1 text-[10px] 
              font-semibold text-amber-700"
              >
                Low Stock ({availableStock} left)
              </span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-600">
                In Stock ({availableStock})
              </span>
            )}
          </div>

          {/* Product name */}
          <h2
            title={name}
            onClick={viewProduct}
            className="line-clamp-2 cursor-pointer text-xs font-bold leading-relaxed text-slate-800 transition-colors hover:text-violet-600"
          >
            {name}
          </h2>

          {/* Product description */}
          {descriptionText && (
            <p
              title={descriptionText || "no description avalibale"}
              className="mt-1 line-clamp-3 bg-white text-xs leading-relaxed text-slate-500"
            >
              {descriptionText || "no description avalible "}
            </p>
          )}
        </div>

        {/* PRICE SECTION */}
        <div className="mt-3 border-t border-slate-100 bg-white pt-3">
          {finalPrice < originalPrice ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Original Price:</span>

                <span className="text-xs text-slate-400 line-through">
                  ₹{originalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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
            <span className="text-base font-extrabold text-slate-900">
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
