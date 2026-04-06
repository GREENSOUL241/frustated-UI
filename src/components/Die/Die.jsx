import { useRef, useState } from 'react'
import styles from './Die.module.css'

const FACE_ROTATIONS = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(180deg)',
  3: 'rotateX(-90deg) rotateY(0deg)',
  4: 'rotateX(90deg) rotateY(0deg)',
  5: 'rotateX(0deg) rotateY(-90deg)',
  6: 'rotateX(0deg) rotateY(90deg)',
}

const PIPS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
}

function Face({ number }) {
  return (
    <div className={styles.face}>
      {PIPS[number].map(([x, y], index) => (
        <span
          key={`${number}-${index}`}
          className={styles.pip}
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}

export default function Die({ onRollComplete }) {
  const [spinning, setSpinning] = useState(false)
  const [finalRotation, setFinalRotation] = useState(FACE_ROTATIONS[1])
  const dieRef = useRef(null)

  function roll() {
    if (spinning) {
      return
    }

    const result = Math.floor(Math.random() * 6) + 1
    const rotation = FACE_ROTATIONS[result]

    setFinalRotation(rotation)

    if (dieRef.current) {
      dieRef.current.style.setProperty('--final-rot', rotation)
    }

    requestAnimationFrame(() => {
      setSpinning(true)
    })

    window.setTimeout(() => {
      setSpinning(false)
      onRollComplete(result)
    }, 2200)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scene}>
        <div
          ref={dieRef}
          className={`${styles.die} ${spinning ? styles.spinning : ''}`}
          style={{ '--final-rot': finalRotation }}
        >
          <div className={`${styles.faceWrap} ${styles.front}`}><Face number={1} /></div>
          <div className={`${styles.faceWrap} ${styles.back}`}><Face number={6} /></div>
          <div className={`${styles.faceWrap} ${styles.right}`}><Face number={2} /></div>
          <div className={`${styles.faceWrap} ${styles.left}`}><Face number={5} /></div>
          <div className={`${styles.faceWrap} ${styles.top}`}><Face number={3} /></div>
          <div className={`${styles.faceWrap} ${styles.bottom}`}><Face number={4} /></div>
        </div>
      </div>

      <button type="button" className={styles.rollBtn} onClick={roll} disabled={spinning}>
        {spinning ? 'ROLLING...' : 'ROLL'}
      </button>
    </div>
  )
}
