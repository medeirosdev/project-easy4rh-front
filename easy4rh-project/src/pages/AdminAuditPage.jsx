import { useState, useEffect, useCallback } from 'react'
import { auditApi } from '../services/api'

function getTodayPassword() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  return `${dd}${mm}${yyyy}123`
}

// ── Design tokens (dark theme) ────────────────────────────────

const D = {
  bg:        '#0d1117',
  surface:   '#161b22',
  surface2:  '#1c2330',
  border:    '#30363d',
  border2:   '#21262d',
  text:      '#e6edf3',
  textMuted: '#7d8590',
  textDim:   '#484f58',
  accent:    '#388bfd',
  accentDim: '#1f4d94',
}

const LEVEL = {
  INFO:     { bg: '#0d1f38', text: '#79c0ff', border: '#1f4d94' },
  WARNING:  { bg: '#2d1f00', text: '#e3b341', border: '#6e4b00' },
  ERROR:    { bg: '#2d0f17', text: '#ff7b72', border: '#7d1f2a' },
  CRITICAL: { bg: '#2d0026', text: '#f778ba', border: '#7d005e' },
}

const CATEGORY_LABELS = {
  AUTH: 'Auth', JOBS: 'Vagas', APPLICATIONS: 'Candidaturas',
  COURSES: 'Cursos', ENROLLMENTS: 'Matrículas', LESSONS: 'Aulas',
  USERS: 'Usuários', ADMIN: 'Admin', SYSTEM: 'Sistema',
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function LevelBadge({ level }) {
  const c = LEVEL[level] || LEVEL.INFO
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 700,
      letterSpacing: 0.3, whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
  )
}

// ── Login Gate ────────────────────────────────────────────────

function LoginGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw === getTodayPassword()) {
      sessionStorage.setItem('audit_authed', '1')
      onAuth()
    } else {
      setError('Senha incorreta.')
      setPw('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: D.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16, padding: '48px 40px', width: 360, boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 6px' }}>Painel de Auditoria</h1>
          <p style={{ fontSize: 13, color: D.textMuted, margin: 0 }}>Acesso restrito — Easy4RH</p>
        </div>
        <form onSubmit={submit}>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            placeholder="Senha de acesso"
            autoFocus
            style={{ ...darkInput, borderColor: error ? '#ff7b72' : D.border, marginBottom: 8 }}
          />
          {error && <p style={{ color: '#ff7b72', fontSize: 13, margin: '0 0 10px' }}>{error}</p>}
          <button type="submit" style={primaryBtn}>Entrar</button>
        </form>
      </div>
    </div>
  )
}

// ── Stats Cards ───────────────────────────────────────────────

