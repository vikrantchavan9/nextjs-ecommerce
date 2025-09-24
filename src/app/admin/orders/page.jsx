"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [status, search]);

  async function fetchOrders() {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

    if (status !== "all") query = query.eq("status", status);
    if (search) query = query.ilike("customer_name", `%${search}%`);

    const { data } = await query;
    setOrders(data || []);
  }

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4 ">Orders</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by customer name..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="p-2 border">{order.id.slice(0, 6)}...</td>
              <td className="p-2 border">{order.customer_name}</td>
              <td className="p-2 border">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="p-2 border">{order.total_amount} {order.currency}</td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">
                <Link href={`/admin-dashboard/orders/${order.id}`} className="text-blue-500">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
