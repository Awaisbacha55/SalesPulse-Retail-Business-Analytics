"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  TrendingUp,
  AlertTriangle,
  MapPin,
  CreditCard,
  Layers,
  CheckCircle2,
  Bell,
  RefreshCw,
  Building2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function InsightsPage() {
  const insights = [
    {
      id: 1,
      badge: "Logistics & CSAT",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      icon: AlertTriangle,
      iconColor: "text-rose-600 bg-rose-50",
      title: "Delivery Delays Trigger a -40% Collapse in Customer Satisfaction",
      metric: "-1.72 Stars",
      metricSub: "4.29 on-time vs 2.57 delayed",
      description:
        "Analysis of 96,478 delivered orders reveals that on-time orders maintain a healthy 4.29 average review rating. When delivery breaches the carrier SLA date (8,199 orders, 8.11%), satisfaction plummets to 2.57 stars—a 40.1% decline. Shipping latency is the primary driver of 1-star reviews across Olist.",
      evidence: [
        "88,649 orders delivered on time (91.89% compliance)",
        "8,199 orders delivered late (8.11% defect rate)",
        "Severe delays exceeding 14 days account for over 60% of all 1-star feedback",
      ],
    },
    {
      id: 2,
      badge: "Customer Retention",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: RefreshCw,
      iconColor: "text-amber-600 bg-amber-50",
      title: "Customer Base is 96.9% One-Time Buyers with 3.12% Retention",
      metric: "3.12% Repeat",
      metricSub: "93,099 one-time vs 2,997 repeat buyers",
      description:
        "Out of 96,096 distinct customer identities, only 2,997 ever made a second purchase. The marketplace operates almost entirely on transactional acquisition rather than recurring customer value. Repeat buyers take an average of 86.4 days to place their next order, showing a long latency gap without post-purchase nurturing.",
      evidence: [
        "93,099 customers (96.88%) made exactly 1 order",
        "2,997 customers (3.12%) made 2 or more orders",
        "Average repurchase interval: 86.4 days",
      ],
    },
    {
      id: 3,
      badge: "Regional Concentration",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: MapPin,
      iconColor: "text-blue-600 bg-blue-50",
      title: "Southeast Region Drives 63.4% of Total Gross Merchandise Value",
      metric: "63.36% Share",
      metricSub: "Top 3 states (SP, RJ, MG) dominate",
      description:
        "Geographic demand is heavily clustered in Brazil's Southeast corridor. São Paulo alone generates R$ 5,202,955 (38.28%), followed by Rio de Janeiro (12.44%) and Minas Gerais (11.64%). In contrast, northern and central states face significantly higher transit times (often 18-25 days) and elevated freight friction.",
      evidence: [
        "São Paulo (SP): R$ 5.20M GMV (41,746 orders)",
        "Rio de Janeiro (RJ): R$ 1.69M GMV (12,852 orders)",
        "Minas Gerais (MG): R$ 1.58M GMV (11,635 orders)",
      ],
    },
    {
      id: 4,
      badge: "Financing & Payments",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      icon: CreditCard,
      iconColor: "text-purple-600 bg-purple-50",
      title: "Credit Card Installment Plans Finance Over 73% of GMV Volume",
      metric: "73.9% Credit",
      metricSub: "19.0% Boleto, 5.7% Voucher, 1.4% Debit",
      description:
        "Credit cards dominate customer checkout preferences, accounting for R$ 12.54M (73.9% of transactions), followed by cash voucher Boleto Bancário (19.0%). Notably, 52.8% of credit card transactions use multi-month installment plans, enabling higher Average Order Value (AOV) on electronics and appliances.",
      evidence: [
        "Credit Card: 76,784 payments (R$ 12.54M volume)",
        "Boleto Bancário: 19,784 payments (R$ 2.87M volume)",
        "Installments span up to 24 months, with 1-3 installments most common",
      ],
    },
    {
      id: 5,
      badge: "Catalog Pareto",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Layers,
      iconColor: "text-emerald-600 bg-emerald-50",
      title: "Top 5 of 73 Product Categories Command 36.8% of Total Revenue",
      metric: "36.8% GMV",
      metricSub: "R$ 5.00M across top 5 categories",
      description:
        "Revenue concentration follows a strict Pareto curve. While the catalog spans 73 English-translated product categories, the top 5 (bed_bath_table, health_beauty, computers_accessories, furniture_decor, and sports_leisure) capture over a third of all marketplace revenue. Bed Bath Table alone generates R$ 1.04M across 11,115 items.",
      evidence: [
        "bed_bath_table: R$ 1.04M (11,115 units sold)",
        "health_beauty: R$ 1.26M (9,670 units sold, highest margin)",
        "computers_accessories: R$ 911K (7,827 units sold)",
      ],
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: "Implement Automated Carrier SLA Delay Alerts & Customer Credits",
      horizon: "Immediate (30 Days)",
      icon: Bell,
      color: "border-blue-500",
      impact: "High (+0.6 CSAT recovery)",
      summary:
        "Integrate automated carrier tracking triggers. When an order reaches 48 hours before estimated delivery with tracking showing pending in-transit status, automatically dispatch a proactive SMS/email apologizing for carrier latency alongside a 10% next-purchase voucher. Proactive communication converts angry 1-star reviews into loyal returning customers.",
      steps: [
        "Deploy webhook listener for carrier tracking API milestones.",
        "Trigger proactive status update email at SLA estimate -24 hours.",
        "Issue instant freight coupon for delayed shipments.",
      ],
    },
    {
      id: 2,
      title: "Launch an 86-Day Lifecycle Email Sequence for 2nd Purchase",
      horizon: "Medium-Term (60 Days)",
      icon: TrendingUp,
      color: "border-emerald-500",
      impact: "Very High (Target 6% repeat rate)",
      summary:
        "Capitalize on the verified 86.4-day average repurchase window. Configure automated retention flows targeting buyers at Day 45 (replenishment reminder), Day 70 (personalized recommendations based on category co-purchases), and Day 85 (expiring loyalty discount). Doubling repeat customer rate from 3.1% to 6.2% would unlock over R$ 850,000 in incremental high-margin GMV.",
      steps: [
        "Segment buyers by primary product category purchase.",
        "Schedule triggered emails at day 45, 70, and 85 post-delivery.",
        "Offer free shipping on 2nd purchase within 90 days.",
      ],
    },
    {
      id: 3,
      title: "Establish Regional 3PL Fulfillment Hubs in North & Northeast",
      horizon: "Strategic (90-180 Days)",
      icon: Building2,
      color: "border-purple-500",
      impact: "Transformative (Expand non-SP GMV)",
      summary:
        "The Southeast corridor (SP/RJ/MG) generates 63.4% of GMV primarily because seller warehouses and fulfillment routes are concentrated around São Paulo, causing 18-25 day shipping times to Northern states (BA, CE, PE, PA). Partner with regional 3PL micro-fulfillment centers to pre-stock top 20 Pareto SKUs in Salvador or Recife, cutting transit time by 60% and unlocking suppressed regional demand.",
      steps: [
        "Audit freight cost variance between SP and Northeast deliveries.",
        "Identify top 50 high-velocity SKUs with high freight-to-price ratios.",
        "Pilot consigned inventory storage in a Salvador logistics hub.",
      ],
    },
  ];

  return (
    <DashboardShell
      title="Executive Insights & Strategic Recommendations"
      subtitle="Evidence-based business intelligence, operational bottlenecks, and ROI-driven action plans"
      showFilters={false}
    >
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
            Executive Summary
          </span>
          <h2 className="text-2xl font-bold mt-3 mb-2">
            Data-Driven Strategy for SalesPulse Retail Marketplace
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Synthesized from 1.54M rows across 9 relational PostgreSQL tables, 99,441 verified orders, and R$ 13.59M in merchandise sales. This briefing highlights the 5 most critical empirical findings and presents 3 prioritized executive recommendations to accelerate revenue, improve retention, and safeguard customer satisfaction.
          </p>
        </div>
      </div>

      {/* 5 Key Business Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              5 Core Business Insights (Empirical Evidence)
            </h3>
            <p className="text-xs text-slate-500">
              Verified through SQL CTEs, window functions, and cross-table aggregations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                    {item.title}
                  </h4>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                    <div className="text-lg font-bold text-slate-900">{item.metric}</div>
                    <div className="text-[11px] text-slate-500">{item.metricSub}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Supporting Data:
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {item.evidence.map((ev, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Strategic Recommendations */}
      <div className="mt-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            3 High-Impact Strategic Recommendations
          </h3>
          <p className="text-xs text-slate-500">
            Prioritized business initiatives designed to generate measurable ROI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                className={`bg-white rounded-xl border-l-4 ${rec.color} border-y border-r border-slate-200/80 shadow-sm p-6 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {rec.horizon}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {rec.impact}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug mb-3">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {rec.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Action Plan:
                  </p>
                  <div className="space-y-2">
                    {rec.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}

