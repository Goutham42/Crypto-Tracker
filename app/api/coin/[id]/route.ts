import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const { searchParams } = new URL(req.url);
  const days = searchParams.get("days") || "30";

  try {

    const coinRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      {
        next: { revalidate: 120 } // ✅ CACHE 60 seconds
      }
    );

    if (!coinRes.ok) {
      return NextResponse.json(
        { error: "Coin API failed", status: coinRes.status },
        { status: coinRes.status }
      );
    }

    const coin = await coinRes.json();

    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        next: { revalidate: 120 } // ✅ CACHE
      }
    );

    const chartData = await chartRes.json();

    const chart = chartData.prices.map((p: number[]) => ({
      date: new Date(p[0]).toLocaleDateString(),
      price: p[1],
    }));

    return NextResponse.json({
      coin,
      chart,
    });

  } catch (err) {

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}