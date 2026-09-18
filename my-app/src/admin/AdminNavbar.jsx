import React from 'react'
import { useNavigate } from 'react-router-dom';

 const AdminNavbar = () => {
    const navigate = useNavigate();
   
     const logoutAdmin = () => {
       localStorage.removeItem("token");
       localStorage.removeItem("user");
   
       window.dispatchEvent(new Event("authChange"));
       navigate("/login");
     };
   
     return (
       <header className="flex items-center justify-between border-b bg-white px-4 py-5 shadow-sm md:px-8">
         <div>
           <h3 className="text-xl font-bold text-gray-800">
             Admin Dashboard
           </h3>
   
           <p className="mt-1 text-xs text-gray-500">
             Manage your ecommerce website
           </p>
         </div>
   
         <button
           onClick={logoutAdmin}
           className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
         >
           <FiLogOut />
           Logout
         </button>
       </header>
    
  )
}
export default AdminNavbar;