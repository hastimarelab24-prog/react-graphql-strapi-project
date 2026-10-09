import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  GET_ALL_PRODUCTS,
  GET_CATEGORY,
  GET_PRODUCTS_BY_CATEGORY,
} from "../gqloperation/queries";
import Card from "../components/Card";

const GET_PRODUCT_BY_DOCUMENT_ID = gql`
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
      }
      category {
        name
      }
    }
  }
`;

function Products() {
  const navigate = useNavigate();
  const { pid } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantiti, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [cartMessage, setCartMessage] = useState("");

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_DOCUMENT_ID, {
    variables: { documentId: pid },
    skip: !pid,
    fetchPolicy: "network-only",
  });

  const product = data?.product;

  // catgerogy
  const currentCategoryName = product?.category?.name?.trim() || "";

  console.log("Current product:", product);
  console.log("Current category:", currentCategoryName);
  const {
    data: relatedData,
    loading: relatedLoading,
    error: relatedError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryName: currentCategoryName,
    },
    skip: !currentCategoryName,
  });

  console.log("Related products response:", relatedData);
  console.log("Related products error:", relatedError);

  const relatedProducts = (relatedData?.products || []).filter(
    (item) => item.documentId !== product?.documentId,
  );

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:1337${url}`;
  };

  const getDescriptionText = (description) => {
    if (!description) return "No description available.";
    if (typeof description === "string") return description;

    if (Array.isArray(description)) {
      return description
        .map((block) => {
          if (!block?.children) return "";
          return block.children.map((child) => child?.text || "").join("");
        })
        .filter(Boolean)
        .join("\n");
    }

    return "";
  };

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedSize("M");
    setCartMessage("");
  }, [pid]);

  useEffect(() => {
    if (!product) {
      setIsWishlisted(false);
      return;
    }

    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsWishlisted(
        Array.isArray(wishlist) &&
          wishlist.some((item) => item.documentId === product.documentId),
      );
    } catch (err) {
      console.error("Unable to read wishlist:", err);
      setIsWishlisted(false);
    }
  }, [product]);

  const productImages = product?.images || [];
  const safeImageIndex =
    selectedImage >= 0 && selectedImage < productImages.length
      ? selectedImage
      : 0;
  const fullImageUrl = getImageUrl(productImages[safeImageIndex]?.url);
  const description = getDescriptionText(product?.description);

  const addtocart = () => {
    if (!product) return;

    try {
      const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!Array.isArray(oldCart)) throw new Error("Invalid cart data.");

      const productIndex = oldCart.findIndex(
        (item) => item.documentId === product.documentId,
      );

      if (productIndex !== -1) {
        oldCart[productIndex] = {
          ...oldCart[productIndex],
          qty: (Number(oldCart[productIndex].qty) || 1) + quantiti,
        };
      } else {
        oldCart.push({
          documentId: product.documentId,
          name: product.name,
          price: Number(product.price) || 0,
          image: fullImageUrl,
          qty: quantiti,
          size: selectedSize,
        });
      }

      localStorage.setItem("cart", JSON.stringify(oldCart));
      window.dispatchEvent(new Event("cartChange"));
      setCartMessage(
        productIndex !== -1
          ? "Quantity updated in cart!"
          : "Product added to cart!",
      );
    } catch (err) {
      console.error("Unable to update cart:", err);
      setCartMessage("Unable to add product to cart.");
    }
  };

  const toggleWishlist = () => {
    if (!product) return;

    try {
      const oldWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (!Array.isArray(oldWishlist))
        throw new Error("Invalid wishlist data.");

      const exists = oldWishlist.some(
        (item) => item.documentId === product.documentId,
      );

      const newWishlist = exists
        ? oldWishlist.filter((item) => item.documentId !== product.documentId)
        : [
            ...oldWishlist,
            {
              documentId: product.documentId,
              name: product.name,
              price: Number(product.price) || 0,
              image: fullImageUrl,
            },
          ];

      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      setIsWishlisted(!exists);
      window.dispatchEvent(new Event("wishlistChange"));
    } catch (err) {
      console.error("Unable to update wishlist:", err);
    }
  };

  if (!pid) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-yellow-300 bg-white p-6">
          <h2 className="text-xl font-bold text-yellow-600">
            No Product Parameter Found
          </h2>
          <p className="mt-2 text-gray-600">
            Product ID is missing from the URL.
          </p>
          <code className="mt-3 inline-block rounded bg-gray-100 px-3 py-2">
            /products/:pid
          </code>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-12">
        <div className="mx-auto max-w-6xl animate-pulse rounded-2xl bg-white p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="h-[400px] rounded-xl bg-gray-200" />
            <div className="space-y-5">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-12 w-1/3 rounded bg-gray-200" />
              <div className="h-28 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-white p-6">
          <h2 className="text-xl font-bold text-red-600">
            GraphQL Fetch Error
          </h2>
          <p className="mt-3 break-words text-sm text-gray-600">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-6">
          <h2 className="text-xl font-bold text-red-600">Product Not Found</h2>
          <p className="mt-2 break-all text-gray-600">Product ID: {pid}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-full">
        <nav className="mb-6 mt-20 flex flex-wrap items-center text-sm text-gray-500">
          <a href="/" className="hover:text-indigo-600">
            Home
          </a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-indigo-600">
            Products
          </a>
          <span className="mx-2">/</span>
          <span className="max-w-[220px] truncate font-medium text-gray-800">
            {product.name}
          </span>
        </nav>

        <section className="overflow-hidden rounded-3xl bg-white p-5  sm:p-7 lg:p-9">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <div className="flex min-w-0 flex-col">
              <div className="relative flex h-[350px] items-center justify-center overflow-hidden rounded-2xl  sm:h-[450px]">
                {fullImageUrl ? (
                  <img
                    key={fullImageUrl}
                    src={fullImageUrl}
                    alt={product.name || "Product image"}
                    className="h-full w-full object-contain p-5 transition-transform duration-500 hover:scale-105 sm:p-8"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}

                <span className="absolute left-4 top-4 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-600">
                  New Product
                </span>

                <button
                  type="button"
                  onClick={toggleWishlist}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition hover:scale-105 ${
                    isWishlisted
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  {isWishlisted ? "♥" : "♡"}
                </button>
              </div>

              {productImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {productImages.map((image, index) => {
                    const thumbnailUrl = getImageUrl(image.url);
                    return (
                      <button
                        key={`${image.url}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        aria-label={`Select image ${index + 1}`}
                        aria-pressed={safeImageIndex === index}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition sm:h-[88px] sm:w-[88px] ${
                          safeImageIndex === index
                            ? "border-indigo-600 ring-2 ring-indigo-100"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        <img
                          src={thumbnailUrl}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {productImages.length > 1 && (
                <p className="mt-3 text-xs text-gray-400">
                  Image {safeImageIndex + 1} of {productImages.length}
                </p>
              )}
            </div>

            <div className="flex min-w-0 flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  ELECTROHUB / SMART LIVING
                </p>
                <h1 className="mt-3 break-words text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-6 border-b border-gray-200 pb-6">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="mt-1 text-3xl font-bold text-indigo-600">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex gap-6 border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab("description")}
                      className={`border-b-2 pb-3 text-sm font-semibold ${
                        activeTab === "description"
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("details")}
                      className={`border-b-2 pb-3 text-sm font-semibold ${
                        activeTab === "details"
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Product Details
                    </button>
                  </div>

                  <div className="min-h-[110px] py-5">
                    {activeTab === "description" ? (
                      <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                        {description}
                      </p>
                    ) : (
                      <div className="space-y-3 text-sm">
                        <div className="flex flex-wrap justify-between gap-2 border-b border-gray-100 pb-3">
                          <span className="text-gray-500">Product Name</span>
                          <span className="font-medium text-gray-800">
                            {product.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                          <span className="text-gray-500">Product ID</span>
                          <span className="max-w-[65%] break-all text-right font-mono text-xs text-gray-700">
                            {product.documentId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Product ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-gray-700">
                    {product.documentId}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="product-size"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Select Option
                  </label>
                  <select
                    id="product-size"
                    value={selectedSize}
                    onChange={(event) => setSelectedSize(event.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">Extra Large</option>
                  </select>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="text-sm font-semibold text-gray-800">
                    Quantity
                  </span>
                  <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((previous) => Math.max(1, previous - 1))
                      }
                      aria-label="Decrease quantity"
                      className="h-11 w-11 text-xl text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">
                      {quantiti}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((previous) => previous + 1)}
                      aria-label="Increase quantity"
                      className="h-11 w-11 text-xl text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="ml-auto text-sm font-semibold text-gray-800">
                    Total: ₹
                    {(Number(product.price || 0) * quantiti).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addtocart}
                  className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99]"
                >
                  Add to Cart
                </button>

                {cartMessage && (
                  <p
                    role="status"
                    className="mt-3 text-center text-sm font-medium text-indigo-600"
                  >
                    {cartMessage}
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-xl text-indigo-600">✓</p>
                    <p className="font-semibold text-gray-700">Secure</p>
                    <p className="mt-1 text-xs text-gray-400">Safe Shopping</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-xl text-indigo-600">♢</p>
                    <p className="font-semibold text-gray-700">Quality</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Premium Product
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SAME CATEGORY PRODUCTS */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900">
            More from {currentCategoryName}
          </h2>

          <p className="mb-8 mt-2 text-sm text-slate-500">
            Products from the same category.
          </p>

          {relatedLoading ? (
            <p>Loading related products...</p>
          ) : relatedError ? (
            <p className="text-red-500">{relatedError.message}</p>
          ) : relatedProducts.length === 0 ? (
            <p className="text-slate-500">
              No other products found in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Card
                  key={item.documentId}
                  documentId={item.documentId}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  stock={item.stock}
                  imageUrl={item.images?.[0]?.url}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Products;
