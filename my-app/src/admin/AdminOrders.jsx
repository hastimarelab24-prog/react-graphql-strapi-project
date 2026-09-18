import React from 'react'
import { useQuery } from "@apollo/client/react";
import { GET_ALL_ORDERS } from "../gqloperation/queries";

 const AdminOrders = () => {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS, {
      fetchPolicy: "network-only",
    });
  
    if (loading) {
      return <p>Loading orders...</p>;
    }
  
    if (error) {
      return (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          {error.message}
        </div>
      );
    }
  
    const orders = data?.orders?.data || [];
  
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="mt-2 text-gray-500">
            Manage customer orders
          </p>
        </div>
  
        <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-sm">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Order Status</th>
              </tr>
            </thead>
  
            <tbody>
              {orders.map((order) => {
                const item = order.attributes;
  
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      {item?.orderId || order.id}
                    </td>
  
                    <td className="px-4 py-4">
                      {item?.email || "N/A"}
                    </td>
  
                    <td className="px-4 py-4">
                      ₹{item?.amount || 0}
                    </td>
  
                    <td className="px-4 py-4">
                      {item?.paymentStatus || "N/A"}
                    </td>
  
                    <td className="px-4 py-4">
                      {item?.orderStatus || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
  
          {orders.length === 0 && (
            <p className="mt-4 text-gray-500">No orders available.</p>
          )}
        </div>
      </div>
  )
}
export default AdminOrders