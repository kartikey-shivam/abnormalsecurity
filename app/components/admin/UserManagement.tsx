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
      await api.post("/auth/change-role", {
        user_id: userId,
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
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {user.role}
                </span>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                {loading === user.id ? (
                  <LoadingSpinner />
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as UserRole)
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="regular">Regular</option>
                    <option value="guest">Guest</option>
                  </select>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
