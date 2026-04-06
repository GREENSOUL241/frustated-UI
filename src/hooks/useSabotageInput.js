import { useEffect, useRef } from 'react'
import { playTaunt } from './sounds'
import { showFloatingMessage } from './floatingMessage'
import { useGame } from '../context/GameContext'

const CLEAR_MESSAGES = [
  'oops! field cleared itself 🙂',
  'fingers slipped!',
  'autocorrect strikes again',
  'did you even type that?',
  '404: your text not found',
  'the field got bored',
]

export function useSabotageInput(value, onChange, options = {}) {
  const timerRef = useRef()
  const scrambleRef = useRef()
  const isUsername = options.isUsername ?? false
  const { addFrustration } = useGame()

  useEffect(() => {
    if (!value) {
      clearTimeout(timerRef.current)
      clearTimeout(scrambleRef.current)
      return
    }

    clearTimeout(timerRef.current)
    clearTimeout(scrambleRef.current)

    // Clear after random interval between 4s and 9s
    timerRef.current = setTimeout(() => {
      if (value.length > 0) {
        onChange('')
        playTaunt('slow')
        showFloatingMessage(CLEAR_MESSAGES[Math.floor(Math.random() * CLEAR_MESSAGES.length)])
        addFrustration(2)
      }
    }, 4000 + Math.random() * 5000)

    // Username-specific: scramble last 2 chars before clearing
    if (isUsername) {
      scrambleRef.current = setTimeout(() => {
        if (value.length > 0) {
          const scrambled = value.slice(0, -2) + String.fromCharCode(97 + Math.random() * 26, 97 + Math.random() * 26)
          onChange(scrambled)
        }
      }, 6000 + Math.random() * 3000)
    }

    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(scrambleRef.current)
    }
  }, [value, onChange, isUsername, addFrustration])
}
