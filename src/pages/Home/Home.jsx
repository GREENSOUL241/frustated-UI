import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Die from '../../components/Die/Die'
import XPBar from '../../components/XPBar/XPBar'
import FakeLoader from '../../components/FakeLoader'
import { QUIZ_LABELS } from '../../data/questions'
import { useGame } from '../../context/GameContext'
import styles from './Home.module.css'

const ROLL_DESTINATIONS = {
  1: { path: '/quiz/1', title: QUIZ_LABELS[1].title, blurb: QUIZ_LABELS[1].subtitle },
  2: { path: '/quiz/2', title: QUIZ_LABELS[2].title, blurb: QUIZ_LABELS[2].subtitle },
  3: { path: '/quiz/3', title: QUIZ_LABELS[3].title, blurb: QUIZ_LABELS[3].subtitle },
  4: { path: '/trap-a', title: 'Trap Room A', blurb: 'Find the invisible escape button.' },
  5: { path: '/trap-b', title: 'Trap Room B', blurb: 'Press next. Regret instantly.' },
  6: { path: '/dashboard', title: 'Dashboard Dungeon', blurb: 'Numbers, lies, and a haunted CTA.' },
}

export default function Home() {
  const navigate = useNavigate()
  const { state } = useGame()
  const [rolledFace, setRolledFace] = useState(null)
  const [showLoader, setShowLoader] = useState(false)

  const rolledDestination = useMemo(
    () => (rolledFace ? ROLL_DESTINATIONS[rolledFace] : null),
    [rolledFace],
  )

  useEffect(() => {
    if (!rolledDestination) {
      return undefined
    }

    setShowLoader(true)
    const timeoutId = window.setTimeout(() => {
      navigate(rolledDestination.path)
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [navigate, rolledDestination])

  if (showLoader) {
    return <FakeLoader onComplete={() => {}} />
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Chaos launcher</p>
          <h1>Roll for your fate.</h1>
          <p className={styles.description}>
            The die decides whether you face trivia, humiliation, or administrative suffering.
          </p>
        </div>

        <div className={styles.statusCard}>
          <XPBar xp={state.xp} />
          <p className={styles.helper}>
            If a quiz says you are too powerful, that is not a compliment. Roll again.
          </p>
        </div>
      </section>

      <section className={styles.stage}>
        <div className={styles.diePanel}>
          <Die onRollComplete={setRolledFace} />
          <div className={styles.rollMessage}>
            {rolledDestination
              ? `Face ${rolledFace}: ${rolledDestination.title}. Redirecting now...`
              : 'No pressure. Just spin the cube and accept the consequences.'}
          </div>
        </div>

        <div className={styles.outcomes}>
          {Object.entries(ROLL_DESTINATIONS).map(([face, destination]) => (
            <article
              key={face}
              className={`${styles.outcomeCard} ${Number(face) === rolledFace ? styles.outcomeCardActive : ''}`}
            >
              <span className={styles.faceBadge}>Face {face}</span>
              <h2>{destination.title}</h2>
              <p>{destination.blurb}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
