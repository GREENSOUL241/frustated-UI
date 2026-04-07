import { useState } from 'react'
import { AD_POOL } from '../../data/questions'
import styles from './FloatingAd.module.css'

export default function FloatingAd({ adId, adIndex, onClose }) {
  const ad = AD_POOL[adIndex % AD_POOL.length]
  const [position] = useState(() => ({
    top: `${8 + Math.random() * 68}%`,
    left: `${3 + Math.random() * 62}%`,
  }))
  const [delay] = useState(() => Math.random() * 1.6)

  return (
    <div
      className={styles.ad}
      style={{
        top: position.top,
        left: position.left,
        '--ad-color': ad.color,
        animationDelay: `${delay}s`,
      }}
    >
      <button type="button" className={styles.closeBtn} onClick={() => onClose(adId)}>
        X
      </button>
      <div className={styles.headline}>{ad.headline}</div>
      <div className={styles.body}>{ad.body}</div>
      <button type="button" className={styles.ctaBtn}>
        CLICK HERE
      </button>
    </div>
  )
}
