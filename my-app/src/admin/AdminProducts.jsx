import React from "react";

import AdminProductsProvider from "../context/AdminProducts";
import useAdminProducts from "../hook/useAdminProducts";

const API_URL = "http://localhost:1337";

const getImageUrl = (url) => {
  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${API_URL}${url}`;
};

/* 
   PRODUCT CONTENT
 */

const AdminProductsContent = () => {
  const productData = useAdminProducts() || {};

  const {
    formData = {
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      isDiscountActive: false,
      discountType: "percentage",
      discountValue: "",
    },

    images = [],
    existingImages = [],

    /* URL IMAGE STATE */
    imageUrl = "",
    urlImages = [],

    categories = [],
    products = [],

    totalProducts = 0,

    loading = false,
    fetching = false,
    error = "",

    isEditing = false,
    editingProduct = null,

    handleChange,
    handleDiscountChange,

    handleImageChange,

    /* URL IMAGE HANDLERS */
    handleImageUrlChange,
    handleAddImageUrl,
    handleRemoveImageUrl,

    handleRemoveExistingImage,
    handleRemoveNewImage,

    handleEditProduct,
    handleSubmit,
    handleDeleteProduct,

    refreshProducts,
    resetForm,

    getEffectiveDiscount,
    getDiscountPrice,
  } = productData;

  /*
     SUBMIT SAFETY
 */

  const safeHandleSubmit = async (event) => {
    if (typeof handleSubmit !== "function") {
      console.error(
        "handleSubmit is not available from AdminProductsContext"
      );
      return;
    }

    await handleSubmit(event);
  };

  /*
     RENDER
 */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/*==
          PAGE HEADER
    == */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Products
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add and manage your ecommerce products.
        </p>
      </div>

      {/*==
          PRODUCT COUNT
    == */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* TOTAL */}

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {fetching
                  ? "..."
                  : totalProducts}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-2xl">
              📦
            </div>

          </div>
        </div>

        {/* LOADED */}

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Products Loaded
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {fetching
                  ? "..."
                  : products.length}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-4 text-2xl">
              🛍️
            </div>

          </div>
        </div>

      </div>

      {/*==
          PRODUCT FORM
    == */}

      <form
        onSubmit={safeHandleSubmit}
        className="rounded-2xl border bg-white p-5 shadow-sm md:p-7"
      >

        {/* FORM HEADER */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          {isEditing && (
            <button
              type="button"
              onClick={
                typeof resetForm === "function"
                  ? resetForm
                  : undefined
              }
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Cancel Edit
            </button>
          )}

        </div>

        {/*
            PRODUCT NAME
     */}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Product Name *
          </label>

          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />
        </div>

        {/*
            DESCRIPTION
     */}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description *
          </label>

          <textarea
            name="description"
            required
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <p className="mt-1 text-xs text-gray-400">
            Each new line will be saved as a separate text block.
          </p>
        </div>

        {/*
            PRICE + STOCK
     */}

        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* PRICE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price (₹) *
            </label>

            <input
              type="number"
              name="price"
              min="0"
              step="1"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* STOCK */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Stock *
            </label>

            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock"
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/*
            IMAGE SECTION
     */}

        <div className="mb-6">

          <label className="mb-3 block text-sm font-medium text-gray-700">
            {isEditing
              ? "Add More Product Images"
              : "Product Images *"}
          </label>

          {/*
              URL + PC UPLOAD
         */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* URL IMAGE */}

            <div className="rounded-xl border bg-gray-50 p-4">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Image URL
              </label>

              <div className="flex w-full gap-2">

                <input
                  type="text"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Paste image URL here"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={
                    !imageUrl ||
                    !imageUrl.trim()
                  }
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Add
                </button>

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Paste an image URL and click Add.
              </p>

            </div>

            {/* PC UPLOAD */}

            <div className="rounded-xl border bg-gray-50 p-4">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Upload From PC
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full cursor-pointer rounded-lg border border-dashed bg-white p-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-400">
                You can select multiple images from your computer.
              </p>

            </div>

          </div>

          {/*
              EXISTING IMAGES
         */}

          {isEditing &&
            existingImages.length > 0 && (
              <div className="mt-5 rounded-xl border bg-gray-50 p-4">

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Current Product Images
                    </h3>

                    <p className="text-xs text-gray-500">
                      First image is the main product image.
                    </p>
                  </div>

                  <span className="text-sm text-gray-500">
                    {existingImages.length} image(s)
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">

                  {existingImages.map(
                    (image, index) => {

                      const imageKey =
                        image?.id ||
                        image?.documentId ||
                        `existing-${index}`;

                      return (
                        <div
                          key={imageKey}
                          className="relative overflow-hidden rounded-xl border bg-white"
                        >

                          <img
                            src={getImageUrl(
                              image?.url
                            )}
                            alt={
                              formData.name ||
                              "Product"
                            }
                            className="h-28 w-full object-cover"
                          />

                          {/* MAIN */}

                          {index === 0 && (
                            <span className="absolute left-1 top-1 rounded bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                              MAIN
                            </span>
                          )}

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveExistingImage(
                                image?.id ||
                                  image?.documentId
                              )
                            }
                            className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm text-white hover:bg-red-700"
                          >
                            ×
                          </button>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            )}

          {/*
              URL IMAGES
         */}

          {urlImages.length > 0 && (
            <div className="mt-5 rounded-xl border bg-blue-50 p-4">

              <div className="mb-3 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-gray-800">
                    URL Images
                  </h3>

                  <p className="text-xs text-gray-500">
                    Images added using URL.
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {urlImages.length} image(s)
                </span>

              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">

                {urlImages.map(
                  (image, index) => (
                    <div
                      key={
                        image?.key ||
                        `url-${index}`
                      }
                      className="relative overflow-hidden rounded-xl border bg-white"
                    >

                      <img
                        src={image?.url}
                        alt={`URL image ${
                          index + 1
                        }`}
                        className="h-28 w-full object-cover"
                      />

                      {index === 0 &&
                        existingImages.length ===
                          0 && (
                          <span className="absolute left-1 top-1 rounded bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                            MAIN
                          </span>
                        )}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImageUrl(
                            index
                          )
                        }
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm text-white hover:bg-red-700"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/*
              NEW PC IMAGES
         */}

          {images.length > 0 && (
            <div className="mt-5 rounded-xl border bg-green-50 p-4">

              <div className="mb-3 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-gray-800">
                    New PC Images
                  </h3>

                  <p className="text-xs text-gray-500">
                    Images selected from your computer.
                  </p>
                </div>

                <span className="text-sm font-medium text-green-600">
                  {images.length} image(s)
                </span>

              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">

                {images.map(
                  (image, index) => {

                    const previewUrl =
                      URL.createObjectURL(
                        image
                      );

                    return (
                      <div
                        key={`${image.name}-${index}`}
                        className="relative overflow-hidden rounded-xl border bg-white"
                      >

                        <img
                          src={previewUrl}
                          alt={
                            image.name
                          }
                          className="h-28 w-full object-cover"
                        />

                        {index === 0 &&
                          existingImages.length ===
                            0 &&
                          urlImages.length ===
                            0 && (
                            <span className="absolute left-1 top-1 rounded bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                              MAIN
                            </span>
                          )}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveNewImage(
                              index
                            )
                          }
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm text-white hover:bg-red-700"
                        >
                          ×
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

          <p className="mt-2 text-xs text-gray-400">
            You can add multiple images using URL or upload
            multiple images from your PC.
          </p>

        </div>

        {/*
            CATEGORY
     */}

        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
          >

            <option value="">
              Select Category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category.documentId ||
                    category.id
                  }
                  value={
                    category.documentId ||
                    category.id
                  }
                >
                  {category.name}
                </option>
              )
            )}

          </select>

        </div>

        {/*
            DISCOUNT
     */}

        <div className="mb-5 rounded-xl border p-4">

          <div className="flex items-center justify-between gap-3">

            <div>
              <h3 className="font-medium text-gray-800">
                Is Discount Active?
              </h3>

              <p className="text-sm text-gray-500">
                Enable or disable product discount.
              </p>
            </div>

            <input
              type="checkbox"
              checked={
                Boolean(
                  formData.isDiscountActive
                )
              }
              onChange={
                handleDiscountChange
              }
              className="h-5 w-5 accent-blue-600"
            />

          </div>

          {formData.isDiscountActive && (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* DISCOUNT TYPE */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Discount Type
                </label>

                <select
                  name="discountType"
                  value={
                    formData.discountType
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white p-3"
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed
                  </option>
                </select>

              </div>

              {/* DISCOUNT VALUE */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Discount Value
                </label>

                <input
                  type="number"
                  name="discountValue"
                  min="0"
                  step="1"
                  value={
                    formData.discountValue
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />

              </div>

            </div>
          )}

        </div>

        {/*
            ERROR
     */}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/*
            SUBMIT
     */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 md:w-auto"
        >
          {loading
            ? isEditing
              ? "Updating Product..."
              : "Adding Product..."
            : isEditing
              ? "Update Product"
              : "Add Product"}
        </button>

      </form>

      {/*==
          PRODUCT LIST
    == */}

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">

          <div>
            <h2 className="text-lg font-semibold">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products are displayed according to their selected category.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshProducts}
            disabled={fetching}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {fetching
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {/* LOADING */}

        {fetching && (
          <p className="p-6 text-gray-500">
            Loading products...
          </p>
        )}

        {/* EMPTY */}

        {!fetching &&
          products.length === 0 && (
            <p className="p-6 text-gray-500">
              No products found.
            </p>
          )}

        {/* TABLE */}

        {!fetching &&
          products.length > 0 && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left text-sm">

                <thead className="bg-gray-50 text-gray-600">

                  <tr>

                    <th className="p-4">
                      Product
                    </th>

                    <th className="p-4">
                      Images
                    </th>

                    <th className="p-4">
                      Price
                    </th>

                    <th className="p-4">
                      Discount
                    </th>

                    <th className="p-4">
                      Discount Price
                    </th>

                    <th className="p-4">
                      Stock
                    </th>

                    <th className="p-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product,index) => {

                      const firstImage =
                        product
                          ?.images?.[0]
                          ?.url;

                      const discount =
                        typeof getEffectiveDiscount ===
                        "function"
                          ? getEffectiveDiscount(
                              product
                            )
                          : {
                              active: false,
                              type: "percentage",
                              value: 0,
                            };

                      const finalPrice =
                        typeof getDiscountPrice ===
                        "function"
                          ? getDiscountPrice(
                              product
                            )
                          : product?.price ??
                            0;

                      return (
                        <tr
                          key={
                            product.documentId ||
                            product.id
                          }
                          className="border-t"
                        >

                          {/* PRODUCT */}

                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              {firstImage ? (
                                <img
                                  src={getImageUrl(
                                    firstImage
                                  )}
                                  alt={
                                    product.name ||
                                    "Product"
                                  }
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                  📦
                                </div>
                              )}

                              <div>

                                <p className="font-medium">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="text-xs text-gray-400">
                                  {product
                                    ?.images
                                    ?.length ||
                                    0}{" "}
                                  image(s)
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* IMAGES */}

                          <td className="p-4">

                            <div className="flex items-center gap-2">

                              {product?.images
                                ?.slice(
                                  0,
                                  3
                                )
                                .map(
                                  (
                                    image,
                                    index
                                  ) => (
                                    <img
                                      key={
                                        image.id ||
                                        image.documentId ||
                                        index
                                      }
                                      src={getImageUrl(
                                        image.url
                                      )}
                                      alt={`${product.name} ${
                                        index +
                                        1
                                      }`}
                                      className="h-10 w-10 rounded-md border object-cover"
                                    />
                                  )
                                )}

                              {(product?.images
                                ?.length ||
                                0) > 3 && (
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                  +
                                  {(
                                    product
                                      ?.images
                                      ?.length ||
                                    0
                                  ) - 3}
                                </span>
                              )}

                            </div>

                          </td>

                          {/* PRICE */}

                          <td className="p-4">

                            <span
                              className={
                                discount?.active
                                  ? "text-gray-400 line-through"
                                  : "font-medium"
                              }
                            >
                              ₹
                              {
                                product.price
                              }
                            </span>

                          </td>

                          {/* DISCOUNT */}

                          <td className="p-4">

                            {discount?.active ? (
                              <div>

                                <span className="font-semibold text-green-600">

                                  {discount.type ===
                                  "percentage"
                                    ? `${discount.value}% OFF`
                                    : `₹${discount.value} OFF`}

                                </span>

                                {discount.source ===
                                  "global" && (
                                  <p className="mt-1 text-xs text-blue-600">
                                    Festival
                                  </p>
                                )}

                              </div>
                            ) : (
                              <div className="text-gray-400">
                                No Discount
                              </div>
                            )}

                          </td>

                          {/* DISCOUNT PRICE */}

                          <td className="p-4 font-semibold">
                            ₹
                            {Number(
                              finalPrice
                            ).toFixed(0)}
                          </td>

                          {/* STOCK */}

                          <td className="p-4">
                            {product.stock ??
                              0}
                          </td>

                          {/* ACTIONS */}

                          <td className="p-4">

                            <div className="flex gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditProduct(
                                    product,index
                                  )
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteProduct(
                                    product
                                  )
                                }
                                disabled={loading}
                                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Remove
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
};

/* 
   PROVIDER WRAPPER
 */

const AdminProducts = () => {
  return (
    <AdminProductsProvider>
      <AdminProductsContent />
    </AdminProductsProvider>
  );
};

export default AdminProducts;