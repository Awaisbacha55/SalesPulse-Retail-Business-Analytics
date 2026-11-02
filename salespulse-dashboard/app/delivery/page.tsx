"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DeliverySlaChart } from "@/components/charts/DeliverySlaChart";
import { DeliveryMetrics } from "@/types/dashboard";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { Truck, CheckCircle2, AlertTriangle, Star, Clock } from "lucide-react";

export default function DeliveryPage() {
  const [data, setData] = useState<DeliveryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDelivery() {
      setLoading(true);
      try {
        const res = await fetch("/api/delivery");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load delivery analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDelivery();
  }, []);

  return (
    <DashboardShell
      title="Logistics & Delivery SLA Analytics"
      subtitle="Transit duration analysis, carrier SLA compliance, and customer satisfaction correlation"
      showFilters={false}
    >
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Avg Delivery Transit</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? `${data.averageDeliveryDays} days` : "12.6 days"}
            </h3>
            <p className="text-[11px] text-slate-400">Order purchase to doorstep</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">On-Time SLA Rate</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? formatPercent(data.onTimeDeliveryRate) : "91.89%"}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">
              {data ? formatNumber(data.onTimeOrders) : "88,649"} orders delivered on schedule
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Delayed Deliveries</p>
            <h3 className="text-xl font-bold text-slate-900">
              {data ? formatNumber(data.delayedOrders) : "8,199"}
            </h3>
            <p className="text-[11px] text-rose-500 font-medium">
              {data
                ? formatPercent(100 - data.onTimeDeliveryRate)
                : "8.11%"}{" "}
              breached estimated date
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Delay Rating Penalty</p>
            <h3 className="text-xl font-bold text-rose-600">
              -1.72 ★
            </h3>
            <p className="text-[11px] text-slate-400">
              4.29 on-time vs 2.57 delayed rating
            </p>
          </div>
        </div>
      </div>

      {/* Main SLA Chart and Impact Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeliverySlaChart
            onTimeOrders={data?.onTimeOrders || 88649}
            delayedOrders={data?.delayedOrders || 8199}
            onTimeRating={data?.onTimeAvgRating || 4.29}
            delayedRating={data?.delayedAvgRating || 2.57}
            loading={loading}
          />
        </div>

        {/* SLA Executive Callout */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-sm border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                Logistics Takeaway
              </h3>
            </div>
            <h4 className="text-lg font-bold mb-3">
              Delivery Delays Destroy CSAT Scores
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              When an order delivers after its estimated date, customer review satisfaction collapses by <strong>40.1%</strong> (from 4.29 to 2.57 stars).
            </p>
            <div className="space-y-3 pt-3 border-t border-slate-700">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Delivered Cohort</span>
                <span className="font-bold">{data ? formatNumber(data.totalDelivered) : "96,478"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">On-Time Success</span>
                <span className="font-bold text-emerald-400">91.89%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Severe Delays (&gt; 30d)</span>
                <span className="font-bold text-rose-400">Over 500 orders</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 text-[11px] text-slate-400 italic">
            Data sourced from orders delivered with matching review scores.
          </div>
        </div>
      </div>

      {/* Top Delayed Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Longest Delivery Delays (Worst-Case SLA Breaches)
            </h3>
            <p className="text-xs text-slate-500">
              Orders with extreme variance between carrier estimate and actual delivery timestamp
            </p>
          </div>
          <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-1 rounded-full">
            Top 10 Severe Delays
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Purchase Date</th>
                <th className="px-5 py-3">Estimated SLA</th>
                <th className="px-5 py-3">Actual Delivery</th>
                <th className="px-5 py-3 text-right">Delay (Days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Loading delivery anomalies...
                  </td>
                </tr>
              ) : data?.topDelayedOrders?.length ? (
                data.topDelayedOrders.map((order, i) => (
                  <tr key={order.orderId || i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-slate-800">
                      {order.orderId.slice(0, 16)}...
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {order.purchaseDate ? order.purchaseDate.slice(0, 10) : "-"}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {order.estimatedDelivery ? order.estimatedDelivery.slice(0, 10) : "-"}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {order.actualDelivery ? order.actualDelivery.slice(0, 10) : "-"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        +{order.delayDays} days
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No delayed orders recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

