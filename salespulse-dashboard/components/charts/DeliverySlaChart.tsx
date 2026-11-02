"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatNumber } from "@/lib/formatters";

interface DeliverySlaChartProps {
  onTimeOrders: number;
  delayedOrders: number;
  onTimeRating: number;
  delayedRating: number;
  loading?: boolean;
}

export function DeliverySlaChart({
  onTimeOrders,
  delayedOrders,
  onTimeRating,
  delayedRating,
  loading,
}: DeliverySlaChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm h-80 flex items-center justify-center">
        <div className="h-6 w-32 bg-slate-200 animate-pulse rounded" />
      </div>
    );
  }

  const data = [
    {
      status: "On-Time Delivery",
      orders: onTimeOrders,
      avgRating: onTimeRating,
    },
    {
      status: "Delayed Delivery",
      orders: delayedOrders,
      avgRating: delayedRating,
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Logistics SLA vs. Customer Review Rating
          </h3>
          <p className="text-xs text-slate-500">
            Delivery delay triggers a <span className="font-bold text-rose-600">-1.72 star drop (-40%)</span>
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 11, fill: "#475569" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 5]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#f59e0b" }}
              tickFormatter={(v) => `${v} ★`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { status: string; orders: number; avgRating: number };
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold text-slate-200">{d.status}</p>
                    <p className="text-blue-400">
                      Orders: <span className="font-bold text-white">{formatNumber(d.orders)}</span>
                    </p>
                    <p className="text-amber-400">
                      Avg Rating: <span className="font-bold text-white">{d.avgRating.toFixed(2)} / 5.0 ★</span>
                    </p>
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar
              yAxisId="left"
              dataKey="orders"
              name="Delivered Orders"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={34}
            />
            <Bar
              yAxisId="right"
              dataKey="avgRating"
              name="Average Review Score (out of 5 ★)"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              barSize={34}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

