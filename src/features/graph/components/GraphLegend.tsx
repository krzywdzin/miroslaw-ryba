import { useTranslation } from 'react-i18next'
import { ENTITY_TYPES, ENTITY_COLORS } from '../lib/graph-colors'

export function GraphLegend() {
  const { t } = useTranslation('graph')

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow">
      <div className="flex items-center gap-4">
        {ENTITY_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: ENTITY_COLORS[type] }}
              data-testid={`legend-color-${type}`}
            />
            <span className="text-xs text-muted-foreground">
              {t(`view.types.${type}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
