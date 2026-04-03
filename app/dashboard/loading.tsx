export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-backgroundSecondary/60">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3 border-b border-border/80 pb-8">
          <div className="skeleton skeleton-shimmer h-3 w-24 rounded-md" />
          <div className="skeleton skeleton-shimmer h-9 max-w-md rounded-lg" />
          <div className="skeleton skeleton-shimmer h-4 max-w-xl rounded-md" />
        </div>
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-shimmer h-24 rounded-xl"
            />
          ))}
        </div>
        <div className="mb-10 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-shimmer h-[320px] rounded-xl"
            />
          ))}
        </div>
        <div className="skeleton skeleton-shimmer mb-10 h-[420px] rounded-xl" />
        <div className="grid gap-8">
          <div className="skeleton skeleton-shimmer h-48 rounded-xl" />
          <div className="skeleton skeleton-shimmer h-56 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
