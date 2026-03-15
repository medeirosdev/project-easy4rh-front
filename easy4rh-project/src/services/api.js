// ============================================================
// src/services/api.js
// Arquivo central de chamadas à API do backend
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ── Helpers ──────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: authHeaders(),
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `Erro ${res.status}`)
  }

  if (res.status === 204) return null

  return res.json()
}

// Auth

export const authApi = {
  /**
   * Registrar novo usuário (candidato)
   * POST /users
   */
  register: (data) => request('POST', '/users', data),
  // data: { email, password, name, phone?, role?: 'CANDIDATE' | 'RECRUITER' }

  /**
   * Login — retorna { access_token }
   * POST /auth/login
   */
  login: (email, password) =>
    request('POST', '/auth/login', { email, password }),

  /**
   * Buscar perfil do usuário logado
   * GET /users/:id
   */
  getUser: (id) => request('GET', `/users/${id}`),

  /**
   * Atualizar usuário
   * PATCH /users/:id
   */
  updateUser: (id, data) => request('PATCH', `/users/${id}`, data),
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

// ── Applications (Candidaturas) ───────────────────────────────

export const applicationsApi = {
  /**
   * Candidatar-se a uma vaga
   * POST /jobs/:id/apply
   */
  apply: (jobId) => request('POST', `/jobs/${jobId}/apply`),

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
  updateStatus: (id, status) => request('PATCH', `/applications/${id}`, { status }),
  // status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED'

  /**
   * Desistir de candidatura (Candidato)
   * DELETE /applications/:id/withdraw
   */
  withdraw: (id) => request('DELETE', `/applications/${id}/withdraw`),
}

// ── Companies (Empresas) ──────────────────────────────────────

export const companiesApi = {
  /**
   * Listar empresas
   * GET /companies
   */
  list: () => request('GET', '/companies'),

  /**
   * Detalhes de empresa
   * GET /companies/:id
   */
  get: (id) => request('GET', `/companies/${id}`),

  /**
   * Criar empresa (Recrutador)
   * POST /companies
   */
  create: (data) => request('POST', '/companies', data),
}

// ── Courses / LMS ─────────────────────────────────────────────

export const coursesApi = {
  /**
   * Listar cursos públicos
   * GET /courses
   */
  list: () => request('GET', '/courses'),

  /**
   * Detalhes de um curso
   * GET /courses/:id
   */
  get: (id) => request('GET', `/courses/${id}`),

  /**
   * Matricular-se em um curso
   * POST /courses/:id/enroll
   */
  enroll: (id) => request('POST', `/courses/${id}/enroll`),

  /**
   * Meus cursos matriculados
   * GET /me/enrollments
   */
  myEnrollments: () => request('GET', '/me/enrollments'),

  /**
   * Grade curricular (seções e aulas)
   * GET /courses/:id/sections
   */
  sections: (id) => request('GET', `/courses/${id}/sections`),
}

// ── Lessons ───────────────────────────────────────────────────

export const lessonsApi = {
  /**
   * Ver aula
   * GET /lessons/:id
   */
  get: (id) => request('GET', `/lessons/${id}`),

  /**
   * Atualizar progresso
   * POST /lessons/:id/progress
   */
  updateProgress: (id, data) => request('POST', `/lessons/${id}/progress`, data),
  // data: { completed: true }
}

// ── Candidate Profile ─────────────────────────────────────────
export const profileApi = {
  get: () => request('GET', '/candidate-profiles/me'),
  create: (data) => request('POST', '/candidate-profiles', data),
  update: (data) => request('PATCH', '/candidate-profiles/me', data),
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
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}
