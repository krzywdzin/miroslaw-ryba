import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { EntityDetailPanel } from './EntityDetailPanel'

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

type SortField = 'name' | 'type' | 'relationshipCount'
type SortDir = 'asc' | 'desc'

interface EntityTableProps {
  entities: Entity[]
  entityTypes: string[]
  isLoading: boolean
  relationshipCounts?: Record<string, number>
  relationshipsMap?: Record<string, Relationship[]>
}

export function EntityTable({
  entities,
  entityTypes,
  isLoading,
  relationshipCounts,
  relationshipsMap,
}: EntityTableProps) {
  const { t } = useTranslation('environment')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortedEntities = useMemo(() => {
    let filtered =
      typeFilter === 'all'
        ? entities
        : entities.filter((e) => e.type === typeFilter)

    return [...filtered].sort((a, b) => {
      let cmp: number
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (sortField === 'type') {
        cmp = a.type.localeCompare(b.type)
      } else {
        const countA = relationshipCounts?.[a.uuid] ?? 0
        const countB = relationshipCounts?.[b.uuid] ?? 0
        cmp = countA - countB
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [entities, sortField, sortDir, typeFilter, relationshipCounts])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sortDir === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  if (isLoading) {
    return <LoadingSkeleton variant="list" lines={5} />
  }

  const selectedRelationships = selectedEntity
    ? (relationshipsMap?.[selectedEntity.uuid] ?? [])
    : []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
        >
          <SelectTrigger className="w-[200px]" data-testid="type-filter">
            <SelectValue placeholder={t('entities.filter.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('entities.filter.all')}</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sortedEntities.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center" data-testid="entity-empty">
          {t('entities.empty')}
        </p>
      ) : (
        <Table data-testid="entity-table">
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort('name')}
                  data-testid="sort-name"
                >
                  {t('entities.columns.name')}
                  <SortIcon field="name" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort('type')}
                  data-testid="sort-type"
                >
                  {t('entities.columns.type')}
                  <SortIcon field="type" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort('relationshipCount')}
                  data-testid="sort-relationships"
                >
                  {t('entities.columns.relationships')}
                  <SortIcon field="relationshipCount" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntities.map((entity) => (
              <TableRow
                key={entity.uuid}
                className="cursor-pointer"
                onClick={() => setSelectedEntity(entity)}
                data-testid="entity-row"
              >
                <TableCell className="font-medium">{entity.name}</TableCell>
                <TableCell>{entity.type}</TableCell>
                <TableCell>
                  {relationshipCounts?.[entity.uuid] ?? '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EntityDetailPanel
        entity={selectedEntity}
        relationships={selectedRelationships}
        onClose={() => setSelectedEntity(null)}
      />
    </div>
  )
}
