import { useCallback, useEffect, useRef, useState } from 'react'
import { AD_POOL } from '../../data/questions'
import { useXP } from '../../hooks/useXP'
import FloatingAd from '../FloatingAd/FloatingAd'

function createAd() {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    adIndex: Math.floor(Math.random() * AD_POOL.length),
  }
}

export default function AdManager() {
  const { addXP } = useXP()
  const [ads, setAds] = useState(() => Array.from({ length: 3 }, createAd))
  const timeoutIds = useRef(new Set())

  useEffect(() => () => {
    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutIds.current.clear()
  }, [])

  const closeAd = useCallback((id) => {
    addXP(10, 'Closed an ad')
    setAds((current) => current.filter((ad) => ad.id !== id))

    const timeoutId = window.setTimeout(() => {
      setAds((current) => (current.length >= 3 ? current : [...current, createAd()]))
      timeoutIds.current.delete(timeoutId)
    }, 900)

    timeoutIds.current.add(timeoutId)
  }, [addXP])

  return (
    <>
      {ads.map((ad) => (
        <FloatingAd key={ad.id} adId={ad.id} adIndex={ad.adIndex} onClose={closeAd} />
      ))}
    </>
  )
}
