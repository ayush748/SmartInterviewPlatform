"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function DasboardBtn() {
  const pathname = usePathname();

  // Hide button on dashboard page
  if (pathname === "/dashboard") return null;

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition"
    >
      <LayoutDashboard className="h-4 w-4" />
      Dashboard
    </Link>
  );
}
