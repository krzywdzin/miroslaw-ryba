import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

interface ToolCallsSectionProps {
  toolCalls: unknown[] | undefined
}

export function ToolCallsSection({ toolCalls }: ToolCallsSectionProps) {
  const { t } = useTranslation('chat')

  if (!toolCalls || toolCalls.length === 0) return null

  return (
    <div className="mt-3 border-t border-muted pt-3">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-1 text-xs font-semibold">
          {t('toolCalls')}
          <ChevronDown className="h-3 w-3" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">
            {JSON.stringify(toolCalls, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
