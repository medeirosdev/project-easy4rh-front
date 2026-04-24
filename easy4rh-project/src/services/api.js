// ============================================================
// src/services/api.js
// Arquivo central de chamadas à API do backend
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ── Helpers ──────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token')
}

// Verifica se o JWT expirou antes de enviar o request
function isTokenExpired(token) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Limpa sessao e redireciona para login quando token expira
function handleAuthExpired() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  localStorage.removeItem('easy4rh_saved_jobs')
  // Remove user-scoped company cache keys
  Object.keys(localStorage)
    .filter(k => k.startsWith('my_company_id_'))
    .forEach(k => localStorage.removeItem(k))
  // Dispara evento customizado para o AuthContext reagir
  window.dispatchEvent(new CustomEvent('auth:expired'))
}

// Exportado para uso no AuthContext (validação na montagem)
export { isTokenExpired }

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(method, path, body = null) {
  const token = getToken()

  // Verifica expiracao antes de enviar
  if (token && isTokenExpired(token)) {
    handleAuthExpired()
    throw new Error('Sessao expirada. Faca login novamente.')
  }

  const options = {
    method,
    headers: authHeaders(),
  }
  if (body !== null && body !== undefined) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)

  // Token invalido ou expirado no servidor
  if (res.status === 401) {
    handleAuthExpired()
    throw new Error('Sessao expirada. Faca login novamente.')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `Erro ${res.status}`)
  }

  if (res.status === 204) return null

  return res.json()
}

