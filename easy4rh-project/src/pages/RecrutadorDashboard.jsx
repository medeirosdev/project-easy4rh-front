import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useJobs } from '../context/JobsContext'
import { useBreakpoint } from '../hooks/useBreakpoint'

const menuItems = [
  { id: 'resumo',      icon: '🏠', label: 'Resumo' },
  { id: 'publicar',    icon: '➕', label: 'Publicar Vaga' },
  { id: 'vagas',       icon: '📢', label: 'Vagas Publicadas' },
  { id: 'aplicacoes',  icon: '📋', label: 'Aplicações' },
  { id: 'talentos',    icon: '🌟', label: 'Banco de Talentos' },
]

const mockVagasPublicadas = [
  { id: 1, title: 'Gerente de Loja', location: 'São Paulo, SP', type: 'Presencial', aplicacoes: 14, status: 'Ativa', date: '01/03/2026' },
  { id: 2, title: 'Supervisor de Vendas', location: 'Campinas, SP', type: 'Híbrido', aplicacoes: 7, status: 'Ativa', date: '05/03/2026' },
  { id: 3, title: 'Analista de RH', location: 'São Paulo, SP', type: 'Remoto', aplicacoes: 23, status: 'Encerrada', date: '10/02/2026' },
]

const mockAplicacoes = [
  { id: 1, name: 'Ana Silva', role: 'Gerente de Loja', date: '06/03/2026', status: 'Novo', color: '#3b82f6' },
  { id: 2, name: 'Carlos Mendes', role: 'Gerente de Loja', date: '06/03/2026', status: 'Em análise', color: '#f0a500' },
  { id: 3, name: 'Priya Costa', role: 'Supervisor de Vendas', date: '07/03/2026', status: 'Aprovado', color: '#22c55e' },
  { id: 4, name: 'João Alves', role: 'Analista de RH', date: '02/03/2026', status: 'Reprovado', color: '#ef4444' },
]

const mockTalentos = [
  { id: 1, name: 'Fernanda Lima', role: 'Especialista em T&D', location: 'São Paulo, SP', skills: ['Treinamento', 'DISC', 'PDI'] },
  { id: 2, name: 'Ricardo Souza', role: 'Gerente de RH', location: 'Campinas, SP', skills: ['Recrutamento', 'Folha', 'OKR'] },
  { id: 3, name: 'Juliana Barros', role: 'Analista de Pessoas', location: 'São Paulo, SP', skills: ['9 Box', 'Feedback', 'KPIs'] },
  { id: 4, name: 'Marcos Oliveira', role: 'Coordenador de Varejo', location: 'Rio de Janeiro, RJ', skills: ['Liderança', 'Metas', 'Vendas'] },
]

const jobTypes = ['Presencial', 'Remoto', 'Híbrido']
const levels = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Gerente']

