"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: 0, stock: 0, description: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  }

  async function saveProduct() {
    if (editId) {
      await supabase.from("products").update(form).eq("id", editId);
    } else {
      await supabase.from("products").insert([form]);
    }
    fetchProducts();
    setModalOpen(false);
    setForm({ name: "", price: 0, stock: 0, description: "" });
    setEditId(null);
  }

  async function deleteProduct(id) {
    if (confirm("Delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  }

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Add Product
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.price}</td>
              <td className="p-2 border">{p.stock}</td>
              <td className="p-2 border">
                <button onClick={() => { setForm(p); setEditId(p.id); setModalOpen(true); }} className="text-blue-500">Edit</button>{" "}
                <button onClick={() => deleteProduct(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-4">{editId ? "Edit Product" : "Add Product"}</h3>
            <input className="border p-2 w-full mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="border p-2 w-full mb-2" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="border p-2 w-full mb-2" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <textarea className="border p-2 w-full mb-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={saveProduct} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
