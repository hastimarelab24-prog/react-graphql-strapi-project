import React from "react";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
} from "react-icons/fi";

const AdminNavbar = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6 lg:ml-64 lg:px-8">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu size={23} />
        </button>

        <div className="hidden items-center rounded-xl bg-gray-100 px-4 py-2 md:flex">
          <FiSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 md:hidden">
          Admin Panel
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2.5 text-gray-600 hover:bg-gray-100">
          <FiBell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FiUser size={20} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;