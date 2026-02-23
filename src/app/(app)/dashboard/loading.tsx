export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-gray-100" />
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="h-64 rounded-lg bg-gray-100" />
    </div>
  );
}
