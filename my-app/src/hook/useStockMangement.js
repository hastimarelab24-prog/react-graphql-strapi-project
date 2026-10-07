import { useContext } from "react";

import {
  StockManagementContext,
} from "../context/StockManagement";

const useStockMangement = () => {
  const context = useContext(
    StockManagementContext
  );

  if (!context) {
    throw new Error(
      "useStockMangement must be used inside StockManagementProvider"
    );
  }

  return context;
};

export default useStockMangement;