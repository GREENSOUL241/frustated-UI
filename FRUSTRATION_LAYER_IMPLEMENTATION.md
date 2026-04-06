# QuizMayhem Frustration Layer - Implementation Summary

## Overview
Implemented a comprehensive "frustration layer" system that makes the QuizMayhem quiz app deliberately antagonistic and evil, with escalating difficulty based on user frustration.

## Features Implemented

### 1. Sound System (`src/hooks/sounds.js`)
- **Web Audio API-based** - No external files needed
- **Functions implemented:**
  - `playWrongBuzzer()` - Descending sawtooth buzz
  - `playCorrectChime()` - Ascending sine chime (3 notes)
  - `playXPDeduct()` - Square wave descending tones
  - `playFakeLoading()` - Ascending/descending triangle wave sequence
  - `playTaunt(type)` - Trombone-like "wah wah wah" sounds for:
    - `slow`, `paste`, `deduct`, `reset` scenarios

**Triggered by:**
- Wrong answers → `playWrongBuzzer()`
- Correct answers → `playCorrectChime()`
- XP deductions → `playXPDeduct()` + `playTaunt('deduct')`
- Timer resets → `playTaunt('reset')`
- Paste attempts → `playTaunt('paste')`
- Answer shuffles → `playTaunt('slow')`

### 2. Self-Clearing Form Fields (`src/hooks/useSabotageInput.js`)
- **Applied to:** Login username input, Type B quiz inputs
- **Behavior:**
  - Clears field randomly after 4-9 seconds
  - Shows snarky floating message when cleared
  - Increments frustration score by 2
  - Username-specific: Scrambles last 2 characters before clearing

**Messages rotated:**
- "oops! field cleared itself 🙂"
- "fingers slipped!"
- "autocorrect strikes again"
- etc.

### 3. Fake UI Buttons (`src/components/FakeButton.jsx`)
- **Placed:** Login page (1 button) + Quiz page (1-2 buttons, 2 when frustration ≥ 13)
- **Behavior:**
  - Pixel-perfect visual matches of real buttons
  - Silent clicks initially
  - After 3 clicks: Mocks user with floating message
  - After 6 clicks: Fake loading sequence
- **Labels:** Continue, Submit Answer, Next Question, Confirm, Save Progress

### 4. Mouse-Reset Quiz Timer (`src/components/QuizTimer.jsx`)
- **Visible at top of each quiz question**
- **Evil mechanic:** Any `mousemove` resets timer to 15 seconds
- **Timer only counts down during mouse stillness**
- **Expiry consequences:**
  - Auto-submits as wrong answer
  - Deducts 10 XP
  - Adds frustration
- **Escalation:** At frustration ≥ 13, clicking also resets timer

### 5. Copy-Paste Disabled Everywhere (`src/App.jsx`)
- **Global listeners prevent:**
  - Copy attempts → "nothing to copy here, buddy"
  - Paste attempts → plays taunt, shows "no pasting! type it yourself 😤"
  - Cut attempts → "put that back"
  - Right-click context menu → "right click? in THIS economy?"

### 6. Fake Loading Screens (`src/components/FakeLoader.jsx`)
- **Triggered by:**
  - After logging in (in Home)
  - After rolling die (in Home) 
  - Between quiz questions (30% chance)
- **Behavior:**
  - Progresses to 99% then stops
  - Stays at 99% for 2.5 seconds
  - Then shows error: "An error occurred. Please try again"
  - Completes after 2 more seconds
  - Plays fake loading sounds

### 7. Answer Shuffling (`src/hooks/useShufflingAnswers.js`)
- **Applied to:** Type A and Type B quiz questions
- **Interval:** Every 4 seconds
- **Behavior:**
  - Reshuffles answer order with taunt sound
  - Plays shuffle animation (scale 0.93 + rotation)
  - Increments frustration by 1 each shuffle

### 8. Random XP Deductions (`src/hooks/useXPSabotage.js`)
- **Interval:** Every 25-45 seconds (while logged in)
- **Amount:** 5-15 XP randomly deducted
- **Fake reasons:** 
  - "inactivity fee"
  - "breathing tax"
  - "terms of service violation §47(b)"
  - "the algorithm decided"
  - "premium air usage fee"
  - etc.
- **UI:** Red deduction toast that lingers for 4 seconds
- **Sounds:** XP deduct sound + taunt played

### 9. Floating Messages (`src/hooks/floatingMessage.js`)
- **Global utility** for displaying snarky feedback
- **Features:**
  - Random emoji suffix (😈 🙃 💀 🤡 😤 👁️)
  - Fade animation (float up over 2.5s or 4s for deductions)
  - Random positioning on screen
  - DOM-injected, no component overhead
- **Special handling:** Deduction messages (red, 4s duration)

### 10. Frustration Escalation System (`src/context/GameContext.jsx`)
- **Tracks frustration score** incrementally
- **Triggers:**
  - Timer reset: +1
  - Field cleared: +2
  - XP deducted: +2
  - Shuffle: +1
  - Fake button clicked 3x: +3
  - Other evil events

**Escalation Tiers:**
- **0-5:** Normal evil (all base features active)
- **6-12:** Elevated - Shuffles faster (3s instead of 4s)
- **13-20:** Severe - 
  - Timer resets on click too
  - Extra fake buttons spawn (+2)