function StatsCards({ stats }) {
  if (!stats) return null
  const levels = ['INFO', 'WARNING', 'ERROR', 'CRITICAL']
  const labels = { INFO: 'Informação', WARNING: 'Aviso', ERROR: 'Erro', CRITICAL: 'Crítico' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
      {levels.map(l => {
        const c = LEVEL[l]
        return (
          <div key={l} style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: '20px 20px 16px', borderLeft: `3px solid ${c.border}` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.text, lineHeight: 1 }}>{stats.byLevel?.[l] ?? 0}</div>
            <div style={{ fontSize: 12, color: D.textMuted, marginTop: 6, fontWeight: 500 }}>{labels[l]}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Detail Modal ──────────────────────────────────────────────

function DetailModal({ log, onClose }) {
  if (!log) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16, width: '100%', maxWidth: 740, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ padding: '22px 26px', borderBottom: `1px solid ${D.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <LevelBadge level={log.level} />
              <span style={{ fontSize: 12, color: D.textMuted, background: D.surface2, border: `1px solid ${D.border}`, borderRadius: 5, padding: '2px 8px' }}>
                {CATEGORY_LABELS[log.category] || log.category}
              </span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: D.text, margin: '0 0 4px', fontFamily: 'monospace' }}>{log.action}</h2>
            <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>{formatDate(log.createdAt)}</p>
          </div>
          <button onClick={onClose} style={{ background: D.surface2, border: `1px solid ${D.border}`, borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: 'pointer', color: D.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div style={{ padding: '20px 26px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Section title="Requisição HTTP">
            <Row label="Método" value={log.method} mono />
            <Row label="Path" value={log.path} mono />
            <Row label="Status" value={log.statusCode} />
            <Row label="Duração" value={log.duration != null ? `${log.duration} ms` : null} />
          </Section>

          <Section title="Usuário">
            <Row label="ID" value={log.userId} mono />
            <Row label="Email" value={log.userEmail} />
            <Row label="Role" value={log.userRole} />
            <Row label="IP" value={log.ip} mono />
          </Section>

          {(log.entity || log.entityId) && (
            <Section title="Entidade">
              <Row label="Tipo" value={log.entity} />
              <Row label="ID" value={log.entityId} mono />
            </Section>
          )}

          {(log.errorType || log.errorMessage) && (
            <Section title="Erro">
              <Row label="Tipo" value={log.errorType} mono />
              <Row label="Mensagem" value={log.errorMessage} />
            </Section>
          )}

          {log.stackTrace && (
            <Section title="Stack Trace">
              <pre style={{ margin: 0, fontSize: 11, color: '#ff7b72', background: D.bg, borderRadius: 8, padding: 14, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}>
                {log.stackTrace}
              </pre>
            </Section>
          )}

          {log.requestBody && (
            <Section title="Request Body">
              <pre style={{ margin: 0, fontSize: 11, color: '#79c0ff', background: D.bg, borderRadius: 8, padding: 14, overflowX: 'auto', lineHeight: 1.6 }}>
                {JSON.stringify(log.requestBody, null, 2)}
              </pre>
            </Section>
          )}

          {log.after && (
            <Section title="Dados Após">
              <pre style={{ margin: 0, fontSize: 11, color: '#56d364', background: D.bg, borderRadius: 8, padding: 14, overflowX: 'auto', lineHeight: 1.6 }}>
                {JSON.stringify(log.after, null, 2)}
              </pre>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: D.textDim, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 8px' }}>{title}</p>
      <div style={{ background: D.surface2, border: `1px solid ${D.border2}`, borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, mono }) {
  if (value == null || value === '') return null
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 12, color: D.textMuted, minWidth: 80, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: D.text, fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{String(value)}</span>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────

const EMPTY_FILTERS = { level: '', category: '', action: '', userId: '', search: '', startDate: '', endDate: '', page: 1, limit: 20 }

export default function AdminAuditPage({ navigate }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('audit_authed') === '1')
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [purgeDays, setPurgeDays] = useState('')
  const [purging, setPurging] = useState(false)
  const [purgeMsg, setPurgeMsg] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const load = useCallback(async (f) => {
    setLoading(true)
    setError('')
    try {
      const [logsRes, statsRes] = await Promise.all([auditApi.list(f), auditApi.stats()])
      setLogs(logsRes.data || [])
      setMeta(logsRes.meta || null)
      setStats(statsRes)
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    load(filters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const applyFilters = () => {
    const f = { ...filters, page: 1 }
    setFilters(f)
    load(f)
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    load(EMPTY_FILTERS)
  }

  const changePage = (p) => {
    const f = { ...filters, page: p }
    setFilters(f)
    load(f)
  }

  const handlePurge = async () => {
    const days = parseInt(purgeDays)
    if (!days || days < 1) return
    if (!window.confirm(`Deletar logs mais antigos que ${days} dias?\nEsta ação não pode ser desfeita.`)) return
    setPurging(true)
    setPurgeMsg('')
    try {
      const res = await auditApi.purge(days)
      setPurgeMsg(`${res.deleted} log(s) deletado(s).`)
      setPurgeDays('')
      load(filters)
    } catch {
      setPurgeMsg('Erro ao purgar logs.')
    } finally {
      setPurging(false)
    }
  }

  const hasActiveFilters = filters.level || filters.category || filters.action || filters.userId || filters.search || filters.startDate || filters.endDate

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />

  return (
    <div style={{ minHeight: '100vh', background: D.bg, color: D.text, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: D.surface, borderBottom: `1px solid ${D.border}`, padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', gap: 14 }}>
        {navigate && (
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', color: D.textMuted, cursor: 'pointer', fontSize: 18, padding: '0 4px', lineHeight: 1 }}>←</button>
        )}
        <span style={{ width: 1, height: 20, background: D.border }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: D.text }}>Auditoria</span>
        <span style={{ fontSize: 12, color: D.textMuted }}>Easy4RH</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {loading && <span style={{ fontSize: 12, color: D.textMuted }}>Carregando...</span>}
          <button
            onClick={() => { sessionStorage.removeItem('audit_authed'); setAuthed(false) }}
            style={{ background: 'none', border: `1px solid ${D.border}`, color: D.textMuted, borderRadius: 7, padding: '5px 14px', cursor: 'pointer', fontSize: 12 }}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px' }}>

        {error && (
          <div style={{ background: LEVEL.ERROR.bg, border: `1px solid ${LEVEL.ERROR.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: LEVEL.ERROR.text, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Filtros */}
        <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: D.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Filtros</span>
            {hasActiveFilters && (
              <span style={{ fontSize: 11, background: D.accentDim, color: D.accent, borderRadius: 10, padding: '1px 8px' }}>
                ativos
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Nível</label>
              <select value={filters.level} onChange={e => setFilters(p => ({ ...p, level: e.target.value }))} style={darkSelect}>
                <option value="">Todos</option>
                {['INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Categoria</label>
              <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))} style={darkSelect}>
                <option value="">Todas</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Action</label>
              <input
                placeholder="ex: LOGIN, CREATE_JOB"
                value={filters.action}
                onChange={e => setFilters(p => ({ ...p, action: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                style={darkInput}
              />
            </div>

            <div>
              <label style={labelStyle}>Busca livre</label>
              <input
                placeholder="path, email, mensagem de erro..."
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                style={darkInput}
              />
            </div>

            <div>
              <label style={labelStyle}>ID do usuário</label>
              <input
                placeholder="UUID"
                value={filters.userId}
                onChange={e => setFilters(p => ({ ...p, userId: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                style={darkInput}
              />
            </div>

            <div>
              <label style={labelStyle}>De</label>
              <input type="date" value={filters.startDate} onChange={e => setFilters(p => ({ ...p, startDate: e.target.value }))} style={darkInput} />
            </div>

            <div>
              <label style={labelStyle}>Até</label>
              <input type="date" value={filters.endDate} onChange={e => setFilters(p => ({ ...p, endDate: e.target.value }))} style={darkInput} />
            </div>

            <div>
              <label style={labelStyle}>Por página</label>
              <select value={filters.limit} onChange={e => setFilters(p => ({ ...p, limit: Number(e.target.value) }))} style={darkSelect}>
                {[20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={applyFilters} style={primaryBtn}>Aplicar filtros</button>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={ghostBtn}>Limpar filtros</button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number" min="1" max="3650" placeholder="dias"
                value={purgeDays}
                onChange={e => setPurgeDays(e.target.value)}
                style={{ ...darkInput, width: 80 }}
              />
              <button
                onClick={handlePurge}
                disabled={purging || !purgeDays}
                style={{ ...dangerBtn, opacity: (purging || !purgeDays) ? 0.5 : 1 }}
              >
                {purging ? 'Purgando...' : 'Purgar logs'}
              </button>
              {purgeMsg && (
                <span style={{ fontSize: 12, color: purgeMsg.includes('Erro') ? LEVEL.ERROR.text : '#56d364' }}>
                  {purgeMsg}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {loading && logs.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center', color: D.textMuted, fontSize: 14 }}>Carregando...</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center', color: D.textMuted }}>
              <p style={{ fontSize: 14, margin: 0 }}>Nenhum log encontrado.</p>
              {hasActiveFilters && <p style={{ fontSize: 12, marginTop: 8, color: D.textDim }}>Tente limpar os filtros.</p>}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                    {['Data/Hora', 'Nível', 'Categoria', 'Action', 'Path', 'Status', 'Usuário', 'ms', ''].map(h => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: D.textDim, textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap', background: D.surface2 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      style={{ borderBottom: `1px solid ${D.border2}`, cursor: 'pointer', transition: 'background 0.1s' }}
                      onClick={() => setSelected(log)}
                      onMouseEnter={e => e.currentTarget.style.background = D.surface2}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px', color: D.textMuted, whiteSpace: 'nowrap', fontSize: 12 }}>{formatDate(log.createdAt)}</td>
                      <td style={{ padding: '10px 14px' }}><LevelBadge level={log.level} /></td>
                      <td style={{ padding: '10px 14px', color: D.textMuted, fontSize: 12 }}>{CATEGORY_LABELS[log.category] || log.category}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: D.text, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 12 }}>{log.action}</td>
                      <td style={{ padding: '10px 14px', color: D.textMuted, fontFamily: 'monospace', fontSize: 11, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.path}</td>
                      <td style={{ padding: '10px 14px' }}>
                        {log.statusCode && (
                          <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 13, color: log.statusCode >= 500 ? LEVEL.CRITICAL.text : log.statusCode >= 400 ? LEVEL.ERROR.text : log.statusCode >= 300 ? LEVEL.WARNING.text : '#56d364' }}>
                            {log.statusCode}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', color: D.textMuted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{log.userEmail || log.userId || '—'}</td>
                      <td style={{ padding: '10px 14px', color: D.textDim, fontSize: 12, fontFamily: 'monospace' }}>{log.duration != null ? log.duration : '—'}</td>
                      <td style={{ padding: '10px 14px', color: D.textDim, fontSize: 16 }}>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {meta && meta.totalPages > 1 && (
            <div style={{ padding: '14px 18px', borderTop: `1px solid ${D.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: D.surface2 }}>
              <span style={{ fontSize: 12, color: D.textMuted }}>
                {meta.total} resultado(s) — página {meta.page} de {meta.totalPages}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => changePage(1)} disabled={meta.page <= 1} style={pageBtn(meta.page <= 1)}>«</button>
                <button onClick={() => changePage(meta.page - 1)} disabled={meta.page <= 1} style={pageBtn(meta.page <= 1)}>‹</button>
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(meta.totalPages - 4, meta.page - 2)) + i
                  return <button key={p} onClick={() => changePage(p)} style={pageBtn(false, p === meta.page)}>{p}</button>
                })}
                <button onClick={() => changePage(meta.page + 1)} disabled={meta.page >= meta.totalPages} style={pageBtn(meta.page >= meta.totalPages)}>›</button>
                <button onClick={() => changePage(meta.totalPages)} disabled={meta.page >= meta.totalPages} style={pageBtn(meta.page >= meta.totalPages)}>»</button>
              </div>
            </div>
          )}
        </div>

        {meta && (
          <p style={{ textAlign: 'right', fontSize: 11, color: D.textDim, marginTop: 10 }}>
            {meta.total} log(s) no total — exibindo {logs.length}
          </p>
        )}
      </div>

      {selected && <DetailModal log={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────

const darkInput = {
  padding: '8px 11px', borderRadius: 7, border: `1px solid ${D.border}`,
  fontSize: 13, outline: 'none', background: D.bg, color: D.text,
  width: '100%', boxSizing: 'border-box', colorScheme: 'dark',
}

const darkSelect = {
  ...darkInput, cursor: 'pointer', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237d8590' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  paddingRight: 30,
}

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600, color: D.textMuted,
  marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6,
}

const primaryBtn = {
  background: D.accent, color: 'white', border: 'none', borderRadius: 7,
  padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13,
}

const ghostBtn = {
  background: 'none', color: D.textMuted, border: `1px solid ${D.border}`,
  borderRadius: 7, padding: '8px 14px', cursor: 'pointer', fontSize: 13,
}

const dangerBtn = {
  background: '#7d1f2a', color: '#ff7b72', border: `1px solid #a0283a`,
  borderRadius: 7, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
}

const pageBtn = (disabled, active = false) => ({
  padding: '5px 10px', borderRadius: 6, border: `1px solid ${active ? D.accent : D.border}`,
  background: active ? D.accentDim : 'none',
  color: active ? D.accent : disabled ? D.textDim : D.textMuted,
  cursor: disabled ? 'default' : 'pointer', fontSize: 13,
  minWidth: 32, textAlign: 'center',
})
