import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useJobs } from '../context/JobsContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { profileApi, applicationsApi, coursesApi } from '../services/api'
import { getStageLabel, getStageColor, getStageProgress, pipelineSteps, getStageStepIndex } from '../utils/applicationStages'

const menuItems = [
  { id: 'resumo',       icon: '🏠', label: 'Resumo' },
  { id: 'perfil',       icon: '👤', label: 'Meu Perfil' },
  { id: 'candidaturas', icon: '📋', label: 'Candidaturas' },
  { id: 'cv',           icon: '📄', label: 'Meu CV' },
  { id: 'vagas',        icon: '🔍', label: 'Pesquisar Vagas' },
  { id: 'salvas',       icon: '🔖', label: 'Vagas Salvas' },
  { id: 'cursos',       icon: '🎓', label: 'Meus Cursos' },
]

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR')
}

export default function CandidatoDashboard({ navigate }) {
  const { user, logout, savedJobs, toggleSaveJob } = useAuth()
  const { jobs } = useJobs()
  const { isMobile } = useBreakpoint()
  const [activeSection, setActiveSection] = useState('resumo')
  const [keyword, setKeyword] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [cvSaving, setCvSaving] = useState(false)
  const [cvSaved, setCvSaved] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Candidaturas reais
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)

  // Cursos matriculados
  const [enrollments, setEnrollments] = useState([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false)

  // Campos do formulário de perfil
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [desiredRole, setDesiredRole] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [bio, setBio] = useState('')

  // Carregar perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.get()
        setProfile(data)
        setPhone(data.phone || '')
        setCity(data.city || '')
        setDesiredRole(data.headline || '')
        setLinkedin(data.linkedinUrl || '')
        setBio(data.about || '')
        if (data.resumeUrl) setCvUrl(data.resumeUrl)
      } catch {
        // perfil ainda não existe
      }
    }
    loadProfile()
  }, [])

  // Carregar candidaturas reais
  useEffect(() => {
    const loadApplications = async () => {
      setApplicationsLoading(true)
      try {
        const data = await applicationsApi.myApplications()
        const list = Array.isArray(data) ? data : (data.data || [])
        setApplications(list.map(app => ({
          id: app.id,
          title: app.job?.title || 'Vaga',
          company: app.job?.company?.name || (typeof app.job?.company === 'string' ? app.job.company : ''),
          date: formatDate(app.createdAt),
          status: getStageLabel(app.stage),
          color: getStageColor(app.stage),
          stage: app.stage,
        })))
      } catch {
        setApplications([])
      } finally {
        setApplicationsLoading(false)
      }
    }
    loadApplications()
  }, [])

  // Carregar cursos matriculados
  useEffect(() => {
    const loadEnrollments = async () => {
      setEnrollmentsLoading(true)
      try {
        const data = await coursesApi.myEnrollments()
        const list = Array.isArray(data) ? data : (data.data || [])
        setEnrollments(list)
      } catch {
        setEnrollments([])
      } finally {
        setEnrollmentsLoading(false)
      }
    }
    loadEnrollments()
  }, [])

  // Vagas salvas — cruzar IDs do localStorage com jobs do contexto
  const savedJobsList = useMemo(() =>
    jobs.filter(j => savedJobs.includes(j.id)),
    [jobs, savedJobs]
  )

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
    } finally {
      setProfileLoading(false)
    }
  }

  const handleWithdraw = async (appId) => {
    try {
      await applicationsApi.withdraw(appId)
      setApplications(prev => prev.filter(a => a.id !== appId))
    } catch (err) {
      console.error('Erro ao desistir:', err)
    }
  }

  const filteredJobs = jobs.filter(j =>
    !keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || (typeof j.company === 'object' && j.company ? j.company.name : (j.company || '')).toLowerCase().includes(keyword.toLowerCase())
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
              { label: 'Candidaturas', value: applications.length, icon: '📋', color: '#1e4a8a' },
              { label: 'Em análise', value: applications.filter(a => a.stage === 'SCREENING').length, icon: '⏳', color: '#f0a500' },
              { label: 'Aprovações', value: applications.filter(a => ['HIRED', 'OFFER'].includes(a.stage)).length, icon: '✅', color: '#22c55e' },
              { label: 'Vagas salvas', value: savedJobs.length, icon: '🔖', color: '#8b5cf6' },
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

            {[
              { label: 'Nome completo', value: user?.name || '—' },
              { label: 'E-mail', value: user?.email },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input readOnly value={f.value || ''} style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', color: '#334', background: '#f8fafc' }} />
              </div>
            ))}

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
                Perfil salvo com sucesso!
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
          <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>

            {cvUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#f4f8ff', borderRadius: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 36 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e', marginBottom: 2 }}>Currículo vinculado</div>
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#1e4a8a', wordBreak: 'break-all' }}>{cvUrl}</a>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: '#dcfce7', color: '#16a34a', flexShrink: 0 }}>Ativo</span>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a6e', marginBottom: 6 }}>Nenhum CV vinculado</h3>
                <p style={{ fontSize: 13, color: '#778899', maxWidth: 400, margin: '0 auto' }}>
                  Cole abaixo o link do seu currículo (Google Drive, Dropbox, LinkedIn, etc.)
                </p>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Link do currículo</label>
              <input
                value={cvUrl}
                onChange={e => setCvUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... ou outro link"
                style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', color: '#334' }}
              />
            </div>

            {cvSaved && (
              <div style={{ background: '#dcfce7', border: '1px solid #b2e4c8', borderRadius: 8, padding: '10px 14px', color: '#16a34a', fontSize: 13, marginTop: 16 }}>
                CV salvo com sucesso!
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <button
                onClick={async () => {
                  if (!cvUrl) return
                  setCvSaving(true)
                  setCvSaved(false)
                  try {
                    const formatUrl = (url) => {
                      if (!url) return undefined
                      if (url.startsWith('http://') || url.startsWith('https://')) return url
                      return `https://${url}`
                    }
                    if (profile) {
                      await profileApi.update({ resumeUrl: formatUrl(cvUrl) })
                    } else {
                      await profileApi.create({ fullName: user?.name || '', resumeUrl: formatUrl(cvUrl) })
                    }
                    setCvSaved(true)
                    setTimeout(() => setCvSaved(false), 3000)
                  } catch (err) {
                    console.error('Erro ao salvar CV:', err)
                  } finally {
                    setCvSaving(false)
                  }
                }}
                disabled={cvSaving || !cvUrl}
                style={{ background: cvSaving || !cvUrl ? '#ccc' : 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '12px 28px', cursor: cvSaving || !cvUrl ? 'default' : 'pointer', fontWeight: 700, fontSize: 14 }}
              >
                {cvSaving ? 'Salvando...' : 'Salvar CV'}
              </button>
              {cvUrl && (
                <button
                  onClick={async () => {
                    setCvSaving(true)
                    try {
                      if (profile) await profileApi.update({ resumeUrl: null })
                      setCvUrl('')
                      setCvSaved(false)
                    } catch (err) {
                      console.error('Erro ao remover CV:', err)
                    } finally {
                      setCvSaving(false)
                    }
                  }}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 24, padding: '12px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                >
                  Remover
                </button>
              )}
            </div>
          </div>
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
          {filteredJobs.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <p style={{ color: '#778899', marginTop: 12 }}>Nenhuma vaga encontrada.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredJobs.map(job => (
                <div key={job.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{job.title}</div>
                    <div style={{ fontSize: 13, color: '#778899' }}>{typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')} · {job.location}</div>
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
          )}
        </div>
      )

      case 'salvas': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Vagas Salvas</h2>
          {savedJobsList.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🔖</div>
              <p style={{ color: '#778899', marginTop: 12 }}>Nenhuma vaga salva ainda.</p>
              <button onClick={() => setActiveSection('vagas')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginTop: 16 }}>
                Pesquisar vagas
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {savedJobsList.map(job => (
                <div key={job.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{job.title}</div>
                    <div style={{ fontSize: 13, color: '#778899' }}>{typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')} · {job.location}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#e8f2fc', color: '#1e4a8a', marginTop: 8, display: 'inline-block' }}>{job.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate('job-detail', job)} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Ver vaga</button>
                    <button onClick={() => toggleSaveJob(job.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 24, padding: '9px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Remover</button>
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
          {applicationsLoading ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#778899' }}>Carregando candidaturas...</p>
            </div>
          ) : applications.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>📋</div>
              <p style={{ color: '#778899', marginTop: 12 }}>Você ainda não se candidatou a nenhuma vaga.</p>
              <button onClick={() => setActiveSection('vagas')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginTop: 16 }}>
                Pesquisar vagas
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {applications.map(c => {
                const stepIdx = getStageStepIndex(c.stage)
                const progress = getStageProgress(c.stage)
                return (
                  <div key={c.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{c.title}</div>
                        <div style={{ fontSize: 13, color: '#778899' }}>{c.company} · Aplicado em {c.date}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, background: `${c.color}18`, color: c.color }}>{c.status}</span>
                        {c.stage !== 'HIRED' && c.stage !== 'REJECTED' && (
                          <button onClick={() => handleWithdraw(c.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 11 }}>
                            Desistir
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aabbcc', marginBottom: 6 }}>
                        {pipelineSteps.map((step, i) => (
                          <span key={step} style={{ fontWeight: i <= stepIdx ? 700 : 400, color: c.stage === 'REJECTED' ? (i <= stepIdx ? '#ef4444' : '#ccc') : c.stage === 'HIRED' ? '#22c55e' : (i <= stepIdx ? '#1e4a8a' : '#ccc') }}>{step}</span>
                        ))}
                      </div>
                      <div style={{ height: 4, background: '#e8edf4', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress ?? 14}%`, background: c.stage === 'REJECTED' ? '#ef4444' : c.stage === 'HIRED' ? '#22c55e' : '#1e4a8a', borderRadius: 4, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

      case 'cursos': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Meus Cursos</h2>
          {enrollmentsLoading ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#778899' }}>Carregando cursos...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🎓</div>
              <p style={{ color: '#778899', marginTop: 12 }}>Você ainda não está matriculado em nenhum curso.</p>
              <button onClick={() => navigate('plataforma')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginTop: 16 }}>
                Explorar cursos
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {enrollments.map(enr => {
                const course = enr.course || {}
                const progress = enr.progress || 0
                return (
                  <div key={enr.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{course.title || 'Curso'}</div>
                        <div style={{ fontSize: 13, color: '#778899', marginBottom: 8 }}>
                          {[course.category, course.level && { BEGINNER: 'Iniciante', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' }[course.level]].filter(Boolean).join(' · ')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ flex: 1, height: 6, background: '#e8edf4', borderRadius: 3 }}>
                            <div style={{ height: '100%', background: progress >= 100 ? '#22c55e' : 'linear-gradient(90deg, #1e4a8a, #4a9edd)', borderRadius: 3, width: `${progress}%`, transition: 'width 0.3s' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: progress >= 100 ? '#22c55e' : '#1e4a8a', flexShrink: 0 }}>{progress}%</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`curso-${enr.courseId || course.id}`)} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '9px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        {progress > 0 ? 'Continuar' : 'Iniciar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f4f7fb' }}>

      {/* Sidebar */}
      <div style={{ width: sidebarWidth, background: 'white', borderRight: '1px solid #e8edf2', display: isMobile ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 800, marginBottom: 10 }}>
            {user?.name?.[0]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: '#778899', marginTop: 2 }}>Candidato</div>
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
