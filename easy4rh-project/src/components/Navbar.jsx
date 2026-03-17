import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import logoImg from '../assets/logo.png'

const Logo = ({ onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
    <img src={logoImg} alt="Easy4RH Logo" style={{ height: 66, objectFit: 'contain' }} />
  </div>
)

const Icons = {
  home: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  sobre: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  servicos: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  ),
  vagas: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  treinamentos: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  faleConosco: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
}

const pilares = [
  { label: 'Pessoas',     page: 'pessoas',     icon: '👥', color: '#1e4a8a', desc: 'Desenvolvimento humano estratégico' },
  { label: 'Processos',   page: 'processos',   icon: '⚙️', color: '#1e4a8a', desc: 'Fluxos otimizados para resultados' },
  { label: 'Performance', page: 'performance', icon: '📈', color: '#1e4a8a', desc: 'Metas, KPIs e reconhecimento' },
  { label: 'Prevenção',   page: 'prevencao',   icon: '🛡️', color: '#1e4a8a', desc: 'Compliance e proteção jurídica' },
]

const navItems = [
  { label: 'Home',         page: 'home',          icon: Icons.home },
  { label: 'Sobre Nós',    page: 'sobre',         icon: Icons.sobre },
  { label: 'Serviços',     page: null,            icon: Icons.servicos, hasDropdown: true },
  { label: 'Vagas',        page: 'vagas',         icon: Icons.vagas },
  { label: 'Treinamentos', page: 'treinamentos', icon: Icons.treinamentos },
  { label: 'FAQ',          page: 'faq',           icon: Icons.faq },
  { label: 'Fale Conosco', page: null,            icon: Icons.faleConosco, scrollTo: 'fale-conosco' },
]

