import { useTranslation } from 'react-i18next'
import { Check, Loader, Circle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface ReportProgressProps {
  progress: number
  currentSection?: string
  completedSections?: string[]
}

export function ReportProgress({
  progress,
  currentSection,
  completedSections = [],
}: ReportProgressProps) {
  const { t } = useTranslation('reports')

  // Build section list: completed + current + any remaining
  const sections: { name: string; status: 'done' | 'active' | 'pending' }[] = []

  for (const section of completedSections) {
    sections.push({ name: section, status: 'done' })
  }

  if (currentSection && !completedSections.includes(currentSection)) {
    sections.push({ name: currentSection, status: 'active' })
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-[480px] space-y-6">
        <h2 className="text-[22px] font-semibold leading-[1.2]">
          {t('page.generating')}
        </h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('generation.progressLabel')}
          </p>
          <Progress
            value={progress}
            className="w-full transition-all duration-300"
          />
        </div>

        {sections.length > 0 && (
          <ul className="space-y-0" role="list">
            {sections.map((section) => (
              <li
                key={section.name}
                className="flex h-9 items-center gap-3"
              >
                {section.status === 'done' && (
                  <Check className="h-4 w-4 text-success" />
                )}
                {section.status === 'active' && (
                  <Loader className="h-4 w-4 animate-spin text-primary" />
                )}
                {section.status === 'pending' && (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={
                    section.status === 'pending'
                      ? 'text-muted-foreground'
                      : ''
                  }
                >
                  {section.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
