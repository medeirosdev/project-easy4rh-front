import { useState, useEffect } from 'react'
import { companiesApi, jobsApi } from '../services/api'
import { normalizeJob } from '../context/JobsContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import logoImg from '../assets/logo.png'

const sizeLabels = {
  MICRO: '1–9 funcionários',
  SMALL: '10–49 funcionários',
  MEDIUM: '50–249 funcionários',
  LARGE: '250–999 funcionários',
  ENTERPRISE: '1.000+ funcionários',
}

const typeColors = {
  Presencial: { bg: '#e8f4fd', color: '#1a6ea8' },
  Remoto: { bg: '#e8fdf0', color: '#1a8048' },
  Híbrido: { bg: '#f0e8fd', color: '#6a1aa8' },
  ON_SITE: { bg: '#e8f4fd', color: '#1a6ea8' },
  REMOTE: { bg: '#e8fdf0', color: '#1a8048' },
  HYBRID: { bg: '#f0e8fd', color: '#6a1aa8' },
}


function salary(job) {
  if (job.hideSalary) return 'A combinar'
  if (job.salaryMin && job.salaryMax)
    return `R$ ${Number(job.salaryMin).toLocaleString('pt-BR')} – R$ ${Number(job.salaryMax).toLocaleString('pt-BR')}`
  if (job.salaryMin) return `A partir de R$ ${Number(job.salaryMin).toLocaleString('pt-BR')}`
  if (job.salaryMax) return `Até R$ ${Number(job.salaryMax).toLocaleString('pt-BR')}`
  return job.salary || 'A combinar'
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'hoje'
  if (d === 1) return 'ontem'
  if (d < 7) return `${d} dias atrás`
  if (d < 30) return `${Math.floor(d / 7)} sem. atrás`
  return `${Math.floor(d / 30)} meses atrás`
}

