export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black via-gray-900 to-black">

      <div className="glass p-10 rounded-2xl flex flex-col items-center gap-6">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-lg font-semibold text-green-400 animate-pulse">
          Loading cryptocurrencies...
        </p>

        {/* Subtext */}
        <p className="text-xs text-gray-400">
          Fetching live market data
        </p>

      </div>

    </div>
  );
}