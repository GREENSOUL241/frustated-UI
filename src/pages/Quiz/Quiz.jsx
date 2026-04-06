import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import XPBar from '../../components/XPBar/XPBar'
import QuizTimer from '../../components/QuizTimer'
import FakeLoader from '../../components/FakeLoader'
import { FakeButton } from '../../components/FakeButton'
import { useGame } from '../../context/GameContext'
import { QUIZ_LABELS, QUIZ_QUESTIONS, assignQuestionTypes } from '../../data/questions'
import { useXP } from '../../hooks/useXP'
import { playWrongBuzzer, playCorrectChime } from '../../hooks/sounds'
import QuestionTypeA from './QuestionTypeA'
import QuestionTypeB from './QuestionTypeB'
import QuestionTypeC from './QuestionTypeC'
import styles from './Quiz.module.css'

const XP_LIMITS = { 1: 100, 2: 200, 3: 300 }
const QUESTION_COMPONENTS = {
  A: QuestionTypeA,
  B: QuestionTypeB,
  C: QuestionTypeC,
}
const FAKE_BUTTON_LABELS = ['Continue', 'Submit Answer', 'Next Question', 'Confirm', 'Save Progress']

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch, addFrustration } = useGame()
  const { addXP } = useXP()

  const quizMeta = QUIZ_LABELS[id]
  const sourceQuestions = QUIZ_QUESTIONS[id]

  const [questions] = useState(() => (sourceQuestions ? assignQuestionTypes(sourceQuestions) : []))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [xpThisRound, setXpThisRound] = useState(0)
  const [showAdBreak, setShowAdBreak] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)
  const [showLoader, setShowLoader] = useState(false)
  const [fakeButton1, setFakeButton1] = useState(FAKE_BUTTON_LABELS[0])
  const [fakeButton2, setFakeButton2] = useState(FAKE_BUTTON_LABELS[1])

  useEffect(() => {
    if (!sourceQuestions) {
      navigate('/home', { replace: true })
      return
    }

    if (state.xp >= XP_LIMITS[id]) {
      window.alert("You're too powerful for this quiz. Roll again.")
      navigate('/home', { replace: true })
    }
  }, [id, navigate, sourceQuestions, state.xp])

  useEffect(() => {
    if (!showAdBreak || adCountdown <= 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setAdCountdown((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [adCountdown, showAdBreak])

  const currentQuestion = questions[current]
  const QuestionComponent = currentQuestion ? QUESTION_COMPONENTS[currentQuestion.type] : null

  const progressText = useMemo(
    () => `Question ${current + 1} of ${questions.length || 5}`,
    [current, questions.length],
  )

  function finishQuiz(finalScore, finalXpRound, projectedTotalXp) {
    if (projectedTotalXp < 100) {
      dispatch({ type: 'LOGOUT' })
      navigate('/?reason=noxp', { replace: true })
      return
    }

    dispatch({
      type: 'SAVE_QUIZ_RESULT',
      result: {
        quizId: id,
        score: finalScore,
        xpEarned: finalXpRound,
        date: new Date().toLocaleDateString(),
      },
    })
    navigate('/results')
  }

  function nextQuestion(nextScore = score, nextRoundXp = xpThisRound, projectedTotalXp = state.xp) {
    if (current >= questions.length - 1) {
      finishQuiz(nextScore, nextRoundXp, projectedTotalXp)
      return
    }

    setCurrent((value) => value + 1)
  }

  function handleAnswer(correct, isTimeout = false) {
    let earned = correct ? 20 : 5
    const nextScore = score + (correct ? 1 : 0)
    let nextRoundXp = xpThisRound + earned
    let projectedTotalXp = state.xp + earned

    if (isTimeout) {
      earned = -10
      nextRoundXp = xpThisRound - 10
      projectedTotalXp = Math.max(0, state.xp - 10)
      addFrustration(1)
    }

    if (correct) {
      playCorrectChime()
    } else {
      playWrongBuzzer()
    }

    addXP(earned, isTimeout ? 'Timer expired!' : (correct ? 'Correct!' : 'Nice try'))
    setScore(nextScore)
    setXpThisRound(nextRoundXp)

    if (current === 1) {
      setShowAdBreak(true)
      setAdCountdown(5)
      return
    }

    // 30% chance for fake loader between questions
    if (Math.random() < 0.3 && !isTimeout) {
      setShowLoader(true)
      return
    }

    nextQuestion(nextScore, nextRoundXp, projectedTotalXp)
  }

  function handleLoaderComplete() {
    setShowLoader(false)
    const nextScore = score + (current >= questions.length - 1 ? 0 : 0)
    nextQuestion(nextScore, xpThisRound, state.xp)
  }

  function handleAdBreakClose() {
    const bonus = 15
    addXP(bonus, 'Survived the ad')
    setXpThisRound((value) => value + bonus)
    setShowAdBreak(false)
    nextQuestion(score, xpThisRound + bonus, state.xp + bonus)
  }

  if (!sourceQuestions || !currentQuestion || !QuestionComponent) {
    return null
  }

  if (showLoader) {
    return <FakeLoader onComplete={handleLoaderComplete} />
  }

  if (showAdBreak) {
    return (
      <div className={styles.adBreak}>
        <div className={styles.adBreakPanel}>
          <p className={styles.questionBadge}>Mandatory nonsense</p>
          <h1>And now, a word from our sponsors...</h1>
          <div className={styles.fakeAd}>
            <p>BUY THINGS YOU DO NOT NEED</p>
            <p>Limited time offer on every bad decision.</p>
          </div>
          <button
            type="button"
            className={styles.closeAdBtn}
            disabled={adCountdown > 0}
            onClick={handleAdBreakClose}
          >
            {adCountdown > 0 ? `Close in ${adCountdown}...` : 'Close (+15 XP)'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <QuizTimer onExpire={() => handleAnswer(false, true)} frustrationScore={state.frustrationScore} />

      <div className={styles.headerCard}>
        <div>
          <p className={styles.questionBadge}>{quizMeta.title}</p>
          <h1>{progressText}</h1>
          <p className={styles.subtitle}>{quizMeta.subtitle}</p>
        </div>
        <div className={styles.roundStats}>
          <span>Round XP: {xpThisRound}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <XPBar xp={state.xp} compact />

      <QuestionComponent
        key={`${current}-${currentQuestion.type}`}
        question={currentQuestion}
        onAnswer={handleAnswer}
        onSkip={() => nextQuestion(score, xpThisRound, state.xp)}
      />

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', opacity: 0.4 }}>
        <FakeButton label={fakeButton1} className={styles.answerButton} />
        {state.frustrationScore >= 13 && <FakeButton label={fakeButton2} className={styles.answerButton} />}
      </div>
    </div>
  )
}
