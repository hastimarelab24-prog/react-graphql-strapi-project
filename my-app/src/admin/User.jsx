import React from "react";
import { FiUsers, FiXCircle } from "react-icons/fi";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_USERS } from "../gqloperation/adminQueries";

const AdminUsers = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });

  const users = data?.usersPermissionsUsers || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          List of all registered website users from Strapi database.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {loading && (
          <div className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-3 text-sm text-gray-500">Loading registered users...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <FiXCircle size={32} className="mx-auto text-red-500" />
            <p className="mt-2 font-semibold text-red-500">Failed to load users</p>
            <p className="text-xs text-gray-400 mt-1">{error.message}</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="p-10 text-center">
            <FiUsers size={40} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-lg font-semibold text-gray-800">No Users Found</h2>
            <p className="mt-1 text-sm text-gray-500">
              Users registered through the website will appear here.
            </p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Index</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                  <tr key={user.documentId || index} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.confirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.confirmed ? "Confirmed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
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