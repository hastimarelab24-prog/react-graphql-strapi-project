import { useMemo, useState } from "react";

function usePagination(items = [], itemsPerPage = 8) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return items.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [items, currentPage, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  const prevPage = () => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  };
}

export default usePagination;