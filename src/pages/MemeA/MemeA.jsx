import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useXP } from '../../hooks/useXP'
import styles from './MemeA.module.css'

const HIDDEN_POSITIONS = [
  { top: '95%', left: '2%', fontSize: '8px', opacity: 0.06 },
  { top: '4%', left: '88%', fontSize: '8px', opacity: 0.05 },
  { top: '48%', left: '96%', fontSize: '7px', opacity: 0.05 },
  { top: '84%', left: '44%', fontSize: '9px', opacity: 0.08 },
  { top: '18%', left: '3%', fontSize: '7px', opacity: 0.05 },
]

export default function MemeA() {
  const navigate = useNavigate()
  const { addXP } = useXP()
  const [position] = useState(() => HIDDEN_POSITIONS[Math.floor(Math.random() * HIDDEN_POSITIONS.length)])

  return (
    <div className={styles.page}>
      <div className={styles.memeBox}>
        <p className={styles.kicker}>Trap Room A</p>
        <div className={styles.memeText}>oops.</div>
        <div className={styles.memeSubtext}>wrong number</div>
        <div className={styles.face}>(x_x)</div>
        <p className={styles.caption}>this is fine. everything is fine.</p>
      </div>

      <button
        type="button"
        className={styles.hiddenBtn}
        style={position}
        onClick={() => {
          addXP(5, 'Found the escape hatch')
          navigate('/home')
        }}
      >
        escape
      </button>
    </div>
  )
}
