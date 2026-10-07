
import React from "react";
import {
  FiShoppingBag,
  FiXCircle,
  FiRefreshCw,
  FiMapPin,
  FiMail,
  FiUser,
  FiCreditCard,
  FiPackage,
  FiCalendar,
  FiHash,
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

  // FORMAT DATE
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

  // FORMAT AMOUNT
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // PAYMENT STATUS CLASS
  const getPaymentStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (["paid", "success", "successful"].includes(value)) {
      return "bg-green-100 text-green-700";
    }

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (["failed", "cancelled", "canceled"].includes(value)) {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ORDER STATUS CLASS
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

  // GET ORDER ITEMS
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

  // CUSTOMER NAME
  const getCustomerName = (order) => {
    const user = order?.user;

    return (
      user?.username ||
      user?.email ||
      order?.email ||
      "Guest"
    );
  };

  // CUSTOMER EMAIL
  const getCustomerEmail = (order) => {
    const user = order?.user;

    return (
      order?.email ||
      user?.email ||
      "N/A"
    );
  };

  // ORDER CONTENT
  const renderOrderDetails = (order, index) => {
    const items = getItems(order);

    const customerName = getCustomerName(order);
    const customerEmail = getCustomerEmail(order);

    return (
      <div
        key={
          order?.documentId ||
          order?.id ||
          order?.orderId ||
          index
        }
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
      >
        {/* CARD HEADER */}
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FiShoppingBag className="text-xl text-blue-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order #{index + 1}
              </p>

              <p className="mt-1 break-all text-sm font-bold text-gray-800">
                {order?.orderId ||
                  order?.documentId ||
                  "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                order?.paymentStatus
              )}`}
            >
              Payment: {order?.paymentStatus || "N/A"}
            </span>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClass(
                order?.orderStatus
              )}`}
            >
              {order?.orderStatus || "N/A"}
            </span>
          </div>
        </div>

        {/* CUSTOMER + AMOUNT */}
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* CUSTOMER */}
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <FiUser size={14} />
              Customer
            </div>

            <p className="truncate text-sm font-semibold text-gray-800">
              {customerName}
            </p>
          </div>

          {/* EMAIL */}
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <FiMail size={14} />
              Email
            </div>

            <p className="break-all text-sm text-gray-600">
              {customerEmail}
            </p>
          </div>

          {/* AMOUNT */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <FiCreditCard size={14} />
              Amount
            </div>

            <p className="text-base font-bold text-gray-800">
              {formatAmount(order?.amount)}
            </p>
          </div>

          {/* DATE */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <FiCalendar size={14} />
              Date
            </div>

            <p className="text-sm text-gray-600">
              {formatDate(order?.createdAt)}
            </p>
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FiMapPin className="text-blue-500" />

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Shipping Address
            </p>
          </div>

          <p className="break-words text-sm text-gray-700">
            {order?.shippingAddress || "N/A"}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>
              City:{" "}
              <span className="font-medium text-gray-700">
                {order?.city || "N/A"}
              </span>
            </span>

            <span>
              State:{" "}
              <span className="font-medium text-gray-700">
                {order?.state || "N/A"}
              </span>
            </span>

            <span>
              PIN:{" "}
              <span className="font-medium text-gray-700">
                {order?.pin ?? "N/A"}
              </span>
            </span>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiPackage className="text-blue-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order Items
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              {items.length}{" "}
              {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-gray-800">
                      {item?.name || "Product"}
                    </p>

                    {item?.documentId && (
                      <p className="mt-0.5 break-all text-xs text-gray-400">
                        ID: {item.documentId}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-4 text-xs text-gray-500">
                    <span>
                      Qty:{" "}
                      <span className="font-semibold text-gray-700">
                        {item?.qty || item?.quantity || 1}
                      </span>
                    </span>

                    {item?.price !== undefined &&
                      item?.price !== null && (
                        <span className="font-semibold text-gray-700">
                          ₹
                          {Number(item.price).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
              No item details available
            </div>
          )}
        </div>

        {/* PAYMENT ID */}
        {order?.paymentId && (
          <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <FiHash size={14} />
              Payment ID
            </span>

            <span className="break-all text-xs text-gray-500 sm:text-right">
              {order.paymentId}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/*           PAGE HEADER
       */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Orders Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            List of all orders placed through the website.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FiRefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/*           TOTAL ORDERS
       */}

      {!loading && !error && (
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:w-fit sm:min-w-[220px] sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FiShoppingBag className="text-xl text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Total Orders
              </p>

              <p className="mt-0.5 text-xl font-bold text-gray-800">
                {totalOrders}
              </p>
            </div>
          </div>
        </div>
      )}

      {/*           MAIN CONTAINER
       */}

      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/*             LOADING
         */}

        {loading && (
          <div className="p-8 text-center sm:p-12">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading orders...
            </p>
          </div>
        )}

        {/*             ERROR
         */}

        {!loading && error && (
          <div className="p-6 text-center sm:p-10">
            <FiXCircle
              size={42}
              className="mx-auto text-red-500"
            />

            <p className="mt-4 font-semibold text-red-500">
              Failed to load orders
            </p>

            <p className="mx-auto mt-2 max-w-xl break-words text-xs text-gray-400">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <FiRefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/*             NO ORDERS
         */}

        {!loading && !error && orders.length === 0 && (
          <div className="p-8 text-center sm:p-12 lg:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FiShoppingBag
                size={30}
                className="text-gray-300"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-800">
              No Orders Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Orders placed through the website will appear
              here.
            </p>
          </div>
        )}

        {/*             DESKTOP / TABLET TABLE
         */}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1250px] text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="whitespace-nowrap px-5 py-4">
                      #
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Order ID
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Customer
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Amount
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Payment
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Address
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Items
                    </th>

                    <th className="whitespace-nowrap px-5 py-4">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, index) => {
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
                        {/* NUMBER */}
                        <td className="px-5 py-5 text-sm font-semibold text-blue-600">
                          #{index + 1}
                        </td>

                        {/* ORDER ID */}
                        <td className="max-w-[180px] px-5 py-5">
                          <p className="break-all text-sm font-semibold text-gray-800">
                            {order?.orderId ||
                              order?.documentId ||
                              "N/A"}
                          </p>
                        </td>

                        {/* CUSTOMER */}
                        <td className="max-w-[220px] px-5 py-5">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {getCustomerName(order)}
                          </p>

                          <p className="mt-1 break-all text-xs text-gray-500">
                            {getCustomerEmail(order)}
                          </p>
                        </td>

                        {/* AMOUNT */}
                        <td className="whitespace-nowrap px-5 py-5 text-sm font-bold text-gray-800">
                          {formatAmount(order?.amount)}
                        </td>

                        {/* PAYMENT */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClass(
                              order?.paymentStatus
                            )}`}
                          >
                            {order?.paymentStatus || "N/A"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getOrderStatusClass(
                              order?.orderStatus
                            )}`}
                          >
                            {order?.orderStatus || "N/A"}
                          </span>
                        </td>

                        {/* ADDRESS */}
                        <td className="max-w-[260px] px-5 py-5">
                          <div className="flex items-start gap-2">
                            <FiMapPin
                              size={15}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />

                            <div>
                              <p className="line-clamp-2 break-words text-sm text-gray-600">
                                {order?.shippingAddress ||
                                  "N/A"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {order?.city || "N/A"},{" "}
                                {order?.state || "N/A"} -{" "}
                                {order?.pin ?? "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ITEMS */}
                        <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                          {items.length > 0
                            ? `${items.length} ${
                                items.length === 1
                                  ? "item"
                                  : "items"
                              }`
                            : "N/A"}
                        </td>

                        {/* DATE */}
                        <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-500">
                          {formatDate(order?.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/*                 MOBILE + TABLET CARDS
             */}

            <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-2 xl:hidden">
              {orders.map((order, index) =>
                renderOrderDetails(order, index)
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ====
// PROVIDER WRAPPER
// ====

const AdminOrders = () => {
  return (
    <AdminOrdersProvider>
      <AdminOrdersContent />
    </AdminOrdersProvider>
  );
};

export default AdminOrders;

