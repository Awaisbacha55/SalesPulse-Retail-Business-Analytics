"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { AlertCircle, Inbox } from "lucide-react";

interface CustomerRetentionChartProps {
  repeatCount: number;
  oneTimeCount: number;
  repeatPct: number;
  loading?: boolean;
  error?: string | null;
}

export function CustomerRetentionChart({
  repeatCount,
  oneTimeCount,
  repeatPct,
  loading,
  error,
}: CustomerRetentionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex flex-col items-center justify-center">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded mb-3" />
        <p className="text-xs text-slate-400">Loading customer retention...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm h-80 flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <h4 className="text-sm font-semibold text-slate-800">Unable to load retention</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">{error}</p>
      </div>
    );
  }

  const total = oneTimeCount + repeatCount;

  if (total === 0) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex flex-col items-center justify-center text-center p-6">
        <Inbox className="w-8 h-8 text-slate-300 mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No customer data available</h4>
        <p className="text-xs text-slate-400 mt-1">No customer transactions match current filters.</p>
      </div>
    );
  }

  const data = [
    { name: "One-Time Buyers (1 Order)", value: oneTimeCount, color: "#94a3b8" },
    { name: "Repeat Buyers (>1 Order)", value: repeatCount, color: "#3b82f6" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Customer Retention Dynamics</h3>
          <p className="text-xs text-slate-500">
            Repeat rate: <span className="font-semibold text-blue-600">{formatPercent(repeatPct)}</span>
          </p>
        </div>
      </div>

      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height={250} minWidth={0} minHeight={250}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { name: string; value: number; color: string };
                const pct = total > 0 ? (d.value * 100) / total : 0;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold text-slate-200">{d.name}</p>
                    <p className="text-slate-300">
                      Count: <span className="font-bold text-white">{formatNumber(d.value)}</span>
                    </p>
                    <p className="text-blue-400">
                      Share: <span className="font-bold text-white">{pct.toFixed(2)}%</span>
                    </p>
                  </div>
                );
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

