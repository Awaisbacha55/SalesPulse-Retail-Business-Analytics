"use client";

import { Award, CheckCircle2 } from "lucide-react";
import { formatPercent } from "@/lib/formatters";

interface ParetoProductCardProps {
  cutoffRank: number;
  totalProducts: number;
  percentile: number;
  revenueShare: number;
  loading?: boolean;
}

export function ParetoProductCard({
  cutoffRank,
  totalProducts,
  percentile,
  revenueShare,
  loading,
}: ParetoProductCardProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-xl border border-indigo-800 shadow-md h-64 animate-pulse" />
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 rounded-xl border border-indigo-900/50 shadow-md relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Pareto Principle (80/20 Rule) Analysis</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Top {formatPercent(percentile)} of Products Drive {formatPercent(revenueShare)} of Revenue
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Empirical validation on 32,951 active SKUs demonstrates significant catalog concentration.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-indigo-900/40">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Cutoff Product Rank</p>
          <p className="text-lg font-bold text-white mt-0.5">#{cutoffRank.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-slate-400">Total Catalog SKUs</p>
          <p className="text-lg font-bold text-white mt-0.5">{totalProducts.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-slate-400">Catalog Percentile</p>
          <p className="text-lg font-bold text-indigo-400 mt-0.5">{percentile.toFixed(2)}%</p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-slate-400">Cumulative Revenue</p>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{revenueShare.toFixed(2)}%</p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2 text-xs text-indigo-200/80 bg-indigo-900/30 px-3 py-2 rounded-lg border border-indigo-800/40">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Executive Action: Focus seller SLA management and stock replenishment on these top ~8.5k SKUs.</span>
      </div>
    </div>
  );
}

