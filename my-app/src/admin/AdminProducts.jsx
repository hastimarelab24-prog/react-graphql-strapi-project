import React from "react";

import AdminProductsProvider from "../context/AdminProducts";
import useAdminProducts from "../hook/useAdminProducts";

const API_URL = "http://localhost:1337";

// PRODUCT UI

const AdminProductsContent = () => {
  const {
    formData,
    images,

    categories,
    products,

    totalProducts,

    loading,
    fetching,
    error,

    handleChange,
    handleDiscountChange,
    handleImageChange,

    handleSubmit,
    handleDeleteProduct,

    refreshProducts,

    getEffectiveDiscount,
    getDiscountPrice,
  } = useAdminProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* 
          PAGE HEADING
       */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Products
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add and manage your ecommerce products.
        </p>
      </div>

      {/* 
          PRODUCT COUNT
       */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total */}
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

        {/* Loaded */}
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

      {/* 
          ADD PRODUCT
       */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white p-5 shadow-sm md:p-7"
      >
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Add New Product
        </h2>

        {/* Product name */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
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

        {/* Description */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Description *
          </label>

          <textarea
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <p className="mt-1 text-xs text-gray-400">
            Each new line will be saved as a separate text block.
          </p>
        </div>

        {/* Price + Stock */}
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
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

          <div>
            <label className="mb-2 block text-sm font-medium">
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
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Product Images *
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleImageChange}
            className="w-full rounded-lg border border-dashed p-4"
          />

          {images.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              {images.length} image(s) selected
            </p>
          )}
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
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

        {/* Discount */}
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
                formData.isDiscountActive
              }
              onChange={
                handleDiscountChange
              }
              className="h-5 w-5 accent-blue-600"
            />
          </div>

          {formData.isDiscountActive && (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 md:w-auto"
        >
          {loading
            ? "Adding Product..."
            : "+ Add Product"}
        </button>
      </form>

      {/* 
          PRODUCT LIST
       */}

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
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

        {/* Loading */}
        {fetching && (
          <p className="p-6 text-gray-500">
            Loading products...
          </p>
        )}

        {/* Empty */}
        {!fetching &&
          products.length === 0 && (
            <p className="p-6 text-gray-500">
              No products found.
            </p>
          )}

        {/* Table */}
        {!fetching &&
          products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4">
                      Product
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
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(
                    (product) => {
                      const firstImage =
                        product?.images?.[0]
                          ?.url;

                      const discount =
                        getEffectiveDiscount(
                          product
                        );

                      const finalPrice =
                        getDiscountPrice(
                          product
                        );

                      return (
                        <tr
                          key={
                            product.documentId ||
                            product.id
                          }
                          className="border-t"
                        >
                          {/* Product */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {firstImage ? (
                                <img
                                  src={`${API_URL}${firstImage}`}
                                  alt={
                                    product.name
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

                                {discount.active &&
                                  discount.source ===
                                    "global" && (
                                    <p className="text-xs text-green-600">
                                      {
                                        discount.name
                                      }
                                    </p>
                                  )}
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="p-4">
                            <span
                              className={
                                discount.active
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

                          {/* Discount */}
                          <td className="p-4">
                            {discount.active ? (
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

                          {/* Final price */}
                          <td className="p-4 font-semibold">
                            ₹
                            {Number(
                              finalPrice
                            ).toFixed(0)}
                          </td>

                          {/* Stock */}
                          <td className="p-4">
                            {product.stock ??
                              0}
                          </td>

                          {/* Delete */}
                          <td className="p-4">
                            <button
                              type="button"
                              className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-400 disabled:opacity-50"
                              onClick={() =>
                                handleDeleteProduct(
                                  product
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              Remove
                            </button>
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

// PROVIDER WRAPPER

const AdminProducts = () => {
  return (
    <AdminProductsProvider>
      <AdminProductsContent />
    </AdminProductsProvider>
  );
};

export default AdminProducts;