import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../api/adminCategoriesApi";

export const AdminCategoriesContext =
  createContext(null);

const AdminCategoriesProvider = ({
  children,
}) => {  // STATE
  const [categories, setCategories] =
    useState([]);

  const [categoryName, setCategoryName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [error, setError] =
    useState("");
  // FETCH CATEGORIES
  const fetchCategories =
    useCallback(async () => {
      try {
        setFetching(true);
        setError("");

        const result =
          await getCategories();

        console.log(
          "Categories from Strapi:",
          result
        );

        setCategories(
          Array.isArray(result?.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Fetch categories error:",
          err
        );

        setCategories([]);
        setError(
          err?.message ||
            "Failed to fetch categories."
        );
      } finally {
        setFetching(false);
      }
    }, []);
  // INITIAL FETCH
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  // PRODUCT COUNT
  const getProductCount = useCallback(
    (category) => {
      if (
        Array.isArray(category?.products)
      ) {
        return category.products.length;
      }

      if (
        Array.isArray(
          category?.products?.data
        )
      ) {
        return category.products.data
          .length;
      }

      return 0;
    },
    []
  );
  // ADD CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const name =
        categoryName.trim();

      if (!name) {
        throw new Error(
          "Please enter category name."
        );
      }

      setLoading(true);

      // Duplicate check
      const existingCategory =
        categories.some(
          (category) =>
            category?.name
              ?.trim()
              .toLowerCase() ===
            name.toLowerCase()
        );

      if (existingCategory) {
        throw new Error(
          "This category already exists."
        );
      }

      // Create in Strapi
      const result =
        await createCategory(name);

      console.log(
        "Category created:",
        result
      );

      setCategoryName("");

      // Refresh list
      await fetchCategories();

      alert(
        "Category added successfully."
      );
    } catch (err) {
      console.error(
        "Create category error:",
        err
      );

      setError(
        err?.message ||
          "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
  };
  // DELETE CATEGORY
  const handleDelete = async (
    category
  ) => {
    const documentId =
      category?.documentId;

    if (!documentId) {
      setError(
        "Category documentId not found."
      );
      return;
    }

    const productCount =
      getProductCount(category);

    // Confirmation
    if (productCount > 0) {
      const confirmed =
        window.confirm(
          `"${category.name}" has ${productCount} product(s).\n\nAre you sure you want to delete this category?`
        );

      if (!confirmed) {
        return;
      }
    } else {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${category.name}"?`
        );

      if (!confirmed) {
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      await deleteCategory(
        documentId
      );

      await fetchCategories();

      alert(
        "Category deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete category error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete category."
      );
    } finally {
      setLoading(false);
    }
  };
  // TOTAL PRODUCTS
  const totalProductsInCategories =
    categories.reduce(
      (total, category) =>
        total +
        getProductCount(category),
      0
    );
  // CONTEXT VALUE
  const value = {
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
  };

  return (
    <AdminCategoriesContext.Provider
      value={value}
    >
      {children}
    </AdminCategoriesContext.Provider>
  );
};

export default AdminCategoriesProvider;