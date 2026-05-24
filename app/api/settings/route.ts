import { NextResponse } from "next/server";

export async function GET() {
  const aiEnabled = process.env.AI_ENABLED !== "false";
  const hasApiKey = !!process.env.AI_API_KEY && process.env.AI_API_KEY !== "your_key_here";

  return NextResponse.json({
    aiEnabled,
    provider: process.env.AI_BASE_URL || "not configured",
    model: process.env.AI_MODEL || "not configured",
    hasApiKey,
    supabaseConfigured: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://xxxx.supabase.co"
    ),
  });
}