async function requestFormData(method, path, formData) {
  const token = getToken()

  if (token && isTokenExpired(token)) {
    handleAuthExpired()
    throw new Error('Sessao expirada. Faca login novamente.')
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (res.status === 401) {
    handleAuthExpired()
    throw new Error('Sessao expirada. Faca login novamente.')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `Erro ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// Auth

export const authApi = {
  register: (data) => request('POST', '/users', data),
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  getUser: (id) => request('GET', `/users/${id}`),
  updateUser: (id, data) => request('PATCH', `/users/${id}`, data),
  requestPasswordReset: (email) => request('POST', '/auth/password-reset/request', { email }),
  confirmPasswordReset: (token, newPassword) => request('POST', '/auth/password-reset/confirm', { token, newPassword }),
}

// ── Jobs (Vagas) ──────────────────────────────────────────────

export const jobsApi = {
  /**
   * Listar vagas com filtros opcionais
   * GET /jobs
   */
  list: (filters = {}) => {
    const params = new URLSearchParams()
    const map = {
      keyword:         'search',
      location:        'city',
      state:           'state',
      type:            'locationType',    // ON_SITE | REMOTE | HYBRID
      level:           'experienceLevel', // JUNIOR | MID | SENIOR
      contractType:    'contractType',    // CLT | PJ | INTERNSHIP
      area:            'area',
      salaryMin:       'salaryMin',
      salaryMax:       'salaryMax',
      page:            'page',
      limit:           'limit',
    }
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(map[key] || key, val)
      }
    })
    const qs = params.toString()
    return request('GET', `/jobs${qs ? `?${qs}` : ''}`)
  },

  /**
   * Detalhes de uma vaga
   * GET /jobs/:id
   */
  get: (id) => request('GET', `/jobs/${id}`),

  /**
   * Criar vaga (Recrutador)
   * POST /jobs
   */
  create: (data) => request('POST', '/jobs', data),

  /**
   * Editar vaga (Recrutador)
   * PATCH /jobs/:id
   */
  update: (id, data) => request('PATCH', `/jobs/${id}`, data),

  /**
   * Excluir vaga (Recrutador)
   * DELETE /jobs/:id
   */
  delete: (id) => request('DELETE', `/jobs/${id}`),

  /**
   * Publicar vaga (Recrutador)
   * POST /jobs/:id/publish
   */
  publish: (id) => request('POST', `/jobs/${id}/publish`),
  pause: (id) => request('POST', `/jobs/${id}/pause`),

  /**
   * Encerrar vaga (Recrutador)
   * POST /jobs/:id/close
   */
  close: (id) => request('POST', `/jobs/${id}/close`),

  /**
   * Minhas vagas (Recrutador)
   * GET /jobs/recruiter/my-jobs
   */
  myJobs: () => request('GET', '/jobs/recruiter/my-jobs'),
}

// ── Job Questions (Perguntas de triagem) ──────────────────────

export const jobQuestionsApi = {
  list: (jobId) => request('GET', `/jobs/${jobId}/questions`),
  create: (jobId, data) => request('POST', `/jobs/${jobId}/questions`, data),
  update: (jobId, questionId, data) => request('PATCH', `/jobs/${jobId}/questions/${questionId}`, data),
  remove: (jobId, questionId) => request('DELETE', `/jobs/${jobId}/questions/${questionId}`),
  reorder: (jobId, questionIds) => request('PATCH', `/jobs/${jobId}/questions/reorder`, { questionIds }),
}

// ── Applications (Candidaturas) ───────────────────────────────

export const applicationsApi = {
  /**
   * Candidatar-se a uma vaga
   * POST /jobs/:id/apply
   */
  apply: (jobId, data = {}) => request('POST', `/jobs/${jobId}/apply`, data),

  /**
   * Minhas candidaturas (Candidato)
   * GET /me/applications
   */
  myApplications: () => request('GET', '/me/applications'),

  /**
   * Candidatos de uma vaga (Recrutador)
   * GET /jobs/:id/applications
   */
  jobApplications: (jobId) => request('GET', `/jobs/${jobId}/applications`),

  /**
   * Atualizar status de candidatura (Recrutador)
   * PATCH /applications/:id
   */
  updateStatus: (id, stage) => request('PATCH', `/applications/${id}`, { stage }),
  // stage: 'APPLIED' | 'SCREENING' | 'INTERVIEW_1' | 'INTERVIEW_2' | 'TECHNICAL' | 'OFFER' | 'HIRED' | 'REJECTED'

  /**
   * Desistir de candidatura (Candidato)
   * DELETE /applications/:id/withdraw
   */
  withdraw: (id) => request('DELETE', `/applications/${id}/withdraw`),
}

// ── Companies (Empresas) ──────────────────────────────────────

export const companiesApi = {
  list: () => request('GET', '/companies'),
  mine: () => request('GET', '/companies/mine'),
  get: (id) => request('GET', `/companies/${id}`),
  create: (data) => request('POST', '/companies', data),
  update: (id, data) => request('PATCH', `/companies/${id}`, data),
  delete: (id) => request('DELETE', `/companies/${id}`),
  uploadLogo: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return requestFormData('POST', `/companies/${id}/upload-logo`, fd)
  },
  uploadVideo: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return requestFormData('POST', `/companies/${id}/upload-video`, fd)
  },
}

// ── Courses / LMS ─────────────────────────────────────────────

export const coursesApi = {
  list: () => request('GET', '/courses'),
  get: (id) => request('GET', `/courses/${id}`),
  create: (data) => request('POST', '/courses', data),
  update: (id, data) => request('PATCH', `/courses/${id}`, data),
  delete: (id) => request('DELETE', `/courses/${id}`),
  publish: (id) => request('POST', `/courses/${id}/publish`),
  archive: (id) => request('POST', `/courses/${id}/archive`),
  myCourses: () => request('GET', '/courses/instructor/my-courses'),
  enroll: (id) => request('POST', `/courses/${id}/enroll`),
  myEnrollments: () => request('GET', '/me/enrollments'),
  enrollmentDetail: (id) => request('GET', `/enrollments/${id}`),
  sections: (id) => request('GET', `/courses/${id}/sections`),
  students: (id) => request('GET', `/courses/${id}/students`),
  stats: (id) => request('GET', `/courses/${id}/stats`),
}

// ── Sections ─────────────────────────────────────────────────

export const sectionsApi = {
  list: (courseId) => request('GET', `/courses/${courseId}/sections`),
  create: (courseId, data) => request('POST', `/courses/${courseId}/sections`, data),
  update: (id, data) => request('PATCH', `/sections/${id}`, data),
  delete: (id) => request('DELETE', `/sections/${id}`),
  reorder: (courseId, sectionIds) => request('POST', `/courses/${courseId}/sections/reorder`, { sectionIds }),
}

// ── Lessons ───────────────────────────────────────────────────

export const lessonsApi = {
  get: (id) => request('GET', `/lessons/${id}`),
  create: (sectionId, data) => request('POST', `/sections/${sectionId}/lessons`, data),
  update: (id, data) => request('PATCH', `/lessons/${id}`, data),
  delete: (id) => request('DELETE', `/lessons/${id}`),
  reorder: (sectionId, lessonIds) => request('POST', `/sections/${sectionId}/lessons/reorder`, { lessonIds }),
  uploadVideo: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return requestFormData('POST', `/lessons/${id}/upload-video`, fd)
  },
  updateProgress: (id, data) => request('POST', `/lessons/${id}/progress`, data),
}

// ── Candidate Profile ─────────────────────────────────────────
export const profileApi = {
  get: () => request('GET', '/candidate-profiles/me'),
  create: (data) => request('POST', '/candidate-profiles', data),
  update: (data) => request('PATCH', '/candidate-profiles/me', data),
}

export const documentsApi = {
  // Recruiter — library
  listLibrary: () => request('GET', '/documents/library'),
  addToLibrary: (data) => request('POST', '/documents/library', data),
  deleteFromLibrary: (id) => request('DELETE', `/documents/library/${id}`),
  // Recruiter — send + track
  send: (documentId, data) => request('POST', `/documents/library/${documentId}/send`, data),
  listSent: () => request('GET', '/documents/sent'),
  // Candidate — receive + respond
  listReceived: () => request('GET', '/documents/received'),
  markAsViewed: (sentDocumentId) => request('PATCH', `/documents/received/${sentDocumentId}/view`),
  respond: (sentDocumentId, status) => request('PATCH', `/documents/received/${sentDocumentId}`, { status }),
}

// ── Admin Management (ADMIN only, uses JWT) ───────────────────

function buildQs(params) {
  return new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
  ).toString()
}

export const adminApi = {
  stats: () => requestAudit('GET', '/admin/stats'),

  listJobs: (params = {}) => {
    const qs = buildQs(params)
    return requestAudit('GET', `/admin/jobs${qs ? '?' + qs : ''}`)
  },
  deleteJob: (id) => requestAudit('DELETE', `/admin/jobs/${id}`),

  listCourses: (params = {}) => {
    const qs = buildQs(params)
    return requestAudit('GET', `/admin/courses${qs ? '?' + qs : ''}`)
  },
  deleteCourse: (id) => requestAudit('DELETE', `/admin/courses/${id}`),

  listUsers: (params = {}) => {
    const qs = buildQs(params)
    return requestAudit('GET', `/admin/users${qs ? '?' + qs : ''}`)
  },
  deleteUser: (id) => requestAudit('DELETE', `/admin/users/${id}`),
}

// Requisições para o painel de auditoria — usa X-Audit-Key, sem JWT
function auditKey() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  return `${dd}${mm}${yyyy}123`
}

async function requestAudit(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Audit-Key': auditKey() },
  }
  if (body !== null) options.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `Erro ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const auditApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString()
    return requestAudit('GET', `/audit${qs ? '?' + qs : ''}`)
  },
  stats: () => requestAudit('GET', '/audit/stats'),
  get: (id) => requestAudit('GET', `/audit/${id}`),
  purge: (days) => requestAudit('DELETE', `/audit/purge/${days}`),
}

// ── Token helpers (usados no AuthContext) ──────────────────────

export function saveToken(token) {
  localStorage.setItem('access_token', token)
}

export function clearToken() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function loadUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    // Valida schema minimo para evitar objeto invalido de versoes antigas
    if (!user?.email || !user?.role) return null
    return user
  } catch {
    return null
  }
}
