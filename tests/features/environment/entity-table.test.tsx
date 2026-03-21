import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EntityTable } from '@/features/environment/components/EntityTable'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'entities.title': 'Encje i relacje',
        'entities.columns.name': 'Nazwa',
        'entities.columns.type': 'Typ',
        'entities.columns.relationships': 'Relacje',
        'entities.filter.all': 'Wszystkie typy',
        'entities.filter.placeholder': 'Filtruj po typie...',
        'entities.empty': 'Brak encji',
        'entities.detail.title': 'Szczegoly encji',
        'entities.detail.relationships': 'Relacje',
        'entities.detail.noRelationships': 'Brak relacji',
      }
      return translations[key] ?? key
    },
  }),
}))

// Mock Radix portals for Sheet/Select
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

const mockEntities = [
  { uuid: '1', name: 'Alice', type: 'person', description: 'A person' },
  { uuid: '2', name: 'Acme Corp', type: 'organization', description: 'A company' },
  { uuid: '3', name: 'Bob', type: 'person' },
  { uuid: '4', name: 'Warsaw', type: 'location' },
]

const mockEntityTypes = ['person', 'organization', 'location']

const mockRelationshipCounts: Record<string, number> = {
  '1': 3,
  '2': 1,
  '3': 2,
  '4': 0,
}

describe('EntityTable', () => {
  it('renders entity rows with name and type columns', () => {
    render(
      <EntityTable
        entities={mockEntities}
        entityTypes={mockEntityTypes}
        isLoading={false}
        relationshipCounts={mockRelationshipCounts}
      />,
    )

    const rows = screen.getAllByTestId('entity-row')
    expect(rows).toHaveLength(4)

    // Default sort by name asc: Acme Corp, Alice, Bob, Warsaw
    expect(rows[0]).toHaveTextContent('Acme Corp')
    expect(rows[1]).toHaveTextContent('Alice')
    expect(rows[2]).toHaveTextContent('Bob')
    expect(rows[3]).toHaveTextContent('Warsaw')
  })

  it('sorts by name column toggling order', async () => {
    const user = userEvent.setup()
    render(
      <EntityTable
        entities={mockEntities}
        entityTypes={mockEntityTypes}
        isLoading={false}
        relationshipCounts={mockRelationshipCounts}
      />,
    )

    // Default is asc by name
    let rows = screen.getAllByTestId('entity-row')
    expect(rows[0]).toHaveTextContent('Acme Corp')

    // Click name sort to toggle to desc
    await user.click(screen.getByTestId('sort-name'))
    rows = screen.getAllByTestId('entity-row')
    expect(rows[0]).toHaveTextContent('Warsaw')
  })

  it('sorts by type column', async () => {
    const user = userEvent.setup()
    render(
      <EntityTable
        entities={mockEntities}
        entityTypes={mockEntityTypes}
        isLoading={false}
        relationshipCounts={mockRelationshipCounts}
      />,
    )

    await user.click(screen.getByTestId('sort-type'))
    const rows = screen.getAllByTestId('entity-row')
    // location < organization < person
    expect(rows[0]).toHaveTextContent('Warsaw')
  })

  it('shows empty state when no entities', () => {
    render(
      <EntityTable
        entities={[]}
        entityTypes={[]}
        isLoading={false}
      />,
    )

    expect(screen.getByTestId('entity-empty')).toHaveTextContent('Brak encji')
  })

  it('renders loading skeleton when loading', () => {
    render(
      <EntityTable
        entities={[]}
        entityTypes={[]}
        isLoading={true}
      />,
    )

    // LoadingSkeleton renders Skeleton divs, no table rows
    expect(screen.queryByTestId('entity-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('entity-empty')).not.toBeInTheDocument()
  })

  it('clicking row opens entity detail panel', async () => {
    const user = userEvent.setup()
    render(
      <EntityTable
        entities={mockEntities}
        entityTypes={mockEntityTypes}
        isLoading={false}
        relationshipCounts={mockRelationshipCounts}
        relationshipsMap={{
          '1': [{ name: 'Acme Corp', relation: 'works_at', direction: 'outgoing' }],
        }}
      />,
    )

    const rows = screen.getAllByTestId('entity-row')
    // Click Alice (second row in default name sort)
    await user.click(rows[1])

    expect(screen.getByTestId('entity-detail-name')).toHaveTextContent('Alice')
  })

  it('shows relationship count from props', () => {
    render(
      <EntityTable
        entities={mockEntities}
        entityTypes={mockEntityTypes}
        isLoading={false}
        relationshipCounts={mockRelationshipCounts}
      />,
    )

    const rows = screen.getAllByTestId('entity-row')
    // Alice (second row in default sort) has 3 relationships
    const aliceRow = rows[1]
    const cells = within(aliceRow).getAllByRole('cell')
    expect(cells[2]).toHaveTextContent('3')
  })

  it('shows dash for entities without relationship counts', () => {
    render(
      <EntityTable
        entities={mockEntities}
        entityTypes={mockEntityTypes}
        isLoading={false}
      />,
    )

    const rows = screen.getAllByTestId('entity-row')
    const cells = within(rows[0]).getAllByRole('cell')
    expect(cells[2]).toHaveTextContent('-')
  })
})
