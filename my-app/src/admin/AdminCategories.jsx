import React from "react";

import AdminCategoriesProvider from "../context/AdminCategoriesContext";
import useAdminCategories from "../hook/useAdminCategories";
// CATEGORY PAGE CONTENT
const AdminCategoriesContent = () => {
  const {
    categories,
    categoryName,
    setCategoryName,

    loading,
    fetching,
    error,

    fetchCategories,

    getProductCount,

    handleSubmit,
    handleDelete,

    totalProductsInCategories,
  } = useAdminCategories();

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">

      {/* ==========================================
          PAGE HEADING
      ========================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Categories
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add and manage product categories.
        </p>
      </div>

      {/* ==========================================
          STATISTICS
      ========================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* TOTAL CATEGORIES */}

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {fetching
                  ? "..."
                  : categories.length}
              </h2>

            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-2xl">
              📂
            </div>

          </div>

        </div>

        {/* PRODUCTS IN CATEGORIES */}

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Products in Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {fetching
                  ? "..."
                  : totalProductsInCategories}
              </h2>

            </div>

            <div className="rounded-xl bg-green-50 p-4 text-2xl">
              🛍️
            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          ADD CATEGORY
      ========================================== */}

      <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-7">

        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Add New Category
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:flex-row"
        >

          <input
            type="text"
            value={categoryName}
            onChange={(e) =>
              setCategoryName(
                e.target.value
              )
            }
            placeholder="Enter category name"
            disabled={loading}
            className="flex-1 rounded-lg border p-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Adding..."
              : "+ Add Category"}
          </button>

        </form>

        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

      </div>

      {/* ==========================================
          CATEGORY LIST
      ========================================== */}

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              All Categories
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Categories are loaded directly from Strapi.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchCategories}
            disabled={fetching}
            className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            {fetching
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {fetching ? (

          <p className="p-6 text-gray-500">
            Loading categories...
          </p>

        ) : categories.length === 0 ? (

          /* ========================================
             EMPTY
          ======================================== */

          <div className="p-8 text-center">

            <div className="text-4xl">
              📂
            </div>

            <p className="mt-3 font-medium text-gray-700">
              No categories found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first category above.
            </p>

          </div>

        ) : (

          /* ========================================
             TABLE
          ======================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left text-sm">

              <thead className="bg-gray-50 text-gray-600">

                <tr>

                  <th className="p-4">
                    #
                  </th>

                  <th className="p-4">
                    Category Name
                  </th>

                  <th className="p-4">
                    Products
                  </th>

                  <th className="p-4">
                    Document ID
                  </th>

                  <th className="p-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {categories.map(
                  (category, index) => {

                    const productCount =
                      getProductCount(
                        category
                      );

                    return (
                      <tr
                        key={
                          category.documentId ||
                          category.id
                        }
                        className="border-t transition hover:bg-gray-50"
                      >

                        {/* NUMBER */}

                        <td className="p-4 text-gray-500">
                          {index + 1}
                        </td>

                        {/* CATEGORY */}

                        <td className="p-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                              📂
                            </div>

                            <div>

                              <p className="font-semibold text-gray-800">
                                {category.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                Product Category
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PRODUCT COUNT */}

                        <td className="p-4">

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                            {productCount}{" "}

                            {productCount ===
                            1
                              ? "Product"
                              : "Products"}

                          </span>

                        </td>

                        {/* DOCUMENT ID */}

                        <td className="p-4 text-xs text-gray-500">
                          {category.documentId ||
                            category.id ||
                            "-"}
                        </td>

                        {/* DELETE */}

                        <td className="p-4">

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            disabled={loading}
                            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
const AdminCategories = () => {
  return (
    <AdminCategoriesProvider>
      <AdminCategoriesContent />
    </AdminCategoriesProvider>
  );
};

export default AdminCategories;