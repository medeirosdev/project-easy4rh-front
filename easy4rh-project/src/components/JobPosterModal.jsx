import { useRef } from 'react'
import QRCode from 'react-qr-code'

// Generates a shareable URL for a job posting.
// In production this should point to the public job detail page.
function getJobUrl(jobId) {
  return `${window.location.origin}/vaga/${jobId}`
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

export default function JobPosterModal({ job, company, onClose }) {
  const posterRef = useRef(null)
  const jobUrl = getJobUrl(job.id)

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
      // html2canvas not installed — fall back to print
      window.print()
    }
  }

  const logoUrl = company?.logoUrl || null
  const companyName = company?.name || 'Empresa'
  const location = [job.city, job.state].filter(Boolean).join(', ') || job.location || ''

  return (
    <>
      {/* Print styles — only poster visible when printing */}
      <style>{`
        @media print {
          body > *:not(#job-poster-print-root) { display: none !important; }
          #job-poster-print-root { display: block !important; }
          .poster-modal-overlay { position: static !important; background: none !important; padding: 0 !important; }
          .poster-modal-actions { display: none !important; }
          .poster-modal-backdrop { display: none !important; }
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
          style={{
            position: 'fixed', top: 20, right: 20, display: 'flex', gap: 10, zIndex: 1001,
          }}
        >
          <button
            onClick={handleDownload}
            style={{ background: '#1a4f8a', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
          >
            Baixar PNG
          </button>
          <button
            onClick={handlePrint}
            style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
          >
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
          {/* Header band */}
          <div style={{ background: 'linear-gradient(135deg, #1a4f8a 0%, #2a7ec8 100%)', padding: '36px 40px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', background: 'white', padding: 4 }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white', fontWeight: 800 }}>
                  {companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 2 }}>Vaga em aberto</div>
                <div style={{ fontSize: 16, color: 'white', fontWeight: 700 }}>{companyName}</div>
              </div>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.2 }}>
              {job.title}
            </h1>
            {job.isConfidential && (
              <span style={{ display: 'inline-block', marginTop: 10, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', letterSpacing: 1 }}>
                VAGA CONFIDENCIAL
              </span>
            )}
          </div>

          {/* Tags row */}
          <div style={{ display: 'flex', gap: 10, padding: '20px 40px 0', flexWrap: 'wrap' }}>
            {location && <Tag icon="📍">{location}</Tag>}
            {job.locationType && <Tag icon="💼">{formatType(job.locationType)}</Tag>}
            {job.contractType && <Tag icon="📄">{formatContract(job.contractType)}</Tag>}
            {job.experienceLevel && <Tag icon="⭐">{formatLevel(job.experienceLevel)}</Tag>}
          </div>

          {/* Salary */}
          {!job.hideSalary && (job.salaryMin || job.salaryMax) && (
            <div style={{ padding: '16px 40px 0' }}>
              <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '12px 16px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>💰</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#15803d' }}>
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

          {/* Description */}
          {job.description && (
            <Section title="Sobre a vaga">
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                {job.description.length > 500 ? job.description.slice(0, 500) + '…' : job.description}
              </p>
            </Section>
          )}

          {/* Requirements */}
          {job.requirements && (
            <Section title="Requisitos">
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                {job.requirements.length > 300 ? job.requirements.slice(0, 300) + '…' : job.requirements}
              </p>
            </Section>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* QR Code footer */}
          <div style={{ borderTop: '1.5px solid #e8f0f8', margin: '0 40px', paddingTop: 24, paddingBottom: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ background: 'white', border: '3px solid #e8f0f8', borderRadius: 12, padding: 10, flexShrink: 0 }}>
              <QRCode value={jobUrl} size={96} level="M" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1e3a6e', marginBottom: 6 }}>
                Candidate-se agora!
              </div>
              <div style={{ fontSize: 11.5, color: '#778899', lineHeight: 1.5, marginBottom: 8 }}>
                Escaneie o QR Code com seu celular<br />ou acesse o link abaixo:
              </div>
              <div style={{ fontSize: 11, color: '#2a7ec8', wordBreak: 'break-all', fontWeight: 600 }}>
                {jobUrl}
              </div>
              {job.expiresAt && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#9ca3af' }}>
                  Inscrições até {new Date(job.expiresAt).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Tag({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#374151', background: '#f3f4f6', borderRadius: 20, padding: '5px 12px', fontWeight: 500 }}>
      <span>{icon}</span>
      {children}
    </span>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ padding: '16px 40px 0' }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#1a4f8a', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
