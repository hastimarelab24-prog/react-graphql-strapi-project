import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiShoppingBag,
  FiLogIn,
  FiHome,
} from "react-icons/fi";

const AdminSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FiGrid />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FiUsers />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Login Activity",
      path: "/admin/login-activity",
      icon: <FiLogIn />,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-gray-900 p-5 text-white md:flex">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">Electro Hub</h2>
        <p className="mt-1 text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/"
        className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <FiHome />
        Back to Website
      </NavLink>
    </aside>
  );
};

export default AdminSidebar;