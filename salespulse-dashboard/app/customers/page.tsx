"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CustomerRetentionChart } from "@/components/charts/CustomerRetentionChart";
import { CustomerMetrics } from "@/types/dashboard";
import { formatBRL, formatNumber, formatPercent } from "@/lib/formatters";
import { Users, UserCheck, Repeat, Clock, ShieldCheck } from "lucide-react";

export default function CustomersPage() {
  const [data, setData] = useState<CustomerMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch("/api/customers");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load customer analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <DashboardShell
      title="Customer Analytics & Retention"
      subtitle="Buyer lifecycle metrics, repeat purchase patterns, and lifetime value tiers"
      showFilters={false}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Unique Buyers</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? formatNumber(data.totalCustomers) : "96,096"}
            </h3>
            <p className="text-[11px] text-slate-400">Persistent customer IDs</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Repeat Customers</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? formatNumber(data.repeatCustomers) : "2,997"}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">
              {data ? formatPercent(data.repeatCustomerPct) : "3.12%"} retention rate
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">One-Time Buyers</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? formatNumber(data.oneTimeCustomers) : "93,099"}
            </h3>
            <p className="text-[11px] text-slate-400">96.88% of customer base</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Avg Repurchase Gap</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? `${data.avgRepurchaseDays} days` : "86.4 days"}
            </h3>
            <p className="text-[11px] text-slate-400">Between consecutive orders</p>
          </div>
        </div>
      </div>

      {/* Retention Donut & Customer Spending Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerRetentionChart
          repeatCount={data?.repeatCustomers || 2997}
          oneTimeCount={data?.oneTimeCustomers || 93099}
          repeatPct={data?.repeatCustomerPct || 3.12}
          loading={loading}
        />

        {/* Customer Tiers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Customer Lifetime Spend Segments
              </h3>
              <p className="text-xs text-slate-500">
                Categorized by historical purchase volume in PostgreSQL
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-3">
            {data?.segments.map((seg) => (
              <div
                key={seg.segment}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{seg.segment}</h4>
                  <p className="text-[11px] text-slate-500">
                    {formatNumber(seg.customerCount)} customers ({((seg.customerCount * 100) / (data?.totalCustomers || 1)).toFixed(1)}%)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{formatBRL(seg.segmentRevenue)}</p>
                  <p className="text-[11px] text-blue-600 font-medium">
                    Avg Spend: R$ {seg.avgSpend.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Top 10 Customers by Lifetime Revenue
            </h3>
            <p className="text-xs text-slate-500">
              Ranked using customer_unique_id aggregations across orders
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            VIP Champions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Customer Unique ID</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Revenue</th>
                <th className="py-3 px-4">First Purchase</th>
                <th className="py-3 px-4">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.topCustomers.map((c, idx) => (
                <tr key={c.customerUniqueId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                    {c.customerUniqueId}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">{c.totalOrders}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatBRL(c.lifetimeRevenue)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(c.firstPurchase).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(c.lastPurchase).toLocaleDateString()}
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

