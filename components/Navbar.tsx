"use client";

import { useEffect, useState } from "react";
import { fetchBTC } from "@/services/cryptoService";

interface BTCData {
  usd: number;
  usd_24h_change: number;
}

export default function Navbar() {

  const [dark, setDark] = useState(false);
  const [btc, setBtc] = useState<BTCData | null>(null);

  /* ---------------- THEME INIT ---------------- */

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const isDark = savedTheme === "dark";

      document.documentElement.classList.toggle("dark", isDark);
      setDark(isDark);

    } else {

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      document.documentElement.classList.toggle("dark", prefersDark);
      setDark(prefersDark);
    }

  }, []);

  /* ---------------- TOGGLE THEME ---------------- */

  const toggleDark = () => {

    const newTheme = !dark;

    document.documentElement.classList.toggle("dark", newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");

    setDark(newTheme);
  };

  /* ---------------- BTC FETCH ---------------- */

  useEffect(() => {

    const loadBTC = async () => {
      const data = await fetchBTC();
      if (data) setBtc(data);
    };

    loadBTC();

    const interval = setInterval(loadBTC, 30000);

    return () => clearInterval(interval);

  }, []);

  return (

    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-green-500/20 shadow-lg">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* LOGO */}

        <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          💰
          <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            CRYPTO TRACKER
          </span>
        </h1>

        {/* BTC TICKER */}

        {btc && (

          <div className="hidden md:flex items-center text-sm font-medium border-l pl-4 border-green-500/20">

            <span className="mr-2 text-gray-400">BTC</span>

            <span className="mr-3 font-semibold text-black dark:text-white">
              ${btc.usd.toLocaleString()}
            </span>

            <span
              className={`px-2 py-1 rounded-md text-xs font-semibold ${
                btc.usd_24h_change > 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {btc.usd_24h_change > 0 ? "▲" : "▼"}{" "}
              {btc.usd_24h_change.toFixed(2)}%
            </span>

          </div>

        )}

        {/* TOGGLE */}

        <button
          onClick={toggleDark}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/40 bg-black/60 dark:bg-gray-800 hover:bg-green-500/10 transition text-sm font-medium text-green-400 shadow-md"
        >
          {dark ? "🌞 Light" : "🌙 Dark"}
        </button>

      </div>

    </nav>
  );
}