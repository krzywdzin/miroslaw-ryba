import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ENTITY_COLORS } from '../lib/graph-colors'
import type { GraphEdge } from 'reagraph'

interface NodeData {
  id: string
  label: string
  data: { type?: string; name: string }
}

interface NodeDetailPanelProps {
  node: NodeData | null
  allNodes: Array<{ id: string; label?: string }>
  edges: GraphEdge[]
  onClose: () => void
}

export function NodeDetailPanel({
  node,
  allNodes,
  edges,
  onClose,
}: NodeDetailPanelProps) {
  const { t } = useTranslation('graph')

  const relationships = node
    ? edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          const otherId = e.source === node.id ? e.target : e.source
          const otherNode = allNodes.find((n) => n.id === otherId)
          return {
            name: otherNode?.label ?? otherId,
            relation: e.label ?? '',
            direction: e.source === node.id ? 'outgoing' : 'incoming',
          }
        })
    : []

  return (
    <Sheet open={!!node} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="overflow-y-auto">
        {node && (
          <>
            <SheetHeader>
              <SheetTitle data-testid="node-detail-name">
                {node.data.name}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {t('view.detail.title')}
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                  {t('view.detail.type')}
                </h4>
                <Badge
                  variant="outline"
                  className="border-2"
                  style={{
                    borderColor: ENTITY_COLORS[node.data.type ?? 'default'],
                    color: ENTITY_COLORS[node.data.type ?? 'default'],
                  }}
                  data-testid="node-detail-type"
                >
                  {node.data.type
                    ? t(`view.types.${node.data.type}`)
                    : node.data.type}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                  {t('view.detail.relationships')}
                </h4>
                {relationships.length > 0 ? (
                  <ul className="space-y-2" data-testid="node-relationships">
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
                    data-testid="node-no-relationships"
                  >
                    Brak relacji
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
