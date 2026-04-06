const SNARKY_EXTRAS = ['😈', '🙃', '💀', '🤡', '😤', '👁️']

export function showFloatingMessage(text, options = {}) {
  const el = document.createElement('div')
  el.textContent = text + ' ' + (options.emoji ?? SNARKY_EXTRAS[Math.floor(Math.random() * SNARKY_EXTRAS.length)])

  const isDeduction = options.type === 'deduction'
  const defaultBg = isDeduction ? '#2a1a1a' : '#1a1a2e'
  const defaultColor = isDeduction ? '#ff6b6b' : '#f0e040'
  const defaultBorder = isDeduction ? '#ff6b6b' : '#f0e040'

  Object.assign(el.style, {
    position: 'fixed',
    top: options.top ?? `${20 + Math.random() * 60}%`,
    left: options.left ?? `${10 + Math.random() * 60}%`,
    background: options.bg ?? defaultBg,
    color: options.color ?? defaultColor,
    border: `1px solid ${options.border ?? defaultBorder}`,
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: isDeduction ? '0.95rem' : '0.85rem',
    fontWeight: '600',
    fontFamily: 'DM Sans, sans-serif',
    zIndex: '99998',
    pointerEvents: 'none',
    animation: isDeduction ? 'floatUp 4s ease forwards' : 'floatUp 2.5s ease forwards',
    whiteSpace: 'nowrap',
  })

  if (!document.getElementById('float-style')) {
    const s = document.createElement('style')
    s.id = 'float-style'
    s.textContent = `
      @keyframes floatUp {
        0%   { opacity: 0; transform: translateY(0px); }
        15%  { opacity: 1; }
        80%  { opacity: 1; transform: translateY(-28px); }
        100% { opacity: 0; transform: translateY(-40px); }
      }
    `
    document.head.appendChild(s)
  }

  document.body.appendChild(el)
  const duration = isDeduction ? 4000 : 2600
  setTimeout(() => el.remove(), duration)
}
