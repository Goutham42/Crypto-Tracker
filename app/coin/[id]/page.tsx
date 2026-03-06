"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    ath: { usd: number };
    ath_date: { usd: string };
  };
}

interface ChartData {
  date: string;
  price: number;
}

export default function CoinPage() {
  const params = useParams();
  const id = params?.id as string;

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chart, setChart] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetched = useRef(false);

  /* ---------- FORMAT NUMBERS ---------- */

  const format = (num: number) =>
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);

  /* ---------- LOAD DATA ---------- */

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/coin/${id}?days=${days}`);

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      if (!data?.coin) return;

      setCoin(data.coin);
      setChart(data.chart || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    if (fetched.current && days === 30) return;

    fetched.current = true;

    loadData();
  }, [id, days]);

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400 text-lg">
        Loading coin details...
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-400">
        Failed to load coin data
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 overflow-x-hidden">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <Image
          src={coin.image.large}
          alt={coin.name}
          width={64}
          height={64}
          className="rounded-full"
        />

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>

          <p className="text-green-400 font-semibold text-lg">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">

        <StatCard
          label="24h Change"
          value={`${coin.market_data.price_change_percentage_24h.toFixed(2)}%`}
          positive={coin.market_data.price_change_percentage_24h > 0}
        />

        <StatCard
          label="7d Change"
          value={`${coin.market_data.price_change_percentage_7d.toFixed(2)}%`}
          positive={coin.market_data.price_change_percentage_7d > 0}
        />

        <StatCard
          label="Market Cap"
          value={`$${format(coin.market_data.market_cap.usd)}`}
        />

        <StatCard
          label="Volume (24h)"
          value={`$${format(coin.market_data.total_volume.usd)}`}
        />

        <StatCard
          label="All Time High"
          value={`$${coin.market_data.ath.usd.toLocaleString()}`}
          subText={new Date(
            coin.market_data.ath_date.usd
          ).toLocaleDateString()}
        />
      </div>

      {/* FILTER BUTTONS */}

      <div className="flex gap-2 mb-4 flex-wrap">
        {[7, 30, 90, 365].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              days === d
                ? "bg-green-500 text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      {/* CHART */}

      <div className="chart-card p-6 rounded-xl overflow-hidden">

        <h2 className="text-lg font-semibold mb-4 text-green-400">
          Price Chart ({days} days)
        </h2>

        <div className="w-full h-72">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chart}
              margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
            >

              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                width={50}
                tickFormatter={(v: number | string) =>
                  `$${format(Number(v))}`
                }
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value: number | string) =>
                  `$${Number(value).toLocaleString()}`
                }
                contentStyle={{
                  background: "#111",
                  border: "1px solid #22c55e",
                  borderRadius: "8px",
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>

    </main>
  );
}

/* ---------- STAT CARD ---------- */

function StatCard({
  label,
  value,
  subText,
  positive,
}: {
  label: string;
  value: string;
  subText?: string;
  positive?: boolean;
}) {
  return (
    <div className="glass p-4 rounded-xl">

      <p className="text-gray-400 text-sm">{label}</p>

      <p
        className={`font-semibold text-lg ${
          positive !== undefined
            ? positive
              ? "text-green-400"
              : "text-red-400"
            : ""
        }`}
      >
        {value}
      </p>

      {subText && (
        <p className="text-gray-500 text-xs">{subText}</p>
      )}

    </div>
  );
}