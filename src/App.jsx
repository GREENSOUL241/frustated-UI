import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import XPToast from './components/XPToast/XPToast'
import { useGame } from './context/GameContext'
import { useXP } from './hooks/useXP'
import { useXPSabotage } from './hooks/useXPSabotage'
import { playTaunt } from './hooks/sounds'
import { showFloatingMessage } from './hooks/floatingMessage'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import MemeA from './pages/MemeA/MemeA'
import MemeB from './pages/MemeB/MemeB'
import Quiz from './pages/Quiz/Quiz'
import Results from './pages/Results/Results'

function ProtectedRoute({ children }) {
  const { state } = useGame()

  if (!state.username) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <NavBar />
      <div className="protected-shell">{children}</div>
    </>
  )
}

export default function App() {
  const { toasts } = useXP()
  const { state } = useGame()
  const [titleIndex, setTitleIndex] = useState(0)

  const EVIL_TITLES = [
    'QuizMayhem',
    'why are you still here',
    'please leave',
    'this is not good for you',
    'QUIZMAYHEM',
    '404: your sanity not found',
    'still going huh',
    '...',
    'QuizMayhem (you will not win)',
  ]

  // Audio context resume on first click
  useEffect(() => {
    const handleFirstClick = async () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        await audioContext.resume()
      } catch (e) {
        console.log('AudioContext:', e)
      }
    }
    document.addEventListener('click', handleFirstClick, { once: true })
    return () => document.removeEventListener('click', handleFirstClick)
  }, [])

  // Global copy/paste/cut blocking
  useEffect(() => {
    const blockPaste = (e) => {
      e.preventDefault()
      playTaunt('paste')
      showFloatingMessage("no pasting! type it yourself 😤")
    }
    const blockCopy = (e) => {
      e.preventDefault()
      showFloatingMessage("nothing to copy here, buddy")
    }
    const blockCut = (e) => {
      e.preventDefault()
      showFloatingMessage("put that back")
    }
    const blockContext = (e) => {
      e.preventDefault()
      showFloatingMessage("right click? in THIS economy?")
    }

    document.addEventListener('paste', blockPaste)
    document.addEventListener('copy', blockCopy)
    document.addEventListener('cut', blockCut)
    document.addEventListener('contextmenu', blockContext)

    return () => {
      document.removeEventListener('paste', blockPaste)
      document.removeEventListener('copy', blockCopy)
      document.removeEventListener('cut', blockCut)
      document.removeEventListener('contextmenu', blockContext)
    }
  }, [])

  // Title chaos at high frustration
  useEffect(() => {
    if (state.frustrationScore < 21) return
    const interval = setInterval(() => {
      setTitleIndex(idx => (idx + 1) % EVIL_TITLES.length)
      document.title = EVIL_TITLES[titleIndex]
    }, 3500)
    return () => clearInterval(interval)
  }, [state.frustrationScore, titleIndex, EVIL_TITLES])

  // XP sabotage hook
  useXPSabotage()

  return (
    <>
      <XPToast toasts={toasts} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={(
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/quiz/:id"
          element={(
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/results"
          element={(
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/trap-a"
          element={(
            <ProtectedRoute>
              <MemeA />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/trap-b"
          element={(
            <ProtectedRoute>
              <MemeB />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </>
  )
}
