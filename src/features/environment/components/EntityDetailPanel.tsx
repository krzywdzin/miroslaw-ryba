import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

interface Entity {
  uuid: string
  name: string
  type: string
  description?: string
}

interface Relationship {
  name: string
  relation: string
  direction: 'incoming' | 'outgoing'
}

interface EntityDetailPanelProps {
  entity: Entity | null
  relationships: Relationship[]
  onClose: () => void
}

export function EntityDetailPanel({
  entity,
  relationships,
  onClose,
}: EntityDetailPanelProps) {
  const { t } = useTranslation('environment')

  return (
    <Sheet open={!!entity} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="overflow-y-auto" data-testid="entity-detail-panel">
        {entity && (
          <>
            <SheetHeader>
              <SheetTitle data-testid="entity-detail-name">
                {entity.name}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {t('entities.detail.title')}
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 space-y-6">
              <div>
                <Badge variant="outline" className="border-2">
                  {entity.type}
                </Badge>
              </div>

              {entity.description && (
                <p className="text-sm text-muted-foreground">
                  {entity.description}
                </p>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                  {t('entities.detail.relationships')}
                </h4>
                {relationships.length > 0 ? (
                  <ul className="space-y-2" data-testid="entity-relationships">
                    {relationships.map((rel, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {rel.direction === 'outgoing' ? '\u2192' : '\u2190'}
                        </span>
                        <span className="font-medium">{rel.name}</span>
                        {rel.relation && (
                          <span className="text-xs text-muted-foreground">
                            ({rel.relation})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="entity-no-relationships"
                  >
                    {t('entities.detail.noRelationships')}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
