import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useJobs } from '../context/JobsContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { profileApi } from '../services/api'

const menuItems = [
  { id: 'resumo',     icon: '🏠', label: 'Resumo' },
  { id: 'perfil',     icon: '👤', label: 'Meu Perfil' },
  { id: 'cv',         icon: '📄', label: 'Meu CV' },
  { id: 'vagas',      icon: '🔍', label: 'Pesquisar Vagas' },
  { id: 'salvas',     icon: '🔖', label: 'Vagas Salvas' },
]

const mockCandidaturas = [
  { id: 1, title: 'Gerente de Loja', company: 'Magazine Luiza', date: '05/03/2026', status: 'Em análise', color: '#f0a500' },
  { id: 2, title: 'Supervisor de Vendas', company: 'Renner', date: '01/03/2026', status: 'Aprovado', color: '#22c55e' },
  { id: 3, title: 'Analista de RH', company: 'Riachuelo', date: '20/02/2026', status: 'Reprovado', color: '#ef4444' },
]

const mockSalvas = [
  { id: 1, title: 'Coordenador de RH', company: 'C&A', location: 'São Paulo, SP', type: 'Presencial' },
  { id: 2, title: 'Líder de Equipe', company: 'Americanas', location: 'Rio de Janeiro, RJ', type: 'Híbrido' },
  { id: 3, title: 'Analista de T&D', company: 'Lojas Marisa', location: 'Campinas, SP', type: 'Remoto' },
]

