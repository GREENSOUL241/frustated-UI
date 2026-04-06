const ctx = new (window.AudioContext || window.webkitAudioContext)()

export function playWrongBuzzer() {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(220, ctx.currentTime)
  o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4)
  g.gain.setValueAtTime(0.4, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
  o.start()
  o.stop(ctx.currentTime + 0.4)
}

export function playCorrectChime() {
  [523, 659, 784].forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
    g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.05)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
    o.start(ctx.currentTime + i * 0.12)
    o.stop(ctx.currentTime + i * 0.12 + 0.3)
  })
}

export function playXPDeduct() {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = 'square'
  o.frequency.setValueAtTime(400, ctx.currentTime)
  o.frequency.setValueAtTime(200, ctx.currentTime + 0.1)
  o.frequency.setValueAtTime(100, ctx.currentTime + 0.2)
  g.gain.setValueAtTime(0.3, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
  o.start()
  o.stop(ctx.currentTime + 0.35)
}

export function playFakeLoading() {
  [300, 400, 500, 600, 700, 400].forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.frequency.value = freq
    o.type = 'triangle'
    g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.18)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.15)
    o.start(ctx.currentTime + i * 0.18)
    o.stop(ctx.currentTime + i * 0.18 + 0.15)
  })
}

export function playTaunt(type) {
  const freqs = {
    slow: [300, 250, 200],
    paste: [400, 300, 200],
    deduct: [350, 280, 180],
    reset: [500, 350, 180],
  }
  const seq = freqs[type] || freqs.slow
  seq.forEach((freq, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.type = 'sawtooth'
    o.frequency.value = freq
    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.2)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.18)
    o.start(ctx.currentTime + i * 0.2)
    o.stop(ctx.currentTime + i * 0.2 + 0.18)
  })
}
