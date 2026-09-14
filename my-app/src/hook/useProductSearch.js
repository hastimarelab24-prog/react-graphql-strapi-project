import { useQuery } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import { SEARCH_PRODUCTS } from "../gqloperation/queries";

function useProductSearch() {
  const [search, setSearch] = useState("");
  const [delaySearch, setDelaySearch] = useState("");

  useEffect(() => {
    setDelaySearch("");
    if (search.trim() === "") {
      return;
    }
    const timer = setTimeout(() => {
      setDelaySearch(search.trim());
    }, 2000);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, loading, error } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      search: delaySearch,
    },
    skip: delaySearch.trim() === "",
  });
  
  const products = data?.products || [];

  const clearSearch = () => {
    setSearch("");
    setDelaySearch("");
  };
  return {
    search,
    setSearch,
    delaySearch,
    products,
    loading,
    error,
    clearSearch,
  };
}

export default useProductSearch;
