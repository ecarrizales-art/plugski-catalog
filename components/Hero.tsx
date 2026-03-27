'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string
    }> = []

    const colors = ['#8b3fc8', '#c8a028', '#4a8a3c', '#a064ff', '#ffffff']

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const scrollToCatalog = () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '80px 24px 60px',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(139,63,200,0.18) 0%, rgba(74,138,60,0.06) 60%, transparent 80%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
        background: 'linear-gradient(transparent, var(--bg))', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '860px' }}>
        {/* LOGO */}
        <div style={{ animation: 'fadeUp 0.6s ease both', marginBottom: '16px' }}>
          <img
            src="/logo-transparent.png"
            alt="The Plugski"
            style={{
              width: 'clamp(240px, 42vw, 500px)',
              height: 'auto',
              filter: 'drop-shadow(0 0 40px rgba(139,63,200,0.7)) drop-shadow(0 0 80px rgba(139,63,200,0.3))',
            }}
          />
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '4px',
          color: 'var(--text-muted)',
          marginBottom: '40px',
          animation: 'fadeUp 0.5s 0.15s ease both',
        }}>
          VAPES · GLASS · WRAPS · ACCESSORIES
        </p>

        <div style={{
          display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.5s 0.25s ease both',
        }}>
          <button
            onClick={scrollToCatalog}
            style={{
              padding: '14px 36px', borderRadius: '4px',
              background: 'linear-gradient(135deg, #8b3fc8, #6a2fa0)',
              border: 'none', color: '#fff', fontSize: '13px',
              fontWeight: '600', letterSpacing: '2px',
              fontFamily: 'var(--font-mono)', transition: 'all 0.2s',
              boxShadow: '0 0 30px rgba(139,63,200,0.4)',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 40px rgba(139,63,200,0.6)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 0 30px rgba(139,63,200,0.4)' }}
          >
            SHOP NOW
          </button>

          <a
            href="https://t.me/the_plugski_shop"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '14px 32px', borderRadius: '4px',
              background: 'transparent', border: '1px solid rgba(200,160,40,0.35)',
              color: '#c8a028', fontSize: '13px', fontWeight: '500',
              letterSpacing: '2px', fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#c8a028'; el.style.background = 'rgba(200,160,40,0.08)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,160,40,0.35)'; el.style.background = 'transparent' }}
          >
            📬 ORDER VIA TELEGRAM
          </a>
        </div>
      </div>

      <div onClick={scrollToCatalog} style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '4px', color: 'var(--text-dim)', fontSize: '10px',
        fontFamily: 'var(--font-mono)', letterSpacing: '3px',
        animation: 'fadeUp 0.5s 0.5s ease both',
      }}>
        <span>SCROLL</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(#8b3fc8, transparent)' }} />
      </div>
    </section>
  )
}
