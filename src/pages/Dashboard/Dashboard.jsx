import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import XPBar from '../../components/XPBar/XPBar'
import { useGame } from '../../context/GameContext'
import styles from './Dashboard.module.css'

function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value))
}

function useGhostCursor() {
  const [ghostPos, setGhostPos] = useState({ x: -120, y: -120 })
  const trail = useRef([])

  useEffect(() => {
    function handleMove(event) {
      trail.current.push({ x: event.clientX, y: event.clientY })
      if (trail.current.length > 12) {
        trail.current.shift()
      }

      const delayed = trail.current[0]
      if (delayed) {
        setGhostPos({ x: delayed.x + 8, y: delayed.y + 8 })
      }
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return ghostPos
}

function useFlicker(value) {
  const [display, setDisplay] = useState(value)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setDisplay(value)
  }, [value])

  useEffect(() => () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function flicker() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    setDisplay(Math.floor(Math.random() * 999))
    timeoutRef.current = window.setTimeout(() => {
      setDisplay(value)
    }, 80)
  }

  return [display, flicker]
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { state } = useGame()
  const ghostPos = useGhostCursor()
  const buttonRef = useRef(null)
  const [buttonPos, setButtonPos] = useState({ x: 52, y: 86 })

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

      if (Math.hypot(deltaX, deltaY) < 70) {
        setButtonPos((current) => ({
          x: clamp(12, 88, current.x - deltaX * 0.12),
          y: clamp(18, 90, current.y - deltaY * 0.12),
        }))
      }
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  const averageScore = state.totalQuizzes > 0
    ? Math.round((state.totalCorrect / (state.totalQuizzes * 5)) * 100)
    : 0

  const [xpDisplay, flickerXP] = useFlicker(state.xp)
  const [quizDisplay, flickerQuiz] = useFlicker(state.totalQuizzes)
  const [averageDisplay, flickerAverage] = useFlicker(averageScore)
  const [streakDisplay, flickerStreak] = useFlicker(state.streak)

  return (
    <div className={styles.page}>
      <div className={styles.ghostCursor} style={{ left: ghostPos.x, top: ghostPos.y }} />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Suspicious analytics</p>
          <h1>Welcome back, {state.username}.</h1>
          <p className={styles.subtitle}>
            These numbers are real, probably, unless the dashboard gets bored.
          </p>
        </div>
        <XPBar xp={state.xp} />
      </section>

      <section className={styles.statsGrid}>
        <button type="button" className={styles.statCard} onMouseEnter={flickerXP}>
          <span className={styles.statLabel}>Total XP</span>
          <span className={styles.statValue}>{xpDisplay}</span>
        </button>
        <button type="button" className={styles.statCard} onMouseEnter={flickerQuiz}>
          <span className={styles.statLabel}>Quizzes played</span>
          <span className={styles.statValue}>{quizDisplay}</span>
        </button>
        <button type="button" className={styles.statCard} onMouseEnter={flickerAverage}>
          <span className={styles.statLabel}>Average score</span>
          <span className={styles.statValue}>{averageDisplay}%</span>
        </button>
        <button type="button" className={styles.statCard} onMouseEnter={flickerStreak}>
          <span className={styles.statLabel}>Streak</span>
          <span className={styles.statValue}>{streakDisplay}</span>
        </button>
      </section>

      <section className={styles.history}>
        <div className={styles.historyHeader}>
          <h2>Recent games</h2>
          <span>{state.quizHistory.length} stored</span>
        </div>

        {state.quizHistory.length === 0 ? (
          <p className={styles.empty}>No games yet. The die is waiting.</p>
        ) : (
          state.quizHistory.slice(0, 5).map((entry, index) => (
            <div key={`${entry.date}-${entry.quizId}-${index}`} className={styles.historyRow}>
              <span>Quiz {entry.quizId}</span>
              <span>{entry.score}/5</span>
              <span>+{entry.xpEarned} XP</span>
              <span>{entry.date}</span>
            </div>
          ))
        )}
      </section>

      <button
        ref={buttonRef}
        type="button"
        className={styles.rollBtn}
        style={{ left: `${buttonPos.x}%`, top: `${buttonPos.y}%` }}
        onClick={() => navigate('/home')}
      >
        Roll the Dice
      </button>
    </div>
  )
}
