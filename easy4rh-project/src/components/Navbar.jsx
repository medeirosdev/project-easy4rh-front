import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

const Logo = ({ onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
    <img src={logoImg} alt="Easy4RH Logo" style={{ width: 40, height: 40 }} />
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1e4a8a', lineHeight: 1 }}>
        EASY<span style={{ color: '#4a9edd' }}>4</span>RH
      </div>
      <div style={{ fontSize: 9, color: '#888', letterSpacing: 1 }}>CONSULTORIA EM RH</div>
    </div>
  </div>
)

const pilares = [
  { label: 'Pessoas',     page: 'pessoas',     icon: '👥', color: '#1e4a8a', desc: 'Desenvolvimento humano estratégico' },
  { label: 'Processos',   page: 'processos',   icon: '⚙️', color: '#2a7a4e', desc: 'Fluxos otimizados para resultados' },
  { label: 'Performance', page: 'performance', icon: '📈', color: '#7a3a9e', desc: 'Metas, KPIs e reconhecimento' },
  { label: 'Prevenção',   page: 'prevencao',   icon: '🛡️', color: '#a04a1a', desc: 'Compliance e proteção jurídica' },
]

const navItems = [
  { label: 'Home',         page: 'home',        icon: '🏠' },
  { label: 'Sobre Nós',    page: 'sobre',       icon: '👥' },
  { label: 'Serviços',     page: null,          icon: '⚙️', hasDropdown: true },
  { label: 'Vagas',        page: 'vagas',       icon: '💼' },
  { label: 'Treinamentos', page: 'treinamentos',icon: '📚' },
  { label: 'FAQ',          page: 'faq',         icon: '❓' },
  { label: 'Fale Conosco', page: 'home',        icon: '💬' },
]

export default function Navbar({ navigate, page }) {
  const { user, logout } = useAuth()
  const [userMenu, setUserMenu]       = useState(false)
  const [servicosOpen, setServicosOpen] = useState(false)
  const dropRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setServicosOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isServicosActive = ['pessoas', 'processos', 'performance', 'prevencao'].includes(page)

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e8edf2', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Logo onClick={() => navigate('home')} />

        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.label} ref={dropRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setServicosOpen(!servicosOpen)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '6px 11px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      color: isServicosActive || servicosOpen ? '#1e4a8a' : '#555',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                      borderBottom: isServicosActive || servicosOpen ? '2.5px solid #4a9edd' : '2.5px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {item.label}
                      <span style={{ fontSize: 8, display: 'inline-block', transition: 'transform 0.2s', transform: servicosOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </span>
                  </button>

                  {servicosOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'white', borderRadius: 16,
                      boxShadow: '0 16px 48px rgba(30,74,138,0.15)',
                      border: '1px solid #e0eaf4',
                      padding: '12px', minWidth: 300, zIndex: 200,
                      animation: 'dropDown 0.18s ease',
                    }}>
                      {/* Arrow */}
                      <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 16, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: 12, height: 12, background: 'white', border: '1px solid #e0eaf4', transform: 'rotate(45deg)', margin: '2px auto 0' }} />
                      </div>

                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#4a9edd', textTransform: 'uppercase', padding: '4px 8px 10px', margin: 0 }}>
                        Metodologia 4 P's
                      </p>

                      {pilares.map((p) => (
                        <div
                          key={p.label}
                          onClick={() => { navigate(p.page); setServicosOpen(false) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f4f8ff'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                            {p.icon}
                          </div>
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

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.page)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 11px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  color: page === item.page ? '#1e4a8a' : '#555',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                  borderBottom: page === item.page ? '2.5px solid #4a9edd' : '2.5px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', border: 'none', borderRadius: 24, padding: '8px 18px', cursor: 'pointer', color: 'white', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  {user.name[0]}
                </span>
                {user.name.split(' ')[0]}
              </button>
              {userMenu && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e8edf2', minWidth: 170, overflow: 'hidden', zIndex: 100 }}>
                  {[
                    { icon: '👤', label: 'Meu Perfil',    page: user?.role === 'recruiter' ? 'dashboard-recrutador' : 'dashboard-candidato' },
                    { icon: '🔖', label: 'Vagas Salvas',  page: 'dashboard-candidato' },
                    { icon: '📋', label: 'Candidaturas',  page: 'dashboard-candidato' },
                  ].map(({ icon, label, page: dest }) => (
                    <button key={label}
                      onClick={() => { navigate(dest); setUserMenu(false) }}
                      style={{ display: 'flex', width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', gap: 8, fontSize: 13.5, color: '#333', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f4f8ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {icon} {label}
                    </button>
                  ))}
                  <hr style={{ margin: 0, borderColor: '#eee' }} />
                  <button
                    onClick={() => { logout(); setUserMenu(false) }}
                    style={{ display: 'flex', width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: 13.5, gap: 8, alignItems: 'center' }}
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('consultoria-login')}
              style={{ border: '2px solid #1e4a8a', background: 'white', borderRadius: 24, padding: '7px 22px', cursor: 'pointer', color: '#1e4a8a', fontWeight: 700, fontSize: 14 }}
            >
              Login
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </nav>
  )
}
