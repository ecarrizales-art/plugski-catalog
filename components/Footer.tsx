export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          letterSpacing: '4px',
          background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          THE PLUGSKI
        </div>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '24px',
        }}>
          Premium smoke shop. Order via Telegram and we'll get back to you.
        </p>

        <a
          href="https://linktr.ee/956vrtshopski"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '20px',
            background: 'rgba(34,158,217,0.1)',
            border: '1px solid rgba(34,158,217,0.3)',
            color: '#229ED9',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
            transition: 'all 0.2s',
          }}
        >
          📬 @the_plugski_shop
        </a>

        <p style={{
          marginTop: '32px',
          fontSize: '11px',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '1px',
        }}>
          © {new Date().getFullYear()} THE PLUGSKI — ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  )
}
