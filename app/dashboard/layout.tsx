"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Layers,
  Store,
  LogOut,
  ChevronLeft,
  Menu,
  Package,
  Tags,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Layers, label: "Categories", href: "/dashboard/categories" },
    { icon: ShoppingBag, label: "Products", href: "/dashboard/products" },
    { icon: Tags, label: "Variants", href: "/dashboard/variants" },
    { icon: Package, label: "Inventory", href: "/dashboard/inventory" },
    { icon: Store, label: "Vendors", href: "/dashboard/vendors" },
    { icon: Users, label: "Customers", href: "/dashboard/customers" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Theme Toggle */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!isCollapsed && (
              <span className="text-xl font-bold">VendorHub</span>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="rounded-lg p-1.5 hover:bg-accent hidden lg:block"
              >
                {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1.5 hover:bg-accent lg:hidden"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-2 py-2 text-foreground hover:bg-accent",
                  !isCollapsed && "space-x-3"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <button
              className={cn(
                "flex w-full items-center rounded-lg px-2 py-2 text-foreground hover:bg-accent",
                !isCollapsed && "space-x-3"
              )}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card border-b flex items-center justify-between px-4 lg:hidden z-30">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg p-1.5 hover:bg-accent"
        >
          <Menu size={20} />
        </button>
        <span className="text-xl font-bold">VendorHub</span>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-16 lg:pt-0",
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}