"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MonthlyRevenuePoint } from "@/types/dashboard";
import { formatBRLCompact, formatMonthLabel } from "@/lib/formatters";
import { AlertCircle, Inbox } from "lucide-react";

interface RevenueTrendChartProps {
  data: MonthlyRevenuePoint[];
  loading?: boolean;
  error?: string | null;
}

export function RevenueTrendChart({ data, loading, error }: RevenueTrendChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex flex-col items-center justify-center">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded mb-3" />
        <p className="text-xs text-slate-400">Loading revenue trajectory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm h-80 flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <h4 className="text-sm font-semibold text-slate-800">Unable to load revenue trend</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex flex-col items-center justify-center text-center p-6">
        <Inbox className="w-8 h-8 text-slate-300 mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No data available for this chart</h4>
        <p className="text-xs text-slate-400 mt-1">Try adjusting the filter criteria or date range.</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    formattedMonth: formatMonthLabel(d.salesMonth),
  }));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Monthly Revenue Trajectory</h3>
          <p className="text-xs text-slate-500">Gross sales velocity across complete calendar months (through August 2018)</p>
        </div>
      </div>

      <div className="h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="formattedMonth"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v) => formatBRLCompact(v)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as MonthlyRevenuePoint & { formattedMonth: string };
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold text-slate-200">{d.formattedMonth}</p>
                    <p className="text-blue-400">
                      Revenue:{" "}
                      <span className="font-bold text-white">
                        {formatBRLCompact(d.monthlyRevenue)}
                      </span>
                    </p>
                    <p className="text-slate-300">
                      Orders: <span className="font-bold text-white">{d.totalOrders.toLocaleString()}</span>
                    </p>
                    <p className="text-slate-300">
                      AOV: <span className="font-bold text-white">R$ {d.averageOrderValue.toFixed(2)}</span>
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="monthlyRevenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

