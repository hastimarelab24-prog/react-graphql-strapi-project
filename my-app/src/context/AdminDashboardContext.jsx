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

const AdminDashboardProvider = ({
  children,
}) => {
  const [users, setUsers] = useState([]);

  const [ordersCount, setOrdersCount] =
    useState(0);

  const [productsCount, setProductsCount] =
    useState(0);

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

  const [error, setError] =
    useState("");

  /* =====================================================
     USER STATUS
  ===================================================== */

  const calculateUserStatus = (
    userList
  ) => {
    const today = new Date();

    const todayString =
      today.toISOString().split("T")[0];

    let activeTodayCount = 0;
    let currentlyLoggedInCount = 0;
    let loggedOutCount = 0;

    userList.forEach((user) => {
      const isActive =
        user?.isActive === true ||
        user?.active === true ||
        user?.loginStatus ===
          "active" ||
        user?.loginStatus ===
          "logged-in" ||
        user?.status === "active";

      if (isActive) {
        currentlyLoggedInCount++;
      } else {
        loggedOutCount++;
      }

      const loginDate =
        user?.lastLoginAt ||
        user?.lastLogin ||
        user?.loginAt ||
        user?.updatedAt;

      if (loginDate) {
        try {
          const date = new Date(
            loginDate
          );

          const dateString =
            date.toISOString().split("T")[0];

          if (
            dateString ===
            todayString
          ) {
            activeTodayCount++;
          }
        } catch (error) {
          console.warn(
            "Invalid login date:",
            loginDate
          );
        }
      }
    });

    return {
      activeTodayCount,
      currentlyLoggedInCount,
      loggedOutCount,
    };
  };

  /* =====================================================
     FETCH USERS
  ===================================================== */

  const fetchUsers = useCallback(
    async () => {
      try {
        setUsersLoading(true);
        setError("");

        const result =
          await getDashboardUsers();

        const userList = Array.isArray(
          result
        )
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

        setUsers(userList);

        return userList;
      } catch (err) {
        console.error(
          "Dashboard users error:",
          err
        );

        setUsers([]);

        setError(
          err?.message ||
            "Failed to load users."
        );

        return [];
      } finally {
        setUsersLoading(false);
      }
    },
    []
  );

  /* =====================================================
     FETCH ORDERS
  ===================================================== */

  const fetchOrdersCount =
    useCallback(async () => {
      try {
        setOrdersLoading(true);

        const result =
          await getDashboardOrders();

        const total =
          result?.meta?.pagination
            ?.total ??
          result?.meta?.total ??
          result?.data?.length ??
          (Array.isArray(result)
            ? result.length
            : 0);

        setOrdersCount(
          Number(total)
        );
      } catch (err) {
        console.error(
          "Dashboard orders error:",
          err
        );

        setOrdersCount(0);

        setError(
          err?.message ||
            "Failed to load orders."
        );
      } finally {
        setOrdersLoading(false);
      }
    }, []);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts =
    useCallback(async () => {
      try {
        setProductsLoading(true);
        setStockLoading(true);

        const result =
          await getDashboardProducts();

        const products = Array.isArray(
          result?.data
        )
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const total =
          result?.meta?.pagination
            ?.total ??
          result?.meta?.total ??
          products.length;

        setProductsCount(
          Number(total)
        );

        const outOfStock =
          products.filter(
            (product) => {
              const stock = Number(
                product?.stock ??
                  product?.attributes
                    ?.stock ??
                  0
              );

              return stock <= 0;
            }
          );

        setOutOfStockProducts(
          outOfStock
        );
      } catch (err) {
        console.error(
          "Dashboard products error:",
          err
        );

        setProductsCount(0);

        setOutOfStockProducts([]);

        setError(
          err?.message ||
            "Failed to load products."
        );
      } finally {
        setProductsLoading(false);
        setStockLoading(false);
      }
    }, []);

  /* =====================================================
     REFRESH DASHBOARD
  ===================================================== */

  const refreshDashboard =
    useCallback(async () => {
      setError("");

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

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  /* =====================================================
     CALCULATE STATUS
  ===================================================== */

  const {
    activeTodayCount,
    currentlyLoggedInCount,
    loggedOutCount,
  } = calculateUserStatus(users);

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <AdminDashboardContext.Provider
      value={{
        users,

        usersLoading,

        ordersCount,

        ordersLoading,

        productsCount,

        productsLoading,

        outOfStockProducts,

        stockLoading,

        activeToday:
          activeTodayCount,

        currentlyLoggedIn:
          currentlyLoggedInCount,

        loggedOut:
          loggedOutCount,

        error,

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