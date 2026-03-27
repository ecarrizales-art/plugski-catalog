export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <img
          src="/logo-transparent.png"
          alt="The Plugski"
          style={{
            height: '80px', width: 'auto',
            filter: 'drop-shadow(0 0 20px rgba(139,63,200,0.4))',
            marginBottom: '16px',
          }}
        />

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Premium smoke shop. Order via Telegram and we'll get back to you.
        </p>

        <a
          href="https://t.me/the_plugski_shop"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '20px',
            background: 'rgba(34,158,217,0.1)', border: '1px solid rgba(34,158,217,0.3)',
            color: '#229ED9', fontSize: '13px', fontFamily: 'var(--font-mono)',
            letterSpacing: '1px', transition: 'all 0.2s',
          }}
        >
          📬 @the_plugski_shop
        </a>

        <p style={{
          marginTop: '32px', fontSize: '11px', color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)', letterSpacing: '1px',
        }}>
          © {new Date().getFullYear()} THE PLUGSKI — ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  )
}
