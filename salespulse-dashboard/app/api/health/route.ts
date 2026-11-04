import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await checkDbConnection();
  if (result.connected) {
    return NextResponse.json({
      success: true,
      data: result,
    });
  } else {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        data: result,
      },
      { status: 503 }
    );
  }
}

