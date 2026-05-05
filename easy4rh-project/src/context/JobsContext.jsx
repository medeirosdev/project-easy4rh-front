import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jobsApi, applicationsApi, coursesApi } from '../services/api'

const JobsContext = createContext()

// Mapeia enums do backend para labels do frontend
export const locationTypeMap = { ON_SITE: 'Presencial', REMOTE: 'Remoto', HYBRID: 'Híbrido' }
export const experienceLevelMap = {
  INTERN: 'Estágio',
  NO_EXPERIENCE: 'Sem experiência',
  UP_TO_1_YEAR: 'Até 1 ano',
  TWO_YEARS_PLUS: '2+ anos',
  JUNIOR: 'Júnior',
  MID: 'Pleno',
  SENIOR: 'Sênior',
  LEAD: 'Lead',
  MANAGER: 'Gerente',
}

export const contractTypeMap = { CLT: 'CLT', PJ: 'PJ', INTERNSHIP: 'Estágio', TEMPORARY: 'Temporário', FREELANCE: 'Freelance' }

const logoColors = ['#0066FF', '#CC0000', '#004B9B', '#E31E26', '#333333', '#009944', '#E60000', '#8B5CF6']

export function normalizeJob(job, index = 0) {
  const companyName = typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')
  const companyLogo = typeof job.company === 'object' && job.company && job.company.logoUrl
    ? job.company.logoUrl
    : companyName.slice(0, 2).toUpperCase()

  return {
    ...job,
    company: job.company,
    logo: job.logo || companyLogo,
    logoColor: job.logoColor || logoColors[index % logoColors.length],
    type: locationTypeMap[job.locationType] || job.type || 'Presencial',
    level: experienceLevelMap[job.experienceLevel] || job.level || 'Pleno',
    contract: contractTypeMap[job.contractType] || job.contract || null,
    location: job.city && job.state ? `${job.city}, ${job.state}` : (job.location || ''),
    salary: job.salaryMin != null
      ? `R$ ${job.salaryMin.toLocaleString('pt-BR')}${job.salaryMax ? ` – R$ ${job.salaryMax.toLocaleString('pt-BR')}` : ''}`
      : (job.salary || 'A combinar'),
    posted: job.createdAt
      ? `${Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000))} dias`
      : (job.posted || 'Recente'),
    description: job.description || '',
    responsibilities: job.responsibilities ? (typeof job.responsibilities === 'string' ? job.responsibilities.split('\n') : job.responsibilities) : [],
    requirements: job.requirements ? (typeof job.requirements === 'string' ? job.requirements.split('\n') : job.requirements) : [],
    benefits: job.benefits || [],
    category: job.area || job.category || '',
  }
}

const courseLevelMap = { BEGINNER: 'Básico', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' }

function normalizeCourse(course) {
  return {
    ...course,
    level: courseLevelMap[course.level] || course.level || 'Básico',
    students: course.enrollmentCount ?? course.students ?? 0,
    rating: course.rating ?? 0,
    instructor: course.instructor?.candidateProfile?.fullName || course.instructor?.fullName || course.instructor?.email || course.instructorName || course.instructor || '',
    // BUG-A02: course.duration is stored in seconds — convert to hours for display
    duration: (() => {
      const secs = course.totalDuration ?? course.duration
      if (!secs) return '—'
      const hours = Math.round(secs / 3600)
      return hours > 0 ? `${hours}h` : `${Math.round(secs / 60)}min`
    })(),
    description: course.description || '',
    category: course.category || '',
  }
}

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [courses, setCourses] = useState([])
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('easy4rh_applied_jobs')) || [] } catch { return [] }
  })
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [error, setError] = useState(null)
  const [jobsMeta, setJobsMeta] = useState(null)

  // ── Carregar vagas ao montar ──
  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobsApi.list({ limit: 20, page: 1, ...filters })
      const list = Array.isArray(data) ? data : (data.data || data.jobs || [])
      setJobs(list.map((j, i) => normalizeJob(j, i)))
      if (data.meta) setJobsMeta(data.meta)
    } catch (err) {
      console.error('Erro ao carregar vagas:', err)
      setError(err.message)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMoreJobs = useCallback(async () => {
    if (!jobsMeta || jobsMeta.page >= jobsMeta.totalPages) return
    setLoadingMore(true)
    try {
      const data = await jobsApi.list({ limit: jobsMeta.limit, page: jobsMeta.page + 1 })
      const list = Array.isArray(data) ? data : (data.data || data.jobs || [])
      setJobs(prev => {
        const existingIds = new Set(prev.map(j => j.id))
        const newJobs = list
          .filter(j => !existingIds.has(j.id))
          .map((j, i) => normalizeJob(j, prev.length + i))
        return [...prev, ...newJobs]
      })
      if (data.meta) setJobsMeta(data.meta)
    } catch (err) {
      console.error('Erro ao carregar mais vagas:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [jobsMeta])

  // ── Carregar cursos ao montar ──
  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true)
    try {
      const data = await coursesApi.list()
      const list = Array.isArray(data) ? data : (data.data || data.courses || [])
      setCourses(list.map(normalizeCourse))
    } catch (err) {
      console.error('Erro ao carregar cursos:', err)
      setCourses([])
    } finally {
      setCoursesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
    fetchCourses()
  }, [fetchJobs, fetchCourses])

  // ── Candidatar-se ──
  const applyToJob = async (jobId, data = {}) => {
    try {
      await applicationsApi.apply(jobId, data)
      setAppliedJobs(prev => {
        if (prev.includes(jobId)) return prev
        const next = [...prev, jobId]
        localStorage.setItem('easy4rh_applied_jobs', JSON.stringify(next))
        return next
      })
      return { success: true }
    } catch (err) {
      // 409 = já se candidatou — trata como sucesso local para sincronizar estado
      const isDuplicate =
        err.message?.includes('409') ||
        err.message?.toLowerCase().includes('já se candidatou') ||
        err.message?.toLowerCase().includes('already applied')
      if (isDuplicate) {
        setAppliedJobs(prev => {
          if (prev.includes(jobId)) return prev
          const next = [...prev, jobId]
          localStorage.setItem('easy4rh_applied_jobs', JSON.stringify(next))
          return next
        })
        return { success: false, isDuplicate: true, message: 'Você já se candidatou a esta vaga.' }
      }
      console.error('Erro ao candidatar:', err)
      return { success: false, message: err.message }
    }
  }

  const clearAppliedJobs = () => {
    setAppliedJobs([])
    localStorage.removeItem('easy4rh_applied_jobs')
  }

  return (
    <JobsContext.Provider value={{
      jobs,
      courses,
      appliedJobs,
      loading,
      loadingMore,
      coursesLoading,
      error,
      jobsMeta,
      applyToJob,
      clearAppliedJobs,
      fetchJobs,
      fetchCourses,
      loadMoreJobs,
    }}>
      {children}
    </JobsContext.Provider>
  )
}

export const useJobs = () => useContext(JobsContext)
