import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Stepper } from './Stepper'

interface SidebarMobileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SidebarMobile({ open, onOpenChange }: SidebarMobileProps) {
  const { t } = useTranslation('common')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[var(--sidebar-width)] p-4">
        <SheetHeader className="p-0">
          <SheetTitle className="text-[13px] font-semibold text-muted-foreground">
            {t('pipeline')}
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        <Stepper />
      </SheetContent>
    </Sheet>
  )
}
