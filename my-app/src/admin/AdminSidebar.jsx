import React from "react";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiX,
  FiTag,
  FiLayers,
  FiArchive,
} from "react-icons/fi";

const AdminSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid />,
    },
    {
      name: "Discount",
      icon: <FiTag />,
    },
    {
      name: "Category",
      icon: <FiLayers />,
    },
    {
      name: "Stock Management",
      icon: <FiArchive />,
    },
    {
      name: "Products",
      icon: <FiPackage />,
    },
    {
      name: "Orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Users",
      icon: <FiUsers />,
    },
  
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-xl font-bold text-blue-600">
              Electro Hub
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activePage === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setActivePage(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <span className="flex w-5 items-center justify-center text-lg">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t p-4">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              window.dispatchEvent(new Event("authChange"));

              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <FiLogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;