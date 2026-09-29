// import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// const apolloClient = new ApolloClient({
//   link: new HttpLink({
//     uri: "http://localhost:1337/graphql",
//   }),

//   cache: new InMemoryCache(),
// });

// export default apolloClient;

// import { gql } from "@apollo/client";

// export const GET_ALL_ORDERS = gql`
//   query GetAllOrders {
//     orders {
//       documentId
//       customerName
//       customerEmail
//       totalAmount
//       status
//       createdAt
//     }
//   }
// `;

// import React from "react";

// import {
//   FiUsers,
//   FiUserCheck,
//   FiUserX,
//   FiShoppingBag,
//   FiDollarSign,
//   FiClock,
// } from "react-icons/fi";

// import useAdminOrders from "../hooks/useAdminOrders";

// const AdminDashboard = () => {
//   const {
//     orders,
//     loading,
//     error,
//     totalOrders,
//     pendingOrders,
//     totalSales,
//   } = useAdminOrders();

//   const stats = [
//     {
//       title: "Total Users",
//       value: "0",
//       icon: <FiUsers />,
//     },
//     {
//       title: "Logged-in Users",
//       value: "0",
//       icon: <FiUserCheck />,
//     },
//     {
//       title: "Logged-out Users",
//       value: "0",
//       icon: <FiUserX />,
//     },
//     {
//       title: "Total Orders",
//       value: totalOrders,
//       icon: <FiShoppingBag />,
//     },
//     {
//       title: "Total Sales",
//       value: `₹${totalSales.toLocaleString("en-IN")}`,
//       icon: <FiDollarSign />,
//     },
//     {
//       title: "Pending Orders",
//       value: pendingOrders,
//       icon: <FiClock />,
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-lg font-medium text-gray-600">
//           Loading dashboard...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="rounded-lg bg-red-50 p-6 text-red-600">
//           <h2 className="mb-2 text-lg font-bold">
//             Dashboard Error
//           </h2>

//           <p>{error.message}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">

//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
//           Admin Dashboard
//         </h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Manage your ecommerce store
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

//         {stats.map((stat) => (
//           <div
//             key={stat.title}
//             className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
//           >

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   {stat.title}
//                 </p>

//                 <h2 className="mt-2 text-2xl font-bold text-gray-900">
//                   {stat.value}
//                 </h2>
//               </div>

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
//                 {stat.icon}
//               </div>

//             </div>

//           </div>
//         ))}

//       </div>

//       <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

//         <div className="border-b border-gray-200 p-5">
//           <h2 className="text-lg font-bold text-gray-900">
//             Recent Orders
//           </h2>

//           <p className="mt-1 text-sm text-gray-500">
//             Latest orders from your store
//           </p>
//         </div>

//         <div className="overflow-x-auto">

//           <table className="min-w-full">

//             <thead className="bg-gray-50">

//               <tr>

//                 <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                   Customer
//                 </th>

//                 <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                   Email
//                 </th>

//                 <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                   Amount
//                 </th>

//                 <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                   Status
//                 </th>

//               </tr>

//             </thead>

//             <tbody className="divide-y divide-gray-100">

//               {orders.length === 0 ? (

//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="px-5 py-10 text-center text-gray-500"
//                   >
//                     No orders found
//                   </td>
//                 </tr>

//               ) : (

//                 orders.slice(0, 10).map((order) => (

//                   <tr
//                     key={order.documentId}
//                     className="hover:bg-gray-50"
//                   >

//                     <td className="px-5 py-4 text-sm font-medium text-gray-900">
//                       {order.customerName || "Unknown"}
//                     </td>

//                     <td className="px-5 py-4 text-sm text-gray-500">
//                       {order.customerEmail || "-"}
//                     </td>

//                     <td className="px-5 py-4 text-sm font-semibold text-gray-900">
//                       ₹
//                       {Number(
//                         order.totalAmount || 0
//                       ).toLocaleString("en-IN")}
//                     </td>

//                     <td className="px-5 py-4">

//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                           order.status?.toLowerCase() === "pending"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : order.status?.toLowerCase() === "completed"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {order.status || "Unknown"}
//                       </span>

//                     </td>

//                   </tr>

//                 ))

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default AdminDashboard;




// import { useQuery } from "@apollo/client/react";

// import { GET_ALL_ORDERS } from "../Gqloperation/adminQueries";

// const useAdminOrders = () => {
//   const {
//     data,
//     loading,
//     error,
//   } = useQuery(GET_ALL_ORDERS);

//   const orders = data?.orders || [];

//   const totalOrders = orders.length;

//   const pendingOrders = orders.filter(
//     (order) =>
//       order.status?.toLowerCase() === "pending"
//   ).length;

//   const totalSales = orders.reduce(
//     (total, order) =>
//       total + Number(order.totalAmount || 0),
//     0
//   );

//   return {
//     orders,
//     loading,
//     error,
//     totalOrders,
//     pendingOrders,
//     totalSales,
//   };
// };

// export default useAdminOrders;