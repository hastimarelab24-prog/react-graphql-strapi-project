import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_ORDERS } from "../gqloperation/adminQueries";

const AdminDashboard = () => {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const orders = data?.orders || [];

  const totalOrders = orders.length;

  const totalSales = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((total, order) => total + Number(order.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Orders */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>

        {/* Total Sales */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-gray-500">Total Sales</h2>
          <p className="text-3xl font-bold">
            ₹{totalSales}
          </p>
        </div>

        {/* Paid Orders */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-gray-500">Paid Orders</h2>
          <p className="text-3xl font-bold">
            {orders.filter(
              (order) => order.paymentStatus === "paid"
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;