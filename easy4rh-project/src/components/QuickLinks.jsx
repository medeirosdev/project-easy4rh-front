export default function QuickLinks({ navigate }) {
  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e8edf2' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 20px', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          ['🔐', 'Login', 'login'],
          ['📝', 'Registre seu CV', 'register'],
          ['🔍', 'Recrutamento', 'vagas'],
          ['🏢', 'Empresas', 'vagas'],
        ].map(([icon, label, pg]) => (
          <button
            key={label}
            onClick={() => navigate(pg)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#1e4a8a', fontSize: 13.5, fontWeight: 600 }}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  )
}