export default function EmpresaPage({ companyId, company: companyProp, navigate }) {
  const { isMobile } = useBreakpoint()
  const [company, setCompany] = useState(companyProp || null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(!companyProp)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('sobre')

  const id = companyId || companyProp?.id

  useEffect(() => {
    if (!id) { setError('Empresa não encontrada.'); setLoading(false); return }
    if (!companyProp) {
      setLoading(true)
      companiesApi.get(id)
        .then(c => { setCompany(c); setLoading(false) })
        .catch(() => { setError('Não foi possível carregar os dados da empresa.'); setLoading(false) })
    }
    setJobsLoading(true)
    jobsApi.list({ companyId: id, limit: 100 })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.jobs || [])
        setJobs(list.map((j, i) => normalizeJob(j, i)))
        setJobsLoading(false)
      })
      .catch(() => { setJobs([]); setJobsLoading(false) })
  }, [id]) // eslint-disable-line

  if (loading) return <LoadingScreen />
  if (error || !company) return <ErrorScreen message={error} navigate={navigate} />

  const location = [company.city, company.state].filter(Boolean).join(', ')
  const hasSocial = company.website || company.linkedinUrl || company.glassdoorUrl || company.instagramUrl

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2851 0%, #1a4f8a 50%, #2a7ec8 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '36px 20px 32px' : '52px 40px 44px', position: 'relative' }}>
          {/* Back button */}
          <button
            onClick={() => navigate('vagas')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 14px', color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 28, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
          >
            ← Voltar às vagas
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? 16 : 28, flexWrap: 'wrap' }}>
            {/* Logo */}
            <div style={{ width: isMobile ? 72 : 96, height: isMobile ? 72 : 96, borderRadius: 20, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden', flexShrink: 0 }}>
              {company.logoUrl
                ? <img src={company.logoUrl} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <img src={logoImg} alt="Easy4RH" style={{ width: '60%', height: '60%', objectFit: 'contain', opacity: 0.5 }} />
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Perfil da Empresa
              </div>
              <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, color: 'white', margin: '0 0 10px', lineHeight: 1.2 }}>
                {company.name}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {company.industry && (
                  <HeroBadge icon="🏢">{company.industry}</HeroBadge>
                )}
                {location && (
                  <HeroBadge icon="📍">{location}</HeroBadge>
                )}
                {company.size && sizeLabels[company.size] && (
                  <HeroBadge icon="👥">{sizeLabels[company.size]}</HeroBadge>
                )}
                {company.legalNature && (
                  <HeroBadge icon="📋">{company.legalNature}</HeroBadge>
                )}
              </div>

              {/* Social links */}
              {hasSocial && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {company.website && (
                    <SocialBtn href={company.website} label="Website">🌐</SocialBtn>
                  )}
                  {company.linkedinUrl && (
                    <SocialBtn href={company.linkedinUrl} label="LinkedIn">in</SocialBtn>
                  )}
                  {company.glassdoorUrl && (
                    <SocialBtn href={company.glassdoorUrl} label="Glassdoor">★</SocialBtn>
                  )}
                  {company.instagramUrl && (
                    <SocialBtn href={company.instagramUrl} label="Instagram">📷</SocialBtn>
                  )}
                </div>
              )}
            </div>

            {/* Vagas count badge */}
            {!jobsLoading && (
              <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '14px 20px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1 }}>{jobs.length}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: 500 }}>
                  {jobs.length === 1 ? 'vaga aberta' : 'vagas abertas'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5eaf0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 0 }}>
          {[
            { key: 'sobre', label: 'Sobre' },
            { key: 'vagas', label: `Vagas (${jobs.length})` },
            ...(company.aboutVideoUrl ? [{ key: 'video', label: 'Vídeo' }] : []),
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none', border: 'none', padding: '16px 20px', cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                color: activeTab === tab.key ? '#1a4f8a' : '#6b7280',
                borderBottom: activeTab === tab.key ? '2.5px solid #1a4f8a' : '2.5px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '36px 40px 64px' }}>

        {/* SOBRE */}
        {activeTab === 'sobre' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: 24 }}>

            {/* Left col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {company.description && (
                <Card title="Sobre a empresa">
                  <p style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {company.description}
                  </p>
                </Card>
              )}

              {company.mission && (
                <Card title="Nossa missão" accent="#16a34a">
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>🎯</div>
                    <p style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {company.mission}
                    </p>
                  </div>
                </Card>
              )}

              {company.values && (
                <Card title="Valores" accent="#7c3aed">
                  <ValuesBlock text={company.values} />
                </Card>
              )}

              {!company.description && !company.mission && !company.values && (
                <div style={{ textAlign: 'center', padding: '48px 24px', background: 'white', borderRadius: 16, border: '1px solid #e5eaf0', color: '#9ca3af' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
                  <p style={{ margin: 0, fontSize: 14 }}>A empresa ainda não adicionou informações sobre si mesma.</p>
                </div>
              )}
            </div>

            {/* Right col — sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5eaf0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#1a4f8a', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
                  Informações
                </div>
                <InfoRow label="Setor" value={company.industry} icon="🏢" />
                <InfoRow label="Porte" value={sizeLabels[company.size]} icon="👥" />
                <InfoRow label="Localização" value={location} icon="📍" />
                <InfoRow label="Natureza" value={company.legalNature} icon="📋" />
              </div>

              {hasSocial && (
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5eaf0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#1a4f8a', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
                    Links
                  </div>
                  {company.website && <LinkRow href={company.website} label="Website" icon="🌐" />}
                  {company.linkedinUrl && <LinkRow href={company.linkedinUrl} label="LinkedIn" icon="💼" />}
                  {company.glassdoorUrl && <LinkRow href={company.glassdoorUrl} label="Glassdoor" icon="★" />}
                  {company.instagramUrl && <LinkRow href={company.instagramUrl} label="Instagram" icon="📷" />}
                </div>
              )}

              {/* CTA vagas */}
              {jobs.length > 0 && (
                <button
                  onClick={() => setActiveTab('vagas')}
                  style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14, width: '100%' }}
                >
                  Ver {jobs.length} {jobs.length === 1 ? 'vaga aberta' : 'vagas abertas'} →
                </button>
              )}
            </div>
          </div>
        )}

        {/* VAGAS */}
        {activeTab === 'vagas' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a6e', margin: '0 0 4px' }}>
                Vagas abertas em {company.name}
              </h2>
              <p style={{ fontSize: 13.5, color: '#6b7280', margin: 0 }}>
                {jobs.length === 0 ? 'Nenhuma vaga aberta no momento.' : `${jobs.length} ${jobs.length === 1 ? 'vaga disponível' : 'vagas disponíveis'}`}
              </p>
            </div>

            {jobsLoading
              ? <JobsSkeleton />
              : jobs.length === 0
                ? <EmptyJobs company={company} navigate={navigate} />
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {jobs.map(job => (
                      <CompanyJobCard key={job.id} job={job} navigate={navigate} />
                    ))}
                  </div>
            }
          </div>
        )}

        {/* VIDEO */}
        {activeTab === 'video' && company.aboutVideoUrl && (
          <Card title="Conheça mais sobre nós">
            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
              {isYouTube(company.aboutVideoUrl)
                ? <iframe
                    src={toYouTubeEmbed(company.aboutVideoUrl)}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Vídeo institucional"
                  />
                : <video
                    src={company.aboutVideoUrl}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
              }
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────

function HeroBadge({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 20, padding: '4px 12px', fontSize: 12.5, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
      {icon} {children}
    </span>
  )
}

function SocialBtn({ href, label, children }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      title={label}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
    >
      {children}
    </a>
  )
}

function Card({ title, accent = '#1a4f8a', children }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5eaf0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 18, background: accent, borderRadius: 3 }} />
        <div style={{ fontSize: 13, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {title}
        </div>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value, icon }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  )
}

