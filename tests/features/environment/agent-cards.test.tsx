import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgentProfileCard } from '@/features/environment/components/AgentProfileCard'
import { AgentProfileGrid } from '@/features/environment/components/AgentProfileGrid'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'agents.personality': 'Osobowosc',
        'agents.stance': 'Stanowisko',
        'agents.platform': 'Platforma',
        'agents.empty': 'Profile zostana wygenerowane po uruchomieniu',
        'agents.loading': 'Generowanie profili agentow...',
      }
      return translations[key] ?? key
    },
  }),
}))

const fullProfile = {
  agent_id: 'a1',
  name: 'Jan Kowalski',
  personality: 'Analityczny i spokojny',
  stance: 'Neutralny obserwator',
  platform: 'twitter',
}

const minimalProfile = {
  agent_id: 'a2',
  name: 'Anna Nowak',
}

describe('AgentProfileCard', () => {
  it('renders agent name', () => {
    render(<AgentProfileCard profile={fullProfile} />)
    expect(screen.getByTestId('agent-name')).toHaveTextContent('Jan Kowalski')
  })

  it('renders personality when present', () => {
    render(<AgentProfileCard profile={fullProfile} />)
    expect(screen.getByTestId('agent-personality')).toHaveTextContent(
      'Analityczny i spokojny',
    )
  })

  it('renders stance when present', () => {
    render(<AgentProfileCard profile={fullProfile} />)
    expect(screen.getByTestId('agent-stance')).toHaveTextContent(
      'Neutralny obserwator',
    )
  })

  it('renders platform badge when present', () => {
    render(<AgentProfileCard profile={fullProfile} />)
    expect(screen.getByTestId('agent-platform')).toHaveTextContent('twitter')
  })

  it('handles missing optional fields gracefully', () => {
    render(<AgentProfileCard profile={minimalProfile} />)
    expect(screen.getByTestId('agent-name')).toHaveTextContent('Anna Nowak')
    expect(screen.queryByTestId('agent-personality')).not.toBeInTheDocument()
    expect(screen.queryByTestId('agent-stance')).not.toBeInTheDocument()
    expect(screen.queryByTestId('agent-platform')).not.toBeInTheDocument()
  })
})

describe('AgentProfileGrid', () => {
  const profiles = [
    fullProfile,
    minimalProfile,
    { agent_id: 'a3', name: 'Piotr Wisniewski', platform: 'reddit' },
  ]

  it('renders cards for each profile', () => {
    render(
      <AgentProfileGrid
        profiles={profiles}
        isLoading={false}
        isPreparing={false}
      />,
    )
    const cards = screen.getAllByTestId('agent-card')
    expect(cards).toHaveLength(3)
  })

  it('shows loading state when isPreparing', () => {
    render(
      <AgentProfileGrid profiles={[]} isLoading={false} isPreparing={true} />,
    )
    expect(screen.getByTestId('agent-grid-loading')).toBeInTheDocument()
    expect(screen.getByText('Generowanie profili agentow...')).toBeInTheDocument()
  })

  it('shows empty message when no profiles and not preparing', () => {
    render(
      <AgentProfileGrid profiles={[]} isLoading={false} isPreparing={false} />,
    )
    expect(screen.getByTestId('agent-grid-empty')).toHaveTextContent(
      'Profile zostana wygenerowane po uruchomieniu',
    )
  })

  it('shows loading state when isLoading', () => {
    render(
      <AgentProfileGrid profiles={[]} isLoading={true} isPreparing={false} />,
    )
    expect(screen.getByTestId('agent-grid-loading')).toBeInTheDocument()
  })
})
