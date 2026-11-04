"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useFilters } from "@/components/filters/FilterContext";
import { TopCategoriesChart } from "@/components/charts/TopCategoriesChart";
import { ParetoProductCard } from "@/components/charts/ParetoProductCard";
import { CategoryRevenueItem, ProductItem } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/formatters";
import { Package, Award, Tag } from "lucide-react";

export default function ProductsPage() {
  const { filters, refreshTrigger } = useFilters();
  const [topCategories, setTopCategories] = useState<CategoryRevenueItem[]>([]);
  const [topProducts, setTopProducts] = useState<ProductItem[]>([]);
  const [pareto, setPareto] = useState<{
    cutoffProductRank: number;
    totalProducts: number;
    productPercentile: number;
    cumulativeRevenueSharePct: number;
  }>({
    cutoffProductRank: 8536,
    totalProducts: 32951,
    productPercentile: 25.91,
    cumulativeRevenueSharePct: 80.0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    async function fetchProducts() {
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
        const res = await fetch(`/api/products${qs}`);
        const json = await res.json();
        if (!isCurrent) return;
        if (json.success && json.data) {
          setTopCategories(json.data.topCategories || []);
          setTopProducts(json.data.topProducts || []);
          if (json.data.pareto) setPareto(json.data.pareto);
        } else {
          setError(json.error || "Failed to load product analytics from database.");
        }
      } catch (err: any) {
        if (isCurrent) {
          console.error("Failed to load product analytics:", err);
          setError(err?.message || "Failed to connect to product API.");
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      isCurrent = false;
    };
  }, [filters, refreshTrigger]);

  return (
    <DashboardShell
      title="Product & Category Analytics"
      subtitle="Merchandise catalog performance, category revenue shares, and Pareto 80/20 concentration"
    >
      {/* Pareto 80/20 Bonus Scorecard */}
      <ParetoProductCard
        cutoffRank={pareto.cutoffProductRank}
        totalProducts={pareto.totalProducts}
        percentile={pareto.productPercentile}
        revenueShare={pareto.cumulativeRevenueSharePct}
        loading={loading}
      />

      {/* Top Categories Chart */}
      <div className="grid grid-cols-1 gap-6 min-w-0">
        <div className="min-w-0">
          <TopCategoriesChart data={topCategories} loading={loading} error={error} />
        </div>
      </div>

      {/* Top 10 Best-Selling Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Top 10 Products by Sales Revenue
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by gross merchandise sales in PostgreSQL
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Top Performers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Avg Selling Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((p, idx) => (
                <tr key={p.productId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 max-w-[180px] truncate">
                    {p.productId}
                  </td>
                  <td className="py-3 px-4 capitalize font-medium text-slate-800">
                    {p.category.replace(/_/g, " ")}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{formatNumber(p.unitsSold)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatBRL(p.totalRevenue)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">R$ {p.averagePrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