function LinkRow({ href, label, icon }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, textDecoration: 'none', color: '#1a4f8a', marginBottom: 4, transition: 'background 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f0f6ff' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>↗</span>
    </a>
  )
}

function ValuesBlock({ text }) {
  const lines = text.split(/\n|;|,/).map(l => l.trim()).filter(Boolean)
  if (lines.length <= 1) {
    return <p style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {lines.map((v, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f3ff', color: '#6d28d9', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600 }}>
          <span style={{ fontSize: 10, color: '#a78bfa' }}>✦</span> {v}
        </span>
      ))}
    </div>
  )
}

function CompanyJobCard({ job, navigate }) {
  // job already normalized — job.type, job.level, job.location, job.salary are ready
  const tc = typeColors[job.type] || typeColors.Presencial
  const sal = job.salary && job.salary !== 'A combinar' ? job.salary : salary(job)
  const posted = timeAgo(job.createdAt || job.publishedAt)

  return (
    <div
      onClick={() => navigate('job-detail', job)}
      style={{ background: 'white', borderRadius: 14, border: '1px solid #e5eaf0', padding: '18px 22px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,79,138,0.12)'; e.currentTarget.style.borderColor = '#c3d9f5' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5eaf0' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1e3a6e', marginBottom: 6, lineHeight: 1.3 }}>{job.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {job.location && <Tag>📍 {job.location}</Tag>}
            {job.level && <Tag>🎓 {job.level}</Tag>}
            {sal !== 'A combinar' && <Tag color="#16a34a">💰 {sal}</Tag>}
            {(job.isFreelance || job.contractType === 'FREELANCE') && (
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#f5f3ff', color: '#7c3aed' }}>Freelance</span>
            )}
          </div>
          {posted && <div style={{ fontSize: 12, color: '#9ca3af' }}>🕐 {posted}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {job.type}
          </span>
          <span style={{ fontSize: 12.5, color: '#1a4f8a', fontWeight: 600 }}>Ver vaga →</span>
        </div>
      </div>
    </div>
  )
}

function Tag({ children, color }) {
  return (
    <span style={{ fontSize: 12.5, color: color || '#6b7280' }}>{children}</span>
  )
}

function EmptyJobs({ company, navigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', background: 'white', borderRadius: 16, border: '1px solid #e5eaf0' }}>
      <div style={{ fontSize: 44, marginBottom: 16 }}>📭</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e3a6e', margin: '0 0 8px' }}>
        Nenhuma vaga aberta no momento
      </h3>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>
        {company.name} não tem vagas abertas agora. Explore outras oportunidades!
      </p>
      <button
        onClick={() => navigate('vagas')}
        style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
      >
        Ver todas as vagas
      </button>
    </div>
  )
}

function JobsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #e5eaf0', padding: '18px 22px' }}>
          <div style={{ height: 18, background: '#f0f4f8', borderRadius: 6, width: '55%', marginBottom: 10 }} />
          <div style={{ height: 13, background: '#f0f4f8', borderRadius: 6, width: '35%' }} />
        </div>
      ))}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e5eaf0', borderTopColor: '#1a4f8a', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#6b7280', fontSize: 14 }}>Carregando perfil da empresa…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}

function ErrorScreen({ message, navigate }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏢</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a6e', marginBottom: 8 }}>Empresa não encontrada</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>{message || 'Não foi possível carregar os dados desta empresa.'}</p>
        <button
          onClick={() => navigate('vagas')}
          style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
        >
          Explorar vagas
        </button>
      </div>
    </div>
  )
}

function isYouTube(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'))
}

function toYouTubeEmbed(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
}
