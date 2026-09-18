import React from 'react'
import { Outlet } from "react-router-dom";
import AdminSidebar from "./adminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
     <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar />

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
}

export default AdminLayout