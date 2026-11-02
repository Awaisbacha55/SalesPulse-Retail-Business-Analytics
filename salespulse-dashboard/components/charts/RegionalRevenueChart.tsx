"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { StateRevenueItem } from "@/types/dashboard";
import { formatBRLCompact } from "@/lib/formatters";

interface RegionalRevenueChartProps {
  data: StateRevenueItem[];
  loading?: boolean;
}

export function RegionalRevenueChart({ data, loading }: RegionalRevenueChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex items-center justify-center">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded" />
      </div>
    );
  }

  const topStates = data.slice(0, 10);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">State Revenue Concentration</h3>
          <p className="text-xs text-slate-500">Top Brazilian federative units by merchandise volume</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topStates} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="state"
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
                const d = payload[0].payload as StateRevenueItem;
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold text-slate-200">State: {d.state}</p>
                    <p className="text-blue-400">
                      Revenue:{" "}
                      <span className="font-bold text-white">
                        {formatBRLCompact(d.totalRevenue)}
                      </span>
                    </p>
                    <p className="text-slate-300">
                      Share: <span className="font-bold text-white">{d.revenueSharePct}%</span>
                    </p>
                    <p className="text-slate-300">
                      Orders: <span className="font-bold text-white">{d.totalOrders.toLocaleString()}</span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="totalRevenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

