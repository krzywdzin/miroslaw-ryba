import { useState, useEffect, useCallback, type RefObject } from 'react'

export function useScrollAnchor(scrollRef: RefObject<HTMLDivElement | null>) {
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handler = () => {
      setIsAtTop(el.scrollTop < 50)
    }

    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [scrollRef])

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [scrollRef])

  return { isAtTop, scrollToTop }
}
