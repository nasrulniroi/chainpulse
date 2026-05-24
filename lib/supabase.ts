import { createClient } from "@supabase/supabase-js";
import type { WalletProfile } from "@/types/wallet";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const CACHE_TTL_HOURS = parseInt(process.env.CACHE_TTL_HOURS || "24");

export async function getCachedProfile(address: string): Promise<WalletProfile | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("wallet_profiles")
      .select("profile, updated_at")
      .eq("address", address.toLowerCase())
      .single();

    if (error || !data) return null;

    // Check TTL
    const updatedAt = new Date(data.updated_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > CACHE_TTL_HOURS) return null;

    return data.profile as WalletProfile;
  } catch {
    return null;
  }
}

export async function cacheProfile(address: string, profile: WalletProfile): Promise<void> {
  if (!supabase) return;

  try {
    await supabase
      .from("wallet_profiles")
      .upsert(
        {
          address: address.toLowerCase(),
          profile: profile as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "address" }
      );
  } catch {
    // Silent fail — caching is optional
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey && supabaseUrl !== "https://xxxx.supabase.co");
}