export default function CandidatoDashboard({ navigate }) {
  const { user, logout } = useAuth()
  const { jobs } = useJobs()
  const { isMobile } = useBreakpoint()
  const [activeSection, setActiveSection] = useState('resumo')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [cvUploaded, setCvUploaded] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // campos do formulário
const [phone, setPhone] = useState('')
const [city, setCity] = useState('')
const [desiredRole, setDesiredRole] = useState('')
const [linkedin, setLinkedin] = useState('')
const [bio, setBio] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.get()
        setProfile(data)
        setPhone(data.phone || '')
        setCity(data.city || '')
        setDesiredRole(data.desiredRole || '')
        setLinkedin(data.linkedin || '')
        setBio(data.bio || '')
      } catch {
        // perfil ainda não existe — ok
      }
    }
    loadProfile()
  }, [])

    const handleSaveProfile = async () => {
    setProfileLoading(true)
    setProfileSaved(false)
    try {
      const formatUrl = (url) => {
        if (!url) return undefined
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        return `https://${url}`
      }

      const payload = {
        fullName: user?.name || '',
        phone: phone || undefined,
        city: city || undefined,
        headline: desiredRole || undefined,
        about: bio || undefined,
        linkedinUrl: formatUrl(linkedin),
      }

      if (profile) {
        await profileApi.update(payload)
      } else {
        await profileApi.create(payload)
      }
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar perfil:', err)
      console.error('Detalhe do erro:', err.response?.data)
    } finally {
      setProfileLoading(false)
    }
  }


  const filteredJobs = jobs.filter(j =>
    !keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase())
  )

  const sidebarWidth = 240

  const renderSection = () => {
    switch (activeSection) {

      case 'resumo': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>
            Olá, {user?.name?.split(' ')[0]} 👋
          </h2>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Candidaturas', value: mockCandidaturas.length, icon: '📋', color: '#1e4a8a' },
              { label: 'Em análise', value: 1, icon: '⏳', color: '#f0a500' },
              { label: 'Aprovações', value: 1, icon: '✅', color: '#22c55e' },
              { label: 'Vagas salvas', value: mockSalvas.length, icon: '🔖', color: '#8b5cf6' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#778899', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA complete profile */}
          <div style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', borderRadius: 16, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 4 }}>Complete seu perfil</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Perfis completos têm 3x mais chances de serem vistos.</div>
            </div>
            <button onClick={() => setActiveSection('perfil')} style={{ background: 'white', color: '#1e4a8a', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              Completar agora
            </button>
          </div>
        </div>
      )

        case 'perfil': return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Meu Perfil</h2>
      <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white', fontWeight: 800, flexShrink: 0 }}>
            {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e3a6e' }}>{user?.name || user?.email?.split('@')[0]}</div>
            <div style={{ fontSize: 13, color: '#778899' }}>{user?.email}</div>
          </div>
        </div>

        {/* Campos fixos (somente leitura) */}
        {[
          { label: 'Nome completo', value: user?.name || '—' },
          { label: 'E-mail', value: user?.email },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input readOnly value={f.value || ''} style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', color: '#334', background: '#f8fafc' }} />
          </div>
        ))}

        {/* Campos editáveis */}
        {[
          { label: 'Telefone', value: phone, set: setPhone, placeholder: '(11) 99999-9999' },
          { label: 'Cidade', value: city, set: setCity, placeholder: 'São Paulo, SP' },
          { label: 'Cargo desejado', value: desiredRole, set: setDesiredRole, placeholder: 'Ex: Gerente de Loja' },
          { label: 'LinkedIn', value: linkedin, set: setLinkedin, placeholder: 'linkedin.com/in/seuperfil' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', color: '#334' }} />
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Sobre mim</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Fale um pouco sobre você..." rows={4} style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box', color: '#334' }} />
        </div>

        {profileSaved && (
          <div style={{ background: '#dcfce7', border: '1px solid #b2e4c8', borderRadius: 8, padding: '10px 14px', color: '#16a34a', fontSize: 13, marginBottom: 16 }}>
            ✅ Perfil salvo com sucesso!
          </div>
        )}

        <button onClick={handleSaveProfile} disabled={profileLoading} style={{ background: profileLoading ? '#aaa' : 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '12px 28px', cursor: profileLoading ? 'default' : 'pointer', fontWeight: 700, fontSize: 14 }}>
          {profileLoading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )

      case 'cv': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Meu CV</h2>
          {!cvUploaded ? (
            <div style={{ background: 'white', borderRadius: 16, padding: '48px 28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e3a6e', marginBottom: 8 }}>Nenhum CV enviado ainda</h3>
              <p style={{ fontSize: 13.5, color: '#778899', marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
                Envie seu currículo para se candidatar às vagas com mais agilidade. Aceitamos PDF, DOC e DOCX.
              </p>
              <label style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                📎 Enviar CV
                <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={() => setCvUploaded(true)} />
              </label>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#f4f8ff', borderRadius: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 36 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>curriculo_{user?.name?.split(' ')[0].toLowerCase()}.pdf</div>
                  <div style={{ fontSize: 12, color: '#778899' }}>Enviado hoje · 245 KB</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: '#dcfce7', color: '#16a34a' }}>✓ Ativo</span>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  🔄 Substituir CV
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                </label>
                <button onClick={() => setCvUploaded(false)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  🗑️ Remover
                </button>
              </div>
            </div>
          )}
        </div>
      )

      case 'vagas': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Pesquisar Vagas</h2>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Cargo, empresa ou palavra-chave..."
              style={{ flex: 1, minWidth: 200, border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '11px 16px', fontSize: 13.5, outline: 'none' }}
            />
            <button style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              Buscar
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#778899', marginBottom: 16 }}><strong style={{ color: '#1e3a6e' }}>{filteredJobs.length}</strong> vagas encontradas</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredJobs.map(job => (
              <div key={job.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: '#778899' }}>{job.company} · {job.location}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#e8f2fc', color: '#1e4a8a' }}>{job.type}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#f0f4f8', color: '#556677' }}>{job.level}</span>
                  </div>
                </div>
                <button onClick={() => navigate('job-detail', job)} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '9px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  Ver vaga
                </button>
              </div>
            ))}
          </div>
        </div>
      )

      case 'salvas': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Vagas Salvas</h2>
          {mockSalvas.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🔖</div>
              <p style={{ color: '#778899', marginTop: 12 }}>Nenhuma vaga salva ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockSalvas.map(job => (
                <div key={job.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{job.title}</div>
                    <div style={{ fontSize: 13, color: '#778899' }}>{job.company} · {job.location}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#e8f2fc', color: '#1e4a8a', marginTop: 8, display: 'inline-block' }}>{job.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Candidatar</button>
                    <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 24, padding: '9px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )

      case 'candidaturas': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Minhas Candidaturas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockCandidaturas.map(c => (
              <div key={c.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: '#778899' }}>{c.company} · Aplicado em {c.date}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, background: `${c.color}18`, color: c.color }}>{c.status}</span>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aabbcc', marginBottom: 6 }}>
                    {['Aplicado', 'Em análise', 'Entrevista', 'Decisão'].map((step, i) => (
                      <span key={step} style={{ fontWeight: c.status === 'Aprovado' || i <= 1 ? 700 : 400, color: c.status === 'Aprovado' ? '#22c55e' : i <= 1 ? '#1e4a8a' : '#ccc' }}>{step}</span>
                    ))}
                  </div>
                  <div style={{ height: 4, background: '#e8edf4', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: c.status === 'Aprovado' ? '100%' : c.status === 'Em análise' ? '50%' : '25%', background: c.status === 'Aprovado' ? '#22c55e' : c.status === 'Reprovado' ? '#ef4444' : '#1e4a8a', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f4f7fb' }}>

      {/* Sidebar */}
      <div style={{ width: sidebarWidth, background: 'white', borderRight: '1px solid #e8edf2', display: isMobile ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        {/* User info */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 800, marginBottom: 10 }}>
            {user?.name?.[0]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: '#778899', marginTop: 2 }}>Candidato</div>
        </div>

        {/* Menu */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? '#e8f2fc' : 'transparent', color: activeSection === item.id ? '#1e4a8a' : '#556677', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #f0f4f8' }}>
          <button onClick={() => navigate('vagas')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, background: 'transparent', color: '#556677', marginBottom: 2 }}>
            <span>🌐</span> Ver site
          </button>
          <button onClick={() => { logout(); navigate('home') }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, background: 'transparent', color: '#ef4444' }}>
            <span>🚪</span> Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: isMobile ? '24px 16px' : '36px 40px', overflowY: 'auto' }}>
        {/* Mobile menu */}
        {isMobile && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            {menuItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? '#1e4a8a' : 'white', color: activeSection === item.id ? 'white' : '#556677' }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
        {renderSection()}
      </div>
    </div>
  )
}
