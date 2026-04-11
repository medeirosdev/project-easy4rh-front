import { useRef } from 'react'
import QRCode from 'react-qr-code'
import logoImg from '../assets/logo.png'

function getJobUrl() {
  return `${window.location.origin}`
}

function formatType(type) {
  return { ON_SITE: 'Presencial', REMOTE: 'Remoto', HYBRID: 'Híbrido' }[type] || type
}

function formatLevel(level) {
  return {
    INTERN: 'Estágio', NO_EXPERIENCE: 'Sem experiência', UP_TO_1_YEAR: 'Até 1 ano',
    TWO_YEARS_PLUS: '2 anos ou mais', JUNIOR: 'Júnior', MID: 'Pleno',
    SENIOR: 'Sênior', LEAD: 'Lead', MANAGER: 'Gerente',
  }[level] || level
}

function formatContract(contract) {
  return { CLT: 'CLT', PJ: 'PJ', INTERNSHIP: 'Estágio', TEMPORARY: 'Temporário', FREELANCE: 'Freelance' }[contract] || contract
}

// Normaliza campo que pode vir como string ou array (responsabilidades/requisitos)
function toText(value) {
  if (!value) return ''
  if (Array.isArray(value)) return value.join('\n')
  return String(value)
}

export default function JobPosterModal({ job, company, onClose }) {
  const posterRef = useRef(null)
  const jobUrl = getJobUrl()

  function handlePrint() {
    window.print()
  }

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `poster-${job.title.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      window.print()
    }
  }

  const logoUrl = company?.logoUrl || null
  const companyName = company?.name || 'Empresa'
  const location = [job.city, job.state].filter(Boolean).join(', ') || job.location || ''

  const description = toText(job.description)
  const requirements = toText(job.requirements)
  const responsibilities = toText(job.responsibilities)

  // Trunca texto preservando palavras completas
  function truncate(text, max) {
    if (!text || text.length <= max) return text
    return text.slice(0, max).replace(/\s\S*$/, '') + '…'
  }

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#job-poster-print-root) { display: none !important; }
          #job-poster-print-root { display: block !important; }
          .poster-modal-overlay { position: static !important; background: none !important; padding: 0 !important; }
          .poster-modal-actions { display: none !important; }
          .poster-modal-box { box-shadow: none !important; max-height: none !important; overflow: visible !important; }
        }
      `}</style>

      <div
        id="job-poster-print-root"
        className="poster-modal-overlay"
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Action bar */}
        <div
          className="poster-modal-actions"
          style={{ position: 'fixed', top: 20, right: 20, display: 'flex', gap: 10, zIndex: 1001 }}
        >
          <button onClick={handleDownload} style={{ background: '#1a4f8a', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Baixar PNG
          </button>
          <button onClick={handlePrint} style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Imprimir
          </button>
          <button onClick={onClose} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Fechar
          </button>
        </div>

        {/* Poster — A4 proportions */}
        <div
          className="poster-modal-box"
          ref={posterRef}
          style={{
            width: 595, minHeight: 842, background: 'white', borderRadius: 18,
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', maxHeight: '95vh', overflowY: 'auto',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div style={{ background: 'linear-gradient(135deg, #1a4f8a 0%, #2a7ec8 100%)', padding: '32px 40px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>

              {/* Empresa */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {logoUrl ? (
                  <img src={logoUrl} alt={companyName} crossOrigin="anonymous"
                    style={{ width: 54, height: 54, borderRadius: 12, objectFit: 'cover', background: 'white', padding: 4 }} />
                ) : (
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, flexShrink: 0 }}>
                    <img src={logoImg} alt="Easy4RH" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginBottom: 2, letterSpacing: 0.5 }}>VAGA EM ABERTO</div>
                  <div style={{ fontSize: 15, color: 'white', fontWeight: 700 }}>{companyName}</div>
                </div>
              </div>

              {/* Easy4RH branding no canto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.75 }}>
                <img src={logoImg} alt="Easy4RH" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: 0.5 }}>EASY4RH</span>
              </div>
            </div>

            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: '0 0 8px', lineHeight: 1.2 }}>
              {job.title}
            </h1>

            {job.isConfidential && (
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', letterSpacing: 1 }}>
                  VAGA CONFIDENCIAL
                </span>
              </div>
            )}
          </div>

          {/* ── Tags ── */}
          <div style={{ display: 'flex', gap: 8, padding: '18px 40px 0', flexWrap: 'wrap' }}>
            {location && <Tag icon="📍">{location}</Tag>}
            {job.locationType && <Tag icon="💼">{formatType(job.locationType)}</Tag>}
            {job.contractType && <Tag icon="📄">{formatContract(job.contractType)}</Tag>}
            {job.experienceLevel && <Tag icon="⭐">{formatLevel(job.experienceLevel)}</Tag>}
            {job.area && <Tag icon="🏷️">{job.area}</Tag>}
          </div>

          {/* ── Salário ── */}
          {!job.hideSalary && (job.salaryMin || job.salaryMax) && (
            <div style={{ padding: '14px 40px 0' }}>
              <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15 }}>💰</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#15803d' }}>
                  {job.salaryMin && job.salaryMax
                    ? `R$ ${Number(job.salaryMin).toLocaleString('pt-BR')} – R$ ${Number(job.salaryMax).toLocaleString('pt-BR')}`
                    : job.salaryMin
                      ? `A partir de R$ ${Number(job.salaryMin).toLocaleString('pt-BR')}`
                      : `Até R$ ${Number(job.salaryMax).toLocaleString('pt-BR')}`
                  }
                </span>
              </div>
            </div>
          )}

          {/* ── Sobre a vaga ── */}
          {description && (
            <Section title="Sobre a vaga">
              <p style={{ fontSize: 12.5, color: '#4b5563', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                {truncate(description, 420)}
              </p>
            </Section>
          )}

          {/* ── Responsabilidades e Requisitos lado a lado ── */}
          {(responsibilities || requirements) && (
            <div style={{ display: 'grid', gridTemplateColumns: responsibilities && requirements ? '1fr 1fr' : '1fr', gap: 0, padding: '16px 40px 0' }}>
              {responsibilities && (
                <div style={{ paddingRight: requirements ? 16 : 0, borderRight: requirements ? '1px solid #e8f0f8' : 'none' }}>
                  <SectionInline title="Responsabilidades">
                    <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {truncate(responsibilities, 320)}
                    </p>
                  </SectionInline>
                </div>
              )}
              {requirements && (
                <div style={{ paddingLeft: responsibilities ? 16 : 0 }}>
                  <SectionInline title="Requisitos">
                    <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {truncate(requirements, 320)}
                    </p>
                  </SectionInline>
                </div>
              )}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1, minHeight: 16 }} />

          {/* ── QR Code footer ── */}
          <div style={{ background: '#f8fafc', borderTop: '1.5px solid #e8f0f8', padding: '20px 40px', display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ background: 'white', border: '3px solid #e8f0f8', borderRadius: 12, padding: 8, flexShrink: 0 }}>
              <QRCode value={jobUrl} size={80} level="M" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1e3a6e', marginBottom: 4 }}>
                Candidate-se agora!
              </div>
              <div style={{ fontSize: 11, color: '#778899', lineHeight: 1.5, marginBottom: 6 }}>
                Escaneie o QR Code ou acesse o site e busque pela vaga:
              </div>
              <div style={{ fontSize: 12, color: '#1a4f8a', fontWeight: 700, marginBottom: 3 }}>
                "{job.title}"
              </div>
              <div style={{ fontSize: 10.5, color: '#2a7ec8', fontWeight: 500 }}>
                {jobUrl}
              </div>
              {job.expiresAt && (
                <div style={{ marginTop: 6, fontSize: 10.5, color: '#9ca3af' }}>
                  Inscrições até {new Date(job.expiresAt).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
            {/* Easy4RH branding no footer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.5, flexShrink: 0 }}>
              <img src={logoImg} alt="Easy4RH" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              <span style={{ fontSize: 9, color: '#1e3a6e', fontWeight: 700, letterSpacing: 0.5 }}>EASY4RH</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Tag({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', background: '#f3f4f6', borderRadius: 20, padding: '4px 11px', fontWeight: 500 }}>
      <span>{icon}</span>
      {children}
    </span>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ padding: '14px 40px 0' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#1a4f8a', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 18, height: 2, background: '#1a4f8a', borderRadius: 2 }} />
        {title}
      </div>
      {children}
    </div>
  )
}

function SectionInline({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#1a4f8a', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 14, height: 2, background: '#1a4f8a', borderRadius: 2 }} />
        {title}
      </div>
      {children}
    </div>
  )
}
