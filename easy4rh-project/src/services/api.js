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

async function requestFormData(method, path, formData) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
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
  // data: { email, password, role?: 'CANDIDATE' | 'RECRUITER' }

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
