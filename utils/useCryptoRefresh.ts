import { useEffect, useState } from "react";

export function useCryptoRefresh<T>(fetchFunction: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const result = await fetchFunction();
        if (mounted) setData(result);
      } catch (err) {
        console.error("useCryptoRefresh error:", err);
      }
    };

    loadData();

    const interval = setInterval(loadData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return data;
}