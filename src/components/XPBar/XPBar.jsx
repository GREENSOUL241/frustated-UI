import styles from './XPBar.module.css'

const LEVELS = [
  { max: 99, label: 'Goblin Tutorial' },
  { max: 199, label: 'Respectable Menace' },
  { max: 299, label: 'Certified Problem' },
  { max: Number.POSITIVE_INFINITY, label: 'Too Powerful For Trivia' },
]

export default function XPBar({ xp, max = 300, compact = false }) {
  const progress = Math.min(100, (xp / max) * 100)
  const level = LEVELS.find(({ max: upperBound }) => xp <= upperBound)?.label ?? LEVELS[0].label

  return (
    <div className={`${styles.shell} ${compact ? styles.compact : ''}`}>
      <div className={styles.meta}>
        <span>Total XP</span>
        <strong>{xp} / {max}</strong>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
        <div className={styles.markers}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className={styles.footer}>
        <span>{level}</span>
        <span>Quiz locks at 100 / 200 / 300 XP</span>
      </div>
    </div>
  )
}
