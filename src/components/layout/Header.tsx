import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { Settings, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { BackendStatus } from './BackendStatus'

const routeNameKeys: Record<string, { ns: string; key: string }> = {
  '/': { ns: 'navigation', key: 'dashboard' },
  '/settings': { ns: 'navigation', key: 'settings' },
}

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const currentRoute = routeNameKeys[location.pathname]
  const pageName = currentRoute
    ? t(currentRoute.key, { ns: currentRoute.ns })
    : location.pathname.slice(1)

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center border-b bg-background px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Logo */}
      <span className="text-[15px] font-semibold">
        {t('appTitle', { ns: 'common' })}
      </span>

      {/* Breadcrumb center */}
      <div className="mx-4 hidden flex-1 sm:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/')
                }}
              >
                {t('breadcrumb.home', { ns: 'navigation' })}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== '/' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Spacer for when breadcrumb is hidden on mobile */}
      <div className="flex-1 sm:hidden" />

      {/* Right group */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              aria-label={t('settings', { ns: 'common' })}
            >
              <Settings className="size-[18px]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('settings', { ns: 'common' })}</TooltipContent>
        </Tooltip>
        <BackendStatus />
      </div>
    </header>
  )
}
