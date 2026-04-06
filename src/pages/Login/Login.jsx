import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdManager from '../../components/AdManager/AdManager'
import XPBar from '../../components/XPBar/XPBar'
import { FakeButton } from '../../components/FakeButton'
import { useGame } from '../../context/GameContext'
import { LOGIN_BONUS_PROMPTS } from '../../data/questions'
import { useXP } from '../../hooks/useXP'
import { useSabotageInput } from '../../hooks/useSabotageInput'
import styles from './Login.module.css'

const REASON_COPY = {
  noxp: "You don't have enough XP. Earn more chaos first.",
  trap: "Thanks for playing! You didn't win anything.",
}

const FAKE_BUTTON_LABELS = ['Continue', 'Submit Answer', 'Next Question', 'Confirm', 'Save Progress']

export default function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const reason = params.get('reason')
  const { state, dispatch } = useGame()
  const { xp, addXP } = useXP()

  const [username, setUsername] = useState('')
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [waiverRewarded, setWaiverRewarded] = useState(false)
  const [answeredBonus, setAnsweredBonus] = useState({})
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useSabotageInput(username, setUsername, { isUsername: true })

  const bannerMessage = useMemo(() => REASON_COPY[reason] ?? '', [reason])
  const canEnter = username.trim().length >= 2 && waiverAccepted
  const fakeLabel = FAKE_BUTTON_LABELS[Math.floor(Math.random() * FAKE_BUTTON_LABELS.length)]

  useEffect(() => {
    if (state.username) {
      navigate('/home', { replace: true })
    }
  }, [navigate, state.username])

  useEffect(() => {
    setBannerDismissed(false)
  }, [reason])

  function handleBonusAnswer(prompt, option) {
    if (answeredBonus[prompt.id]) {
      return
    }

    const correct = option === prompt.answer
    const amount = correct ? prompt.reward : 5
    addXP(amount, correct ? prompt.successLabel : 'Earned pity XP')
    setAnsweredBonus((current) => ({ ...current, [prompt.id]: option }))
  }

  function handleWaiverChange(event) {
    const checked = event.target.checked
    setWaiverAccepted(checked)

    if (checked && !waiverRewarded) {
      addXP(10, 'Initialed the waiver')
      setWaiverRewarded(true)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!canEnter) {
      return
    }

    dispatch({ type: 'SET_USERNAME', username })
    navigate('/home')
  }

  return (
    <div className={styles.page}>
      <AdManager />

      <div className={styles.backdropBlob} />
      <div className={styles.backdropBlobTwo} />

      <div className={styles.shell}>
        <section className={styles.hero}>
          {bannerMessage && !bannerDismissed && (
            <div className={styles.banner}>
              <span>{bannerMessage}</span>
              <button type="button" onClick={() => setBannerDismissed(true)}>
                Dismiss
              </button>
            </div>
          )}

          <div className={styles.kicker}>Browser-only nonsense</div>
          <h1>QuizMayhem</h1>
          <p className={styles.tagline}>
            A quiz game that rewards persistence, ad-closing, and questionable decision-making.
          </p>

          <div className={styles.heroCard}>
            <p className={styles.cardLabel}>Survival meter</p>
            <XPBar xp={xp} />
            <p className={styles.helper}>
              Reach at least 100 total XP before a quiz ends, or the app boots you back here.
            </p>
          </div>

          <div className={styles.bonusGrid}>
            {LOGIN_BONUS_PROMPTS.map((prompt) => {
              const answered = answeredBonus[prompt.id]

              return (
                <article key={prompt.id} className={styles.bonusCard}>
                  <p className={styles.cardLabel}>Bonus XP</p>
                  <h2>{prompt.prompt}</h2>
                  <div className={styles.bonusOptions}>
                    {prompt.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.optionBtn} ${answered === option ? styles.optionBtnSelected : ''}`}
                        disabled={Boolean(answered)}
                        onClick={() => handleBonusAnswer(prompt, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <p className={styles.bonusStatus}>
                    {answered
                      ? answered === prompt.answer
                        ? `Correct. +${prompt.reward} XP`
                        : 'Wrong, but you still got 5 pity XP.'
                      : 'One attempt only. Choose with theatrical confidence.'}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.loginPanel}>
          <div className={styles.panelInner}>
            <p className={styles.cardLabel}>Login gate</p>
            <h2>Enter the arena</h2>
            <p className={styles.panelCopy}>
              Choose a username, sign the very suspicious waiver, and hope the ads stay merciful.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.inputLabel} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className={styles.input}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Captain Chaos"
                maxLength={18}
              />

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={waiverAccepted}
                  onChange={handleWaiverChange}
                />
                <span>I can handle mild emotional damage and popup trauma.</span>
              </label>

              <button type="submit" className={styles.submitBtn} disabled={!canEnter}>
                Enter QuizMayhem
              </button>
            </form>

            <FakeButton label={fakeLabel} className={styles.submitBtn} />

            <div className={styles.notes}>
              <p>Close ads for +10 XP each.</p>
              <p>Roll the die to find a quiz, a trap, or a very rude dashboard.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
