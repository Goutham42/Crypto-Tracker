"use client";

import { useState } from "react";
import { useCryptoRefresh } from "@/utils/useCryptoRefresh";
import { fetchCryptos } from "@/services/cryptoService";
import CryptoTable from "@/components/CryptoTable";
import { Crypto } from "@/types/crypto";

export default function Home() {
  const cryptos = useCryptoRefresh<Crypto>(fetchCryptos);

  const [search, setSearch] = useState("");

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container-responsive">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Crypto Tracker</h1>

      <p className="text-gray-500 mb-6">
        Track real-time cryptocurrency prices
      </p>

      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 mb-6 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
      />

      <CryptoTable cryptos={filteredCryptos} />
    </main>
  );
}