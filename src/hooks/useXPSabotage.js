import { useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { playXPDeduct, playTaunt } from './sounds'
import { showFloatingMessage } from './floatingMessage'

const DEDUCT_REASONS = [
  'inactivity fee',
  'breathing tax',
  'existing in this app',
  'looking at the screen wrong',
  'vibes were off',
  'server maintenance surcharge',
  'you blinked',
  'terms of service violation §47(b)',
  'the algorithm decided',
  'ambient frustration levy',
  'cursor was moving suspiciously',
  'premium air usage fee',
  'anti-fun clause activated',
]

export function useXPSabotage() {
  const { state, dispatch } = useGame()

  useEffect(() => {
    if (!state.username) return

    function scheduleDeduction() {
      const delay = 25000 + Math.random() * 20000
      return setTimeout(() => {
        const amount = 5 + Math.floor(Math.random() * 11)
        dispatch({ type: 'ADD_XP', amount: -amount })
        playXPDeduct()
        playTaunt('deduct')
        showFloatingMessage(
          `-${amount} XP: ${DEDUCT_REASONS[Math.floor(Math.random() * DEDUCT_REASONS.length)]}`,
          { type: 'deduction' }
        )
        scheduleDeduction()
      }, delay)
    }

    const t = scheduleDeduction()
    return () => clearTimeout(t)
  }, [state.username, dispatch])
}
