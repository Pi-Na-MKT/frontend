import Skeleton from '../../shared/components/Skeleton'

export default function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-start gap-2.5 mb-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="flex-1 h-4 rounded" />
      </div>
      <Skeleton className="h-3 rounded mb-3" style={{ marginLeft: '26px' }} />
      <div className="flex items-center gap-2" style={{ marginLeft: '26px' }}>
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
    </div>
  )
}