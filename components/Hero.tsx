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

    const colors = ['#a064ff', '#00e5c0', '#ff4d6d', '#ffffff']

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
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

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

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
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Radial gradient bg */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(160,100,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(transparent, var(--bg))',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '800px' }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(160,100,255,0.3)',
          background: 'rgba(160,100,255,0.08)',
          color: 'var(--accent)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '2px',
          marginBottom: '24px',
          animation: 'fadeUp 0.5s ease forwards',
        }}>
          🔌 PREMIUM SMOKESHOP
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(64px, 12vw, 140px)',
          lineHeight: '0.9',
          letterSpacing: '4px',
          marginBottom: '8px',
          animation: 'fadeUp 0.5s 0.1s ease both',
        }}>
          <span style={{
            display: 'block',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>THE</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(160,100,255,0.4))',
          }}>PLUGSKI</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          letterSpacing: '3px',
          color: 'var(--text-muted)',
          marginBottom: '40px',
          animation: 'fadeUp 0.5s 0.2s ease both',
        }}>
          VAPES · GLASS · WRAPS · ACCESSORIES
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeUp 0.5s 0.3s ease both',
        }}>
          <button
            onClick={scrollToCatalog}
            style={{
              padding: '14px 32px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, var(--accent), #7a3fff)',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1px',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
              boxShadow: '0 0 30px rgba(160,100,255,0.3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(160,100,255,0.5)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(160,100,255,0.3)' }}
          >
            SHOP NOW
          </button>

          <a
            href="https://t.me/the_plugski_shop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 32px',
              borderRadius: '4px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '1px',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            📬 @the_plugski_shop
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        onClick={scrollToCatalog}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-dim)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '2px',
          animation: 'fadeUp 0.5s 0.5s ease both',
        }}
      >
        <span>SCROLL</span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(var(--accent), transparent)',
          animation: 'shimmer 2s infinite',
        }} />
      </div>
    </section>
  )
}
