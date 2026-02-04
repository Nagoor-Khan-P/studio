export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Page Title */}
      <div className="h-8 w-48 rounded bg-muted" />

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Capital Skeleton (spans 2 cols) */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 space-y-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-10 w-64 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted" />
          <div className="h-9 w-full rounded bg-muted" />
        </div>

        {/* Total P/L Skeleton */}
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-3 w-40 rounded bg-muted" />
        </div>

        {/* Remaining metric cards */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-6 space-y-4"
          >
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
