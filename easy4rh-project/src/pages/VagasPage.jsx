import { useState, useMemo } from 'react'
import { useJobs } from '../context/JobsContext'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import { useBreakpoint } from '../hooks/useBreakpoint'

const jobTypes = ['Remoto', 'Presencial', 'Híbrido']
const levels = ['Estágio', 'Sem experiência', 'Até 1 ano', '2+ anos', 'Júnior', 'Pleno', 'Sênior', 'Lead', 'Gerente']
const locations = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR', 'Florianópolis, SC', 'Porto Alegre, RS', 'Campinas, SP', 'Recife, PE', 'Salvador, BA', 'Manaus, AM', 'Brasília, DF', 'Goiânia, GO']
const sortOptions = ['Mais recentes', 'Maior salário', 'Menor salário']

export default function VagasPage({ navigate }) {
  const { jobs, loading } = useJobs()
  const { user } = useAuth()
  const { isMobile } = useBreakpoint()

  const [filters, setFilters] = useState({ types: [], levels: [], locations: [] })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [appliedKeyword, setAppliedKeyword] = useState('')
  const [appliedLocation, setAppliedLocation] = useState('')
  const [sortBy, setSortBy] = useState('Mais recentes')

  const toggleFilter = (key, val) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }))
  }

  const handleSearch = () => {
    setAppliedKeyword(keywordInput.trim())
    setAppliedLocation(locationInput.trim())
  }

  const handleClearAll = () => {
    setFilters({ types: [], levels: [], locations: [] })
    setKeywordInput('')
    setLocationInput('')
    setAppliedKeyword('')
    setAppliedLocation('')
  }

  const parseSalary = (job) => {
    if (job.salaryMin != null) return job.salaryMin
    return 0
  }

  const filtered = useMemo(() => {
    let list = jobs.filter(job => {
      if (filters.types.length && !filters.types.includes(job.type)) return false
      if (filters.levels.length && !filters.levels.includes(job.level)) return false
      if (filters.locations.length && !filters.locations.some(l => job.location.includes(l.split(',')[0]))) return false
      if (appliedKeyword) {
        const kw = appliedKeyword.toLowerCase()
        const companyName = typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')
        if (!job.title.toLowerCase().includes(kw) && !companyName.toLowerCase().includes(kw) && !job.description?.toLowerCase().includes(kw)) return false
      }
      if (appliedLocation) {
        const loc = appliedLocation.toLowerCase()
        if (!job.location.toLowerCase().includes(loc)) return false
      }
      return true
    })

    if (sortBy === 'Maior salário') {
      list = [...list].sort((a, b) => parseSalary(b) - parseSalary(a))
    } else if (sortBy === 'Menor salário') {
      list = [...list].sort((a, b) => parseSalary(a) - parseSalary(b))
    }
    // 'Mais recentes' keeps default order (already sorted by createdAt desc from API)

    return list
  }, [jobs, filters, appliedKeyword, appliedLocation, sortBy])

  const isRecruiter = user && ['RECRUITER', 'RECRUITER_INSTRUCTOR', 'ADMIN'].includes(user.role)
  const hasActiveFilters = filters.types.length || filters.levels.length || filters.locations.length || appliedKeyword || appliedLocation

  const inputStyle = {
    border: '1.5px solid #d0dcea',
    borderRadius: 10,
    padding: '11px 16px',
    fontSize: 13.5,
    outline: 'none',
    background: 'white',
    color: '#334',
    width: '100%',
    boxSizing: 'border-box',
  }

  return (
    <div>

      {/* ── Search hero bar ── */}
      <div style={{
        background: 'linear-gradient(160deg, #2a4a7a 0%, #3a6ab0 50%, #5a8fd0 100%)',
        padding: isMobile ? '32px 20px 40px' : '40px 20px 56px',
        borderRadius: '0 0 32px 32px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Search bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto',
            gap: 10,
            background: 'white',
            borderRadius: 14,
            padding: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            marginBottom: 12,
          }}>
            <input
              style={{ ...inputStyle, border: 'none', borderRight: isMobile ? 'none' : '1.5px solid #e8edf2' }}
              placeholder="Palavras-chave, cargo ou empresa"
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <input
              style={{ ...inputStyle, border: 'none' }}
              placeholder="Cidade, estado ou região"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              style={{
                background: 'linear-gradient(135deg, #1a3a6e, #2a5a9e)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '11px 28px', cursor: 'pointer', fontWeight: 700,
                fontSize: 14, whiteSpace: 'nowrap',
              }}
            >
              Buscar
            </button>
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 8,
              padding: '7px 16px', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>Filtros Avançados</span>
            <span style={{ fontSize: 10, transform: showAdvanced ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
          </button>

          {/* Advanced filters panel */}
          {showAdvanced && (
            <div style={{
              marginTop: 12, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              borderRadius: 12, padding: '16px 20px',
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 20,
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              {[
                { title: 'Tipo de Vaga', key: 'types', options: jobTypes },
                { title: 'Nível', key: 'levels', options: levels },
              ].map(section => (
                <div key={section.key}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{section.title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {section.options.map(opt => (
                      <div
                        key={opt}
                        onClick={() => toggleFilter(section.key, opt)}
                        style={{
                          padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                          background: filters[section.key].includes(opt) ? 'white' : 'rgba(255,255,255,0.15)',
                          color: filters[section.key].includes(opt) ? '#1e4a8a' : 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          transition: 'all 0.15s',
                        }}
                      >{opt}</div>
                    ))}
                  </div>
                </div>
              ))}
              {hasActiveFilters ? (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={handleClearAll}
                    style={{ background: 'rgba(255,80,80,0.2)', color: 'white', border: '1px solid rgba(255,80,80,0.4)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Tagline */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'white', marginBottom: 8 }}>
              Encontre sua próxima <span style={{ color: '#7ac8f0' }}>oportunidade</span>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
              Explore centenas de vagas nas melhores redes de varejo do Brasil
            </p>
          </div>

        </div>
      </div>

      {/* ── Secondary nav bar ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8edf2' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10, position: 'relative' }}>
          {!user ? (
            <div style={{ display: 'flex', gap: isMobile ? 12 : 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: '🔐 Entrar', action: () => navigate('login') },
                { label: '📝 Criar conta', action: () => navigate('register') },
                { label: '🔍 Recrutamento', action: () => navigate('login') },
              ].map((item) => (
                <button key={item.label} onClick={item.action}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e4a8a', fontSize: 13, fontWeight: 600 }}>
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: isMobile ? 12 : 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={() => navigate(isRecruiter ? 'dashboard-recrutador' : 'dashboard-candidato')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e4a8a', fontSize: 13, fontWeight: 600 }}>
                🏠 Meu Painel
              </button>
              {!isRecruiter && (
                <button onClick={() => navigate('dashboard-candidato')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e4a8a', fontSize: 13, fontWeight: 600 }}>
                  📋 Minhas Candidaturas
                </button>
              )}
            </div>
          )}
          {isRecruiter && (
            <button onClick={() => navigate('dashboard-recrutador')} style={{ position: isMobile ? 'static' : 'absolute', right: 20, background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', color: 'white', border: 'none', borderRadius: 10, padding: '9px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              + Publicar vaga
            </button>
          )}
        </div>
      </div>

      {/* ── Job listings ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>

        {/* Count + Sort row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#555', fontSize: 13.5, margin: 0, fontWeight: 500 }}>
            {loading ? 'Carregando vagas...' : <><strong>{filtered.length}</strong> vagas encontradas</>}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#778899', fontWeight: 500 }}>Ordenar por:</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {sortOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: sortBy === opt ? '1.5px solid #1e4a8a' : '1.5px solid #d0dcea',
                    background: sortBy === opt ? '#1e4a8a' : 'white',
                    color: sortBy === opt ? 'white' : '#556677',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: 28 }}>

          {/* Sidebar */}
          <div>
            {[
              { title: 'TIPO DE VAGA', key: 'types', options: jobTypes },
              { title: 'NÍVEL', key: 'levels', options: levels },
              { title: 'LOCALIZAÇÃO', key: 'locations', options: locations },
            ].map(section => (
              <div key={section.title} style={{ background: 'white', border: '1px solid #e8edf2', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 1, margin: '0 0 12px', textTransform: 'uppercase' }}>{section.title}</h4>
                {section.options.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8, fontSize: 13 }}>
                    <input type="checkbox" checked={filters[section.key].includes(opt)} onChange={() => toggleFilter(section.key, opt)} style={{ cursor: 'pointer', accentColor: '#1e4a8a' }} />
                    <span style={{ color: '#444' }}>{opt}</span>
                  </label>
                ))}
              </div>
            ))}
            {hasActiveFilters ? (
              <button onClick={handleClearAll}
                style={{ background: '#fee', border: '1px solid #fcc', color: '#c00', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, width: '100%' }}>
                Limpar todos os filtros
              </button>
            ) : null}
          </div>

          {/* Listings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e8edf2', height: 100, opacity: 0.5 + i * 0.1 }} />
              ))
            ) : filtered.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', border: '1px solid #e8edf2' }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <h3 style={{ color: '#1e3a6e' }}>Nenhuma vaga encontrada</h3>
                <p style={{ color: '#666' }}>Tente ajustar seus filtros ou busca</p>
                {hasActiveFilters && (
                  <button onClick={handleClearAll} style={{ marginTop: 8, background: '#1e4a8a', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              filtered.map(job => <JobCard key={job.id} job={job} navigate={navigate} />)
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
