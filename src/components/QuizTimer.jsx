import { useState, useEffect, useRef } from 'react'
import { playTaunt } from '../hooks/sounds'
import styles from './QuizTimer.module.css'

export default function QuizTimer({ onExpire, frustrationScore = 0 }) {
  const [time, setTime] = useState(15)
  const [showTip, setShowTip] = useState(true)
  const timerRef = useRef()
  const RESET_TIME = 15
  const allowClickReset = frustrationScore >= 13

  function resetTimer() {
    setTime(RESET_TIME)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          onExpire()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    resetTimer()
    
    const onMove = () => {
      setTime(prev => {
        if (prev < RESET_TIME) playTaunt('reset')
        return RESET_TIME
      })
      resetTimer()
    }

    const onClick = () => {
      if (allowClickReset) {
        onMove()
      }
    }

    window.addEventListener('mousemove', onMove)
    if (allowClickReset) window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (allowClickReset) window.removeEventListener('click', onClick)
      clearInterval(timerRef.current)
    }
  }, [allowClickReset])

  const pct = (time / RESET_TIME) * 100
  const color = time > 10 ? '#40e0ff' : time > 5 ? '#f0e040' : '#ff4fa3'

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar} style={{ width: `${pct}%`, background: color }} />
      <span className={styles.label} style={{ color }}>
        {time}s {time === RESET_TIME ? (showTip && !allowClickReset ? '(move mouse to reset 😈)' : '') : '— hold still...'}
      </span>
      {showTip && !allowClickReset && (
        <div className={styles.tip}>Tip: keep your mouse still to start the timer</div>
      )}
    </div>
  )
}
