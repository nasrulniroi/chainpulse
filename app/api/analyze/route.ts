import { NextRequest, NextResponse } from "next/server";
import { analyzeWallet } from "@/lib/wallet-analyzer";
import { getCachedProfile, cacheProfile } from "@/lib/supabase";
import { isValidAddress } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { success: false, error: "Address parameter is required" },
      { status: 400 }
    );
  }

  const cleanAddress = address.trim().toLowerCase();

  // Validate: must be 0x + 40 hex chars
  if (!isValidAddress(cleanAddress)) {
    return NextResponse.json(
      { success: false, error: "Invalid Ethereum address. Must be 0x followed by 40 hex characters." },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = await getCachedProfile(cleanAddress);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Analyze wallet
    const profile = await analyzeWallet(cleanAddress);

    // Cache result
    await cacheProfile(cleanAddress, profile);

    return NextResponse.json({
      success: true,
      data: profile,
      cached: false,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze wallet. Please try again.",
      },
      { status: 500 }
    );
  }
}
