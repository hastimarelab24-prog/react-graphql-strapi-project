import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getDashboardUsers,
  getDashboardOrders,
  getDashboardProducts,
} from "../api/adminDashboardApi";

export const AdminDashboardContext =
  createContext(null);

const AdminDashboardProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const [
    outOfStockProducts,
    setOutOfStockProducts,
  ] = useState([]);

  const [usersLoading, setUsersLoading] =
    useState(true);

  const [ordersLoading, setOrdersLoading] =
    useState(true);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [stockLoading, setStockLoading] =
    useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);

      const result =
        await getDashboardUsers();

      setUsers(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard users error:",
        error
      );

      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchOrdersCount =
    useCallback(async () => {
      try {
        setOrdersLoading(true);

        const result =
          await getDashboardOrders();

        const total =
          result?.meta?.pagination?.total ??
          result?.meta?.total ??
          result?.data?.length ??
          0;

        setOrdersCount(Number(total));
      } catch (error) {
        console.error(
          "Dashboard orders error:",
          error
        );

        setOrdersCount(0);
      } finally {
        setOrdersLoading(false);
      }
    }, []);

  const fetchProducts =
    useCallback(async () => {
      try {
        setProductsLoading(true);
        setStockLoading(true);

        const result =
          await getDashboardProducts();

        const products =
          result?.data || [];

        const total =
          result?.meta?.pagination?.total ??
          result?.meta?.total ??
          products.length;

        setProductsCount(Number(total));

        const outOfStock =
          products.filter(
            (product) =>
              Number(
                product?.stock ?? 0
              ) === 0
          );

        setOutOfStockProducts(
          outOfStock
        );
      } catch (error) {
        console.error(
          "Dashboard products error:",
          error
        );

        setProductsCount(0);
        setOutOfStockProducts([]);
      } finally {
        setProductsLoading(false);
        setStockLoading(false);
      }
    }, []);

  const refreshDashboard =
    useCallback(async () => {
      await Promise.all([
        fetchUsers(),
        fetchOrdersCount(),
        fetchProducts(),
      ]);
    }, [
      fetchUsers,
      fetchOrdersCount,
      fetchProducts,
    ]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return (
    <AdminDashboardContext.Provider
      value={{
        users,
        ordersCount,
        productsCount,
        outOfStockProducts,

        usersLoading,
        ordersLoading,
        productsLoading,
        stockLoading,

        fetchUsers,
        fetchOrdersCount,
        fetchProducts,
        refreshDashboard,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
};

export default AdminDashboardProvider;