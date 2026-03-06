import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface ChartResponse {
  prices: [number, number][];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "30";

  try {

    /* ---------------- COIN DATA ---------------- */

    const coinRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      {
        next: { revalidate: 120 }
      }
    );

    if (!coinRes.ok) {
      return NextResponse.json(
        { error: "Coin API failed" },
        { status: coinRes.status }
      );
    }

    const coin = await coinRes.json();

    /* ---------------- CHART DATA ---------------- */

    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        next: { revalidate: 120 }
      }
    );

    const chartData: ChartResponse = await chartRes.json();

    const chart = chartData.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price
    }));

    /* ---------------- RESPONSE ---------------- */

    return NextResponse.json({
      coin,
      chart
    });

  } catch (error) {

    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}