import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ShortcutsHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  { keys: '1-5', descriptionKey: 'shortcuts.navigate' },
  { keys: '/', descriptionKey: 'shortcuts.chatFocus' },
  { keys: '[ ]', descriptionKey: 'shortcuts.panelSwitch' },
  { keys: '?', descriptionKey: 'shortcuts.help' },
] as const

export function ShortcutsHelpModal({ open, onOpenChange }: ShortcutsHelpModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('shortcuts.title')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('shortcuts.title')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {t(shortcut.descriptionKey)}
              </span>
              <kbd className="rounded bg-muted px-2 py-1 font-mono text-xs">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
