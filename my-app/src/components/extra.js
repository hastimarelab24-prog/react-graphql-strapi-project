
import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";

import AdminSidebar from "../admin/AdminSidebar";
import AdminNavbar from "../admin/AdminNavbar";
import AdminStatCard from "../admin/AdminStatCard";

import AdminOrders from "./AdminOrders";
import AdminUsers from "./User";

import AdminCategories from "../admin/AdminCategories";
import Discount from "../admin/Discount";
import AdminProducts from "./AdminProducts";
import StockManagement from "./StockManagement";

const API_URL = "http://localhost:1337";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // USERS
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // ORDERS
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // PRODUCTS
  const [productsCount, setProductsCount] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [stockLoading, setStockLoading] = useState(true);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/users?pagination[pageSize]=100`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      console.log("Dashboard users response:", result);

      if (!response.ok) {
        throw new Error(result?.error?.message || "Failed to fetch users");
      }

      setUsers(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Dashboard users error:", error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // FETCH ORDERS COUNT
  const fetchOrdersCount = async () => {
    try {
      setOrdersLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/orders?pagination[pageSize]=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      console.log("Dashboard orders response:", result);

      if (!response.ok) {
        throw new Error(result?.error?.message || "Failed to fetch orders");
      }

      // Strapi REST gives:
      // meta.pagination.total OR meta.total
      const total =
        result?.meta?.pagination?.total ??
        result?.meta?.total ??
        result?.data?.length ??
        0;

      setOrdersCount(Number(total));
    } catch (error) {
      console.error("Dashboard orders count error:", error);
      setOrdersCount(0);
    } finally {
      setOrdersLoading(false);
    }
  };

  // FETCH PRODUCTS COUNT
  const fetchProductsCount = async () => {
    try {
      setProductsLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/products?pagination[pageSize]=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      console.log("Dashboard products response:", result);

      if (!response.ok) {
        throw new Error(result?.error?.message || "Failed to fetch products");
      }

      // Strapi REST gives:
      // meta.pagination.total OR meta.total
      const total =
        result?.meta?.pagination?.total ??
        result?.meta?.total ??
        result?.data?.length ??
        0;

      setProductsCount(Number(total));
    } catch (error) {
      console.error("Dashboard products count error:", error);

      setProductsCount(0);
    } finally {
      setProductsLoading(false);
    }
  };

  // LOAD DASHBOARD DATA
  useEffect(() => {
    fetchUsers();
    fetchOrdersCount();
    fetchProductsCount();
    fetchStockStatus();
  }, []);

  // TODAY CHECK
  const today = new Date();

  const isToday = (dateValue) => {
    if (!dateValue) return false;

    const date = new Date(dateValue);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // USER STATUS
  const activeToday = users.filter((user) => isToday(user.lastLoginAt)).length;

  const currentlyLoggedIn = users.filter(
    (user) => user.isOnline === true,
  ).length;

  const loggedOut = users.filter((user) => user.isOnline !== true).length;

  // Prevent unused variable warnings if these
  // values are needed later for dashboard cards.
  console.log("User statistics:", {
    activeToday,
    currentlyLoggedIn,
    loggedOut,
  });

  // DASHBOARD STATS
  const stats = [
    {
      title: "Total Users",
      value: usersLoading ? "..." : users.length,
      icon: <FiUsers size={23} />,
      description: "Registered website users",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Orders",
      value: ordersLoading ? "..." : ordersCount,
      icon: <FiShoppingBag size={23} />,
      description: "Orders placed through website",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Total Sales",
      value: "—",
      icon: <FiDollarSign size={23} />,
      description: "Sales information",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Products",
      value: productsLoading ? "..." : productsCount,
      icon: <FiPackage size={23} />,
      description: "Products available in store",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Out of Stock",
      value: stockLoading ? "..." : outOfStockProducts.length,
      icon: <FiPackage size={23} />,
      description: "Products currently out of stock",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  // DASHBOARD
  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here is what's happening with your store.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/*  OUT OF STOCK PRODUCTS */}
      {!stockLoading && outOfStockProducts.length > 0 && (
        <div className="rounded-2xl border border-red-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-red-100 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                ⚠ Out of Stock Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These products currently have no available stock.
              </p>
            </div>

            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {outOfStockProducts.length}
            </span>
          </div>

          <div className="divide-y">
            {outOfStockProducts.map((product) => {
              const image = product?.images?.[0]?.url;

              return (
                <div
                  key={product.documentId || product.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3">
                    {image ? (
                      <img
                        src={`${API_URL}${image}`}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        📦
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>

                      <p className="text-sm text-red-500">Stock: 0</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Out of Stock
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // PAGE ROUTING
  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();

      case "Products":
        return <AdminProducts />;
      case "stockmanegmanet":
        return <StockManagement />;
      case "Category":
        return <AdminCategories />;

      case "Discount":
        return <Discount />;

      case "Orders":
        return <AdminOrders />;

      case "Users":
        return <AdminUsers />;

      default:
        return renderDashboard();
    }
  };

  const fetchStockStatus = async () => {
    try {
      setStockLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/products?populate=*&pagination[pageSize]=100`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error?.message || "Failed to fetch stock");
      }

      const products = result?.data || [];

      const outOfStock = products.filter(
        (product) => Number(product?.stock ?? 0) === 0,
      );

      setOutOfStockProducts(outOfStock);
    } catch (error) {
      console.error("Stock status error:", error);

      setOutOfStockProducts([]);
    } finally {
      setStockLoading(false);
    }
  };

  // MAIN LAYOUT
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <AdminNavbar setSidebarOpen={setSidebarOpen} />

      <main className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{renderPage()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
