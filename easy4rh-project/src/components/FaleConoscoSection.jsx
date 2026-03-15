import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function FaleConoscoSection() {
  const { isMobile } = useBreakpoint()
  const [form, setForm] = useState({ nome: '', celular: '', email: '', empresa: '', tipo: '', interesse: '', mensagem: '' })
  const [submitted, setSubmitted] = useState(false)
  const [interestOpen, setInterestOpen] = useState(false)

  const interesses = ['Estrutura do Curso', 'Formação de liderança', 'Consultoria para empresas', 'Outro/Quero orientação']

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.nome || !form.email) return
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid #8AAEC2',
    fontSize: 13.5,
    background: 'white',
    outline: 'none',
    color: '#333',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
  }

  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 600,
    color: '#1e3a6e',
    marginBottom: 6,
    display: 'block',
  }

  return (
  <div id="fale-conosco" style={{
    background: 'linear-gradient(135deg, #3a6ab0 0%, #5a8fd0 40%, #7aaed8 70%, #9ac8e0 100%)',
    padding: '72px 20px',
  }}>
      <div style={{
        maxWidth: 1050,
        margin: '0 auto',
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 24,
        padding: isMobile ? '40px 24px' : '56px 56px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr',
        gap: isMobile ? 40 : 64,
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}>

        {/* Left — text */}
        <div>
          <h2 style={{
            fontSize: isMobile ? 32 : 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 400,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            Pronto para transformar sua{' '}
            <strong style={{ fontWeight: 800 }}>Gestão de pessoas?</strong>
          </h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.8,
            marginBottom: 36,
            maxWidth: 360,
          }}>
            Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer com pessoas mais engajadas, processos claros e resultados consistentes.
          </p>
          <button
            onClick={() => document.getElementById('fale-form')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'rgba(30,50,90,0.6)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '14px 28px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,50,90,0.85)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,50,90,0.6)'}
          >
            Agendar conversa <span style={{ fontSize: 18 }}>›</span>
          </button>
        </div>

        {/* Right — form card */}
        <div id="fale-form" style={{
          background: 'rgba(220,232,245,0.92)',
          borderRadius: 20,
          padding: isMobile ? '28px 20px' : '36px 32px',
          backdropFilter: 'blur(8px)',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 24 }}>
            Fale com a gente
          </h3>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1e3a6e', marginBottom: 8 }}>Mensagem enviada!</h4>
              <p style={{ fontSize: 14, color: '#556677' }}>Entraremos em contato em breve.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Nome + Você é */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Seu nome *</label>
                  <input style={inputStyle} value={form.nome} onChange={e => handle('nome', e.target.value)}
                    onFocus={e => e.target.style.border = '1.5px solid #4a9edd'}
                    onBlur={e => e.target.style.border = '1.5px solid #d0dcea'} />
                </div>
                <div>
                  <label style={labelStyle}>Você é: *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                    {['Pessoa física', 'Empresa', 'Profissional de RH/Liderança'].map((opt) => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#334' }}>
                        <input type="radio" name="tipo" value={opt} checked={form.tipo === opt} onChange={() => handle('tipo', opt)}
                          style={{ accentColor: '#1e4a8a', width: 14, height: 14 }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Celular */}
              <div>
                <label style={labelStyle}>Número do celular *</label>
                <input style={inputStyle} value={form.celular} onChange={e => handle('celular', e.target.value)} placeholder="(00) 00000-0000"
                  onFocus={e => e.target.style.border = '1.5px solid #4a9edd'}
                  onBlur={e => e.target.style.border = '1.5px solid #d0dcea'} />
              </div>

              {/* Email + Mensagem */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input style={inputStyle} value={form.email} onChange={e => handle('email', e.target.value)} placeholder="you@example.com"
                      onFocus={e => e.target.style.border = '1.5px solid #4a9edd'}
                      onBlur={e => e.target.style.border = '1.5px solid #d0dcea'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Empresa</label>
                    <input style={inputStyle} value={form.empresa} onChange={e => handle('empresa', e.target.value)}
                      onFocus={e => e.target.style.border = '1.5px solid #4a9edd'}
                      onBlur={e => e.target.style.border = '1.5px solid #d0dcea'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Mensagem *</label>
                  <textarea
                    style={{ ...inputStyle, height: 112, resize: 'none' }}
                    value={form.mensagem}
                    onChange={e => handle('mensagem', e.target.value)}
                    placeholder="Conte pra gente sua dúvida ou necessidade"
                    onFocus={e => e.target.style.border = '1.5px solid #4a9edd'}
                    onBlur={e => e.target.style.border = '1.5px solid #d0dcea'}
                  />
                </div>
              </div>

              {/* Interesse dropdown */}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Interesse *</label>
                <div
                  onClick={() => setInterestOpen(!interestOpen)}
                  style={{ ...inputStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: interestOpen ? '1.5px solid #4a9edd' : '1.5px solid #d0dcea' }}
                >
                  <span style={{ color: form.interesse ? '#333' : '#aaa' }}>{form.interesse || 'Selecione seu interesse'}</span>
                  <span style={{ fontSize: 12, color: '#888', transform: interestOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>
                {interestOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e0eaf4', zIndex: 10, overflow: 'hidden' }}>
                    {interesses.map((opt) => (
                      <div key={opt} onClick={() => { handle('interesse', opt); setInterestOpen(false) }}
                        style={{ padding: '11px 14px', cursor: 'pointer', fontSize: 13.5, color: form.interesse === opt ? '#1e4a8a' : '#333', background: form.interesse === opt ? '#f0f6ff' : 'white', fontWeight: form.interesse === opt ? 600 : 400, transition: 'background 0.15s' }}
                        onMouseEnter={e => { if (form.interesse !== opt) e.currentTarget.style.background = '#f8fafc' }}
                        onMouseLeave={e => { if (form.interesse !== opt) e.currentTarget.style.background = 'white' }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={submit}
                style={{
                  background: 'linear-gradient(135deg, #1e3a6e, #2a5a9e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  width: '100%',
                  marginTop: 4,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Enviar mensagem
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
