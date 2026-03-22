import { useState, useEffect } from 'react'

export function useElapsedTime(startTime: number | null, isRunning: boolean): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime || !isRunning) {
      setElapsed(0)
      return
    }

    setElapsed(Math.floor((Date.now() - startTime) / 1000))

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, isRunning])

  return elapsed
}
