import { useState } from 'react'
import { useShufflingAnswers } from '../../hooks/useShufflingAnswers'
import styles from './Quiz.module.css'

export default function QuestionTypeA({ question, onAnswer }) {
  const [selected, setSelected] = useState('')
  const { answers } = useShufflingAnswers(question.options)

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
      <div className={styles.questionBadge}>Type A: Traditional pain</div>
      <h2 className={styles.prompt}>{question.q}</h2>
      <div className={styles.optionsGrid}>
        {answers.map((option) => (
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
      <p className={styles.smallText}>At last, a normal interface. That feeling will not last.</p>
    </section>
  )
}
