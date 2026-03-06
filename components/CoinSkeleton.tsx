export default function CoinSkeleton() {
  return (
    <div className="glass p-4 animate-pulse">
      <div className="h-6 w-32 bg-gray-700 rounded mb-3"></div>
      <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-20 bg-gray-700 rounded"></div>
    </div>
  );
}