export default function RecrutadorDashboard({ navigate }) {
  const { user, logout } = useAuth()
  const { isMobile } = useBreakpoint()
  const [activeSection, setActiveSection] = useState('resumo')
  const [novaVaga, setNovaVaga] = useState({ title: '', company: '', location: '', type: '', level: '', description: '' })
  const [vagaPublicada, setVagaPublicada] = useState(false)

  const handlePublicar = () => {
    if (novaVaga.title && novaVaga.company) {
      setVagaPublicada(true)
      setTimeout(() => { setVagaPublicada(false); setNovaVaga({ title: '', company: '', location: '', type: '', level: '', description: '' }); setActiveSection('vagas') }, 2000)
    }
  }

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
              { label: 'Vagas ativas', value: 2, icon: '📢', color: '#1e4a8a' },
              { label: 'Total de aplicações', value: mockAplicacoes.length, icon: '📋', color: '#f0a500' },
              { label: 'Aprovados', value: 1, icon: '✅', color: '#22c55e' },
              { label: 'Talentos no banco', value: mockTalentos.length, icon: '🌟', color: '#8b5cf6' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#778899', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent applications */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 16 }}>Aplicações recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {mockAplicacoes.slice(0, 3).map(a => (
              <div key={a.id} style={{ background: 'white', borderRadius: 12, padding: '14px 20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f2fc, #c8daf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1e4a8a', fontSize: 14 }}>
                    {a.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e3a6e' }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: '#778899' }}>{a.role} · {a.date}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: `${a.color}18`, color: a.color }}>{a.status}</span>
              </div>
            ))}
          </div>

          {/* CTA publish */}
          <div style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', borderRadius: 16, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 4 }}>Publique uma nova vaga</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Alcance centenas de candidatos qualificados no varejo.</div>
            </div>
            <button onClick={() => setActiveSection('publicar')} style={{ background: 'white', color: '#1e4a8a', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              + Publicar vaga
            </button>
          </div>
        </div>
      )

      case 'publicar': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Publicar Nova Vaga</h2>
          {vagaPublicada ? (
            <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ color: '#22c55e', fontSize: 18, fontWeight: 800 }}>Vaga publicada com sucesso!</h3>
              <p style={{ color: '#778899', marginTop: 8 }}>Redirecionando para suas vagas...</p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { label: 'Título da vaga *', key: 'title', placeholder: 'Ex: Gerente de Loja' },
                  { label: 'Empresa *', key: 'company', placeholder: 'Nome da empresa' },
                  { label: 'Localização', key: 'location', placeholder: 'Cidade, Estado' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input value={novaVaga[f.key]} onChange={e => setNovaVaga(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Tipo</label>
                  <select value={novaVaga.type} onChange={e => setNovaVaga(prev => ({ ...prev, type: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white' }}>
                    <option value="">Selecione</option>
                    {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Nível</label>
                  <select value={novaVaga.level} onChange={e => setNovaVaga(prev => ({ ...prev, level: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white' }}>
                    <option value="">Selecione</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Descrição da vaga</label>
                <textarea value={novaVaga.description} onChange={e => setNovaVaga(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..." rows={6}
                  style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button onClick={handlePublicar}
                style={{ background: novaVaga.title && novaVaga.company ? 'linear-gradient(135deg, #1a4f8a, #2a7ec8)' : '#ccc', color: 'white', border: 'none', borderRadius: 24, padding: '13px 32px', cursor: novaVaga.title && novaVaga.company ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 15 }}>
                Publicar vaga
              </button>
            </div>
          )}
        </div>
      )

      case 'vagas': return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e' }}>Vagas Publicadas</h2>
            <button onClick={() => setActiveSection('publicar')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              + Nova vaga
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mockVagasPublicadas.map(v => (
              <div key={v.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: '#778899' }}>{v.location} · {v.type} · Publicada em {v.date}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: v.status === 'Ativa' ? '#dcfce7' : '#f3f4f6', color: v.status === 'Ativa' ? '#16a34a' : '#6b7280' }}>{v.status}</span>
                      <span style={{ fontSize: 12, color: '#778899' }}>📋 {v.aplicacoes} aplicações</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setActiveSection('aplicacoes')} style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Ver candidatos</button>
                    <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Encerrar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

      case 'aplicacoes': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Aplicações Recebidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockAplicacoes.map(a => (
              <div key={a.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f2fc, #c8daf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1e4a8a', fontSize: 16, flexShrink: 0 }}>
                    {a.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: '#778899' }}>{a.role} · {a.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: `${a.color}18`, color: a.color }}>{a.status}</span>
                  <button style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Ver CV</button>
                  <button style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Aprovar</button>
                  <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Reprovar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

      case 'talentos': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Banco de Talentos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
            {mockTalentos.map(t => (
              <div key={t.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f2fc, #c8daf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1e4a8a', fontSize: 16, flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#778899' }}>{t.role} · {t.location}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {t.skills.map(s => (
                    <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#e8f2fc', color: '#1e4a8a' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Ver perfil</button>
                  <button style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Contatar</button>
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
      <div style={{ width: 240, background: 'white', borderRight: '1px solid #e8edf2', display: isMobile ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 800, marginBottom: 10 }}>
            {user?.name?.[0]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: '#778899', marginTop: 2 }}>Recrutador</div>
        </div>

        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? '#e8f2fc' : 'transparent', color: activeSection === item.id ? '#1e4a8a' : '#556677', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid #f0f4f8' }}>
          <button onClick={() => navigate('home')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, background: 'transparent', color: '#556677', marginBottom: 2 }}>
            <span>🌐</span> Ver site
          </button>
          <button onClick={() => { logout(); navigate('home') }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, background: 'transparent', color: '#ef4444' }}>
            <span>🚪</span> Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: isMobile ? '24px 16px' : '36px 40px', overflowY: 'auto' }}>
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
