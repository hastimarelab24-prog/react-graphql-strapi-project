import { useMemo, useState } from "react";

function useProductFilters(products = []) {
  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [sortBy, setSortBy] = useState("default");

  const [viewMode, setViewMode] = useState("grid");

  // CATEGORY
  const categories = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const categoryName = product?.category?.name;

      if (categoryName) {
        categoryMap[categoryName] =
          (categoryMap[categoryName] || 0) + 1;
      }
    });

    return Object.entries(categoryMap);
  }, [products]);

  // FILTER + SORT
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY FILTER
    if (selectedCategory !== "All Products") {
      result = result.filter(
        (product) =>
          product?.category?.name === selectedCategory
      );
    }

    // PRICE LOW TO HIGH
    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    // PRICE HIGH TO LOW
    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    // NAME
    if (sortBy === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(
          b.name || ""
        )
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    sortBy,
  ]);

  return {
    selectedCategory,
    setSelectedCategory,

    sortBy,
    setSortBy,

    viewMode,
    setViewMode,

    categories,
    filteredProducts,
  };
}

export default useProductFilters;