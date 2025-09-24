"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut(); // if you are using custom cookie/session, clear it here
    document.cookie = "token=; Max-Age=0; path=/;";
    router.push("/login");
  }

  const links = [
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/users", label: "Users" },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold">Admin Dashboard</h1>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:underline ${
              pathname.startsWith(link.href) ? "font-semibold text-yellow-400" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
