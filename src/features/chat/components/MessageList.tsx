import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatBubble } from './ChatBubble'
import { TypingIndicator } from './TypingIndicator'
import type { ChatMessage } from '../types'

interface MessageListProps {
  messages: ChatMessage[]
  isPending: boolean
}

export function MessageList({ messages, isPending }: MessageListProps) {
  const { t } = useTranslation('chat')
  const scrollEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messages.length === 0 && !isPending) {
    return (
      <ScrollArea className="flex-1">
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-semibold">{t('emptyState')}</p>
          <p className="text-sm text-muted-foreground">
            {t('emptyStateHint')}
          </p>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div
        className="flex flex-col gap-3 p-4"
        role="log"
        aria-live="polite"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isPending && <TypingIndicator />}
        <div ref={scrollEndRef} />
      </div>
    </ScrollArea>
  )
}
