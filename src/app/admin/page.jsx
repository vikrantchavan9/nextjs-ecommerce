export default function AdminDashboard() {
  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <a href="/admin/orders" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          Manage Orders
        </a>
        <a href="/admin/products" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          Manage Products
        </a>
        <a href="/admin/users" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          Manage Users
        </a>
      </div>
    </div>
  );
}
