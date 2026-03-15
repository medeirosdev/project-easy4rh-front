import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jobsApi, applicationsApi } from '../services/api'
import { mockJobs, mockCourses } from '../data/mockData'

const JobsContext = createContext()

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [courses] = useState(mockCourses) // LMS ainda não integrado
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ── Carregar vagas ao montar ──
  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobsApi.list(filters)
      // A API retorna { data: [...], total, page, limit } ou um array direto
      const list = Array.isArray(data) ? data : (data.data || data.jobs || [])
      setJobs(list)
    } catch (err) {
      console.error('Erro ao carregar vagas:', err)
      setError(err.message)
      // Fallback para mocks enquanto o backend não estiver disponível
      setJobs(mockJobs)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // ── Candidatar-se ──
  const applyToJob = async (jobId) => {
    try {
      await applicationsApi.apply(jobId)
      setAppliedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]))
      return { success: true }
    } catch (err) {
      console.error('Erro ao candidatar:', err)
      return { success: false, message: err.message }
    }
  }

  return (
    <JobsContext.Provider value={{
      jobs,
      courses,
      appliedJobs,
      loading,
      error,
      applyToJob,
      fetchJobs, // expõe para VagasPage usar com filtros
    }}>
      {children}
    </JobsContext.Provider>
  )
}

export const useJobs = () => useContext(JobsContext)
