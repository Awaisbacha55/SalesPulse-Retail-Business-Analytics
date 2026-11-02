import { NextResponse } from "next/server";
import { getDeliveryAnalytics } from "@/lib/queries/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getDeliveryAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("API /api/delivery error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch delivery metrics" },
      { status: 500 }
    );
  }
}

