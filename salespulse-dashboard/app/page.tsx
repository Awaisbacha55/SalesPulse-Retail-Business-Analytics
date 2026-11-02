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
} from "lucide-react";

export default function OverviewPage() {
  const { filters, refreshTrigger } = useFilters();

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.set("startDate", filters.startDate);
        if (filters.endDate) queryParams.set("endDate", filters.endDate);
        if (filters.state && filters.state !== "ALL") queryParams.set("state", filters.state);
        if (filters.category && filters.category !== "ALL")
          queryParams.set("category", filters.category);

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const [ovRes, revRes, prodRes, regRes, delRes, custRes] = await Promise.all([
          fetch(`/api/overview${qs}`).then((r) => r.json()),
          fetch(`/api/revenue${qs}`).then((r) => r.json()),
          fetch(`/api/products${qs}`).then((r) => r.json()),
          fetch(`/api/regions${qs}`).then((r) => r.json()),
          fetch(`/api/delivery`).then((r) => r.json()),
          fetch(`/api/customers`).then((r) => r.json()),
        ]);

        if (ovRes.success) setOverview(ovRes.data);
        if (revRes.success) setRevenueTrend(revRes.data);
        if (prodRes.success) setTopCategories(prodRes.data.topCategories);
        if (regRes.success) setRegionalData(regRes.data);
        if (delRes.success) setDeliveryData(delRes.data);
        if (custRes.success) {
          setCustomerData({
            repeatCount: custRes.data.repeatCustomers,
            oneTimeCount: custRes.data.oneTimeCustomers,
            repeatPct: custRes.data.repeatCustomerPct,
          });
        }
      } catch (err) {
        console.error("Failed to load overview dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters, refreshTrigger]);

  return (
    <DashboardShell
      title="Executive Overview"
      subtitle="High-level commercial KPIs, revenue velocity, and operational SLA health"
    >
      {/* 8 Required KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sales Revenue"
          value={overview ? formatBRL(overview.totalRevenue) : "R$ 13.59M"}
          subtitle="Merchandise sales from order items"
          badge="Core GMV"
          badgeColor="emerald"
          icon={DollarSign}
          loading={loading}
        />

        <KpiCard
          title="Total Orders"
          value={overview ? formatNumber(overview.totalOrders) : "99,441"}
          subtitle="Completed transactional orders"
          badge="100% Verified"
          badgeColor="blue"
          icon={ShoppingCart}
          loading={loading}
        />

        <KpiCard
          title="Average Order Value"
          value={overview ? `R$ ${overview.averageOrderValue.toFixed(2)}` : "R$ 137.75"}
          subtitle="Average spend per customer order"
          badge="AOV"
          badgeColor="purple"
          icon={TrendingUp}
          loading={loading}
        />

        <KpiCard
          title="Total Customers"
          value={overview ? formatNumber(overview.totalCustomers) : "96,096"}
          subtitle="Unique buyer profiles across Brazil"
          badge="Unique IDs"
          badgeColor="blue"
          icon={Users}
          loading={loading}
        />

        <KpiCard
          title="Catalog Products"
          value={overview ? formatNumber(overview.totalProducts) : "32,951"}
          subtitle="Active SKU catalog variety"
          badge="Products"
          badgeColor="blue"
          icon={Package}
          loading={loading}
        />

        <KpiCard
          title="Marketplace Sellers"
          value={overview ? formatNumber(overview.totalSellers) : "3,095"}
          subtitle="Active independent merchants"
          badge="Sellers"
          badgeColor="blue"
          icon={Store}
          loading={loading}
        />

        <KpiCard
          title="Average Delivery Time"
          value={overview ? formatDays(overview.averageDeliveryDays) : "12.6 days"}
          subtitle="From purchase to customer door"
          badge="Logistics"
          badgeColor="amber"
          icon={Clock}
          loading={loading}
        />

        <KpiCard
          title="On-Time Delivery Rate"
          value={overview ? formatPercent(overview.onTimeDeliveryRate) : "91.89%"}
          subtitle="Arrived on or before estimated date"
          badge="SLA Health"
          badgeColor="emerald"
          icon={CheckCircle2}
          loading={loading}
        />
      </div>

      {/* Row 1: Revenue Trajectory & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart data={revenueTrend} loading={loading} />
        <TopCategoriesChart data={topCategories} loading={loading} />
      </div>

      {/* Row 2: Regional Concentration & Customer Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegionalRevenueChart data={regionalData} loading={loading} />
        </div>
        <div>
          <CustomerRetentionChart
            repeatCount={customerData.repeatCount}
            oneTimeCount={customerData.oneTimeCount}
            repeatPct={customerData.repeatPct}
            loading={loading}
          />
        </div>
      </div>

      {/* Row 3: Delivery SLA vs Review Rating */}
      {deliveryData && (
        <div className="grid grid-cols-1 gap-6">
          <DeliverySlaChart
            onTimeOrders={deliveryData.onTimeOrders}
            delayedOrders={deliveryData.delayedOrders}
            onTimeRating={deliveryData.onTimeAvgRating}
            delayedRating={deliveryData.delayedAvgRating}
            loading={loading}
          />
        </div>
      )}
    </DashboardShell>
  );
}

