import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Key, Bot, SlidersHorizontal, Cloud, Container } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'api-keys', icon: Key, labelKey: 'nav.apiKeys' },
  { id: 'model-selection', icon: Bot, labelKey: 'nav.modelSelection' },
  { id: 'simulation', icon: SlidersHorizontal, labelKey: 'nav.simulation' },
  { id: 'zep-cloud', icon: Cloud, labelKey: 'nav.zepCloud' },
  { id: 'docker', icon: Container, labelKey: 'nav.docker' },
] as const

export function SectionNav() {
  const { t } = useTranslation('settings')
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    const headings = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[]

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function handleClick(sectionId: string) {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', `#${sectionId}`)
    }
  }

  return (
    <nav
      className="sticky top-[88px] hidden w-[200px] shrink-0 xl:block"
      aria-label={t('pageTitle')}
    >
      <ul className="space-y-1">
        {SECTIONS.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors duration-150',
                  isActive
                    ? 'border-l-2 border-primary text-primary'
                    : 'border-l-2 border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {t(section.labelKey)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
