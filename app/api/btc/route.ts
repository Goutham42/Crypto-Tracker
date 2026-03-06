import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
  {
    next: { revalidate: 30 },
  }
);

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("BTC API error:", err); 

    return NextResponse.json({ bitcoin: null });
  }
}