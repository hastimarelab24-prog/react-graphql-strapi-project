import React from "react";

import {
  FiUsers,
  FiXCircle,
  FiRefreshCw,
  FiCheckCircle,
  FiUserX,
  FiActivity,
  FiMail,
  FiCalendar,
  FiClock,
  FiHash,
} from "react-icons/fi";

import { useQuery } from "@apollo/client/react";

import { GET_ALL_USERS } from "../gqloperation/adminQueries";

const AdminUsers = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });

  const users = data?.usersPermissionsUsers || [];

  // Counts

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isOnline === true
  ).length;

  const loggedOutUsers = users.filter(
    (user) => user.isOnline !== true
  ).length;

  // Date Formatter

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Short Date

  const formatShortDate = (date) => {
    if (!date) {
      return "N/A";
    }

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

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* 
          HEADER
       */}

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Users Management
          </h1>

          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
            Monitor registered users and their login status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FiRefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          <span>Refresh</span>
        </button>
      </div>

      {/* 
          STATISTICS
       */}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Users */}

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-14 sm:w-14">
                <FiUsers size={24} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Total Users
                </p>

                <p className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>

          {/* Active Users */}

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 sm:h-14 sm:w-14">
                <FiActivity size={24} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Active Users
                </p>

                <p className="mt-1 text-xl font-bold text-green-600 sm:text-2xl">
                  {activeUsers}
                </p>
              </div>
            </div>
          </div>

          {/* Logged Out */}

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 sm:h-14 sm:w-14">
                <FiUserX size={24} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Logged Out Users
                </p>

                <p className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl">
                  {loggedOutUsers}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
          MAIN CARD
       */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* 
            LOADING
         */}

        {loading && (
          <div className="px-4 py-12 text-center sm:px-6 sm:py-16">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        )}

        {/* 
            ERROR
         */}

        {error && (
          <div className="px-4 py-10 text-center sm:px-6 sm:py-14">
            <FiXCircle
              size={40}
              className="mx-auto text-red-500"
            />

            <p className="mt-3 font-semibold text-red-500">
              Failed to load users
            </p>

            <p className="mx-auto mt-2 max-w-2xl break-words text-xs leading-5 text-gray-500">
              {error.message}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 
            EMPTY
         */}

        {!loading && !error && users.length === 0 && (
          <div className="px-4 py-12 text-center sm:px-6 sm:py-16">
            <FiUsers
              size={40}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              No Users Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Registered users will appear here.
            </p>
          </div>
        )}

        {/* 
            DESKTOP / TABLET TABLE
            Visible from md and above
         */}

        {!loading && !error && users.length > 0 && (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      #
                    </th>

                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      Username
                    </th>

                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      Email
                    </th>

                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      Login Status
                    </th>

                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      Account Status
                    </th>

                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      Last Login
                    </th>

                    <th className="whitespace-nowrap px-4 py-4 lg:px-6">
                      Registered
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => (
                    <tr
                      key={
                        user.documentId ||
                        user.id ||
                        `user-${index}`
                      }
                      className="transition hover:bg-gray-50"
                    >
                      {/* Index */}

                      <td className="px-4 py-4 lg:px-6">
                        <span className="text-sm font-semibold text-blue-600">
                          #{index + 1}
                        </span>
                      </td>

                      {/* Username */}

                      <td className="px-4 py-4 lg:px-6">
                        <div className="flex min-w-[150px] items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {(user.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {user.username || "N/A"}
                            </p>

                            <p className="truncate text-xs text-gray-400">
                              ID: {user.id || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}

                      <td className="max-w-[220px] px-4 py-4 lg:px-6">
                        <div className="flex items-center gap-2">
                          <FiMail
                            size={14}
                            className="shrink-0 text-gray-400"
                          />

                          <span className="truncate text-sm text-gray-600">
                            {user.email || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Login Status */}

                      <td className="px-4 py-4 lg:px-6">
                        {user.isOnline ? (
                          <span className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            <span className="h-2 w-2 rounded-full bg-gray-400" />
                            Logged Out
                          </span>
                        )}
                      </td>

                      {/* Account Status */}

                      <td className="px-4 py-4 lg:px-6">
                        {user.blocked ? (
                          <span className="inline-flex whitespace-nowrap items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Blocked
                          </span>
                        ) : user.confirmed ? (
                          <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            <FiCheckCircle size={13} />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex whitespace-nowrap items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Last Login */}

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 lg:px-6">
                        {formatDate(user.lastLoginAt)}
                      </td>

                      {/* Registered */}

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 lg:px-6">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 
                MOBILE USER CARDS
                Visible below md
             */}

            <div className="divide-y divide-gray-100 md:hidden">
              {users.map((user, index) => (
                <div
                  key={
                    user.documentId ||
                    user.id ||
                    `user-${index}`
                  }
                  className="p-4 sm:p-5"
                >
                  {/* User Header */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-600">
                        {(user.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                          {user.username || "N/A"}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          User #{index + 1}
                        </p>
                      </div>
                    </div>

                    {/* Login Status */}

                    {user.isOnline ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 sm:text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 sm:text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        Logged Out
                      </span>
                    )}
                  </div>

                  {/* User Details */}

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* ID */}

                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <FiHash
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          User ID
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-gray-700">
                        {user.id || "N/A"}
                      </p>
                    </div>

                    {/* Email */}

                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <FiMail
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          Email
                        </span>
                      </div>

                      <p className="mt-1 break-all text-sm font-medium text-gray-700">
                        {user.email || "N/A"}
                      </p>
                    </div>

                    {/* Account Status */}

                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <FiCheckCircle
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          Account Status
                        </span>
                      </div>

                      <div className="mt-2">
                        {user.blocked ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            Blocked
                          </span>
                        ) : user.confirmed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            <FiCheckCircle size={12} />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Last Login */}

                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <FiClock
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          Last Login
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatDate(user.lastLoginAt)}
                      </p>
                    </div>

                    {/* Registered */}

                    <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <FiCalendar
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          Registered
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 
          MOBILE SUMMARY
       */}

      {!loading && !error && users.length > 0 && (
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-500 sm:text-sm">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {users.length}
          </span>{" "}
          registered user{users.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;