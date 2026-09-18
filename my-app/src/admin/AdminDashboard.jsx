import React, { useMemo } from "react";
import { useQuery } from "@apollo/client/react";

import {
  FiShoppingBag,
  FiDollarSign,
  FiCheckCircle,
  FiClock
} from "react-icons/fi";

import { GET_ALL_ORDERS } from "../gqloperation/adminQueries";

const AdminDashboard = () => {
  const {
    data,
    loading,
    error
  } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only"
  });

  const orders = useMemo(() => {
    return data?.orders || [];
  }, [data]);

  const paidOrders = orders.filter(
    (order) =>
      order.paymentStatus === "paid"
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus === "pending"
  );

  const totalSales = paidOrders.reduce(
    (total, order) => {
      return total + Number(order.amount || 0);
    },
    0
  );

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: <FiShoppingBag />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Paid Orders",
      value: paidOrders.length,
      icon: <FiCheckCircle />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      icon: <FiClock />,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Total Sales",
      value: `₹${totalSales}`,
      icon: <FiDollarSign />,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  if (loading) {
    return (
      <p className="text-lg">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-700">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Website overview and order statistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${stat.color}`}
            >
              {stat.icon}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Recent Orders
        </h2>

        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">
                Order ID
              </th>

              <th className="px-4 py-3">
                Amount
              </th>

              <th className="px-4 py-3">
                Payment
              </th>

              <th className="px-4 py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr
                key={order.documentId}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  {order.orderId || order.documentId}
                </td>

                <td className="px-4 py-4">
                  ₹{order.amount || 0}
                </td>

                <td className="px-4 py-4">
                  {order.paymentStatus || "N/A"}
                </td>

                <td className="px-4 py-4">
                  {order.orderStatus || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="mt-4 text-gray-500">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;