"use client";

import { useEffect, useState } from "react";
import { useFilters } from "@/components/filters/FilterContext";
import { Database, Clock, Menu, AlertCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { lastUpdated, refreshTrigger } = useFilters();
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data?.connected) {
            setDbStatus("connected");
            setLatency(json.data.latencyMs ?? null);
          } else {
            setDbStatus("error");
          }
        }
      } catch {
        if (isMounted) setDbStatus("error");
      }
    }
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm/50">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic Neon / PostgreSQL Status Badge */}
        {dbStatus === "connected" && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3 h-3 text-emerald-600" />
            <span>
              Neon PostgreSQL Connected{latency !== null ? ` (${latency}ms)` : ""}
            </span>
          </div>
        )}

        {dbStatus === "checking" && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
            <Database className="w-3 h-3 text-slate-500" />
            <span>Checking PostgreSQL...</span>
          </div>
        )}

        {dbStatus === "error" && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Database Disconnected</span>
          </div>
        )}

        {/* Last Updated Timestamp */}
        {lastUpdated && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated: {lastUpdated}</span>
          </div>
        )}
      </div>
    </header>
  );
}

