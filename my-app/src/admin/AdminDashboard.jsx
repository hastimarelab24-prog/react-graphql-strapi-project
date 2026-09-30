import React, { useState } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useQuery } from "@apollo/client/react";

import AdminSidebar from "../admin/AdminSidebar";
import AdminNavbar from "../admin/AdminNavbar";
import AdminStatCard from "../admin/AdminStatCard";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./User"; // <--- Imported Alag Component
import { GET_ALL_ORDERS, GET_ALL_USERS } from "../gqloperation/adminQueries";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only",
  });

  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });

  const orders = ordersData?.orders || [];
  const users = usersData?.usersPermissionsUsers || [];

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
      value: ordersLoading ? "..." : orders.length,
      icon: <FiShoppingBag size={23} />,
      description: "Orders from Strapi",
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
      value: "—",
      icon: <FiPackage size={23} />,
      description: "Products in store",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here is what's happening with your store.
        </p>
      </div>

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
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();
      case "Orders":
        return <AdminOrders />;
      case "Users":
        return <AdminUsers />; // <--- Render Alag Component
      default:
        return renderDashboard();
    }
  };

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