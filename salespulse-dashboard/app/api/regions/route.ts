import { NextRequest, NextResponse } from "next/server";
import { getRegionalAnalytics } from "@/lib/queries/analytics";

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

    const data = await getRegionalAnalytics(filters);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("API /api/regions error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch regional analytics" },
      { status: 500 }
    );
  }
}

