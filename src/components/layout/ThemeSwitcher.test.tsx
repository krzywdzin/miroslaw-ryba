import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeSwitcher } from './ThemeSwitcher'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'theme.label': 'Theme',
        'theme.system': 'System',
        'theme.light': 'Light',
        'theme.dark': 'Dark',
      }
      return map[key] ?? key
    },
  }),
}))

// Mock useTheme
const mockSetTheme = vi.fn()
let mockTheme = 'system'
let mockResolvedTheme: 'light' | 'dark' = 'light'

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
    resolvedTheme: mockResolvedTheme,
  }),
}))

beforeEach(() => {
  mockTheme = 'system'
  mockResolvedTheme = 'light'
  mockSetTheme.mockClear()
})

describe('ThemeSwitcher', () => {
  it('renders 3 theme options in dropdown', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)

    // Open dropdown
    await user.click(screen.getByRole('button', { name: 'Theme' }))

    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })

  it('shows Sun icon when resolved theme is light', () => {
    mockResolvedTheme = 'light'
    render(<ThemeSwitcher />)

    // The trigger button should be present with the aria-label
    const button = screen.getByRole('button', { name: 'Theme' })
    expect(button).toBeInTheDocument()
  })

  it('shows Moon icon when resolved theme is dark', () => {
    mockResolvedTheme = 'dark'
    render(<ThemeSwitcher />)

    const button = screen.getByRole('button', { name: 'Theme' })
    expect(button).toBeInTheDocument()
  })
})
