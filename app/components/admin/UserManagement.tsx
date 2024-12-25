import { useState } from "react";
import { User, UserRole } from "@/app/types";
import { toast } from "react-hot-toast";
import api from "@/app/utils/api";
import { LoadingSpinner } from "../LoadingSpinner";

interface UserManagementProps {
  users: User[];
  onRoleUpdate: () => void;
}

export const UserManagement = ({
  users,
  onRoleUpdate,
}: UserManagementProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setLoading(userId);
    try {
      await api.patch(`/users/${userId}/update_role/`, {
        role: newRole,
      });
      toast.success("Role updated successfully");
      onRoleUpdate();
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Role update failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Current Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Change Role
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-sm font-medium rounded-full
                    ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : ""
                    }
                    ${
                      user.role === "regular" ? "bg-blue-100 text-blue-800" : ""
                    }
                    ${user.role === "guest" ? "bg-gray-100 text-gray-800" : ""}
                  `}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {loading === user.id ? (
                  <div className="w-full flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as UserRole)
                    }
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="regular">Regular</option>
                    <option value="guest">Guest</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