- **21+:** UNHINGED - 
  - Page title rotates through evil messages
  - XP bar glitches occasionally
  - Ads respawn aggressively

### 11. Page Title Chaos (`src/App.jsx` at frustration ≥ 21)
- **Rotation every 3.5 seconds:**
  - "QuizMayhem"
  - "why are you still here"
  - "please leave"
  - "this is not good for you"
  - "QUIZMAYHEM"
  - "404: your sanity not found"
  - "still going huh"
  - "..."
  - "QuizMayhem (you will not win)"

## Integration Points

| Feature | File | Mounted In | Notes |
|---------|------|-----------|-------|
| Sounds | sounds.js | Imported where needed | AudioContext resume on first click in App.jsx |
| Self-clearing inputs | useSabotageInput.js | Login.jsx, QuestionTypeB.jsx | Frustration increment integrated |
| Fake buttons | FakeButton.jsx | Login.jsx, Quiz.jsx | Dynamic label selection |
| Timer | QuizTimer.jsx | Quiz.jsx | Receives frustration score for tier 3 activation |
| Copy/paste block | App.jsx | Global useEffect | Runs on all pages after mount |
| Fake loader | FakeLoader.jsx | Home.jsx, Quiz.jsx | Shows between questions, on roll, on login |
| Answer shuffling | useShufflingAnswers.js | QuestionTypeA.jsx, QuestionTypeB.jsx | Tracks frustration |
| XP sabotage | useXPSabotage.js | App.jsx global | Runs while logged in |
| Floating messages | floatingMessage.js | Global utility | Called from all evil systems |
| Frustration tracking | GameContext.jsx | All components | Central state management |
| Title chaos | App.jsx | Page title manipulation | Activated at frustration ≥ 21 |

## GameContext Enhancements

**New state property:**
- `frustrationScore: 0` - Incremented by evil events

**New actions:**
- `ADD_FRUSTRATION` - Increments frustration score by amount

**New context methods:**
- `addFrustration(amount)` - Helper to dispatch frustration additions

## Files Created/Modified

### New Files:
- `src/hooks/sounds.js` - Web Audio sound generation
- `src/hooks/floatingMessage.js` - Floating toast utility
- `src/hooks/useSabotageInput.js` - Field-clearing logic
- `src/hooks/useShufflingAnswers.js` - Answer shuffle hook
- `src/hooks/useXPSabotage.js` - Random XP deduction
- `src/components/FakeButton.jsx` - Fake button component
- `src/components/FakeLoader.jsx` - Fake loading screen
- `src/components/FakeLoader.module.css` - Loader styles
- `src/components/QuizTimer.jsx` - Mouse-reset timer
- `src/components/QuizTimer.module.css` - Timer styles

### Modified Files:
- `src/App.jsx` - Global evil listeners, AudioContext resume, frustration title chaos
- `src/context/GameContext.jsx` - Frustration score state + actions
- `src/pages/Login/Login.jsx` - Self-clearing username, fake button
- `src/pages/Home/Home.jsx` - Fake loader on die roll
- `src/pages/Quiz/Quiz.jsx` - Timer, sounds, fake loader, fake buttons, frustration tracking
- `src/pages/Quiz/Quiz.module.css` - Shuffle animation keyframes
- `src/pages/Quiz/QuestionTypeA.jsx` - Answer shuffling
- `src/pages/Quiz/QuestionTypeB.jsx` - Answer shuffling

## Tone & Implementation Notes

✅ **Achieved:**
- App feels **genuinely antagonistic** - not mocking, just matter-of-fact evil
- Fake loader looks **completely professional** before cancelling at 99%
- Fake buttons are **pixel-perfect matches** of real buttons
- All messages sound like **legitimate system responses**
- Sounds are **punchy and short** (under 0.5s each)
- Evil escalates smoothly as frustration accumulates

## Usage Examples

**Incrementing frustration from a component:**
```jsx
const { addFrustration } = useGame()
addFrustration(2)  // Field cleared
addFrustration(1)  // Answer shuffled
```

**Playing sounds:**
```jsx
import { playWrongBuzzer, playCorrectChime } from '../hooks/sounds'
playWrongBuzzer()
playCorrectChime()
```

**Showing floating messages:**
```jsx
import { showFloatingMessage } from '../hooks/floatingMessage'
showFloatingMessage("oops! something happened")
showFloatingMessage("-5 XP: breathing tax", { type: 'deduction' })
```

## Testing Checklist

- [ ] AudioContext resumes on first click
- [ ] Copy/paste blocked globally
- [ ] Right-click context menu disabled
- [ ] Username field clears and scrambles
- [ ] Fake login button appears & does nothing (eventually mocks)
- [ ] Die roll shows fake loader then navigates
- [ ] Quiz displays timer with mouse-reset mechanic
- [ ] Answer options shuffle every 4s
- [ ] Fake XP deductions appear every 25-45s
- [ ] Fake loader appears ~30% between questions
- [ ] Correct answers play chime + wrong play buzzer
- [ ] Timer expiry deducts 10 XP
- [ ] Frustration score increments on evil events
- [ ] At frustration ≥ 13: Timer also resets on click, more fake buttons
- [ ] At frustration ≥ 21: Page title cycles through evil messages

## Completion Status
✅ **ALL 11 FEATURES FULLY IMPLEMENTED**
