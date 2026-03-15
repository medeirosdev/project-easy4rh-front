export default function EmConstrucaoPage({ navigate }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #e8f0f8 0%, #f4f8fc 50%, #e0eaf4 100%)',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1e3a6e', marginBottom: 12 }}>
        Página em Construção
      </h1>
      <p style={{ fontSize: 16, color: '#556677', maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
        Estamos preparando algo incrível para você. Em breve esta página estará disponível!
      </p>
      <button
        onClick={() => navigate('home')}
        style={{
          background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)',
          color: 'white', border: 'none', borderRadius: 32,
          padding: '13px 32px', cursor: 'pointer',
          fontWeight: 700, fontSize: 15,
          boxShadow: '0 4px 16px rgba(26,79,138,0.3)',
        }}
      >
        ← Voltar para o início
      </button>
    </div>
  )
}