export default function Navbar({ navigate, page }) {
  const { user, logout } = useAuth()
  const { isMobile } = useBreakpoint()
  const [userMenu, setUserMenu]         = useState(false)
  const [servicosOpen, setServicosOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileServicosOpen, setMobileServicosOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setServicosOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [page])

  const handleNavClick = (item) => {
    setMobileMenuOpen(false)
    if (item.scrollTo) {
      if (page !== 'home') {
        navigate('home')
        setTimeout(() => document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 150)
      } else {
        document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    if (item.page) navigate(item.page)
  }

  const isServicosActive = ['pessoas', 'processos', 'performance', 'prevencao'].includes(page)

  return (
    <>
      <nav style={{ background: 'white', borderBottom: '1px solid #e8edf2', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Logo onClick={() => navigate('home')} />

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div key={item.label} ref={dropRef} style={{ position: 'relative' }}>
                      <button
                        onClick={() => setServicosOpen(!servicosOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 11px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: isServicosActive || servicosOpen ? '#1e4a8a' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderBottom: isServicosActive || servicosOpen ? '2.5px solid #4a9edd' : '2.5px solid transparent', transition: 'all 0.2s' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          {item.label}
                          <span style={{ fontSize: 8, display: 'inline-block', transition: 'transform 0.2s', transform: servicosOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                        </span>
                      </button>
                      {servicosOpen && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: 16, boxShadow: '0 16px 48px rgba(30,74,138,0.15)', border: '1px solid #e0eaf4', padding: '12px', minWidth: 300, zIndex: 200, animation: 'dropDown 0.18s ease' }}>
                          <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 16, height: 8, overflow: 'hidden' }}>
                            <div style={{ width: 12, height: 12, background: 'white', border: '1px solid #e0eaf4', transform: 'rotate(45deg)', margin: '2px auto 0' }} />
                          </div>
                          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#4a9edd', textTransform: 'uppercase', padding: '4px 8px 10px', margin: 0 }}>Metodologia 4 P's</p>
                          {pilares.map((p) => (
                            <div key={p.label} onClick={() => { navigate(p.page); setServicosOpen(false) }}
                              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f4f8ff'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.label}</div>
                                <div style={{ fontSize: 11, color: '#778899', marginTop: 1 }}>{p.desc}</div>
                              </div>
                              <span style={{ marginLeft: 'auto', fontSize: 12, color: '#aabbcc' }}>›</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                const isActive = item.page && page === item.page
                return (
                  <button key={item.label} onClick={() => handleNavClick(item)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 11px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: isActive ? '#1e4a8a' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderBottom: isActive ? '2.5px solid #4a9edd' : '2.5px solid transparent', transition: 'all 0.2s' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Login / user button */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenu(!userMenu)}
                  style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', border: 'none', borderRadius: 24, padding: '8px 18px', cursor: 'pointer', color: 'white', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{user.name?.[0] || user.email?.[0]?.toUpperCase()}</span>
                  {!isMobile && (user.name?.split(' ')[0] || user.email?.split('@')[0])}
                </button>
                {userMenu && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e8edf2', minWidth: 170, overflow: 'hidden', zIndex: 100 }}>
                    {[
                      { icon: '👤', label: 'Meu Painel',   page: (user?.role === 'RECRUITER' || user?.role === 'INSTRUCTOR') ? 'dashboard-recrutador' : 'dashboard-candidato' },
                      { icon: '🎓', label: 'Treinamentos', page: 'treinamentos' },
                      ...(user?.role === 'CANDIDATE' ? [
                        { icon: '🔖', label: 'Vagas Salvas', page: 'dashboard-candidato' },
                        { icon: '📋', label: 'Candidaturas', page: 'dashboard-candidato' },
                      ] : []),
                    ].map(({ icon, label, page: dest }) => (
                      <button key={label} onClick={() => { navigate(dest); setUserMenu(false) }}
                        style={{ display: 'flex', width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', gap: 8, fontSize: 13.5, color: '#333', alignItems: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f4f8ff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >{icon} {label}</button>
                    ))}
                    <hr style={{ margin: 0, borderColor: '#eee' }} />
                    <button onClick={() => { logout(); setUserMenu(false) }}
                      style={{ display: 'flex', width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: 13.5, gap: 8, alignItems: 'center' }}
                    >🚪 Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('consultoria-login')}
                style={{ border: '2px solid #1e4a8a', background: 'white', borderRadius: 24, padding: '7px 22px', cursor: 'pointer', color: '#1e4a8a', fontWeight: 700, fontSize: 14 }}
              >Login</button>
            )}

            {/* Hamburger button — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center' }}
              >
                <span style={{ display: 'block', width: 22, height: 2, background: mobileMenuOpen ? '#1e4a8a' : '#444', borderRadius: 2, transition: 'all 0.2s', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                <span style={{ display: 'block', width: 22, height: 2, background: mobileMenuOpen ? '#1e4a8a' : '#444', borderRadius: 2, transition: 'all 0.2s', opacity: mobileMenuOpen ? 0 : 1 }} />
                <span style={{ display: 'block', width: 22, height: 2, background: mobileMenuOpen ? '#1e4a8a' : '#444', borderRadius: 2, transition: 'all 0.2s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {isMobile && mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 999, display: 'flex', flexDirection: 'column' }}>
          {/* Backdrop */}
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

          {/* Menu panel */}
          <div style={{ position: 'relative', background: 'white', padding: '16px 0', overflowY: 'auto', maxHeight: '80vh', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileServicosOpen(!mobileServicosOpen)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: isServicosActive ? '#1e4a8a' : '#333' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#778899' }}>{item.icon}</span>
                        {item.label}
                      </div>
                      <span style={{ fontSize: 10, color: '#4a9edd', transform: mobileServicosOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                    </button>
                    {mobileServicosOpen && (
                      <div style={{ background: '#f8fafc', borderTop: '1px solid #f0f4f8', borderBottom: '1px solid #f0f4f8' }}>
                        {pilares.map((p) => (
                          <button key={p.label}
                            onClick={() => { navigate(p.page); setMobileMenuOpen(false) }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#334' }}
                          >
                            <span>{p.icon}</span>
                            <span style={{ fontWeight: 600, color: p.color }}>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              const isActive = item.page && page === item.page
              return (
                <button key={item.label}
                  onClick={() => handleNavClick(item)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', background: isActive ? '#f0f6ff' : 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: isActive ? 700 : 500, color: isActive ? '#1e4a8a' : '#333', borderLeft: isActive ? '3px solid #4a9edd' : '3px solid transparent' }}
                >
                  <span style={{ color: isActive ? '#1e4a8a' : '#778899' }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}
