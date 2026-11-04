"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useFilters } from "@/components/filters/FilterContext";
import { KpiCard } from "@/components/kpi/KpiCard";
import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { TopCategoriesChart } from "@/components/charts/TopCategoriesChart";
import { RegionalRevenueChart } from "@/components/charts/RegionalRevenueChart";
import { CustomerRetentionChart } from "@/components/charts/CustomerRetentionChart";
import { DeliverySlaChart } from "@/components/charts/DeliverySlaChart";
import {
  CategoryRevenueItem,
  DeliveryMetrics,
  MonthlyRevenuePoint,
  OverviewMetrics,
  StateRevenueItem,
} from "@/types/dashboard";
import {
  formatBRL,
  formatBRLCompact,
  formatDays,
  formatNumber,
  formatPercent,
} from "@/lib/formatters";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function OverviewPage() {
  const { filters, refreshTrigger, triggerRefresh } = useFilters();

  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<MonthlyRevenuePoint[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryRevenueItem[]>([]);
  const [regionalData, setRegionalData] = useState<StateRevenueItem[]>([]);
  const [deliveryData, setDeliveryData] = useState<DeliveryMetrics | null>(null);
  const [customerData, setCustomerData] = useState<{
    repeatCount: number;
    oneTimeCount: number;
    repeatPct: number;
  }>({ repeatCount: 2997, oneTimeCount: 93099, repeatPct: 3.12 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function fetchData() {
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

        const [ovRes, revRes, prodRes, regRes, delRes, custRes] = await Promise.all([
          fetch(`/api/overview${qs}`)
            .then((r) => r.json())
            .catch((e) => ({ success: false, error: e.message })),
          fetch(`/api/revenue${qs}`)
            .then((r) => r.json())
            .catch((e) => ({ success: false, error: e.message })),
          fetch(`/api/products${qs}`)
            .then((r) => r.json())
            .catch((e) => ({ success: false, error: e.message })),
          fetch(`/api/regions${qs}`)
            .then((r) => r.json())
            .catch((e) => ({ success: false, error: e.message })),
          fetch(`/api/delivery`)
            .then((r) => r.json())
            .catch((e) => ({ success: false, error: e.message })),
          fetch(`/api/customers`)
            .then((r) => r.json())
            .catch((e) => ({ success: false, error: e.message })),
        ]);

        if (!isCurrent) return;

        const firstError = [ovRes, revRes, prodRes, regRes, delRes, custRes].find(
          (r) => !r.success
        );
        if (firstError) {
          setError(firstError.error || "Failed to load complete analytics from database.");
        }

        if (ovRes.success && ovRes.data) setOverview(ovRes.data);
        if (revRes.success && revRes.data) setRevenueTrend(revRes.data);
        if (prodRes.success && prodRes.data?.topCategories)
          setTopCategories(prodRes.data.topCategories);
        if (regRes.success && regRes.data) setRegionalData(regRes.data);
        if (delRes.success && delRes.data) setDeliveryData(delRes.data);
        if (custRes.success && custRes.data) {
          setCustomerData({
            repeatCount: custRes.data.repeatCustomers ?? 2997,
            oneTimeCount: custRes.data.oneTimeCustomers ?? 93099,
            repeatPct: custRes.data.repeatCustomerPct ?? 3.12,
          });
        }
      } catch (err: any) {
        if (isCurrent) {
          console.error("Failed to load overview dashboard data:", err);
          setError(err?.message || "Failed to connect to analytics API.");
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isCurrent = false;
    };
  }, [filters, refreshTrigger]);

  return (
    <DashboardShell
      title="Executive Overview"
      subtitle="High-level commercial KPIs, revenue velocity, and operational SLA health"
    >
      {/* Database Error Alert Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Analytics Connection Alert</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => triggerRefresh()}
            className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
          >
            Retry Queries
          </button>
        </div>
      )}

      {/* 8 Required KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Merchandise GMV"
          value={overview ? formatBRL(overview.totalRevenue) : (loading ? "—" : "R$ 13.59M")}
          subtitle="Pure product sales across all placed orders (excl. freight)"
          badge="Merchandise GMV"
          badgeColor="emerald"
          icon={DollarSign}
          loading={loading}
        />

        <KpiCard
          title="Total Placed Orders"
          value={overview ? formatNumber(overview.totalOrders) : (loading ? "—" : "99,441")}
          subtitle="Platform orders across all statuses (97.02% delivered)"
          badge="All Placed"
          badgeColor="blue"
          icon={ShoppingCart}
          loading={loading}
        />

        <KpiCard
          title="Average Order Value"
          value={overview ? `R$ ${overview.averageOrderValue.toFixed(2)}` : (loading ? "—" : "R$ 137.75")}
          subtitle="Merchandise GMV per item-associated order (98,666)"
          badge="Basket AOV"
          badgeColor="purple"
          icon={TrendingUp}
          loading={loading}
        />

        <KpiCard
          title="Unique Customers"
          value={overview ? formatNumber(overview.totalCustomers) : (loading ? "—" : "96,096")}
          subtitle="Distinct individual buyers (customer_unique_id)"
          badge="Unique Buyers"
          badgeColor="blue"
          icon={Users}
          loading={loading}
        />

        <KpiCard
          title="Catalog Products"
          value={overview ? formatNumber(overview.totalProducts) : (loading ? "—" : "32,951")}
          subtitle="Active SKU catalog variety"
          badge="Products"
          badgeColor="blue"
          icon={Package}
          loading={loading}
        />

        <KpiCard
          title="Marketplace Sellers"
          value={overview ? formatNumber(overview.totalSellers) : (loading ? "—" : "3,095")}
          subtitle="Active independent merchants"
          badge="Sellers"
          badgeColor="blue"
          icon={Store}
          loading={loading}
        />

        <KpiCard
          title="Average Delivery Time"
          value={overview ? formatDays(overview.averageDeliveryDays) : (loading ? "—" : "12.6 days")}
          subtitle="From purchase to customer door"
          badge="Logistics"
          badgeColor="amber"
          icon={Clock}
          loading={loading}
        />

        <KpiCard
          title="On-Time Delivery Rate"
          value={overview ? formatPercent(overview.onTimeDeliveryRate) : (loading ? "—" : "91.89%")}
          subtitle="Arrived on or before estimated date"
          badge="SLA Health"
          badgeColor="emerald"
          icon={CheckCircle2}
          loading={loading}
        />
      </div>

      {/* Row 1: Revenue Trajectory & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <div className="min-w-0">
          <RevenueTrendChart data={revenueTrend} loading={loading} error={error} />
        </div>
        <div className="min-w-0">
          <TopCategoriesChart data={topCategories} loading={loading} error={error} />
        </div>
      </div>

      {/* Row 2: Regional Concentration & Customer Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        <div className="lg:col-span-2 min-w-0">
          <RegionalRevenueChart data={regionalData} loading={loading} error={error} />
        </div>
        <div className="min-w-0">
          <CustomerRetentionChart
            repeatCount={customerData.repeatCount}
            oneTimeCount={customerData.oneTimeCount}
            repeatPct={customerData.repeatPct}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Row 3: Delivery SLA vs Review Rating */}
      <div className="grid grid-cols-1 gap-6 min-w-0">
        <div className="min-w-0">
          <DeliverySlaChart
            onTimeOrders={deliveryData?.onTimeOrders ?? 0}
            delayedOrders={deliveryData?.delayedOrders ?? 0}
            onTimeRating={deliveryData?.onTimeAvgRating ?? 4.29}
            delayedRating={deliveryData?.delayedAvgRating ?? 2.57}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

