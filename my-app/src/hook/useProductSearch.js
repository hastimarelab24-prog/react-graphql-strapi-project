import { useQuery } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import { SEARCH_PRODUCTS } from "../gqloperation/queries";

function useProductSearch() {
  // refersh page to search value get
  const [search, setSearch] = useState(() => {
    return sessionStorage.getItem("search") || "";
  });
  // initial search string set
  const [delaySearch, setDelaySearch] = useState(() => {
    return sessionStorage.getItem("search" || "");
  });

  // search save karo
  useEffect(() => {
    const trimmedSearch = search.trim();
    // setDelaySearch("");
    if (trimmedSearch === "") {
      setDelaySearch("");
      sessionStorage.removeItem("search");
      return;
    }

    // search save kro
    sessionStorage.setItem("search", trimmedSearch);
    // previous timer clear 2s wait
    const timer = setTimeout(() => {
      setDelaySearch(trimmedSearch);
    }, 2000);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, loading, error } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      search: delaySearch,
    },
    skip: !delaySearch || delaySearch.trim() === "",
  });

  const products = data?.products || [];

  // serach clear
  const clearSearch = () => {
    setSearch("");
    setDelaySearch("");
    sessionStorage.removeItem("serach");
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
