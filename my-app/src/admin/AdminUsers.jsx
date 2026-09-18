import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_USERS } from "../gqloperation/adminQueries";

const AdminUsers = () => {
  const { data, loading, error } = useQuery(GET_ADMIN_USERS, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-red-700">
        {error.message}
      </div>
    );
  }

  const users = data?.usersPermissionsUsers?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <p className="mt-2 text-gray-500">
          Registered customer details
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Confirmed</th>
              <th className="px-4 py-3">Blocked</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const item = user.attributes;

              return (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4">
                    {item?.username || "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    {item?.email || "N/A"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        item?.confirmed
                          ? "rounded-full bg-green-100 px-3 py-1 text-green-700"
                          : "rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"
                      }
                    >
                      {item?.confirmed ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {item?.blocked ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-4">
                    {item?.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;