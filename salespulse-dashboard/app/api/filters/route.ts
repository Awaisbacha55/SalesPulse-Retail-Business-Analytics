import { NextResponse } from "next/server";
import { getFilterOptions } from "@/lib/queries/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getFilterOptions();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("API /api/filters error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}

