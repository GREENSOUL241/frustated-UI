import { NavLink, useNavigate } from 'react-router-dom'
import { useGame } from '../../context/GameContext'
import { useXP } from '../../hooks/useXP'
import XPBar from '../XPBar/XPBar'
import styles from './NavBar.module.css'

export default function NavBar() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const { xp } = useXP()

  function handleLogout() {
    dispatch({ type: 'LOGOUT' })
    navigate('/', { replace: true })
  }

  return (
    <aside className={styles.nav}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Player</p>
          <h2>{state.username}</h2>
        </div>
        <div className={styles.xpChip}>{xp} XP</div>
      </div>

      <div className={styles.links}>
        <NavLink
          to="/home"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Dashboard
        </NavLink>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          Panic Logout
        </button>
      </div>

      <XPBar xp={xp} compact />
    </aside>
  )
}
