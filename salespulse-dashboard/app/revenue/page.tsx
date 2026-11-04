"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useFilters } from "@/components/filters/FilterContext";
import { MonthlyRevenuePoint } from "@/types/dashboard";
import { formatBRL, formatBRLCompact, formatMonthLabel } from "@/lib/formatters";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, AlertCircle, Inbox } from "lucide-react";

export default function RevenuePage() {
  const { filters, refreshTrigger, triggerRefresh } = useFilters();
  const [data, setData] = useState<MonthlyRevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    async function fetchRevenue() {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.set("startDate", filters.startDate);
        if (filters.endDate) queryParams.set("endDate", filters.endDate);
        if (filters.state && filters.state !== "ALL") queryParams.set("state", filters.state);
        if (filters.category && filters.category !== "ALL")
          queryParams.set("category", filters.category);

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const res = await fetch(`/api/revenue${qs}`);
        const json = await res.json();
        if (!isCurrent) return;
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to load revenue data from database.");
        }
      } catch (err: any) {
        if (isCurrent) {
          console.error("Failed to load revenue data:", err);
          setError(err?.message || "Failed to connect to revenue API.");
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    fetchRevenue();
    return () => {
      isCurrent = false;
    };
  }, [filters, refreshTrigger]);

  const totalPeriodRevenue = data.reduce((acc, curr) => acc + curr.monthlyRevenue, 0);
  const totalPeriodOrders = data.reduce((acc, curr) => acc + curr.totalOrders, 0);
  const avgAov = totalPeriodOrders > 0 ? totalPeriodRevenue / totalPeriodOrders : 0;

  const chartData = data.map((d) => ({
    ...d,
    formattedMonth: formatMonthLabel(d.salesMonth),
  }));

  return (
    <DashboardShell
      title="Revenue Analytics"
      subtitle="Financial performance, monthly sales growth trajectory, and basket sizes (complete calendar months through August 2018)"
    >
      {/* Database Error Alert Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Revenue Query Warning</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => triggerRefresh()}
            className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Period Merchandise GMV</p>
            <h3 className="text-xl font-bold text-slate-900">{formatBRL(totalPeriodRevenue)}</h3>
            <p className="text-[11px] text-slate-400">Pure product sales (excl. freight)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Period Item Orders</p>
            <h3 className="text-xl font-bold text-slate-900">{totalPeriodOrders.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400">Orders with merchandise items</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Merchandise Basket AOV</p>
            <h3 className="text-xl font-bold text-slate-900">R$ {avgAov.toFixed(2)}</h3>
            <p className="text-[11px] text-slate-400">Merchandise GMV / Item Orders</p>
          </div>
        </div>
      </div>

      {/* Row 1: Month-over-Month Growth % (Bar Chart with green/red) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Month-over-Month Revenue Growth Percentage
            </h3>
            <p className="text-xs text-slate-500">
              Calculated using PostgreSQL window function <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">LAG(revenue) OVER (ORDER BY sales_month)</code>
            </p>
          </div>
        </div>

        {!isMounted || loading ? (
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <div className="h-6 w-32 bg-slate-200 animate-pulse rounded mb-2" />
            <p className="text-xs text-slate-400">Loading growth rates...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-72 w-full flex flex-col items-center justify-center text-center">
            <Inbox className="w-8 h-8 text-slate-300 mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No data available for this chart</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting the filter criteria.</p>
          </div>
        ) : (
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as MonthlyRevenuePoint & { formattedMonth: string };
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-200">{d.formattedMonth}</p>
                        <p className="text-slate-300">
                          Monthly Revenue:{" "}
                          <span className="font-bold text-white">{formatBRL(d.monthlyRevenue)}</span>
                        </p>
                        <p
                          className={
                            (d.momGrowthPct || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                          }
                        >
                          MoM Growth:{" "}
                          <span className="font-bold">
                            {d.momGrowthPct !== null ? `${d.momGrowthPct}%` : "Baseline (0%)"}
                          </span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="momGrowthPct" radius={[4, 4, 0, 0]} barSize={22}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={(entry.momGrowthPct || 0) >= 0 ? "#10b981" : "#f43f5e"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Row 2: Average Order Value Trend (Line Chart) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Average Order Value (AOV) Trend</h3>
            <p className="text-xs text-slate-500">Average ticket size per order across months</p>
          </div>
        </div>

        {!isMounted || loading ? (
          <div className="h-64 w-full flex flex-col items-center justify-center">
            <div className="h-6 w-32 bg-slate-200 animate-pulse rounded mb-2" />
            <p className="text-xs text-slate-400">Loading AOV trajectory...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 w-full flex flex-col items-center justify-center text-center">
            <Inbox className="w-8 h-8 text-slate-300 mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No data available for this chart</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting the filter criteria.</p>
          </div>
        ) : (
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height={250} minWidth={0} minHeight={250}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="formattedMonth"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `R$ ${v.toFixed(0)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as MonthlyRevenuePoint & { formattedMonth: string };
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-200">{d.formattedMonth}</p>
                        <p className="text-purple-400">
                          AOV: <span className="font-bold text-white">R$ {d.averageOrderValue.toFixed(2)}</span>
                        </p>
                        <p className="text-slate-300">
                          Orders: <span className="font-bold text-white">{d.totalOrders.toLocaleString()}</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="averageOrderValue"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Row 3: Tabular Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Monthly Revenue Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sales Month</th>
                <th className="py-3 px-4">Revenue (BRL)</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">AOV</th>
                <th className="py-3 px-4">MoM Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.salesMonth} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {formatMonthLabel(row.salesMonth)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatBRL(row.monthlyRevenue)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.totalOrders.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-600">R$ {row.averageOrderValue.toFixed(2)}</td>
                  <td className="py-3 px-4 font-medium">
                    {typeof row.momGrowthPct === "number" ? (
                      <span
                        className={
                          row.momGrowthPct >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"
                        }
                      >
                        {row.momGrowthPct >= 0 ? `+${row.momGrowthPct}%` : `${row.momGrowthPct}%`}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
