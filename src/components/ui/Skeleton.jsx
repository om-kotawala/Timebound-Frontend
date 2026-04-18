export default function Skeleton({ className = '', height = 'h-4', rounded = 'rounded-lg' }) {
  return <div className={`shimmer-bg ${height} ${rounded} ${className}`} />
}

export function TaskSkeleton() {
  return (
    <div className="card space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-5" height="h-5" rounded="rounded-full" />
        <Skeleton className="flex-1" />
        <Skeleton className="w-20" height="h-5" />
      </div>
      <Skeleton className="w-2/3" height="h-3" />
      <div className="flex gap-2">
        <Skeleton className="w-16" height="h-6" rounded="rounded-full" />
        <Skeleton className="w-20" height="h-6" rounded="rounded-full" />
      </div>
    </div>
  )
}
