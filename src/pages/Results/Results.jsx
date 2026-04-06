import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../../context/GameContext'
import styles from './Results.module.css'

function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value))
}

export default function Results() {
  const navigate = useNavigate()
  const { state } = useGame()
  const result = state.lastQuizResult
  const buttonRef = useRef(null)
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 78 })

  useEffect(() => {
    if (!result) {
      navigate('/home', { replace: true })
    }
  }, [navigate, result])

  useEffect(() => {
    function handleMove(event) {
      const button = buttonRef.current
      if (!button) {
        return
      }

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = event.clientX - centerX
      const deltaY = event.clientY - centerY
      const distance = Math.hypot(deltaX, deltaY)

      if (distance < 110) {
        setButtonPos((current) => ({
          x: clamp(12, 88, current.x - deltaX * 0.16),
          y: clamp(18, 86, current.y - deltaY * 0.16),
        }))
      }
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  if (!result) {
    return null
  }

  const score = result.score ?? 0
  const snarky = ['Yikes.', 'Yikes.', 'Mid.', 'Mid.', 'Almost decent.', 'Impossible. Did you cheat?'][score]

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <p className={styles.kicker}>Quiz report</p>
        <h1 className={styles.score}>{score} / 5</h1>

        <div className={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={`${styles.star} ${index < score ? styles.starFilled : ''}`}
            />
          ))}
        </div>

        <p className={styles.snarky}>{snarky}</p>
        <p className={styles.xpLine}>
          +{result.xpEarned ?? 0} XP earned. Total: {state.xp} XP.
        </p>

        <button type="button" className={styles.dashBtn} onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={styles.rollBtn}
        style={{ left: `${buttonPos.x}%`, top: `${buttonPos.y}%` }}
        onClick={() => navigate('/home')}
      >
        Roll Again
      </button>
    </div>
  )
}
