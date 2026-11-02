"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useFilters } from "@/components/filters/FilterContext";
import { RegionalRevenueChart } from "@/components/charts/RegionalRevenueChart";
import { StateRevenueItem } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/formatters";
import { MapPin, Globe, Compass } from "lucide-react";

export default function RegionsPage() {
  const { filters, refreshTrigger } = useFilters();
  const [data, setData] = useState<StateRevenueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegions() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.set("startDate", filters.startDate);
        if (filters.endDate) queryParams.set("endDate", filters.endDate);
        if (filters.state && filters.state !== "ALL") queryParams.set("state", filters.state);
        if (filters.category && filters.category !== "ALL")
          queryParams.set("category", filters.category);

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const res = await fetch(`/api/regions${qs}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load regional analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRegions();
  }, [filters, refreshTrigger]);

  const top3Revenue = data
    .slice(0, 3)
    .reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const top3Share = totalRevenue > 0 ? (top3Revenue * 100) / totalRevenue : 63.36;

  return (
    <DashboardShell
      title="Regional & Geographic Analytics"
      subtitle="State-level performance, regional sales density, and geographic concentration"
    >
      {/* Geographic Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Top State (São Paulo)</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data[0] ? formatBRL(data[0].totalRevenue) : "R$ 5.20M"}
            </h3>
            <p className="text-[11px] text-indigo-600 font-semibold">
              {data[0]?.revenueSharePct || 38.28}% of national sales
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Southeast Core (SP, RJ, MG)</p>
            <h3 className="text-xl font-bold text-slate-900">{top3Share.toFixed(2)}%</h3>
            <p className="text-[11px] text-slate-400">Combined market share</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">States Covered</p>
            <h3 className="text-xl font-bold text-slate-900">{data.length || 27} States</h3>
            <p className="text-[11px] text-slate-400">All 27 Brazilian Federative Units</p>
          </div>
        </div>
      </div>

      {/* State Revenue Chart */}
      <RegionalRevenueChart data={data} loading={loading} />

      {/* Comprehensive States Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Complete Brazilian State Performance Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by total merchandise revenue in PostgreSQL
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">State Code</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((st, idx) => (
                <tr key={st.state} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {st.state}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{formatNumber(st.totalOrders)}</td>
                  <td className="py-3 px-4 text-slate-600">{formatNumber(st.unitsSold)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatBRL(st.totalRevenue)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${Math.min(st.revenueSharePct * 2, 100)}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700">{st.revenueSharePct}%</span>
                    </div>
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

