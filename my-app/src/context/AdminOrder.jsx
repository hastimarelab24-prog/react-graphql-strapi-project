import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { getOrders } from "../api/adminOrdersApi";

export const AdminOrdersContext = createContext(null);

const AdminOrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getOrders();

      const fetchedOrders = Array.isArray(result?.data)
        ? result.data
        : [];

      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Fetch orders error:", err);

      setError(err?.message || "Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <AdminOrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        totalOrders: orders.length,
      }}
    >
      {children}
    </AdminOrdersContext.Provider>
  );
};

export default AdminOrdersProvider;