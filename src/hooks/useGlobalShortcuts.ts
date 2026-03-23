import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useHotkeys } from 'react-hotkeys-hook'

const HOTKEY_OPTIONS = { enableOnFormTags: false as const }

export function useGlobalShortcuts() {
  const navigate = useNavigate()
  const [helpOpen, setHelpOpen] = useState(false)

  useHotkeys('1', () => navigate('/graph'), HOTKEY_OPTIONS)
  useHotkeys('2', () => navigate('/environment'), HOTKEY_OPTIONS)
  useHotkeys('3', () => navigate('/simulation'), HOTKEY_OPTIONS)
  useHotkeys('4', () => navigate('/history'), HOTKEY_OPTIONS)
  useHotkeys('5', () => navigate('/chat'), HOTKEY_OPTIONS)

  useHotkeys(
    '/',
    (e) => {
      e.preventDefault()
      const el = document.querySelector<HTMLElement>('[data-chat-input]')
      el?.focus()
    },
    HOTKEY_OPTIONS
  )

  useHotkeys('shift+/', () => setHelpOpen(true), HOTKEY_OPTIONS)

  useHotkeys(
    '[',
    () => window.dispatchEvent(new CustomEvent('panel-prev')),
    HOTKEY_OPTIONS
  )

  useHotkeys(
    ']',
    () => window.dispatchEvent(new CustomEvent('panel-next')),
    HOTKEY_OPTIONS
  )

  return { helpOpen, setHelpOpen }
}
