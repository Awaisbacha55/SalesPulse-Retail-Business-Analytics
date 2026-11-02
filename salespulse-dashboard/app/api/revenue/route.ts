import { NextRequest, NextResponse } from "next/server";
import { getMonthlyRevenueTrend } from "@/lib/queries/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      state: searchParams.get("state") || undefined,
      category: searchParams.get("category") || undefined,
    };

    const trend = await getMonthlyRevenueTrend(filters);
    return NextResponse.json({ success: true, data: trend });
  } catch (error: any) {
    console.error("API /api/revenue error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch revenue trend" },
      { status: 500 }
    );
  }
}

