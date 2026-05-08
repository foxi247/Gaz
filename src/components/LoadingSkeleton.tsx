interface LoadingSkeletonProps {
  variant?: 'dashboard' | 'accounts' | 'transactions' | 'default';
}

export function LoadingSkeleton({ variant = 'default' }: LoadingSkeletonProps) {
  if (variant === 'dashboard') {
    return (
      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[24px] bg-white/70 shadow-card" />
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div className="h-72 animate-pulse rounded-[28px] bg-white/70 shadow-card" />
          <div className="grid gap-5">
            <div className="h-32 animate-pulse rounded-[28px] bg-white/70 shadow-card" />
            <div className="h-32 animate-pulse rounded-[28px] bg-white/70 shadow-card" />
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-[28px] bg-white/70 shadow-card" />
      </div>
    );
  }

  if (variant === 'accounts') {
    return (
      <div className="grid gap-5">
        <div className="h-24 animate-pulse rounded-[28px] bg-white/70 shadow-card" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-[28px] bg-white/70 shadow-card" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'transactions') {
    return (
      <div className="glass-card grid gap-4 p-5 sm:p-6">
        <div className="h-10 w-48 animate-pulse rounded-2xl bg-neutral-100" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-[24px] bg-white/70 shadow-card" />
      ))}
    </div>
  );
}
