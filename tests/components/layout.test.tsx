import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { describe, it, expect } from 'vitest'
import i18n from '@/i18n/config'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Stepper } from '@/components/layout/Stepper'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </I18nextProvider>
    )
  }
}

describe('Stepper', () => {
  it('renders 5 pipeline stages', () => {
    render(<Stepper />, { wrapper: createWrapper() })

    expect(screen.getByText('Budowa grafu')).toBeInTheDocument()
    expect(screen.getByText('Środowisko')).toBeInTheDocument()
    expect(screen.getByText('Symulacja')).toBeInTheDocument()
    expect(screen.getByText('Raport')).toBeInTheDocument()
    expect(screen.getByText('Dialog')).toBeInTheDocument()
  })
})

describe('DashboardPage', () => {
  it('renders hero heading', () => {
    render(<DashboardPage />, { wrapper: createWrapper() })

    expect(
      screen.getByText('Witaj w Miroslaw Ryba'),
    ).toBeInTheDocument()
  })

  it('renders system status and empty state sections', () => {
    render(<DashboardPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Status systemu')).toBeInTheDocument()
    expect(screen.getByText('Ostatnie symulacje')).toBeInTheDocument()
    expect(screen.getByText('Brak symulacji')).toBeInTheDocument()
  })

  it('renders quick-start button', () => {
    render(<DashboardPage />, { wrapper: createWrapper() })

    expect(
      screen.getByRole('button', { name: 'Rozpocznij predykcję' }),
    ).toBeInTheDocument()
  })
})

describe('LanguageSwitcher', () => {
  it('changes language when clicking English option', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <LanguageSwitcher />
        <DashboardPage />
      </div>,
      { wrapper: createWrapper() },
    )

    // Start in Polish
    expect(screen.getByText('Witaj w Miroslaw Ryba')).toBeInTheDocument()

    // Open dropdown and click English
    const trigger = screen.getByRole('button', { name: 'Język' })
    await user.click(trigger)
    const englishOption = screen.getByText('English')
    await user.click(englishOption)

    // Verify text changed to English
    expect(screen.getByText('Welcome to Miroslaw Ryba')).toBeInTheDocument()

    // Reset back to Polish for other tests
    await i18n.changeLanguage('pl')
  })
})
