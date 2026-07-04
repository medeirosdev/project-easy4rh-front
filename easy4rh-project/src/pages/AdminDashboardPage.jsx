import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { adminApi } from '../services/api'

const menuItems = [
  { id: 'resumo',   label: 'Resumo' },
  { id: 'vagas',    label: 'Vagas' },
  { id: 'usuarios', label: 'Usuários' },
  { id: 'cursos',   label: 'Cursos' },
]

const JOB_STATUSES   = ['', 'DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED']
const COURSE_STATUSES = ['', 'DRAFT', 'PUBLISHED', 'ARCHIVED']
const USER_ROLES     = ['', 'CANDIDATE', 'RECRUITER', 'INSTRUCTOR', 'RECRUITER_INSTRUCTOR', 'ADMIN']

const STATUS_COLORS = {
  DRAFT:     { bg: '#f3f4f6', text: '#6b7280' },
  PUBLISHED: { bg: '#dcfce7', text: '#16a34a' },
  PAUSED:    { bg: '#fef3c7', text: '#d97706' },
  CLOSED:    { bg: '#fee2e2', text: '#dc2626' },
  ARCHIVED:  { bg: '#f3f4f6', text: '#6b7280' },
}

const ROLE_COLORS = {
  CANDIDATE:            { bg: '#eff6ff', text: '#1d4ed8' },
  RECRUITER:            { bg: '#f0fdf4', text: '#15803d' },
  INSTRUCTOR:           { bg: '#faf5ff', text: '#7c3aed' },
  RECRUITER_INSTRUCTOR: { bg: '#fff7ed', text: '#c2410c' },
  ADMIN:                { bg: '#fef2f2', text: '#b91c1c' },
}

function Badge({ value, map }) {
  const c = map[value] || { bg: '#f3f4f6', text: '#6b7280' }
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 20, padding: '2px 10px', fontSize: 11.5, fontWeight: 700 }}>
      {value}
    </span>
  )
}

function Pagination({ meta, onPage }) {
  if (!meta || meta.totalPages <= 1) return null
  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1)
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: p === meta.page ? 700 : 500,
          background: p === meta.page ? '#1e3a6e' : '#f0f4f8', color: p === meta.page ? 'white' : '#556677',
        }}>{p}</button>
      ))}
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 12 }}>Confirmar exclusão</h3>
        <p style={{ color: '#556677', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: '#dc2626', color: 'white', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value ?? '—'}</div>
      <div style={{ fontSize: 12, color: '#778899', marginTop: 4 }}>{label}</div>
    </div>
  )
}

// ── Section: Resumo ───────────────────────────────────────────

