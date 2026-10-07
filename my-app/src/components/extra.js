Yes. Tamara Products.jsx ma API/GraphQL, hook logic, Context, ane UI badhu ek file ma che. Ene separate karva mate aa structure rakho:

src/
├── api/
│   └── productApi.js
│
├── hook/
│   └── useProductDetails.js
│
├── context/
│   └── ProductDetailsContext.jsx
│
└── components/
    └── Products.jsx

તમારા existing OfferContext ne same rakhi shakay. useOffer() hook product-details hook ni andar use thase.

1. src/api/productApi.js

Aa file ma only GraphQL query rakho.

import { gql } from "@apollo/client";

/* =========================================================
   GET PRODUCT BY DOCUMENT ID
========================================================= */

export const GET_PRODUCT_BY_DOCUMENT_ID = gql`
  query GetProductByDocumentId($documentId: ID!) {
    product(documentId: $documentId) {
      documentId
      name
      price
      description
      stock

      isDiscountActive
      discountType
      discountValue

      images {
        url
        alternativeText
      }
    }
  }
`;
2. src/hook/useProductDetails.js

Aa file ma API fetch + state + cart + wishlist + quantity + image navigation + discount + Buy Now badhi logic aavse.

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GET_PRODUCT_BY_DOCUMENT_ID } from "../api/productApi";
import { getDiscountedPrice } from "../services/offerService";
import { useOffer } from "../context/OfferContext";

const API_URL = "http://localhost:1337";

