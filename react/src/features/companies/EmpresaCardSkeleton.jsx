import Skeleton from '../../shared/components/Skeleton'

export default function EmpresaCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 rounded mb-2" />
          <Skeleton className="h-3 rounded w-32" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  )
}