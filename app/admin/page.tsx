"use client";

import { useEffect, useState } from "react";
import { User } from "../types";
import { UserManagement } from "../components/admin/UserManagement";
import Layout from "../components/layout/Layout";
import api from "../utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <UserManagement users={users} onRoleUpdate={fetchUsers} />
      </div>
    </Layout>
  );
}
