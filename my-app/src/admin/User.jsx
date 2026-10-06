import React from "react";
import { FiUsers, FiXCircle, FiRefreshCw } from "react-icons/fi";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_USERS } from "../gqloperation/adminQueries";

const AdminUsers = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });

  const users = data?.usersPermissionsUsers || [];

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Users Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            List of all registered website users from Strapi database.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* User Count */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <FiUsers size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
            </div>
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
              Loading registered users...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-8 text-center">
            <FiXCircle
              size={40}
              className="mx-auto text-red-500"
            />

            <p className="mt-3 font-semibold text-red-500">
              Failed to load users
            </p>

            <p className="mx-auto mt-2 max-w-2xl text-xs text-gray-500">
              {error.message}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No users */}
        {!loading && !error && users.length === 0 && (
          <div className="p-10 text-center">
            <FiUsers
              size={40}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              No Users Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Users registered through the website will appear here.
            </p>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">
                    Index
                  </th>

                  <th className="px-6 py-4">
                    User ID
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Account Status
                  </th>

                  <th className="px-6 py-4">
                    Registration Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                  <tr
                    key={user.documentId || `user-${index}`}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Index */}
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      #{index + 1}
                    </td>

                    {/* User ID */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {user.documentId || "N/A"}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email || "N/A"}
                    </td>

                    {/* Account Status */}
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          user.confirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.confirmed
                          ? "Confirmed"
                          : "Pending"}
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;