import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** prefers-reduced-motion leído de forma síncrona y reactiva. */
export function useReduced(): boolean {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
