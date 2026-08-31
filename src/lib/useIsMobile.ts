'use client'

import {useLayoutEffect, useState} from 'react'

const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}
