import { useNavigate } from 'react-router-dom'
import { useGame } from '../../context/GameContext'
import styles from './MemeB.module.css'

export default function MemeB() {
  const navigate = useNavigate()
  const { dispatch } = useGame()

  function handleNext() {
    dispatch({ type: 'LOGOUT' })
    navigate('/?reason=trap', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.memeBox}>
        <p className={styles.kicker}>Trap Room B</p>
        <div className={styles.memeText}>so close.</div>
        <div className={styles.memeSubtext}>yet so far</div>
        <p className={styles.caption}>Do not worry. The exit is definitely just ahead.</p>
      </div>

      <button type="button" className={styles.nextBtn} onClick={handleNext}>
        NEXT -&gt;
      </button>
    </div>
  )
}
