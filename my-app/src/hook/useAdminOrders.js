import { useContext } from "react";

import {
  AdminOrdersContext,
} from "../context/AdminOrder";

const useAdminOrders = () => {
  const context = useContext(AdminOrdersContext);

  if (!context) {
    throw new Error(
      "useAdminOrders must be used inside AdminOrdersProvider"
    );
  }

  return context;
};

export default useAdminOrders;