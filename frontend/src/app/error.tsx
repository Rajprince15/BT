"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8">
      <h2>Something went wrong!</h2>

      <button
        onClick={() => reset()}
        className="mt-4 rounded border px-4 py-2"
      >
        Try Again
      </button>
    </div>
  );
}