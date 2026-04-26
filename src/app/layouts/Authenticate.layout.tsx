'use client'
import { Loader2 } from "lucide-react";
import Sidebar from "../components/core/Sidebar";
import { useAuth } from "../context/Auth.context";
import { usePathname } from "next/navigation";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isChecked } = useAuth();
  const pathname = usePathname();

  // Never wrap auth-related pages with the sidebar layout
  const isAuthRoute = pathname.startsWith("/auth");
  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!isChecked) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-900 dark:text-white animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-gray-950">
        {children}
      </main>
    </div>
  );
}