import { useTranslation } from 'react-i18next'

export function TypingIndicator() {
  const { t } = useTranslation('chat')

  return (
    <div
      className="mr-auto flex max-w-[80px] items-center gap-1 rounded-2xl bg-muted px-4 py-3"
      aria-label={t('typingLabel')}
      role="status"
    >
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
    </div>
  )
}
