// import React from "react";
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import {
//   FiShoppingBag,
//   FiRefreshCw,
//   FiXCircle,
//   FiMapPin,
//   FiMail,
//   FiEye,
// } from "react-icons/fi";

// export const GET_ALL_ORDERS = gql`
//   query GetAllOrders {
//     orders {
//       documentId
//       shippingAddress
//       city
//       state
//       amount
//       items
//       pin
//       orderId
//       email
//       paymentId
//       paymentStatus
//       orderStatus
//       createdAt
//       updatedAt
//     }
//   }
// `;

// const AdminOrders = () => {
//   const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS, {
//     fetchPolicy: "network-only",
//   });

//   const orders = data?.orders || [];

//   // format amount
//   const formatAmount = (amount) => {
//     if (amount === null || amount === undefined) {
//       return "0";
//     }
//     return `${Number(amount).toLocaleString("en-IN")}`;
//   };

//   // format date
//   const formatDate = (dateStr) => {
//     if (!dateStr) {
//       return "N/A";
//     }
//     return new Date(dateStr).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // payment status
//   const getPaymentStatusClass = (status) => {
//     if (!status) {
//       return "bg-gray-100 text-gray-600";
//     }
//     const val = status.toLowerCase();
//     if (val === "paid") {
//       return "bg-green-100 text-green-700";
//     }
//     if (val === "pending") {
//       return "bg-yellow-100 text-yellow-700";
//     }
//     if (val === "failed") {
//       return "bg-red-100 text-red-700";
//     }
//     return "bg-gray-100 text-gray-600";
//   };

//   // orders status
//   const getOrdersStatusClass = (status) => {
//     if (!status) {
//       return "bg-gray-100 text-gray-600";
//     }
//     const value = status.toLowerCase();
//     if (value === "delivered" || value === "completed") {
//       return "bg-green-100 text-green-700";
//     }
//     if (value === "pending" || value === "processing") {
//       return "bg-yellow-100 text-yellow-700";
//     }
//     if (value === "cancelled" || value === "canceled") {
//       return "bg-red-100 text-red-700";
//     }
//     return "bg-blue-100 text-blue-700";
//   };

//   // view order
//   const handleViewOrder = (order) => {
//     const itemText = Array.isArray(order.items)
//       ? order.items
//           .map((item) => `${item.name || "Product"} x ${item.qty || 1}`)
//           .join("\n")
//       : "No items";

//     alert(
//       `Order Details\n\n` +
//         `Order ID: ${order.orderId || "N/A"}\n` +
//         `Email: ${order.email || "N/A"}\n` +
//         `Amount: ₹${formatAmount(order.amount)}\n` +
//         `Shipping Address: ${order.shippingAddress || "N/A"}\n` +
//         `City: ${order.city || "N/A"}\n` +
//         `State: ${order.state || "N/A"}\n` +
//         `PIN: ${order.pin || "N/A"}\n` +
//         `Payment Status: ${order.paymentStatus || "N/A"}\n` +
//         `Order Status: ${order.orderStatus || "N/A"}\n\n` +
//         `Items:\n${itemText}`
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* PAGE HEADER */}
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             All orders placed on your website
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* TOTAL ORDERS */}
//           <div className="rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
//             <p className="text-xs text-gray-500">Total Orders</p>
//             <p className="text-xl font-bold text-gray-800">{orders.length}</p>
//           </div>

//           {/* REFRESH BUTTON */}
//           <button
//             onClick={() => refetch()}
//             disabled={loading}
//             className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
//           >
//             <FiRefreshCw
//               size={17}
//               className={loading ? "animate-spin" : ""}
//             />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* LOADING STATE */}
//       {loading && (
//         <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
//           <p className="mt-4 text-sm text-gray-500">Loading orders...</p>
//         </div>
//       )}

//       {/* ERROR STATE */}
//       {error && (
//         <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
//           <div className="flex items-start gap-3">
//             <FiXCircle size={24} className="mt-0.5 text-red-500" />
//             <div className="min-w-0">
//               <h2 className="font-semibold text-red-700">
//                 Unable to load orders
//               </h2>
//               <p className="mt-2 break-all text-sm text-red-600">
//                 {error.message}
//               </p>
//               <button
//                 onClick={() => refetch()}
//                 className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ORDERS TABLE */}
//       {!loading && !error && orders.length > 0 && (
//         <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//           {/* TABLE HEADER */}
//           <div className="border-b border-gray-100 px-6 py-5">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
//                 <FiShoppingBag size={22} className="text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   All Orders
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Orders fetched from Strapi
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* TABLE CONTENT */}
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1200px]">
//               <thead>
//                 <tr className="border-b bg-gray-50">
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Order
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Customer
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Address
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Payment
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Order Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr
//                     key={order.documentId}
//                     className="border-b last:border-0 hover:bg-gray-50"
//                   >
//                     {/* ORDER ID */}
//                     <td className="px-6 py-5">
//                       <p className="font-semibold text-blue-600">
//                         {order.orderId || "N/A"}
//                       </p>
//                       <p className="mt-1 text-xs text-gray-400">
//                         {order.documentId}
//                       </p>
//                     </td>

//                     {/* CUSTOMER */}
//                     <td className="px-6 py-5">
//                       <div className="flex items-center gap-2">
//                         <FiMail size={16} className="text-gray-400" />
//                         <span className="text-sm text-gray-700">
//                           {order.email || "N/A"}
//                         </span>
//                       </div>
//                     </td>

