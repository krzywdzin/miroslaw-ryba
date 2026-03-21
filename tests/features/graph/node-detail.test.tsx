import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NodeDetailPanel } from '@/features/graph/components/NodeDetailPanel'
import { GraphToolbar } from '@/features/graph/components/GraphToolbar'
import { GraphLegend } from '@/features/graph/components/GraphLegend'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'view.detail.title': 'Szczegoly',
        'view.detail.type': 'Typ',
        'view.detail.relationships': 'Relacje',
        'view.toolbar.search': 'Szukaj wezlow...',
        'view.toolbar.fitToScreen': 'Dopasuj do ekranu',
        'view.types.person': 'Osoby',
        'view.types.organization': 'Organizacje',
        'view.types.location': 'Miejsca',
        'view.types.event': 'Wydarzenia',
      }
      return translations[key] ?? key
    },
  }),
}))

describe('NodeDetailPanel', () => {
  const mockNode = {
    id: '1',
    label: 'Alice',
    data: { type: 'person', name: 'Alice' },
  }

  const mockEdges = [
    { id: '1-2-0', source: '1', target: '2', label: 'works_at' },
    { id: '3-1-0', source: '3', target: '1', label: 'knows' },
  ]

  const mockNodes = [
    { id: '1', label: 'Alice' },
    { id: '2', label: 'Acme Corp' },
    { id: '3', label: 'Bob' },
  ]

  it('renders node name when node provided', () => {
    render(
      <NodeDetailPanel
        node={mockNode}
        allNodes={mockNodes}
        edges={mockEdges}
        onClose={() => {}}
      />,
    )
    expect(screen.getByTestId('node-detail-name')).toHaveTextContent('Alice')
  })

  it('renders type badge with correct text', () => {
    render(
      <NodeDetailPanel
        node={mockNode}
        allNodes={mockNodes}
        edges={mockEdges}
        onClose={() => {}}
      />,
    )
    expect(screen.getByTestId('node-detail-type')).toHaveTextContent('Osoby')
  })

  it('lists connected relationships', () => {
    render(
      <NodeDetailPanel
        node={mockNode}
        allNodes={mockNodes}
        edges={mockEdges}
        onClose={() => {}}
      />,
    )
    const list = screen.getByTestId('node-relationships')
    expect(list.querySelectorAll('li')).toHaveLength(2)
    expect(list).toHaveTextContent('Acme Corp')
    expect(list).toHaveTextContent('Bob')
  })

  it('shows empty state when no relationships', () => {
    render(
      <NodeDetailPanel
        node={mockNode}
        allNodes={mockNodes}
        edges={[]}
        onClose={() => {}}
      />,
    )
    expect(screen.getByTestId('node-no-relationships')).toBeInTheDocument()
  })
})

describe('GraphToolbar', () => {
  const mockFilters = {
    activeTypes: new Set(['person', 'organization', 'location', 'event']),
    searchQuery: '',
    toggleType: vi.fn(),
    setSearchQuery: vi.fn(),
    getFilteredData: vi.fn(),
  }

  it('renders search input with correct placeholder', () => {
    render(
      <GraphToolbar
        filters={mockFilters}
        onFitToScreen={() => {}}
      />,
    )
    expect(screen.getByTestId('graph-search')).toHaveAttribute(
      'placeholder',
      'Szukaj wezlow...',
    )
  })

  it('renders entity type filter checkboxes', () => {
    render(
      <GraphToolbar
        filters={mockFilters}
        onFitToScreen={() => {}}
      />,
    )
    expect(screen.getByTestId('filter-person')).toBeInTheDocument()
    expect(screen.getByTestId('filter-organization')).toBeInTheDocument()
    expect(screen.getByTestId('filter-location')).toBeInTheDocument()
    expect(screen.getByTestId('filter-event')).toBeInTheDocument()
  })
})

describe('GraphLegend', () => {
  it('renders all entity type labels with colored indicators', () => {
    render(<GraphLegend />)
    expect(screen.getByTestId('legend-color-person')).toBeInTheDocument()
    expect(screen.getByTestId('legend-color-organization')).toBeInTheDocument()
    expect(screen.getByTestId('legend-color-location')).toBeInTheDocument()
    expect(screen.getByTestId('legend-color-event')).toBeInTheDocument()
    expect(screen.getByText('Osoby')).toBeInTheDocument()
    expect(screen.getByText('Organizacje')).toBeInTheDocument()
    expect(screen.getByText('Miejsca')).toBeInTheDocument()
    expect(screen.getByText('Wydarzenia')).toBeInTheDocument()
  })
})
