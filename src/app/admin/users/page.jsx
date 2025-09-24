"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("users").select("id, name, email, role, created_at");
    setUsers(data || []);
  }

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="p-2 border">{u.id.slice(0, 6)}...</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
