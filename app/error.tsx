"use client"

export default function Error({
  error,
}: {
  error: Error
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Something went wrong
      </h2>

      <p className="text-gray-500">
        {error.message}
      </p>
    </div>
  )
}