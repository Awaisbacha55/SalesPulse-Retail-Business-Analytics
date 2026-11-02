"use client";

import { ReactNode } from "react";
import { FilterProvider } from "@/components/filters/FilterContext";

export function Providers({ children }: { children: ReactNode }) {
  return <FilterProvider>{children}</FilterProvider>;
}

