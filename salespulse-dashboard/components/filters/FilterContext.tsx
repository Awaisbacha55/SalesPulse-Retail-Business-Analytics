"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FilterOptions, FilterParams } from "@/types/dashboard";

interface FilterContextType {
  filters: FilterParams;
  setFilters: React.Dispatch<React.SetStateAction<FilterParams>>;
  resetFilters: () => void;
  options: FilterOptions;
  refreshTrigger: number;
  triggerRefresh: () => void;
  lastUpdated: string;
}

const defaultOptions: FilterOptions = {
  states: [],
  categories: [],
  minDate: "2016-09-04",
  maxDate: "2018-10-17",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: "",
    endDate: "",
    state: "ALL",
    category: "ALL",
  });

  const [options, setOptions] = useState<FilterOptions>(defaultOptions);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      state: "ALL",
      category: "ALL",
    });
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch("/api/filters");
        const json = await res.json();
        if (json.success && json.data) {
          setOptions(json.data);
        }
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    }
    loadOptions();
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
        options,
        refreshTrigger,
        triggerRefresh,
        lastUpdated,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}

