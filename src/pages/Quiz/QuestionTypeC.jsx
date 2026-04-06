import { useState } from 'react'
import styles from './Quiz.module.css'

export default function QuestionTypeC({ question, onAnswer, onSkip }) {
  const [selected, setSelected] = useState('')

  function handlePick(option) {
    if (selected) {
      return
    }

    setSelected(option)
    window.setTimeout(() => {
      onAnswer(option === question.answer)
    }, 320)
  }

  return (
    <section className={styles.questionShell}>
      <button type="button" className={styles.skipGhost} onClick={onSkip}>
        skip
      </button>
      <div className={styles.questionBadge}>Type C: Hidden mercy clause</div>
      <h2 className={styles.prompt}>{question.q}</h2>
      <div className={styles.optionsGrid}>
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.answerButton} ${selected === option ? styles.answerButtonSelected : ''}`}
            disabled={Boolean(selected)}
            onClick={() => handlePick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className={styles.smallText}>There is absolutely not a tiny skip button hiding on this screen.</p>
    </section>
  )
}
