import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

export interface HistoryItem {
  simulationId: string
  topic: string
  status: string
  date: string | null
  agentCount: number | null
  hasReport: boolean
}

type SortDir = 'asc' | 'desc'

const STATUS_CLASSES: Record<string, string> = {
  completed: 'bg-[hsl(142_71%_45%/0.1)] text-[hsl(142_71%_35%)] border-transparent',
  running: 'bg-[hsl(217_91%_60%/0.1)] text-[hsl(217_91%_50%)] border-transparent',
  generating: 'bg-[hsl(38_92%_50%/0.1)] text-[hsl(38_92%_40%)] border-transparent',
  failed: 'bg-[hsl(0_84%_60%/0.1)] text-[hsl(0_84%_50%)] border-transparent',
}

interface HistoryTableProps {
  items: HistoryItem[]
  isLoading: boolean
}

export function HistoryTable({ items, isLoading }: HistoryTableProps) {
  const { t, i18n } = useTranslation('reports')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = () => {
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      // Nulls sort to end regardless of direction
      if (a.date === null && b.date === null) return 0
      if (a.date === null) return 1
      if (b.date === null) return -1
      const cmp = a.date.localeCompare(b.date)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [items, sortDir])

  const SortIcon = () => {
    return sortDir === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  if (isLoading) {
    return <LoadingSkeleton variant="list" lines={5} />
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-lg font-semibold">{t('empty.historyHeading')}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('empty.historyBody')}
        </p>
      </div>
    )
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString(
      i18n.language === 'pl' ? 'pl-PL' : 'en-US',
      { day: 'numeric', month: 'short' },
    )
  }

  const getStatusBadge = (status: string) => {
    const customClass = STATUS_CLASSES[status]
    if (customClass) {
      return (
        <Badge className={customClass}>
          {t(`status.${status}`, { defaultValue: status })}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        {t(`status.${status}`, { defaultValue: status })}
      </Badge>
    )
  }

  return (
    <Table data-testid="history-table">
      <TableHeader>
        <TableRow>
          <TableHead>{t('history.topic')}</TableHead>
          <TableHead>{t('history.status')}</TableHead>
          <TableHead>
            <button
              className="flex items-center font-medium"
              onClick={handleSort}
              data-testid="sort-date"
            >
              {t('history.date')}
              <SortIcon />
            </button>
          </TableHead>
          <TableHead>{t('history.agents')}</TableHead>
          <TableHead>{t('history.report')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedItems.map((item) => (
          <TableRow key={item.simulationId} className="h-12">
            <TableCell className="truncate max-w-[200px]">
              {item.topic}
            </TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            <TableCell>{formatDate(item.date)}</TableCell>
            <TableCell>{item.agentCount ?? '-'}</TableCell>
            <TableCell>
              {item.hasReport ? (
                <Link
                  to={`/report/${item.simulationId}`}
                  className="text-primary hover:underline"
                >
                  {t('history.open')}
                </Link>
              ) : (
                <span className="text-muted-foreground">
                  {t('history.noReport')}
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
