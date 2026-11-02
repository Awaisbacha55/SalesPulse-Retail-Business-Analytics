import { NextResponse } from "next/server";
import { getCustomerAnalytics } from "@/lib/queries/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCustomerAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("API /api/customers error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch customer metrics" },
      { status: 500 }
    );
  }
}

