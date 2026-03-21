import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text'
  lines?: number
  className?: string
}

const LIST_WIDTHS = ['100%', '80%', '60%']
const TEXT_WIDTHS = ['100%', '90%', '70%']

export function LoadingSkeleton({
  variant = 'text',
  lines = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <Skeleton
        className={cn('h-[120px] w-full rounded-lg', className)}
      />
    )
  }

  const widths = variant === 'list' ? LIST_WIDTHS : TEXT_WIDTHS
  const rowHeight = variant === 'list' ? 'h-10' : 'h-4'

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={rowHeight}
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  )
}
