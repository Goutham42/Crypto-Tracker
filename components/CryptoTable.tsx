"use client";
import { useRouter } from "next/navigation";
import { Crypto } from "@/types/crypto";
import { formatPrice, formatLargeNumber } from "@/utils/formatPrice";
import SparklineChart from "./SparklineChart";

interface Props {
  cryptos: Crypto[];
}

export default function CryptoTable({ cryptos }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="w-full min-w-[700px] text-sm border-separate border-spacing-0">
        <thead className="sticky top-0 bg-gray-900 text-gray-400 uppercase text-xs">
          <tr>
            <th className="py-3 px-2 text-left rounded-tl-lg">#</th>
            <th className="py-3 px-2 text-left">Coin</th>
            <th className="py-3 px-2 text-left">Price</th>
            <th className="py-3 px-2 text-left">1h</th>
            <th className="py-3 px-2 text-left">24h</th>
            <th className="py-3 px-2 text-left">7d</th>
            <th className="py-3 px-2 text-left">24h Volume</th>
            <th className="py-3 px-2 text-left">Market Cap</th>
            <th className="py-3 px-2 text-left rounded-tr-lg">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((coin, i) => {
            const change1h = coin.price_change_percentage_1h_in_currency;
            const change24h = coin.price_change_percentage_24h;
            const change7d = coin.price_change_percentage_7d_in_currency;

            return (
              <tr
                key={coin.id}
                onClick={() => router.push(`/coin/${coin.id}`)}
                className="cursor-pointer border-b border-gray-800 hover:bg-gray-800/20 hover:scale-[1.01] transition-all duration-200"
              >
                <td className="py-3 px-2 text-gray-400">{i + 1}</td>
                <td className="py-3 px-2 flex items-center gap-2 sm:gap-3">
                  <div className="bg-white/10 p-1 rounded-full flex-shrink-0">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{coin.name}</span>
                    <span className="text-gray-400 text-xs uppercase">{coin.symbol}</span>
                  </div>
                </td>
                <td className="py-3 px-2 font-medium">{formatPrice(coin.current_price)}</td>
                <td className={`py-3 px-2 font-medium ${change1h > 0 ? "text-green-500" : "text-red-500"}`}>
                  {change1h > 0 ? "▲" : "▼"} {change1h?.toFixed(2)}%
                </td>
                <td className={`py-3 px-2 font-medium ${change24h > 0 ? "text-green-500" : "text-red-500"}`}>
                  {change24h > 0 ? "▲" : "▼"} {change24h?.toFixed(2)}%
                </td>
                <td className={`py-3 px-2 font-medium ${change7d > 0 ? "text-green-500" : "text-red-500"}`}>
                  {change7d > 0 ? "▲" : "▼"} {change7d?.toFixed(2)}%
                </td>
                <td className="py-3 px-2">{formatLargeNumber(coin.total_volume)}</td>
                <td className="py-3 px-2">{formatLargeNumber(coin.market_cap)}</td>
                <td className="py-3 px-2">
                  <SparklineChart data={coin.sparkline_in_7d.price} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 