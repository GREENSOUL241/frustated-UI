import { useState, useEffect } from 'react'
import { playFakeLoading, playTaunt } from '../hooks/sounds'
import styles from './FakeLoader.module.css'

const FAKE_MESSAGES = [
  'Loading your experience...',
  'Preparing questions...',
  'Calibrating difficulty...',
  'Almost there...',
  'Finalizing...',
  'Just a sec...',
  'Verifying your patience...',
]

export default function FakeLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [cancelled, setCancelled] = useState(false)
  const [msg, setMsg] = useState('Loading your experience...')

  useEffect(() => {
    playFakeLoading()
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 8 + 3
      if (p >= 99) {
        p = 99
        clearInterval(interval)
        setMsg('99% — wrapping up!')
        setTimeout(() => {
          setCancelled(true)
          playTaunt('slow')
          setMsg('An error occurred. Please try again.')
          setTimeout(() => onComplete(), 2000)
        }, 2500)
      } else {
        setMsg(FAKE_MESSAGES[Math.floor(p / 15)] || 'Almost there...')
      }
      setProgress(Math.min(p, 99))
    }, 180)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.spinnerRing} />
        <p className={styles.msg}>{msg}</p>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{
              width: `${progress}%`,
              background: cancelled ? '#ff4fa3' : '#40e0ff'
            }}
          />
        </div>
        <span className={styles.pct}>{Math.floor(progress)}%</span>
        {cancelled && (
          <p className={styles.error}>❌ Loading failed. Restarting...</p>
        )}
      </div>
    </div>
  )
}
