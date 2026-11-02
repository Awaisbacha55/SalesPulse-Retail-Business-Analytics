import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "emerald" | "blue" | "amber" | "rose" | "purple";
  loading?: boolean;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "blue",
  loading = false,
}: KpiCardProps) {
  const badgeClasses = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const iconBgClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-28 bg-slate-200 animate-pulse rounded my-1" />
          ) : (
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgClasses[badgeColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeClasses[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

