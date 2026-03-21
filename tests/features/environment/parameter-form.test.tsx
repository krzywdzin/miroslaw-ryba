import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ParameterSummary } from '@/features/environment/components/ParameterSummary'
import { LaunchConfirmDialog } from '@/features/environment/components/LaunchConfirmDialog'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'parameters.summary.agents': 'Agenci',
        'parameters.summary.rounds': 'Rundy',
        'parameters.summary.platforms': 'Platformy',
        'parameters.adjust': 'Dostosuj',
        'parameters.twitter': 'Twitter',
        'parameters.reddit': 'Reddit',
        'parameters.agentCount': 'Liczba agentow',
        'parameters.maxRounds': 'Maksymalna liczba rund',
        'parameters.platformError': 'Wybierz co najmniej jedna platforme',
        'launch.button': 'Uruchom symulacje',
        'launch.confirm.title': 'Potwierdzenie uruchomienia',
        'launch.confirm.description':
          'Czy na pewno chcesz uruchomic symulacje z ponizszymi parametrami?',
        'launch.confirm.action': 'Uruchom',
        'launch.confirm.cancel': 'Anuluj',
      }
      return translations[key] ?? key
    },
  }),
}))

// Mock Radix portals for AlertDialog
vi.mock('@radix-ui/react-alert-dialog', async () => {
  const actual =
    await vi.importActual<Record<string, unknown>>(
      '@radix-ui/react-alert-dialog',
    )
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

const defaultParams = {
  agentCount: 10,
  maxRounds: 5,
  enableTwitter: true,
  enableReddit: true,
}

describe('ParameterSummary', () => {
  it('renders agent count, round count, and platform names', () => {
    render(<ParameterSummary values={defaultParams} onEdit={vi.fn()} />)

    expect(screen.getByTestId('parameter-summary')).toHaveTextContent('10')
    expect(screen.getByTestId('parameter-summary')).toHaveTextContent('5')
    expect(screen.getByTestId('parameter-summary')).toHaveTextContent(
      'Twitter + Reddit',
    )
  })

  it('calls onEdit when Dostosuj clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<ParameterSummary values={defaultParams} onEdit={onEdit} />)

    await user.click(screen.getByTestId('adjust-button'))
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it('shows only enabled platforms', () => {
    render(
      <ParameterSummary
        values={{ ...defaultParams, enableReddit: false }}
        onEdit={vi.fn()}
      />,
    )

    expect(screen.getByTestId('parameter-summary')).toHaveTextContent('Twitter')
    expect(screen.getByTestId('parameter-summary')).not.toHaveTextContent(
      'Reddit',
    )
  })
})

describe('LaunchConfirmDialog', () => {
  it('renders CTA button text', () => {
    render(
      <LaunchConfirmDialog
        params={defaultParams}
        onConfirm={vi.fn()}
        disabled={false}
      />,
    )

    expect(screen.getByTestId('launch-button')).toHaveTextContent(
      'Uruchom symulacje',
    )
  })

  it('disables button when disabled prop is true', () => {
    render(
      <LaunchConfirmDialog
        params={defaultParams}
        onConfirm={vi.fn()}
        disabled={true}
      />,
    )

    expect(screen.getByTestId('launch-button')).toBeDisabled()
  })
})