function ResumoSection() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.stats()
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#778899' }}>Carregando...</p>
  if (error) return <p style={{ color: '#dc2626' }}>{error}</p>
  if (!stats) return null

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Resumo da plataforma</h2>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#556677', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Usuários</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total" value={stats.users?.total} color="#1e4a8a" />
        <StatCard label="Verificados" value={stats.users?.verified} color="#16a34a" />
        <StatCard label="Novos (30d)" value={stats.users?.registeredLast30Days} color="#7c3aed" />
        {Object.entries(stats.users?.byRole || {}).map(([role, count]) => (
          <StatCard key={role} label={role} value={count} color={ROLE_COLORS[role]?.text || '#6b7280'} />
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#556677', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Vagas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total" value={stats.jobs?.total} color="#1e4a8a" />
        <StatCard label="Publicadas (30d)" value={stats.jobs?.publishedLast30Days} color="#16a34a" />
        {Object.entries(stats.jobs?.byStatus || {}).map(([s, c]) => (
          <StatCard key={s} label={s} value={c} color={STATUS_COLORS[s]?.text || '#6b7280'} />
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#556677', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cursos</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total" value={stats.courses?.total} color="#7c3aed" />
        <StatCard label="Matrículas" value={stats.enrollments?.total} color="#1e4a8a" />
        <StatCard label="Concluídas" value={stats.enrollments?.completed} color="#16a34a" />
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#556677', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Candidaturas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
        <StatCard label="Total" value={stats.applications?.total} color="#f0a500" />
        <StatCard label="Novas (30d)" value={stats.applications?.submittedLast30Days} color="#1e4a8a" />
      </div>
    </div>
  )
}

// ── Section: Vagas ────────────────────────────────────────────

function VagasSection() {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [confirm, setConfirm]   = useState(null) // { id, title }
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    adminApi.listJobs({ search: search || undefined, status: status || undefined, page, limit: 20 })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }

  const handleDelete = async () => {
    if (!confirm) return
    setDeleting(confirm.id)
    setConfirm(null)
    try {
      await adminApi.deleteJob(confirm.id)
      setData(prev => prev ? { ...prev, data: prev.data.filter(j => j.id !== confirm.id), meta: { ...prev.meta, total: prev.meta.total - 1 } } : prev)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 20 }}>Gerenciar Vagas</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={searchInput} onChange={e => setSearchInput(e.target.value)}
          placeholder="Buscar por título..."
          style={{ flex: 1, minWidth: 200, border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none' }}
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white' }}>
          {JOB_STATUSES.map(s => <option key={s} value={s}>{s || 'Todos os status'}</option>)}
        </select>
        <button type="submit" style={{ background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13.5 }}>
          Buscar
        </button>
      </form>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <p style={{ color: '#778899' }}>Carregando...</p>
      ) : (
        <>
          <div style={{ fontSize: 12, color: '#778899', marginBottom: 12 }}>{data?.meta?.total ?? 0} vaga(s) encontrada(s)</div>
          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf2' }}>
                  {['Título', 'Empresa', 'Recrutador', 'Candidaturas', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#778899', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.data || []).map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, color: '#1e3a6e', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {job.title}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334' }}>{job.company?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#778899' }}>{job.recruiter?.email || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334', textAlign: 'center' }}>{job._count?.applications ?? 0}</td>
                    <td style={{ padding: '12px 16px' }}><Badge value={job.status} map={STATUS_COLORS} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => setConfirm({ id: job.id, title: job.title })}
                        disabled={deleting === job.id}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5, opacity: deleting === job.id ? 0.5 : 1 }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {(data?.data || []).length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#778899', fontSize: 14 }}>Nenhuma vaga encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta} onPage={setPage} />
        </>
      )}

      {confirm && (
        <ConfirmModal
          message={`Tem certeza que deseja excluir a vaga "${confirm.title}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

// ── Section: Usuários ─────────────────────────────────────────

function ChangePasswordModal({ user, onClose }) {
  const [newPassword, setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    if (newPassword !== confirmPassword) { setError('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await adminApi.changeUserPassword(user.id, newPassword)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 6 }}>Alterar senha</h3>
        <p style={{ color: '#778899', fontSize: 13, marginBottom: 20 }}>{user.email}</p>

        {success ? (
          <div>
            <div style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              Senha alterada com sucesso!
            </div>
            <button onClick={onClose} style={{ width: '100%', background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#556677', marginBottom: 6 }}>Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 8, padding: '10px 12px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#556677', marginBottom: 6 }}>Confirmar senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
                style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 8, padding: '10px 12px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={onClose} style={{ flex: 1, background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading} style={{ flex: 1, background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

const ROLE_LABELS = {
  CANDIDATE:            'Candidato',
  RECRUITER:            'Recrutador',
  INSTRUCTOR:           'Instrutor',
  RECRUITER_INSTRUCTOR: 'Recrutador + Instrutor',
  ADMIN:                'Administrador',
}

function ChangeRoleModal({ user, onClose, onSuccess }) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedRole === user.role) { onClose(); return }
    setLoading(true)
    setError('')
    try {
      await adminApi.changeUserRole(user.id, selectedRole)
      onSuccess(user.id, selectedRole)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 6 }}>Alterar papel do usuário</h3>
        <p style={{ color: '#778899', fontSize: 13, marginBottom: 20 }}>{user.email}</p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#556677', marginBottom: 8 }}>Papel da conta</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => {
              const c = ROLE_COLORS[value] || { bg: '#f3f4f6', text: '#6b7280' }
              const selected = selectedRole === value
              return (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: `2px solid ${selected ? c.text : '#e0eaf4'}`, background: selected ? c.bg : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <input type="radio" name="role" value={value} checked={selected} onChange={() => setSelectedRole(value)} style={{ accentColor: c.text }} />
                  <span style={{ fontSize: 13.5, fontWeight: selected ? 700 : 500, color: selected ? c.text : '#334' }}>{label}</span>
                  {value === 'INSTRUCTOR' && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>só via admin</span>
                  )}
                </label>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function UsuariosSection({ currentUserId }) {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]     = useState('')
  const [role, setRole]         = useState('')
  const [page, setPage]         = useState(1)
  const [confirm, setConfirm]         = useState(null)
  const [deleting, setDeleting]       = useState(null)
  const [changingPassword, setChangingPassword] = useState(null)
  const [changingRole, setChangingRole]         = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    adminApi.listUsers({ search: search || undefined, role: role || undefined, page, limit: 20 })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [search, role, page])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }

  const handleDelete = async () => {
    if (!confirm) return
    setDeleting(confirm.id)
    setConfirm(null)
    try {
      await adminApi.deleteUser(confirm.id)
      setData(prev => prev ? { ...prev, data: prev.data.filter(u => u.id !== confirm.id), meta: { ...prev.meta, total: prev.meta.total - 1 } } : prev)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 20 }}>Gerenciar Usuários</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={searchInput} onChange={e => setSearchInput(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          style={{ flex: 1, minWidth: 200, border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none' }}
        />
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1) }}
          style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white' }}>
          {USER_ROLES.map(r => <option key={r} value={r}>{r || 'Todos os papéis'}</option>)}
        </select>
        <button type="submit" style={{ background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13.5 }}>
          Buscar
        </button>
      </form>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <p style={{ color: '#778899' }}>Carregando...</p>
      ) : (
        <>
          <div style={{ fontSize: 12, color: '#778899', marginBottom: 12 }}>{data?.meta?.total ?? 0} usuário(s) encontrado(s)</div>
          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf2' }}>
                  {['Nome', 'E-mail', 'Papel', 'Verificado', 'Cadastro', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#778899', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.data || []).map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, color: '#1e3a6e' }}>{u.name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}><Badge value={u.role} map={ROLE_COLORS} /></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: u.emailVerified ? '#16a34a' : '#dc2626' }}>
                      {u.emailVerified ? 'Sim' : 'Não'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#778899' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setChangingRole(u)}
                          style={{ background: '#f5f3ff', color: '#7c3aed', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}
                        >
                          Alterar papel
                        </button>
                        <button
                          onClick={() => setChangingPassword(u)}
                          style={{ background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}
                        >
                          Alterar senha
                        </button>
                        {u.id === currentUserId ? (
                          <span style={{ fontSize: 12, color: '#778899', alignSelf: 'center' }}>Você</span>
                        ) : (
                          <button
                            onClick={() => setConfirm({ id: u.id, label: u.email })}
                            disabled={deleting === u.id}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5, opacity: deleting === u.id ? 0.5 : 1 }}
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(data?.data || []).length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#778899', fontSize: 14 }}>Nenhum usuário encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta} onPage={setPage} />
        </>
      )}

      {confirm && (
        <ConfirmModal
          message={`Tem certeza que deseja excluir o usuário "${confirm.label}"? Todos os dados relacionados serão removidos permanentemente.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {changingPassword && (
        <ChangePasswordModal
          user={changingPassword}
          onClose={() => setChangingPassword(null)}
        />
      )}

      {changingRole && (
        <ChangeRoleModal
          user={changingRole}
          onClose={() => setChangingRole(null)}
          onSuccess={(id, newRole) => {
            setData(prev => prev ? {
              ...prev,
              data: prev.data.map(u => u.id === id ? { ...u, role: newRole } : u)
            } : prev)
          }}
        />
      )}
    </div>
  )
}

// ── Section: Cursos ───────────────────────────────────────────

function CursosSection() {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [page, setPage]         = useState(1)
  const [confirm, setConfirm]   = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    adminApi.listCourses({ search: search || undefined, status: status || undefined, page, limit: 20 })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }

  const handleDelete = async () => {
    if (!confirm) return
    setDeleting(confirm.id)
    setConfirm(null)
    try {
      await adminApi.deleteCourse(confirm.id)
      setData(prev => prev ? { ...prev, data: prev.data.filter(c => c.id !== confirm.id), meta: { ...prev.meta, total: prev.meta.total - 1 } } : prev)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 20 }}>Gerenciar Cursos</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={searchInput} onChange={e => setSearchInput(e.target.value)}
          placeholder="Buscar por título..."
          style={{ flex: 1, minWidth: 200, border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none' }}
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white' }}>
          {COURSE_STATUSES.map(s => <option key={s} value={s}>{s || 'Todos os status'}</option>)}
        </select>
        <button type="submit" style={{ background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13.5 }}>
          Buscar
        </button>
      </form>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <p style={{ color: '#778899' }}>Carregando...</p>
      ) : (
        <>
          <div style={{ fontSize: 12, color: '#778899', marginBottom: 12 }}>{data?.meta?.total ?? 0} curso(s) encontrado(s)</div>
          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf2' }}>
                  {['Título', 'Instrutor', 'Matrículas', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#778899', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.data || []).map(course => (
                  <tr key={course.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, color: '#1e3a6e', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {course.title}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334' }}>{course.instructor?.email || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#334', textAlign: 'center' }}>{course._count?.enrollments ?? 0}</td>
                    <td style={{ padding: '12px 16px' }}><Badge value={course.status} map={STATUS_COLORS} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => setConfirm({ id: course.id, title: course.title })}
                        disabled={deleting === course.id}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5, opacity: deleting === course.id ? 0.5 : 1 }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {(data?.data || []).length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#778899', fontSize: 14 }}>Nenhum curso encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta} onPage={setPage} />
        </>
      )}

      {confirm && (
        <ConfirmModal
          message={`Tem certeza que deseja excluir o curso "${confirm.title}"? Todas as matrículas serão removidas.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export default function AdminDashboardPage({ navigate }) {
  const { user, logout } = useAuth()
  const { isMobile } = useBreakpoint()
  const [activeSection, setActiveSection] = useState('resumo')

  if (user?.role !== 'ADMIN') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#dc2626', fontWeight: 600 }}>Acesso restrito a administradores.</p>
        <button onClick={() => navigate('login')} style={{ background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 700 }}>
          Voltar ao login
        </button>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'resumo':   return <ResumoSection />
      case 'vagas':    return <VagasSection />
      case 'usuarios': return <UsuariosSection currentUserId={user.id} />
      case 'cursos':   return <CursosSection />
      default:         return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>

      {/* Sidebar */}
      <div style={{ width: 240, background: 'white', borderRight: '1px solid #e8edf2', display: isMobile ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1e3a6e' }}>Painel Admin</div>
          <div style={{ fontSize: 11, color: '#778899', marginTop: 2 }}>{user?.email}</div>
        </div>

        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? '#e8f2fc' : 'transparent', color: activeSection === item.id ? '#1e4a8a' : '#556677', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left' }}>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f4f8', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => navigate('dashboard-recrutador')} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, textAlign: 'left' }}>
            Painel Recrutador
          </button>
          <button onClick={() => navigate('admin')} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, textAlign: 'left' }}>
            Logs de Auditoria
          </button>
          <button onClick={logout} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 12.5, fontWeight: 700, textAlign: 'left' }}>
            Sair
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e8edf2', display: 'flex', zIndex: 100, overflowX: 'auto' }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: activeSection === item.id ? 700 : 500, background: 'transparent', color: activeSection === item.id ? '#1e4a8a' : '#778899', borderTop: `2px solid ${activeSection === item.id ? '#1e4a8a' : 'transparent'}` }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, padding: isMobile ? '24px 16px 80px' : '36px 40px', overflowY: 'auto' }}>
        {renderSection()}
      </div>
    </div>
  )
}
