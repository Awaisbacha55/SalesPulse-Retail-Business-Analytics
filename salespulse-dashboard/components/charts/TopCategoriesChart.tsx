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
import { CategoryRevenueItem } from "@/types/dashboard";
import { formatBRLCompact } from "@/lib/formatters";

interface TopCategoriesChartProps {
  data: CategoryRevenueItem[];
  loading?: boolean;
}

export function TopCategoriesChart({ data, loading }: TopCategoriesChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex items-center justify-center">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded" />
      </div>
    );
  }

  const formattedData = data.slice(0, 8).map((d) => ({
    ...d,
    displayName: d.category.replace(/_/g, " "),
  }));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Top Product Categories</h3>
          <p className="text-xs text-slate-500">Revenue generation by merchandise catalog sector</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v) => formatBRLCompact(v)}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 10, fill: "#475569" }}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as CategoryRevenueItem & { displayName: string };
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold capitalize text-slate-200">{d.displayName}</p>
                    <p className="text-blue-400">
                      Revenue:{" "}
                      <span className="font-bold text-white">
                        {formatBRLCompact(d.totalRevenue)}
                      </span>
                    </p>
                    <p className="text-slate-300">
                      Units Sold: <span className="font-bold text-white">{d.unitsSold.toLocaleString()}</span>
                    </p>
                    <p className="text-slate-300">
                      Avg Price: <span className="font-bold text-white">R$ {d.averagePrice.toFixed(2)}</span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="totalRevenue" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

