"use client";

import { useFilters } from "./FilterContext";
import { RotateCcw, Filter, Calendar, MapPin, Tag } from "lucide-react";

export function FilterBar() {
  const { filters, setFilters, resetFilters, options, triggerRefresh } = useFilters();

  const hasActiveFilters = Boolean(
    filters.startDate ||
      filters.endDate ||
      (filters.state && filters.state !== "ALL") ||
      (filters.category && filters.category !== "ALL")
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title and Active Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Global Filters</h3>
            <p className="text-xs text-slate-500">Slice metrics by date, geography, or category</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Start Date */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">From:</span>
            <input
              type="date"
              value={filters.startDate || ""}
              min={options.minDate}
              max={options.maxDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="bg-transparent border-none text-slate-700 text-xs focus:outline-none focus:ring-0"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">To:</span>
            <input
              type="date"
              value={filters.endDate || ""}
              min={options.minDate}
              max={options.maxDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="bg-transparent border-none text-slate-700 text-xs focus:outline-none focus:ring-0"
            />
          </div>

          {/* State Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.state || "ALL"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, state: e.target.value }))
              }
              className="bg-transparent border-none text-slate-700 text-xs focus:outline-none focus:ring-0 cursor-pointer max-w-[120px]"
            >
              <option value="ALL">All States</option>
              {options.states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.category || "ALL"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="bg-transparent border-none text-slate-700 text-xs focus:outline-none focus:ring-0 cursor-pointer max-w-[160px] truncate"
            >
              <option value="ALL">All Categories</option>
              {options.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}

          {/* Refresh Data Button */}
          <button
            onClick={triggerRefresh}
            title="Refresh metrics from PostgreSQL"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

