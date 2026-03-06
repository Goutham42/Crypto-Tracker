import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
  {
    next: { revalidate: 60 },
  }
);

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Cryptos API error:", err);

    return NextResponse.json([]);
  }
}