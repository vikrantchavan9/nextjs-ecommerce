// src/app/admin-dashboard/layout.jsx
import AdminNavbar from "./components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AdminNavbar />   {/* ✅ Only admin navbar */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
