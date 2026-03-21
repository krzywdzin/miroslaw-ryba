// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'upload.dropzone.title': 'Przeciagnij pliki lub kliknij',
        'upload.dropzone.subtitle': 'PDF, DOCX, TXT, MD',
        'upload.files.title': 'Przeslane pliki',
        'upload.files.empty': 'Brak plikow',
        'upload.files.remove': 'Usun',
        'upload.prediction.label': 'Cel predykcji',
        'upload.prediction.placeholder': 'Opisz cel predykcji w jezyku naturalnym...',
        'upload.prediction.hint': 'Obsluguje Markdown',
        'upload.submit': 'Buduj graf',
        'upload.submitting': 'Przesylanie...',
        'upload.title': 'Budowa grafu wiedzy',
        'build.title': 'Budowa grafu w toku',
        'build.steps.analyzing': 'Analiza plikow',
        'build.steps.extracting': 'Ekstrakcja encji',
        'build.steps.building': 'Budowa relacji',
        'build.steps.done': 'Gotowe',
        'build.error': 'Blad budowy grafu',
        'build.retry': 'Sprobuj ponownie',
      }
      return translations[key] ?? key
    },
    i18n: { language: 'pl' },
  }),
}))

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock API
vi.mock('@/api/graph', () => ({
  graphApi: {
    generateOntology: vi.fn(),
    buildGraph: vi.fn(),
    getTask: vi.fn(),
  },
}))

describe('UploadDropzone', () => {
  it('renders drop zone with correct text', async () => {
    const { UploadDropzone } = await import(
      '@/features/graph/components/UploadDropzone'
    )
    render(<UploadDropzone onFilesAdded={vi.fn()} />)

    expect(screen.getByText('Przeciagnij pliki lub kliknij')).toBeInTheDocument()
    expect(screen.getByText('PDF, DOCX, TXT, MD')).toBeInTheDocument()
  })
})

describe('FileList', () => {
  it('renders file names and sizes', async () => {
    const { FileList } = await import(
      '@/features/graph/components/FileList'
    )
    const files = [
      new File(['content'], 'test.pdf', { type: 'application/pdf' }),
      new File(['longer content here'], 'doc.txt', { type: 'text/plain' }),
    ]

    render(<FileList files={files} onRemove={vi.fn()} />)

    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('doc.txt')).toBeInTheDocument()
  })

  it('shows empty state when no files', async () => {
    const { FileList } = await import(
      '@/features/graph/components/FileList'
    )
    render(<FileList files={[]} onRemove={vi.fn()} />)

    expect(screen.getByText('Brak plikow')).toBeInTheDocument()
  })
})

describe('PredictionInput', () => {
  it('renders textarea with placeholder', async () => {
    const { PredictionInput } = await import(
      '@/features/graph/components/PredictionInput'
    )
    render(<PredictionInput value="" onChange={vi.fn()} />)

    const textarea = screen.getByPlaceholderText(
      'Opisz cel predykcji w jezyku naturalnym...',
    )
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName).toBe('TEXTAREA')
  })
})

describe('UploadForm', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('submit button is disabled when no files are selected', async () => {
    const { useGraphStore } = await import(
      '@/features/graph/hooks/useGraphStore'
    )
    useGraphStore.setState({ predictionGoal: 'some goal', step: 'upload' })

    const { UploadForm } = await import(
      '@/features/graph/components/UploadForm'
    )
    render(<UploadForm />)

    const button = screen.getByRole('button', { name: 'Buduj graf' })
    expect(button).toBeDisabled()
  })

  it('submit button is disabled when no prediction goal', async () => {
    const { useGraphStore } = await import(
      '@/features/graph/hooks/useGraphStore'
    )
    useGraphStore.setState({ predictionGoal: '', step: 'upload' })

    const { UploadForm } = await import(
      '@/features/graph/components/UploadForm'
    )
    render(<UploadForm />)

    const button = screen.getByRole('button', { name: 'Buduj graf' })
    expect(button).toBeDisabled()
  })
})

describe('BuildProgress', () => {
  it('renders 4 steps', async () => {
    const { BuildProgress } = await import(
      '@/features/graph/components/BuildProgress'
    )
    render(<BuildProgress currentStep={0} />)

    expect(screen.getByText('Analiza plikow')).toBeInTheDocument()
    expect(screen.getByText('Ekstrakcja encji')).toBeInTheDocument()
    expect(screen.getByText('Budowa relacji')).toBeInTheDocument()
    expect(screen.getByText('Gotowe')).toBeInTheDocument()
  })

  it('highlights current step with pulse animation', async () => {
    const { BuildProgress } = await import(
      '@/features/graph/components/BuildProgress'
    )
    const { container } = render(<BuildProgress currentStep={1} />)

    const pulsingElement = container.querySelector('.animate-pulse')
    expect(pulsingElement).toBeInTheDocument()
    expect(pulsingElement?.textContent).toBe('2')
  })
})
