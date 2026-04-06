import { useGame } from '../context/GameContext'

export function useXP() {
  const { state, addXP, toasts } = useGame()

  return {
    xp: state.xp,
    addXP,
    toasts,
  }
}
