import { Search, Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ENTITY_TYPES, ENTITY_COLORS } from '../lib/graph-colors'
import type { useGraphFilters } from '../hooks/useGraphFilters'

interface GraphToolbarProps {
  filters: ReturnType<typeof useGraphFilters>
  onFitToScreen: () => void
}

export function GraphToolbar({ filters, onFitToScreen }: GraphToolbarProps) {
  const { t } = useTranslation('graph')

  return (
    <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 shadow space-y-3 max-w-[220px]">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('view.toolbar.search')}
          value={filters.searchQuery}
          onChange={(e) => filters.setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm"
          data-testid="graph-search"
        />
      </div>

      <div className="space-y-1.5">
        {ENTITY_TYPES.map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <Checkbox
              checked={filters.activeTypes.has(type)}
              onCheckedChange={() => filters.toggleType(type)}
              data-testid={`filter-${type}`}
            />
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: ENTITY_COLORS[type] }}
            />
            <span>{t(`view.types.${type}`)}</span>
          </label>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={onFitToScreen}
      >
        <Maximize2 className="h-4 w-4 mr-1" />
        {t('view.toolbar.fitToScreen')}
      </Button>
    </div>
  )
}
