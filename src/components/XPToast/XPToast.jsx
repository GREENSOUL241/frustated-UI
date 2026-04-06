import styles from './XPToast.module.css'

export default function XPToast({ toasts }) {
  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast}>
          <span className={styles.amount}>+{toast.amount} XP</span>
          <span className={styles.label}>{toast.label}</span>
        </div>
      ))}
    </div>
  )
}
