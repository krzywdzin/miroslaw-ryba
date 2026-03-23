import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'
import { SourcesList } from './SourcesList'
import { ToolCallsSection } from './ToolCallsSection'
import type { ChatMessage } from '../types'

interface ChatBubbleProps {
  message: ChatMessage
  onRetry?: () => void
}

export function ChatBubble({ message, onRetry }: ChatBubbleProps) {
  const { t } = useTranslation('chat')

  if (message.error) {
    return (
      <div
        className="mr-auto max-w-[80%] rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive"
        data-testid="chat-bubble"
        data-testid-error="true"
      >
        <p className="text-sm">{t('sendError')}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 text-xs underline"
          >
            {t('retry')}
          </button>
        )}
      </div>
    )
  }

  if (message.role === 'user') {
    return (
      <div
        className="ml-auto max-w-[80%] rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
        data-testid="chat-bubble"
        data-testid-user="true"
      >
        <p className="text-sm">{message.content}</p>
      </div>
    )
  }

  return (
    <div
      className="mr-auto max-w-[80%] rounded-2xl bg-muted px-4 py-3"
      data-testid="chat-bubble"
      data-testid-agent="true"
    >
      <div className="prose prose-sm max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
      </div>
      <SourcesList sources={message.sources} />
      <ToolCallsSection toolCalls={message.toolCalls} />
    </div>
  )
}