//                     {/* ADDRESS */}
//                     <td className="px-6 py-5">
//                       <div className="max-w-[280px]">
//                         <div className="flex items-start gap-2">
//                           <FiMapPin
//                             size={17}
//                             className="mt-0.5 shrink-0 text-gray-400"
//                           />
//                           <div>
//                             <p className="text-sm text-gray-700">
//                               {order.shippingAddress || "N/A"}
//                             </p>
//                             <p className="mt-1 text-xs text-gray-500">
//                               {order.city || "N/A"}, {order.state || "N/A"} -{" "}
//                               {order.pin || "N/A"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* AMOUNT */}
//                     <td className="px-6 py-5">
//                       <p className="font-semibold text-gray-800">
//                         ₹{formatAmount(order.amount)}
//                       </p>
//                     </td>

//                     {/* PAYMENT STATUS */}
//                     <td className="px-6 py-5">
//                       <span
//                         className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
//                           order.paymentStatus
//                         )}`}
//                       >
//                         {order.paymentStatus || "N/A"}
//                       </span>
//                     </td>

//                     {/* ORDER STATUS */}
//                     <td className="px-6 py-5">
//                       <span
//                         className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrdersStatusClass(
//                           order.orderStatus
//                         )}`}
//                       >
//                         {order.orderStatus || "Pending"}
//                       </span>
//                     </td>

//                     {/* DATE */}
//                     <td className="px-6 py-5">
//                       <span className="text-sm text-gray-500">
//                         {formatDate(order.createdAt)}
//                       </span>
//                     </td>

//                     {/* ACTION */}
//                     <td className="px-6 py-5">
//                       <button
//                         onClick={() => handleViewOrder(order)}
//                         className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
//                       >
//                         <FiEye size={16} />
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* NO ORDERS FOUND */}
//       {!loading && !error && orders.length === 0 && (
//         <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
//           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
//             <FiShoppingBag size={30} className="text-gray-400" />
//           </div>
//           <h2 className="mt-5 text-lg font-semibold text-gray-800">
//             No Orders Found
//           </h2>
//           <p className="mt-2 text-sm text-gray-500">
//             When customers place orders, they will appear here.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders

import React from "react";
import {
  FiShoppingBag,
  FiXCircle,
  FiRefreshCw,
  FiMapPin,
} from "react-icons/fi";

import AdminOrdersProvider from "../context/AdminOrder";
import useAdminOrders from "../hook/useAdminOrders";

const AdminOrdersContent = () => {
  const {
    orders,
    loading,
    error,
    fetchOrders,
    totalOrders,
  } = useAdminOrders();

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format amount
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // Payment status styling
  const getPaymentStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      ["paid", "success", "successful"].includes(value)
    ) {
      return "bg-green-100 text-green-700";
    }

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      ["failed", "cancelled", "canceled"].includes(value)
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // Order status styling
  const getOrderStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (["delivered", "completed"].includes(value)) {
      return "bg-green-100 text-green-700";
    }

    if (
      ["pending", "processing", "confirmed"].includes(value)
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (["cancelled", "canceled"].includes(value)) {
      return "bg-red-100 text-red-700";
    }

    if (value === "shipped") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // Get order items
  const getItems = (order) => {
    if (!order?.items) {
      return [];
    }

    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (typeof order.items === "string") {
      try {
        const parsed = JSON.parse(order.items);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Orders Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            List of all orders placed through the website.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Total Orders */}
      {!loading && !error && (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <FiShoppingBag className="text-xl text-blue-600" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="text-xl font-bold text-gray-800">
              {totalOrders}
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-10 text-center">
            <FiXCircle
              size={40}
              className="mx-auto text-red-500"
            />

            <p className="mt-3 font-semibold text-red-500">
              Failed to load orders
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="p-10 text-center">
            <FiShoppingBag
              size={40}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              No Orders Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Orders placed through the website will appear here.
            </p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1600px] text-left">

              <thead>
                <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4">Shipping Address</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">State</th>
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order, index) => {
                  const user = order?.user;

                  const customerName =
                    user?.username ||
                    user?.email ||
                    order?.email ||
                    "Guest";

                  const email =
                    order?.email ||
                    user?.email ||
                    "N/A";

                  const items = getItems(order);

                  return (
                    <tr
                      key={
                        order?.documentId ||
                        order?.id ||
                        order?.orderId ||
                        index
                      }
                      className="transition hover:bg-gray-50"
                    >
                      {/* Index */}
                      <td className="px-6 py-5 text-sm font-semibold text-blue-600">
                        #{index + 1}
                      </td>

                      {/* Order ID */}
                      <td className="px-6 py-5">
                        <span className="font-semibold text-gray-800">
                          {order?.orderId ||
                            order?.documentId ||
                            "N/A"}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5 text-sm font-medium text-gray-800">
                        {customerName}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {email}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5 text-sm font-semibold text-gray-800">
                        {formatAmount(order?.amount)}
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClass(
                            order?.paymentStatus
                          )}`}
                        >
                          {order?.paymentStatus || "N/A"}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusClass(
                            order?.orderStatus
                          )}`}
                        >
                          {order?.orderStatus || "N/A"}
                        </span>
                      </td>

                      {/* Shipping Address */}
                      <td className="max-w-[280px] px-6 py-5 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <FiMapPin className="mt-0.5 shrink-0 text-gray-400" />

                          <span className="line-clamp-2">
                            {order?.shippingAddress || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {order?.city || "N/A"}
                      </td>

                      {/* State */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {order?.state || "N/A"}
                      </td>

                      {/* PIN */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {order?.pin ?? "N/A"}
                      </td>

                      {/* Items */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {items.length > 0
                          ? `${items.length} item${
                              items.length > 1 ? "s" : ""
                            }`
                          : "N/A"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(order?.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Provider wrapper
const AdminOrders = () => {
  return (
    <AdminOrdersProvider>
      <AdminOrdersContent />
    </AdminOrdersProvider>
  );
};

export default AdminOrders;