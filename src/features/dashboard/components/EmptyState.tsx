import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  heading: string
  body: string
}

export function EmptyState({ icon: Icon, heading, body }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Icon className="size-12 text-muted-foreground" />
      <h3 className="mt-4 text-[18px] font-semibold">{heading}</h3>
      <p className="mt-2 text-[15px] text-muted-foreground">{body}</p>
    </div>
  )
}
