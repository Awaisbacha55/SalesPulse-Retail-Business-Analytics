import { NextRequest, NextResponse } from "next/server";
import { getOverviewMetrics } from "@/lib/queries/analytics";

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

    const metrics = await getOverviewMetrics(filters);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    console.error("API /api/overview error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch overview metrics" },
      { status: 500 }
    );
  }
}