const useProductDetails = (pid) => {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [successModal, setSuccessModal] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [successType, setSuccessType] =
    useState("success");

  const [wishlistAdded, setWishlistAdded] =
    useState(false);

  /* =========================================================
     GLOBAL OFFER
  ========================================================= */

  const { offer } = useOffer();

  const globalDiscount = {
    isActive: offer?.isActive === true,
    discountType: offer?.discountType,
    discountValue: offer?.discountValue,
  };

  /* =========================================================
     PRODUCT API
  ========================================================= */

  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery(GET_PRODUCT_BY_DOCUMENT_ID, {
    variables: {
      documentId: pid,
    },
    skip: !pid,
  });

  /* =========================================================
     PRODUCT
  ========================================================= */

  const product = data?.product;

  /* =========================================================
     RESET WHEN PRODUCT CHANGES
  ========================================================= */

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setWishlistAdded(false);
  }, [pid]);

  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const getDescriptionText = (description) => {
    if (!description) {
      return "No description available";
    }

    if (typeof description === "string") {
      return description;
    }

    if (Array.isArray(description)) {
      return description
        .map((block) => {
          if (!block?.children) {
            return "";
          }

          return block.children
            .map((child) => child?.text || "")
            .join("");
        })
        .filter(Boolean)
        .join("\n");
    }

    return "";
  };

  /* =========================================================
     IMAGES
  ========================================================= */

  const productImages = product?.images || [];

  const getImageUrl = (url) => {
    if (!url) {
      return "";
    }

    return url.startsWith("http")
      ? url
      : `${API_URL}${url}`;
  };

  const currentImage =
    productImages[selectedImage]?.url || "";

  const fullImageUrl =
    getImageUrl(currentImage);

  /* =========================================================
     PRODUCT DISCOUNT
  ========================================================= */

  const productDiscount = {
    isActive:
      product?.isDiscountActive === true,

    discountType:
      product?.discountType,

    discountValue:
      product?.discountValue,
  };

  /* =========================================================
     FINAL PRICE
  ========================================================= */

  const finalPrice = useMemo(() => {
    if (!product) {
      return 0;
    }

    return getDiscountedPrice(
      Number(product.price || 0),
      globalDiscount,
      null,
      productDiscount
    );
  }, [
    product,
    offer,
  ]);

  const hasDiscount =
    Number(finalPrice) <
    Number(product?.price || 0);

  const discountPercentage =
    hasDiscount &&
    Number(product?.price) > 0
      ? Math.round(
          ((Number(product.price) -
            Number(finalPrice)) /
            Number(product.price)) *
            100
        )
      : 0;

  /* =========================================================
     STOCK
  ========================================================= */

  const stock = Number(
    product?.stock || 0
  );

  const isOutOfStock = stock <= 0;

  /* =========================================================
     IMAGE NAVIGATION
  ========================================================= */

  const nextImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setSelectedImage((prev) =>
      prev === productImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const previousImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setSelectedImage((prev) =>
      prev === 0
        ? productImages.length - 1
        : prev - 1
    );
  };

  /* =========================================================
     QUANTITY
  ========================================================= */

  const increaseQuantity = () => {
    if (stock <= 0) {
      return;
    }

    setQuantity((prev) => {
      if (prev >= stock) {
        return prev;
      }

      return prev + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  /* =========================================================
     MODAL HELPER
  ========================================================= */

  const showMessage = (
    message,
    type = "success"
  ) => {
    setSuccessMessage(message);
    setSuccessType(type);
    setSuccessModal(true);
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = () => {
    if (stock <= 0) {
      showMessage(
        "Product is out of stock",
        "warning"
      );

      return;
    }

    const oldCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const productExist = oldCart.find(
      (item) =>
        item.documentId ===
        product.documentId
    );

    let updatedCart;

    if (productExist) {
      const newQty =
        Number(productExist.qty || 1) +
        quantity;

      updatedCart = oldCart.map((item) =>
        item.documentId ===
        product.documentId
          ? {
              ...item,

              qty:
                newQty > stock
                  ? stock
                  : newQty,

              price: Number(finalPrice),

              originalPrice:
                Number(product.price),

              image: fullImageUrl,
            }
          : item
      );

      showMessage(
        "Product quantity updated in cart"
      );
    } else {
      const newProduct = {
        documentId:
          product.documentId,

        name:
          product.name,

        price:
          Number(finalPrice),

        originalPrice:
          Number(product.price),

        image:
          fullImageUrl,

        qty:
          quantity,
      };

      updatedCart = [
        ...oldCart,
        newProduct,
      ];

      showMessage(
        "Product added to cart successfully"
      );
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartChange")
    );
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const buyNow = () => {
    if (stock <= 0) {
      showMessage(
        "Product is out of stock",
        "warning"
      );

      return;
    }

    const oldCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const newProduct = {
      documentId:
        product.documentId,

      name:
        product.name,

      price:
        Number(finalPrice),

      originalPrice:
        Number(product.price),

      image:
        fullImageUrl,

      qty:
        quantity,
    };

    const productExist = oldCart.find(
      (item) =>
        item.documentId ===
        product.documentId
    );

    let updatedCart;

    if (productExist) {
      updatedCart = oldCart.map(
        (item) =>
          item.documentId ===
          product.documentId
            ? {
                ...item,

                qty:
                  quantity,

                price:
                  Number(finalPrice),

                originalPrice:
                  Number(product.price),

                image:
                  fullImageUrl,
              }
            : item
      );
    } else {
      updatedCart = [
        ...oldCart,
        newProduct,
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartChange")
    );

    navigate("/checkout");
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const addToWishlist = () => {
    const oldWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const productExist =
      oldWishlist.find(
        (item) =>
          item.documentId ===
          product.documentId
      );

    if (productExist) {
      setWishlistAdded(true);

      showMessage(
        "Product already exists in wishlist",
        "warning"
      );

      return;
    }

    const newWishlistProduct = {
      documentId:
        product.documentId,

      name:
        product.name,

      price:
        Number(finalPrice),

      image:
        fullImageUrl,
    };

    const updatedWishlist = [
      ...oldWishlist,
      newWishlistProduct,
    ];

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistChange")
    );

    setWishlistAdded(true);

    showMessage(
      "Product added to wishlist",
      "success"
    );
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    // API
    loading,
    error,
    data,
    product,
    refetch,

    // product
    productImages,
    getImageUrl,
    getDescriptionText,

    // image
    selectedImage,
    setSelectedImage,
    currentImage,
    fullImageUrl,
    nextImage,
    previousImage,

    // quantity
    quantity,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,

    // discount
    globalDiscount,
    productDiscount,
    finalPrice,
    hasDiscount,
    discountPercentage,

    // stock
    stock,
    isOutOfStock,

    // cart
    addToCart,
    buyNow,

    // wishlist
    addToWishlist,
    wishlistAdded,

    // modal
    successModal,
    setSuccessModal,
    successMessage,
    successType,
  };
};

export default useProductDetails;
3. src/context/ProductDetailsContext.jsx

Aa Context hook nu data Products.jsx sudhi provide karse.

import React, {
  createContext,
  useContext,
} from "react";

import useProductDetails from "../hook/useProductDetails";

const ProductDetailsContext =
  createContext(null);

/* =========================================================
   PROVIDER
========================================================= */

export const ProductDetailsProvider = ({
  pid,
  children,
}) => {
  const productDetails =
    useProductDetails(pid);

  return (
    <ProductDetailsContext.Provider
      value={productDetails}
    >
      {children}
    </ProductDetailsContext.Provider>
  );
};

/* =========================================================
   CONTEXT HOOK
========================================================= */

export const useProductDetailsContext = () => {
  const context = useContext(
    ProductDetailsContext
  );

  if (!context) {
    throw new Error(
      "useProductDetailsContext must be used inside ProductDetailsProvider"
    );
  }

  return context;
};

export default ProductDetailsContext;
4. src/components/Products.jsx

Have Products.jsx ma API/query/business logic nahi rahe. Aa mainly UI hase.

import React from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiZap,
  FiCheck,
  FiTruck,
  FiShield,
} from "react-icons/fi";

import CartSuccessModal from "./CartSuccessModal";

import {
  ProductDetailsProvider,
  useProductDetailsContext,
} from "../context/ProductDetailsContext";

/* =========================================================
   PRODUCT UI
========================================================= */

const ProductDetailsContent = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    product,

    productImages,
    getImageUrl,
    getDescriptionText,

    selectedImage,
    setSelectedImage,
    fullImageUrl,

    nextImage,
    previousImage,

    quantity,
    increaseQuantity,
    decreaseQuantity,

    finalPrice,
    hasDiscount,
    discountPercentage,

    stock,
    isOutOfStock,

    addToCart,
    buyNow,

    addToWishlist,
    wishlistAdded,

    successModal,
    setSuccessModal,
    successMessage,
    successType,
  } = useProductDetailsContext();

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-600">
            Product Fetch Error
          </h2>

          <p className="mt-3 rounded-lg bg-red-100 p-3 font-mono text-sm text-red-700">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PRODUCT NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold text-red-600">
            Product Not Found
          </h2>

          <p className="mt-2 text-slate-500">
            No product found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          SUCCESS MODAL
      ===================================================== */}

      <CartSuccessModal
        isOpen={successModal}
        onClose={() =>
          setSuccessModal(false)
        }
        message={successMessage}
        type={successType}
      />

      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hover:text-indigo-600"
            >
              Home
            </button>

            <span>/</span>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="hover:text-indigo-600"
            >
              Products
            </button>

            <span>/</span>

            <span className="font-medium text-slate-800">
              {product.name}
            </span>
          </div>

          {/* =================================================
              PRODUCT CONTAINER
          ================================================= */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* =================================================
                  LEFT IMAGE
              ================================================= */}

              <div className="p-5 sm:p-8">

                <div className="relative flex min-h-[450px] items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:min-h-[560px]">

                  {fullImageUrl ? (
                    <img
                      src={fullImageUrl}
                      alt={
                        product.name ||
                        "Product"
                      }
                      className="h-full max-h-[540px] w-full object-contain p-8 transition-all duration-500"
                    />
                  ) : (
                    <div className="text-slate-400">
                      No image available
                    </div>
                  )}

                  {/* PREVIOUS */}

                  {productImages.length > 1 && (
                    <button
                      type="button"
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg transition hover:bg-indigo-600 hover:text-white"
                    >
                      <FiChevronLeft
                        size={20}
                      />
                    </button>
                  )}

                  {/* NEXT */}

                  {productImages.length > 1 && (
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg transition hover:bg-indigo-600 hover:text-white"
                    >
                      <FiChevronRight
                        size={20}
                      />
                    </button>
                  )}

                  {/* COUNTER */}

                  {productImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white">
                      {selectedImage + 1} /{" "}
                      {productImages.length}
                    </div>
                  )}
                </div>

                {/* =================================================
                    THUMBNAILS
                ================================================= */}

                {productImages.length > 0 && (
                  <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                    {productImages.map(
                      (image, index) => {
                        const thumbnailUrl =
                          getImageUrl(
                            image.url
                          );

                        return (
                          <button
                            key={`${image.url}-${index}`}
                            type="button"
                            onClick={() =>
                              setSelectedImage(
                                index
                              )
                            }
                            className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 p-1 transition-all ${
                              selectedImage ===
                              index
                                ? "border-indigo-600 ring-2 ring-indigo-100"
                                : "border-slate-200 hover:border-indigo-300"
                            }`}
                          >
                            <img
                              src={thumbnailUrl}
                              alt={
                                image.alternativeText ||
                                `${product.name} ${
                                  index + 1
                                }`
                              }
                              className="h-full w-full object-contain"
                            />
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  RIGHT PRODUCT DETAILS
              ================================================= */}

              <div className="flex flex-col justify-between border-t border-slate-100 p-5 sm:p-8 lg:border-l lg:border-t-0">

                <div>

                  {/* BADGES */}

                  <div className="mb-4 flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-600">
                      New Product
                    </span>

                    {!isOutOfStock && (
                      <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-600">
                        In Stock
                      </span>
                    )}

                    {isOutOfStock && (
                      <span className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* NAME */}

                  <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                    {product.name}
                  </h1>

                  {/* PRICE */}

                  <div className="mt-6">
                    {hasDiscount ? (
                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-3xl font-extrabold text-indigo-600">
                          ₹
                          {Number(
                            finalPrice
                          ).toFixed(2)}
                        </span>

                        <span className="text-lg text-slate-400 line-through">
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </span>

                        <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600">
                          {discountPercentage}%
                          OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-extrabold text-indigo-600">
                        ₹
                        {Number(
                          product.price || 0
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="my-7 border-t border-slate-200" />

                  {/* DESCRIPTION */}

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Product Details
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {getDescriptionText(
                        product.description
                      )}
                    </p>
                  </div>

                  {/* STOCK */}

                  <div className="mt-6 flex items-center gap-2 text-sm">
                    <FiCheck className="text-emerald-500" />

                    <span className="text-slate-500">
                      Availability:
                    </span>

                    <span
                      className={
                        stock > 0
                          ? "font-semibold text-emerald-600"
                          : "font-semibold text-red-600"
                      }
                    >
                      {stock > 0
                        ? `In stock (${stock})`
                        : "Out of stock"}
                    </span>
                  </div>

                  {/* QUANTITY */}

                  <div className="mt-7">
                    <p className="mb-2 text-sm font-semibold text-slate-800">
                      Quantity
                    </p>

                    <div className="inline-flex overflow-hidden rounded-xl border border-slate-200">

                      <button
                        type="button"
                        onClick={
                          decreaseQuantity
                        }
                        disabled={
                          isOutOfStock ||
                          quantity <= 1
                        }
                        className="flex h-11 w-11 items-center justify-center bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiMinus />
                      </button>

                      <div className="flex h-11 w-14 items-center justify-center border-x border-slate-200 font-semibold">
                        {quantity}
                      </div>

                      <button
                        type="button"
                        onClick={
                          increaseQuantity
                        }
                        disabled={
                          isOutOfStock ||
                          quantity >= stock
                        }
                        className="flex h-11 w-11 items-center justify-center bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FiPlus />
                      </button>

                    </div>
                  </div>
                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="mt-8">

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={addToCart}
                      disabled={isOutOfStock}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <FiShoppingCart />

                      {isOutOfStock
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>

                    <button
                      type="button"
                      onClick={buyNow}
                      disabled={isOutOfStock}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-4 font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <FiZap />

                      Buy Now
                    </button>
                  </div>

                  {/* WISHLIST */}

                  <button
                    type="button"
                    onClick={addToWishlist}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
                      wishlistAdded
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    <FiHeart
                      className={
                        wishlistAdded
                          ? "fill-current"
                          : ""
                      }
                    />

                    {wishlistAdded
                      ? "Added to Wishlist"
                      : "Add to Wishlist"}
                  </button>

                  {/* FEATURES */}

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <FiShield className="mx-auto text-indigo-600" />

                      <p className="mt-2 text-[11px] font-semibold text-slate-700">
                        Secure
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Safe Shopping
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <FiTruck className="mx-auto text-indigo-600" />

                      <p className="mt-2 text-[11px] font-semibold text-slate-700">
                        Delivery
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Fast Delivery
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <FiCheck className="mx-auto text-indigo-600" />

                      <p className="mt-2 text-[11px] font-semibold text-slate-700">
                        Quality
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Premium
                      </p>
                    </div>

                  </div>

                  {/* PRODUCT ID */}

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Product ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-600">
                      {product.documentId}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Products = () => {
  const { pid } = useParams();

  if (!pid) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-xl font-bold text-yellow-700">
            No Product Parameter Found
          </h2>

          <p className="mt-2 text-sm text-yellow-700">
            Product ID is missing from URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailsProvider pid={pid}>
      <ProductDetailsContent />
    </ProductDetailsProvider>
  );
};

export default Products;
Final structure

Have tamari files logically separate thase: