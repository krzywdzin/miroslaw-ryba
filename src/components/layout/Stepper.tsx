import { useTranslation } from 'react-i18next'
import { Network, Users, Play, FileText, MessageCircle } from 'lucide-react'
import { StepperItem, type StepperItemProps } from './StepperItem'

interface StageOverride {
  id: string
  status: 'completed' | 'current' | 'locked'
}

interface StepperProps {
  stages?: StageOverride[]
}

const defaultStages = [
  { id: 'graph', icon: Network },
  { id: 'environment', icon: Users },
  { id: 'simulation', icon: Play },
  { id: 'report', icon: FileText },
  { id: 'dialogue', icon: MessageCircle },
] as const

const stageKeys = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5'] as const

export function Stepper({ stages }: StepperProps) {
  const { t } = useTranslation('navigation')

  const items: StepperItemProps[] = defaultStages.map((stage, index) => {
    const override = stages?.find((s) => s.id === stage.id)
    return {
      id: stage.id,
      label: t(stageKeys[index]),
      icon: stage.icon,
      status: override?.status ?? 'locked',
    }
  })

  return (
    <nav aria-label="Pipeline" className="flex flex-col gap-1">
      {items.map((item) => (
        <StepperItem key={item.id} {...item} />
      ))}
    </nav>
  )
}
