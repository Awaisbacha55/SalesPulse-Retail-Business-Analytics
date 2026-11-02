"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  MapPin,
  Truck,
  Lightbulb,
  Database,
  ExternalLink,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Revenue Analytics", href: "/revenue", icon: TrendingUp },
  { name: "Customer Analytics", href: "/customers", icon: Users },
  { name: "Product Analytics", href: "/products", icon: Package },
  { name: "Regional Performance", href: "/regions", icon: MapPin },
  { name: "Delivery Analytics", href: "/delivery", icon: Truck },
  { name: "Data Insights", href: "/insights", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
          SP
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            SalesPulse
          </h1>
          <p className="text-[11px] font-medium text-slate-400">Retail Analytics</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Dashboards
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status / Links */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/60 rounded-lg p-3 text-xs border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Neon PostgreSQL</span>
          </div>
          <p className="text-[11px] text-slate-400">1.55M Olist records connected with SSL</p>
        </div>

        <a
          href="https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
}

