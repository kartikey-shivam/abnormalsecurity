"use client";

import { useState, useEffect } from "react";
import { User } from "@/app/types";
import { UserManagement } from "../admin/UserManagement";
import api from "@/app/utils/api";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../LoadingSpinner";

export const UserRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        User Role Management
      </h2>
      <UserManagement users={users} onRoleUpdate={fetchUsers} />
    </div>
  );
};
