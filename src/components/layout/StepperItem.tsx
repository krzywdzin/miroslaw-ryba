import type { LucideIcon } from 'lucide-react'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

export interface SubStep {
  label: string
  status: string
}

export interface StepperItemProps {
  id: string
  label: string
  icon: LucideIcon
  status: 'completed' | 'current' | 'locked'
  subSteps?: SubStep[]
}

export function StepperItem({
  label,
  icon: Icon,
  status,
  subSteps,
}: StepperItemProps) {
  const isExpandable =
    subSteps && subSteps.length > 0 && (status === 'completed' || status === 'current')

  const content = (
    <div
      className={cn(
        'flex h-11 items-center gap-3 rounded-md px-3 text-sm',
        status === 'completed' && 'cursor-pointer hover:bg-accent/50',
        status === 'current' &&
          'border-l-[3px] border-accent font-semibold text-accent-foreground',
        status === 'locked' && 'pointer-events-none opacity-50',
      )}
    >
      {status === 'completed' && (
        <Check className="size-[18px] shrink-0 text-success" />
      )}
      {status === 'current' && (
        <Icon className="size-[18px] shrink-0 text-accent" />
      )}
      {status === 'locked' && (
        <Lock className="size-[18px] shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
    </div>
  )

  if (!isExpandable) {
    return content
  }

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>{content}</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-6 space-y-1 py-1">
          {subSteps.map((sub) => (
            <div
              key={sub.label}
              className="px-3 py-1 text-[13px] text-muted-foreground"
            >
              {sub.label}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
