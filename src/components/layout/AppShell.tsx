import { useState } from 'react'
import { Outlet } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { SidebarMobile } from './SidebarMobile'
import { Footer } from './Footer'
import { MinScreenMessage } from '@/components/shared/MinScreenMessage'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'
import { ShortcutsHelpModal } from '@/components/shared/ShortcutsHelpModal'

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { helpOpen, setHelpOpen } = useGlobalShortcuts()

  return (
    <div className="flex min-h-screen flex-col">
      <MinScreenMessage />
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex flex-1">
        <Sidebar />
        <SidebarMobile
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
        <main className="flex-1 p-8">
          <div className="transition-opacity duration-150 ease-out">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 5000 }}
        visibleToasts={3}
        richColors
      />
      <ShortcutsHelpModal open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}
