import { useAuth } from '../context/AuthContext'

const typeColors = {
  Presencial: { bg: '#e8f4fd', color: '#1a6ea8' },
  Remoto: { bg: '#e8fdf0', color: '#1a8048' },
  Híbrido: { bg: '#f0e8fd', color: '#6a1aa8' },
}

export default function JobCard({ job, navigate }) {
  const { savedJobs, toggleSaveJob, user } = useAuth()
  const isSaved = savedJobs.includes(job.id)
  const tc = typeColors[job.type] || typeColors.Presencial

  return (
    <div
      className="card-hover"
      style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: job.logoColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 12, flexShrink: 0, boxShadow: `0 4px 12px ${job.logoColor}44` }}>
            {job.logo}
          </div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1e3a6e', marginBottom: 2 }}>{job.title}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: '3px 10px', fontSize: 11.5, fontWeight: 600 }}>
            {job.type}
          </span>
          <button
            aria-label={isSaved ? "Remover vaga salva" : "Salvar vaga"}
            onClick={() => (user ? toggleSaveJob(job.id) : navigate('login'))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: isSaved ? 1 : 0.25, transition: 'opacity 0.2s' }}
          >
            🔖
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontSize: 12.5, color: '#555' }}>📍 {job.location}</span>
        <span style={{ fontSize: 12.5, color: '#555' }}>🎓 {job.level}</span>
        <span style={{ fontSize: 12.5, color: '#2e7d32', fontWeight: 600 }}>💰 {job.salary}</span>
        <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>🕐 Há {job.posted}</span>
      </div>

      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <button
        onClick={() => navigate('job-detail', job)}
        style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
      >
        Aplicar para a Vaga →
      </button>
    </div>
  )
}
