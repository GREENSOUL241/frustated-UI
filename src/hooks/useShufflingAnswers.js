import { useState, useEffect } from 'react'
import { playTaunt } from './sounds'
import { useGame } from '../context/GameContext'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useShufflingAnswers(options) {
  const [current, setCurrent] = useState(() => shuffle(options))
  const [shuffleClass, setShuffleClass] = useState(null)
  const { addFrustration } = useGame()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => {
        const next = shuffle(prev)
        if (next[0] !== prev[0]) {
          playTaunt('slow')
          addFrustration(1)
          setShuffleClass('shuffling')
          setTimeout(() => setShuffleClass(null), 300)
        }
        return next
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [addFrustration])

  return { answers: current, shuffleClass }
}
