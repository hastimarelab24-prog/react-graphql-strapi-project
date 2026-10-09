import React, { useState } from "react";

import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
} from "react-icons/fi";

import AdminSidebar from "../admin/AdminSidebar";
import AdminNavbar from "../admin/AdminNavbar";

import AdminOrders from "./AdminOrders";
import AdminUsers from "./User";
import AdminCategories from "./AdminCategories";
import Discount from "./Discount";
import AdminProducts from "./AdminProducts";
import StockManagement from "./StockManagement";

import AdminDashboardProvider from "../context/AdminDashboardContext";
import useAdminDashboard from "../hook/useAdminDashboard";

/* 
   STAT CARD
 */

const DashboardStatCard = ({
  title,
  value,
  icon,
  description,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* 
   DASHBOARD CONTENT
 */

const AdminDashboardContent = () => {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /* mymy
     CONTEXT
  mymy */

  const dashboard =
    useAdminDashboard() || {};

  const {
    users = [],
    usersLoading = false,

    ordersCount = 0,
    ordersLoading = false,

    productsCount = 0,
    productsLoading = false,

    outOfStockProducts = [],
    stockLoading = false,

    activeToday = 0,
    currentlyLoggedIn = 0,
    loggedOut = 0,

    error = "",
    refreshDashboard,
  } = dashboard;

  /* mymy
     STATS
  mymy */

  const stats = [
    {
      title: "Total Users",

      value: usersLoading
        ? "..."
        : users.length,

      icon: <FiUsers size={23} />,

      description:
        "Registered website users",

      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Orders",

      value: ordersLoading
        ? "..."
        : ordersCount,

      icon: (
        <FiShoppingBag size={23} />
      ),

      description:
        "Orders placed through website",

      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Total Sales",

      value: "—",

      icon: (
        <FiDollarSign size={23} />
      ),

      description:
        "Sales information",

      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Products",

      value: productsLoading
        ? "..."
        : productsCount,

      icon: <FiPackage size={23} />,

      description:
        "Products available in store",

      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Out of Stock",

      value: stockLoading
        ? "..."
        : outOfStockProducts.length,

      icon: <FiPackage size={23} />,

      description:
        "Products currently out of stock",

      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  /* mymy
     REFRESH
  mymy */

  const handleRefresh = async () => {
    try {
      if (
        typeof refreshDashboard ===
        "function"
      ) {
        await refreshDashboard();
      }
    } catch (refreshError) {
      console.error(
        "Dashboard refresh error:",
        refreshError
      );
    }
  };

  /* mymy
     DASHBOARD
  mymy */

  const renderDashboard = () => {
    return (
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here is what's
              happening with your store.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <FiRefreshCw size={17} />

            Refresh
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard
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

        {/* USER STATUS */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* LOGGED IN TODAY */}

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Logged In Today
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {activeToday}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Users who logged in today
            </p>
          </div>

          {/* CURRENTLY LOGGED IN */}

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Currently Logged In
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {currentlyLoggedIn}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Users currently active
            </p>
          </div>

          {/* LOGGED OUT */}

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Logged Out
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-600">
              {loggedOut}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Users currently logged out
            </p>
          </div>

        </div>

        {/* OUT OF STOCK */}

        {!stockLoading &&
          outOfStockProducts.length > 0 && (
            <div className="rounded-2xl border border-red-100 bg-white shadow-sm">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-red-100 p-5">

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    ⚠ Out of Stock Products
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    These products currently
                    have no available stock.
                  </p>
                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  {outOfStockProducts.length}
                </span>

              </div>

              {/* PRODUCTS */}

              <div className="divide-y">

                {outOfStockProducts.map(
                  (product, index) => {
                    const image =
                      product?.images?.[0]
                        ?.url;

                    const imageUrl =
                      image
                        ? image.startsWith(
                            "http"
                          )
                          ? image
                          : `http://localhost:1337${image}`
                        : null;

                    const productKey =
                      product?.documentId ||
                      product?.id ||
                      `product-${index}`;

                    const stock = Number(
                      product?.stock ?? 0
                    );

                    return (
                      <div
                        key={productKey}
                        className="flex items-center justify-between gap-4 p-4"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                product?.name ||
                                "Product"
                              }
                              className="h-12 w-12 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                              <FiPackage
                                size={22}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="truncate font-medium text-gray-800">
                              {product?.name ||
                                "Unnamed Product"}
                            </p>

                            <p className="text-sm text-red-500">
                              Stock: {stock}
                            </p>

                          </div>

                        </div>

                        <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Out of Stock
                        </span>

                      </div>
                    );
                  }
                )}

              </div>
            </div>
          )}

        {/* NO OUT OF STOCK */}

        {!stockLoading &&
          outOfStockProducts.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">

              <FiPackage
                size={32}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-3 font-semibold text-gray-800">
                All Products Are In Stock
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no
                out-of-stock products.
              </p>

            </div>
          )}

      </div>
    );
  };

  /* mymy
     PAGE ROUTING
  mymy */

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();

      case "Products":
        return <AdminProducts />;

      case "Stock Management":
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

  /* mymy
     MAIN LAYOUT
  mymy */

  return (
    <div className="min-h-screen bg-gray-50">

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <AdminNavbar
        setSidebarOpen={setSidebarOpen}
      />

      <main className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>

    </div>
  );
};

/* 
   PROVIDER
 */

const AdminDashboard = () => {
  return (
    <AdminDashboardProvider>
      <AdminDashboardContent />
    </AdminDashboardProvider>
  );
};

export default AdminDashboard;