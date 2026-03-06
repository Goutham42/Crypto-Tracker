export async function fetchBTC() {
  try {
    const res = await fetch("/api/btc");

    if (!res.ok) throw new Error("BTC fetch failed");

    const data = await res.json();

    return data.bitcoin;
  } catch (err) {
    console.error("fetchBTC error:", err);
    return null;
  }
}

export async function fetchCryptos() {
  try {
    const res = await fetch("/api/cryptos");

    if (!res.ok) throw new Error("Cryptos fetch failed");

    return res.json();
  } catch (err) {
    console.error("fetchCryptos error:", err);
    return [];
  }
}