import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch leaderboard
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const yard = searchParams.get("yard");
  const limit = parseInt(searchParams.get("limit") || "50");

  let query = supabase
    .from("mowtown_leaderboard")
    .select("id, name, yard, percent, combo, hits, created_at")
    .order("percent", { ascending: false })
    .order("combo", { ascending: false })
    .order("hits", { ascending: true })
    .limit(limit);

  if (yard) {
    query = query.eq("yard", yard);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }

  return NextResponse.json({ leaderboard: data });
}

// POST - Submit score
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { name, email, yard, percent, combo, hits } = body;

    // Validate required fields
    if (!name || !email || !yard || percent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate yard
    const validYards = ["starter", "suburban", "hoa", "abandoned"];
    if (!validYards.includes(yard)) {
      return NextResponse.json({ error: "Invalid yard" }, { status: 400 });
    }

    // Validate percent (0-100)
    if (percent < 0 || percent > 100) {
      return NextResponse.json({ error: "Invalid percent" }, { status: 400 });
    }

    // Insert score
    const { data, error } = await supabase
      .from("mowtown_leaderboard")
      .insert({
        name: name.slice(0, 30), // Limit name length
        email,
        yard,
        percent,
        combo: combo || 0,
        hits: hits || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Leaderboard insert error:", error);
      return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error) {
    console.error("Leaderboard POST error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
