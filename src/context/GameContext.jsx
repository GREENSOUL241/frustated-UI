import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

const STORAGE_KEY = 'quizmayhem'

const INITIAL_STATE = {
  xp: 0,
  username: '',
  quizHistory: [],
  totalQuizzes: 0,
  totalCorrect: 0,
  streak: 0,
  lastQuizResult: null,
  frustrationScore: 0,
}

function loadInitialState() {
  if (typeof window === 'undefined') {
    return INITIAL_STATE
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE
  } catch {
    return INITIAL_STATE
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_XP':
      return { ...state, xp: Math.max(0, state.xp + action.amount) }
    case 'SET_USERNAME':
      return { ...state, username: action.username.trim() }
    case 'LOGOUT':
      return { ...state, username: '' }
    case 'ADD_FRUSTRATION':
      return { ...state, frustrationScore: state.frustrationScore + action.amount }
    case 'SAVE_QUIZ_RESULT':
      return {
        ...state,
        quizHistory: [action.result, ...state.quizHistory].slice(0, 10),
        totalQuizzes: state.totalQuizzes + 1,
        totalCorrect: state.totalCorrect + action.result.score,
        streak: state.streak + 1,
        lastQuizResult: action.result,
      }
    case 'LOAD':
      return { ...INITIAL_STATE, ...action.payload }
    default:
      return state
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE, loadInitialState)
  const [toasts, setToasts] = useState([])
  const timeoutIds = useRef(new Set())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage failures so the app keeps working in-memory.
    }
  }, [state])

  useEffect(() => () => {
    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutIds.current.clear()
  }, [])

  const addXP = useCallback((amount, label = 'Chaos bonus') => {
    dispatch({ type: 'ADD_XP', amount })

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((current) => [...current, { id, amount, label }])

    const timeoutId = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
      timeoutIds.current.delete(timeoutId)
    }, 2500)

    timeoutIds.current.add(timeoutId)
  }, [])

  const addFrustration = useCallback((amount = 1) => {
    dispatch({ type: 'ADD_FRUSTRATION', amount })
  }, [])

  return (
    <GameContext.Provider value={{ state, dispatch, addXP, addFrustration, toasts }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }

  return context
}
