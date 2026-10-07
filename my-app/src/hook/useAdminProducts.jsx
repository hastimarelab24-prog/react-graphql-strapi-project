import { useContext } from "react";

import {
  AdminProductsContext,
} from "../context/AdminProducts";

const useAdminProducts = () => {
  const context = useContext(
    AdminProductsContext
  );

  if (!context) {
    throw new Error(
      "useAdminProducts must be used inside AdminProductsProvider"
    );
  }

  return context;
};

export default useAdminProducts;