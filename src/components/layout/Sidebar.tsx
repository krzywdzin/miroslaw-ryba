import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { Stepper } from './Stepper'

export function Sidebar() {
  const { t } = useTranslation('common')

  return (
    <aside className="hidden w-[var(--sidebar-width)] shrink-0 flex-col border-r bg-muted p-4 lg:flex">
      <span className="mb-2 text-[13px] font-semibold text-muted-foreground">
        {t('pipeline')}
      </span>
      <Separator className="mb-3" />
      <Stepper />
    </aside>
  )
}
