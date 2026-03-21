import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DockerContainer } from '../../types/docker.types'
import { stripDockerLogHeader } from '../../types/docker.types'
import { useContainerLogs } from '../../hooks/useDockerStatus'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface ContainerLogsProps {
  containers: DockerContainer[]
}

export function ContainerLogs({ containers }: ContainerLogsProps) {
  const { t } = useTranslation('settings')
  const [selectedId, setSelectedId] = useState<string>(
    containers[0]?.Id ?? ''
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  // Update selected container if current one disappears
  useEffect(() => {
    if (containers.length > 0 && !containers.find((c) => c.Id === selectedId)) {
      setSelectedId(containers[0].Id)
    }
  }, [containers, selectedId])

  const { logs, isLoading } = useContainerLogs(selectedId, !!selectedId)

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const cleanedLogs = logs
    ? logs
        .split('\n')
        .map((line) => stripDockerLogHeader(line))
        .join('\n')
    : ''

  return (
    <div className="space-y-3">
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Wybierz kontener" />
        </SelectTrigger>
        <SelectContent>
          {containers.map((c) => (
            <SelectItem key={c.Id} value={c.Id}>
              {c.Names[0]?.replace(/^\//, '') ?? c.Id.slice(0, 12)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <Skeleton className="h-[320px] w-full" />
      ) : (
        <ScrollArea className="h-[320px] rounded-md bg-[hsl(240_5%_96%)]">
          <div
            ref={scrollRef}
            className="h-[320px] overflow-auto p-4 font-mono text-[13px] leading-[1.6]"
          >
            {cleanedLogs.trim() ? (
              <pre className="whitespace-pre-wrap break-words">
                {cleanedLogs}
              </pre>
            ) : (
              <p className="text-muted-foreground">{t('docker.noLogs')}</p>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
