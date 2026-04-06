import { useState } from 'react'
import { showFloatingMessage } from '../hooks/floatingMessage'
import { playWrongBuzzer } from '../hooks/sounds'

export function FakeButton({ label, className }) {
  const [clickCount, setClickCount] = useState(0)

  function handleClick() {
    setClickCount(c => c + 1)
    if (clickCount === 2) {
      showFloatingMessage("that button doesn't do anything lol")
      playWrongBuzzer()
    }
    if (clickCount === 5) {
      showFloatingMessage('loading...')
      setTimeout(() => showFloatingMessage('just kidding'), 1200)
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  )
}
