import { NextRequest, NextResponse } from "next/server";
import { getTopCategories, getTopProducts, getParetoProductAnalysis } from "@/lib/queries/analytics";

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

    const [topCategories, topProducts, pareto] = await Promise.all([
      getTopCategories(filters, 10),
      getTopProducts(filters, 10),
      getParetoProductAnalysis(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        topCategories,
        topProducts,
        pareto,
      },
    });
  } catch (error: any) {
    console.error("API /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch product analytics" },
      { status: 500 }
    );
  }
}

