import React, { useState } from "react";

import useStockMangement from "../hook/useStockMangement";
import StockManagementProvider from "../context/StockManagement";

const StockManagementContent = () => {
  const {  products,  categories , loading,  categoryLoading,  savingId,  creatingProduct , stockInputs,  error , productForm,  selectedImage  ,totalProducts,  outOfstockCount,  avilableCount
    ,  fetchProducts  ,handleStockInputChange,  handleAddStock,  handleProductFormChange,  handleImageChange,  handleCreateProduct,  resetProductForm,  API_URL,
  } = useStockMangement();

  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const [search, setSearch] = useState("");

  // FILTER PRODUCTS

  const filteredProducts = products.filter(
    (product) =>
      product?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // IMAGE URL

  const getImageUrl = (product) => {
    let image = null;

    // Strapi direct relation shape
    if (Array.isArray(product?.images)) {
      image = product.images[0];
    }

    // Strapi v4-style shape
    if (
      !image &&
      Array.isArray(product?.images?.data)
    ) {
      image = product.images.data[0];
    }

    if (!image) {
      return null;
    }

    const imageUrl =
      image?.url ||
      image?.attributes?.url;

    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_URL}${imageUrl}`;
  };

  // OPEN ADD PRODUCT

  const openAddProduct = () => {
    resetProductForm();
    setShowAddProduct(true);
  };

  // CLOSE ADD PRODUCT

  const closeAddProduct = () => {
    if (creatingProduct) {
      return;
    }

    resetProductForm();
    setShowAddProduct(false);
  };

  // CREATE PRODUCT SUCCESS / CLOSE

  const handleCreate = async () => {
    await handleCreateProduct();

    // Context resetProductForm() already runs after
    // successful creation.

    // We check the current form values after creation.
    // If successfully reset, close modal.
    if (
      productForm.name === "" &&
      productForm.price === "" &&
      productForm.category === ""
    ) {
      setShowAddProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/*
          HEADER
     */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Stock Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage products, current stock and add new stock.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

          {/* ADD PRODUCT */}

          <button
            type="button"
            onClick={openAddProduct}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Product
          </button>

        </div>
      </div>

      {/*
          ERROR
     */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/*
          SUMMARY CARDS
     */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* TOTAL */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {totalProducts}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            All products
          </p>
        </div>

        {/* AVAILABLE */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            In Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {avilableCount}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Products with available stock
          </p>
        </div>

        {/* OUT OF STOCK */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {outOfstockCount}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Products with zero stock
          </p>
        </div>

      </div>

      {/*
          SEARCH
     */}

      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

        <div className="relative">

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          )}

        </div>

        {search && (
          <p className="mt-2 text-xs text-gray-500">
            {filteredProducts.length} product
            {filteredProducts.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        )}

      </div>

      {/*
          PRODUCTS TABLE
     */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            {/* TABLE HEADER */}

            <thead className="bg-gray-50">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Current Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Add Stock
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}

            <tbody className="divide-y divide-gray-100">

              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">

                      <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                      <p className="text-sm text-gray-500">
                        Loading products...
                      </p>

                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                /* NO PRODUCTS */

                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        📦
                      </div>

                      <p className="font-medium text-gray-700">
                        No products found
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {search
                          ? "Try a different product name."
                          : "Add your first product to manage stock."}
                      </p>

                    </div>

                  </td>
                </tr>
              ) : (
                /* PRODUCTS */

                filteredProducts.map(
                  (product) => {

                    const currentStock =
                      Number(
                        product?.stock || 0
                      );

                    const imageUrl =
                      getImageUrl(
                        product
                      );

                    const documentId =
                      product?.documentId;

                    const isSaving =
                      savingId ===
                      documentId;

                    return (
                      <tr
                        key={
                          documentId ||
                          product?.id
                        }
                        className="transition hover:bg-gray-50"
                      >

                        {/* ==================================
                            PRODUCT
                        ================================== */}

                        <td className="px-5 py-4">

                          <div className="flex min-w-[250px] items-center gap-3">

                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={
                                  product?.name ||
                                  "Product"
                                }
                                className="h-14 w-14 rounded-lg object-cover ring-1 ring-gray-200"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-gray-800">
                                {product?.name ||
                                  "Unnamed Product"}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                                ID:{" "}
                                {documentId ||
                                  product?.id ||
                                  "-"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* ==================================
                            PRICE
                        ================================== */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-700">
                          ₹
                          {Number(
                            product?.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* ==================================
                            CURRENT STOCK
                        ================================== */}

                        <td className="px-5 py-4">

                          <span
                            className={`text-lg font-bold ${
                              currentStock ===
                              0
                                ? "text-red-600"
                                : currentStock <
                                  10
                                ? "text-orange-600"
                                : "text-gray-800"
                            }`}
                          >
                            {currentStock}
                          </span>

                          {currentStock > 0 &&
                            currentStock <
                              10 && (
                              <p className="mt-1 text-xs text-orange-500">
                                Low stock
                              </p>
                            )}

                        </td>

                        {/* ==================================
                            STATUS
                        ================================== */}

                        <td className="px-5 py-4">

                          {currentStock > 0 ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />

                              In Stock

                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />

                              Out of Stock

                            </span>
                          )}

                        </td>

                        {/* ==================================
                            ADD STOCK
                        ================================== */}

                        <td className="px-5 py-4">

                          <div className="flex min-w-[230px] gap-2">

                            <input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="Qty"
                              value={
                                stockInputs[
                                  documentId
                                ] || ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleStockInputChange(
                                  documentId,
                                  event.target.value
                                )
                              }
                              disabled={
                                isSaving ||
                                !documentId
                              }
                              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleAddStock(
                                  product
                                )
                              }
                              disabled={
                                isSaving ||
                                !documentId
                              }
                              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isSaving
                                ? "Saving..."
                                : "Add Stock"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/*
          ADD PRODUCT MODAL
     */}

      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* 
                MODAL HEADER
             */}

            <div className="flex shrink-0 items-center justify-between border-b bg-white px-6 py-4">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Add New Product
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new product with initial stock.
                </p>

              </div>

              <button
                type="button"
                onClick={closeAddProduct}
                disabled={creatingProduct}
                className="text-2xl leading-none text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* 
                MODAL BODY
             */}

            <div className="overflow-y-auto">

              <div className="space-y-5 p-6">

                {/* ========================================
                    PRODUCT NAME
                ======================================== */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      productForm.name
                    }
                    onChange={
                      handleProductFormChange
                    }
                    placeholder="Enter product name"
                    disabled={
                      creatingProduct
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                  />

                </div>

                {/* ========================================
                    PRICE + STOCK
                ======================================== */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* PRICE */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Price *
                    </label>

                    <div className="relative">

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        name="price"
                        value={
                          productForm.price
                        }
                        onChange={
                          handleProductFormChange
                        }
                        placeholder="Enter price"
                        disabled={
                          creatingProduct
                        }
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                      />

                    </div>

                  </div>

                  {/* INITIAL STOCK */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Initial Stock *
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      name="stock"
                      value={
                        productForm.stock
                      }
                      onChange={
                        handleProductFormChange
                      }
                      placeholder="Enter initial stock"
                      disabled={
                        creatingProduct
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    />

                  </div>

                </div>

                {/* ========================================
                    CATEGORY
                ======================================== */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      productForm.category
                    }
                    onChange={
                      handleProductFormChange
                    }
                    disabled={
                      categoryLoading ||
                      creatingProduct
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                  >

                    <option value="">
                      {categoryLoading
                        ? "Loading categories..."
                        : "Select Category"}
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category?.documentId ||
                            category?.id
                          }
                          value={
                            category?.documentId ||
                            category?.id ||
                            ""
                          }
                        >
                          {category?.name ||
                            "Unnamed Category"}
                        </option>
                      )
                    )}

                  </select>

                  {!categoryLoading &&
                    categories.length ===
                      0 && (
                      <p className="mt-2 text-xs text-red-500">
                        No categories found.
                        Please create a
                        category first.
                      </p>
                    )}

                </div>

                {/* ========================================
                    DESCRIPTION
                ======================================== */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={
                      productForm.description
                    }
                    onChange={
                      handleProductFormChange
                    }
                    rows="5"
                    placeholder="Enter product description"
                    disabled={
                      creatingProduct
                    }
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Product description will be
                    stored as Strapi Blocks.
                  </p>

                </div>

                {/* ========================================
                    IMAGE
                ======================================== */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Image *
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    disabled={
                      creatingProduct
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />

                  {selectedImage && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-lg">
                        🖼️
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-medium text-green-700">
                          Image selected
                        </p>

                        <p className="max-w-[400px] truncate text-xs text-green-600">
                          {selectedImage.name}
                        </p>

                      </div>

                    </div>
                  )}

                </div>

                {/* ========================================
                    DISCOUNT
                ======================================== */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <div className="flex items-center gap-3">

                    <input
                      type="checkbox"
                      name="isDiscountActive"
                      checked={
                        Boolean(
                          productForm.isDiscountActive
                        )
                      }
                      onChange={
                        handleProductFormChange
                      }
                      disabled={
                        creatingProduct
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />

                    <label className="text-sm font-semibold text-gray-700">
                      Enable Discount
                    </label>

                  </div>

                  {productForm.isDiscountActive && (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                      {/* DISCOUNT TYPE */}

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Discount Type
                        </label>

                        <select
                          name="discountType"
                          value={
                            productForm.discountType
                          }
                          onChange={
                            handleProductFormChange
                          }
                          disabled={
                            creatingProduct
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                        >

                          <option value="percentage">
                            Percentage
                          </option>

                          <option value="fixed">
                            Fixed Amount
                          </option>

                        </select>

                      </div>

                      {/* DISCOUNT VALUE */}

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Discount Value
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="1"
                          name="discountValue"
                          value={
                            productForm.discountValue
                          }
                          onChange={
                            handleProductFormChange
                          }
                          placeholder={
                            productForm.discountType ===
                            "percentage"
                              ? "Example: 10"
                              : "Example: 500"
                          }
                          disabled={
                            creatingProduct
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                        />

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* 
                MODAL FOOTER
             */}

            <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-6 py-4">

              <button
                type="button"
                onClick={closeAddProduct}
                disabled={
                  creatingProduct
                }
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={
                  creatingProduct ||
                  categoryLoading
                }
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingProduct ? (
                  <span className="flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Creating Product...

                  </span>
                ) : (
                  "Create Product"
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

/*====
   PROVIDER WRAPPER==== */

const StockManagement = () => {
  return (
    <StockManagementProvider>
      <StockManagementContent />
    </StockManagementProvider>
  );
};

export default StockManagement;