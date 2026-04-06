import { useState } from 'react'
import { useShufflingAnswers } from '../../hooks/useShufflingAnswers'
import styles from './Quiz.module.css'

export default function QuestionTypeB({ question, onAnswer }) {
  const [selected, setSelected] = useState('')
  const [locked, setLocked] = useState(false)
  const { answers } = useShufflingAnswers(question.options)

  function handleConfirm() {
    if (!selected || locked) {
      return
    }

    setLocked(true)
    window.setTimeout(() => {
      onAnswer(selected === question.answer)
    }, 320)
  }

  return (
    <section className={styles.questionShell}>
      <div className={styles.questionBadge}>Type B: Definitely not buttons</div>
      <h2 className={styles.prompt}>{question.q}</h2>
      <div className={styles.fakeInputGrid}>
        {answers.map((option) => (
          <input
            key={option}
            type="text"
            readOnly
            value={option}
            className={`${styles.fakeInput} ${selected === option ? styles.fakeInputSelected : ''}`}
            onClick={() => !locked && setSelected(option)}
          />
        ))}
      </div>
      <button
        type="button"
        className={styles.confirmBtn}
        disabled={!selected || locked}
        onClick={handleConfirm}
      >
        Lock in this terrible idea
      </button>
      <p className={styles.smallText}>These are inputs dressed like buttons. Very normal. Totally trustworthy.</p>
    </section>
  )
}
