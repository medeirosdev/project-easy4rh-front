import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { jobsApi, companiesApi, applicationsApi, jobQuestionsApi, coursesApi, sectionsApi, lessonsApi, documentsApi } from '../services/api'
import { locationTypeMap } from '../context/JobsContext'
import { getStageLabel, getStageColor, getStageBackground, PIPELINE_STAGES, normalizeStage } from '../utils/applicationStages'
import JobPosterModal from '../components/JobPosterModal'

const recruiterMenuItems = [
  { id: 'resumo',      icon: '🏠', label: 'Resumo' },
  { id: 'empresa',     icon: '🏢', label: 'Minha Empresa' },
  { id: 'publicar',    icon: '➕', label: 'Publicar Vaga' },
  { id: 'vagas',       icon: '📢', label: 'Vagas Publicadas' },
  { id: 'aplicacoes',  icon: '📋', label: 'Aplicações' },
  { id: 'documentos',  icon: '📄', label: 'Documentos' },
  { id: 'talentos',    icon: '🌟', label: 'Banco de Talentos' },
  { id: 'cursos',      icon: '🎓', label: 'Cursos' },
]

const instructorMenuItems = [
  { id: 'resumo',      icon: '🏠', label: 'Resumo' },
  { id: 'cursos',      icon: '🎓', label: 'Meus Cursos' },
]

const jobTypes = [
  { label: 'Presencial', value: 'ON_SITE' },
  { label: 'Remoto', value: 'REMOTE' },
  { label: 'Híbrido', value: 'HYBRID' },
]
const levels = [
  { label: 'Estágio', value: 'INTERN' },
  { label: 'Sem experiência', value: 'NO_EXPERIENCE' },
  { label: 'Até 1 ano', value: 'UP_TO_1_YEAR' },
  { label: '2 anos ou mais', value: 'TWO_YEARS_PLUS' },
  { label: 'Júnior', value: 'JUNIOR' },
  { label: 'Pleno', value: 'MID' },
  { label: 'Sênior', value: 'SENIOR' },
  { label: 'Gerente', value: 'MANAGER' },
]
const openingReasons = [
  { label: 'Substituição', value: 'REPLACEMENT' },
  { label: 'Aumento de equipe', value: 'TEAM_GROWTH' },
]
const contractTypes = [
  { label: 'CLT', value: 'CLT' },
  { label: 'PJ', value: 'PJ' },
  { label: 'Estágio', value: 'INTERNSHIP' },
  { label: 'Temporário', value: 'TEMPORARY' },
  { label: 'Freelance', value: 'FREELANCE' },
]
const questionTypes = [
  { label: 'Escolha única', value: 'SINGLE_CHOICE' },
  { label: 'Múltipla escolha', value: 'MULTIPLE_CHOICE' },
  { label: 'Sim / Não', value: 'YES_NO' },
  { label: 'Texto livre', value: 'TEXT' },
]
const emptyVaga = { title: '', companyId: '', city: '', state: '', locationType: '', experienceLevel: '', contractType: '', description: '', requirements: '', responsibilities: '', area: '', salaryMin: '', salaryMax: '', hideSalary: false, expiresAt: '', isConfidential: false, openingReason: '' }
const emptyQuestion = { question: '', type: 'SINGLE_CHOICE', required: true, options: [{ label: '', score: 0 }, { label: '', score: 0 }] }
const courseLevels = [
  { label: 'Iniciante', value: 'BEGINNER' },
  { label: 'Intermediário', value: 'INTERMEDIATE' },
  { label: 'Avançado', value: 'ADVANCED' },
]
const emptyCurso = { title: '', description: '', thumbnailUrl: '', level: 'BEGINNER', category: '' }

export default function RecrutadorDashboard({ navigate }) {
  const { user, logout } = useAuth()
  const { isMobile } = useBreakpoint()
  const isInstructor = user?.role === 'INSTRUCTOR'
  // RECRUITER_INSTRUCTOR usa o mesmo menu completo do RECRUITER (já tem cursos)
  const menuItems = isInstructor ? instructorMenuItems : recruiterMenuItems
  const [activeSection, setActiveSection] = useState(isInstructor ? 'cursos' : 'resumo')
  const [novaVaga, setNovaVaga] = useState({ ...emptyVaga })
  const [vagaPublicada, setVagaPublicada] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [pubStep, setPubStep] = useState(1) // 1=dados, 2=perguntas, 3=publicar
  const [createdJobId, setCreatedJobId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [publishing, setPublishing] = useState(false)

  // Real data states
  const [myJobs, setMyJobs] = useState([])
  const [myJobsLoading, setMyJobsLoading] = useState(false)
  const [allApplications, setAllApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [applicationsJobFilter, setApplicationsJobFilter] = useState(null) // jobId | null
  const [posterJob, setPosterJob] = useState(null) // job object | null — drives JobPosterModal visibility

  // Documents module
  const [docLibrary, setDocLibrary] = useState([])
  const [docLibraryLoading, setDocLibraryLoading] = useState(false)
  const [sentDocs, setSentDocs] = useState([])
  const [sentDocsLoading, setSentDocsLoading] = useState(false)
  const [docView, setDocView] = useState('library') // 'library' | 'sent' | 'add'
  const [docForm, setDocForm] = useState({ title: '', description: '', category: 'OTHER', fileUrl: '', fileName: '' })
  const [docSaving, setDocSaving] = useState(false)
  const [docError, setDocError] = useState('')
  const [docSuccess, setDocSuccess] = useState('')
  const [sendDocModal, setSendDocModal] = useState(null) // { doc, search } | null
  const [sendDocCandidateId, setSendDocCandidateId] = useState('')
  const [sendDocMessage, setSendDocMessage] = useState('')
  const [sendDocSaving, setSendDocSaving] = useState(false)
  const [sendDocError, setSendDocError] = useState('')

  // Company management
  const [myCompany, setMyCompany] = useState(null)
  const [companySaving, setCompanySaving] = useState(false)
  const [companyError, setCompanyError] = useState('')
  const [companySuccess, setCompanySuccess] = useState('')
  const [companyForm, setCompanyForm] = useState({
    name: '', razaoSocial: '', cnpj: '', description: '', website: '',
    address: '', addressNumber: '', addressComplement: '', neighborhood: '', zipCode: '', city: '', state: '',
    size: '', industry: '', legalNature: '',
    mission: '', values: '',
    linkedinUrl: '', instagramUrl: '', glassdoorUrl: '',
    logoUrl: '', aboutVideoUrl: '',
  })

  // Course management
  const [myCourses, setMyCourses] = useState([])
  const [myCoursesLoading, setMyCoursesLoading] = useState(false)
  const [courseView, setCourseView] = useState('list') // 'list' | 'create' | 'edit'
  const [novoCurso, setNovoCurso] = useState({ ...emptyCurso })
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [courseSections, setCourseSections] = useState([]) // [{ id?, title, lessons: [{ id?, title, description, videoUrl, duration, isFree, videoFile }] }]
  const [coursePublishing, setCoursePublishing] = useState(false)
  const [courseError, setCourseError] = useState('')
  const [courseSuccess, setCourseSuccess] = useState('')
  const [courseStats, setCourseStats] = useState(null)
  const [courseStudents, setCourseStudents] = useState([])
  const [courseStatsLoading, setCourseStatsLoading] = useState(false)

  // Track pending timers to cancel on unmount (avoids setState on unmounted component)
  const timersRef = useRef([])
  const safeTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])
  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const populateCompanyForm = (company) => {
    setMyCompany(company)
    setCompanyForm({
      name: company.name || '', razaoSocial: company.razaoSocial || '', cnpj: company.cnpj || '',
      description: company.description || '', website: company.website || '',
      address: company.address || '', addressNumber: company.addressNumber || '',
      addressComplement: company.addressComplement || '', neighborhood: company.neighborhood || '',
      zipCode: company.zipCode || '', city: company.city || '', state: company.state || '',
      size: company.size || '', industry: company.industry || '', legalNature: company.legalNature || '',
      mission: company.mission || '', values: company.values || '',
      linkedinUrl: company.linkedinUrl || '', instagramUrl: company.instagramUrl || '',
      glassdoorUrl: company.glassdoorUrl || '',
      logoUrl: company.logoUrl || '', aboutVideoUrl: company.aboutVideoUrl || '',
    })
  }

  // Auto-fill companyId in job form when company is loaded
  useEffect(() => {
    if (myCompany?.id) {
      setNovaVaga(prev => prev.companyId === myCompany.id ? prev : { ...prev, companyId: myCompany.id })
    }
  }, [myCompany?.id])

  // Reset job creation flow when navigating away from 'publicar' section
  useEffect(() => {
    if (activeSection !== 'publicar' && pubStep > 1 && !vagaPublicada) {
      setPubStep(1)
      setNovaVaga(prev => ({ ...emptyVaga, companyId: prev.companyId }))
      setQuestions([])
      setCreatedJobId(null)
      setPublishError('')
    }
  }, [activeSection])

  useEffect(() => {
    // Load recruiter's own company via dedicated endpoint
    companiesApi.mine().then(company => {
      if (company) {
        populateCompanyForm(company)
        localStorage.setItem('my_company_id', company.id)
      }
    }).catch(() => {
      // Fallback: try localStorage saved id
      const savedCompanyId = localStorage.getItem('my_company_id')
      if (savedCompanyId) {
        companiesApi.get(savedCompanyId).then(c => {
          if (c) populateCompanyForm(c)
        }).catch(() => {})
      }
    })
  }, [])

  // Fetch recruiter's jobs
  const fetchMyJobs = useCallback(async () => {
    setMyJobsLoading(true)
    try {
      const data = await jobsApi.myJobs()
      const list = Array.isArray(data) ? data : (data.data || data.jobs || [])
      setMyJobs(list.map(job => ({
        id: job.id,
        title: job.title,
        location: job.city && job.state ? `${job.city}, ${job.state}` : (job.city || job.state || ''),
        type: locationTypeMap[job.locationType] || 'Presencial',
        aplicacoes: job._count?.applications ?? 0,
        status: { PUBLISHED: 'Aberta', PAUSED: 'Pausada', CLOSED: 'Encerrada', DRAFT: 'Rascunho', FILLED: 'Preenchida' }[job.status] || job.status,
        rawStatus: job.status,
        date: job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : '',
        publishedAt: job.publishedAt || null,
        closedAt: job.closedAt || null,
        expiresAt: job.expiresAt || null,
        isConfidential: job.isConfidential || false,
        openingReason: job.openingReason || null,
        experienceLevel: job.experienceLevel || null,
        contractType: job.contractType || null,
      })))
    } catch (err) {
      console.error('Erro ao carregar vagas:', err)
      setMyJobs([])
    } finally {
      setMyJobsLoading(false)
    }
  }, [])

  // Fetch all applications across recruiter's jobs
  const fetchAllApplications = useCallback(async (jobs) => {
    setApplicationsLoading(true)
    try {
      const jobList = jobs || myJobs
      const results = await Promise.all(
        jobList.filter(j => j.id).map(async (job) => {
          try {
            const apps = await applicationsApi.jobApplications(job.id)
            const list = Array.isArray(apps) ? apps : (apps.data || [])
            return list.map(app => {
              const stage = app.stage || 'APPLIED'
              return {
                id: app.id,
                candidateId: app.candidate?.id || app.candidateId || null,
                name: app.candidate?.candidateProfile?.fullName || app.candidate?.email || 'Candidato',
                role: job.title,
                jobId: job.id,
                date: app.createdAt ? new Date(app.createdAt).toLocaleDateString('pt-BR') : '',
                stage,
                status: getStageLabel(stage),
                color: getStageColor(stage),
                resumeUrl: app.candidate?.candidateProfile?.resumeUrl || null,
                adherencePercent: app.adherencePercent ?? null,
              }
            })
          } catch {
            return []
          }
        })
      )
      setAllApplications(results.flat())
    } catch {
      setAllApplications([])
    } finally {
      setApplicationsLoading(false)
    }
  }, [myJobs])

  useEffect(() => {
    fetchMyJobs()
  }, [fetchMyJobs])

  // Load applications after jobs are loaded
  useEffect(() => {
    if (myJobs.length > 0) {
      fetchAllApplications(myJobs)
    }
  }, [myJobs, fetchAllApplications])

  const fetchDocLibrary = useCallback(async () => {
    setDocLibraryLoading(true)
    try {
      const data = await documentsApi.listLibrary()
      setDocLibrary(Array.isArray(data) ? data : [])
    } catch {
      setDocLibrary([])
    } finally {
      setDocLibraryLoading(false)
    }
  }, [])

  const fetchSentDocs = useCallback(async () => {
    setSentDocsLoading(true)
    try {
      const data = await documentsApi.listSent()
      setSentDocs(Array.isArray(data) ? data : [])
    } catch {
      setSentDocs([])
    } finally {
      setSentDocsLoading(false)
    }
  }, [])

  // Load documents when navigating to documents section
  useEffect(() => {
    if (activeSection === 'documentos') {
      fetchDocLibrary()
      fetchSentDocs()
    }
  }, [activeSection, fetchDocLibrary, fetchSentDocs])

  const handleAddDocument = async (e) => {
    e.preventDefault()
    setDocError('')
    if (!docForm.title || !docForm.fileUrl || !docForm.fileName) {
      setDocError('Preencha título, URL do arquivo e nome do arquivo.')
      return
    }
    setDocSaving(true)
    try {
      const created = await documentsApi.addToLibrary(docForm)
      setDocLibrary(prev => [created, ...prev])
      setDocForm({ title: '', description: '', category: 'OTHER', fileUrl: '', fileName: '' })
      setDocView('library')
      setDocSuccess('Documento adicionado com sucesso!')
      safeTimeout(() => setDocSuccess(''), 3000)
    } catch (err) {
      setDocError(err.message || 'Erro ao salvar documento.')
    } finally {
      setDocSaving(false)
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Remover este documento da biblioteca?')) return
    try {
      await documentsApi.deleteFromLibrary(id)
      setDocLibrary(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      setDocError(err.message || 'Erro ao remover documento.')
    }
  }

  const handleSendDocument = async () => {
    if (!sendDocCandidateId) return
    setSendDocSaving(true)
    setSendDocError('')
    try {
      await documentsApi.send(sendDocModal.doc.id, { candidateId: sendDocCandidateId, message: sendDocMessage })
      setSendDocModal(null)
      setSendDocCandidateId('')
      setSendDocMessage('')
      setSendDocError('')
      fetchSentDocs()
      setDocSuccess('Documento enviado com sucesso!')
      safeTimeout(() => setDocSuccess(''), 3000)
    } catch (err) {
      setSendDocError(err.message || 'Erro ao enviar documento.')
    } finally {
      setSendDocSaving(false)
    }
  }

  const [jobActionError, setJobActionError] = useState('')
  const handlePauseJob = async (jobId) => {
    setJobActionError('')
    try {
      await jobsApi.pause(jobId)
      setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Pausada', rawStatus: 'PAUSED' } : j))
    } catch (err) {
      setJobActionError(err.message || 'Erro ao pausar vaga.')
    }
  }

  const handleCloseJob = async (jobId) => {
    if (!window.confirm('Encerrar esta vaga? Candidatos não poderão mais se candidatar.')) return
    setJobActionError('')
    try {
      await jobsApi.close(jobId)
      setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Encerrada', rawStatus: 'CLOSED' } : j))
    } catch (err) {
      setJobActionError(err.message || 'Erro ao encerrar vaga.')
    }
  }

  const handleUpdateApplicationStatus = async (appId, stage) => {
    try {
      await applicationsApi.updateStatus(appId, stage)
      setAllApplications(prev => prev.map(a =>
        a.id === appId ? { ...a, stage, status: getStageLabel(stage), color: getStageColor(stage) } : a
      ))
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
    }
  }

  // Step 1 → criar vaga (rascunho) e ir para perguntas
  const handleCreateDraft = async () => {
    if (!novaVaga.title || !novaVaga.companyId || !novaVaga.description || !novaVaga.requirements) return
    setPublishError('')
    setPublishing(true)
    try {
      const payload = {
        title: novaVaga.title,
        companyId: novaVaga.companyId,
        city: novaVaga.city || undefined,
        state: novaVaga.state || undefined,
        locationType: novaVaga.locationType || 'ON_SITE',
        experienceLevel: novaVaga.experienceLevel || 'MID',
        contractType: novaVaga.contractType || 'CLT',
        description: novaVaga.description,
        requirements: novaVaga.requirements,
        responsibilities: novaVaga.responsibilities || undefined,
        area: novaVaga.area || 'Geral',
        salaryMin: novaVaga.salaryMin ? Number(novaVaga.salaryMin) : undefined,
        salaryMax: novaVaga.salaryMax ? Number(novaVaga.salaryMax) : undefined,
        hideSalary: novaVaga.hideSalary || false,
        expiresAt: novaVaga.expiresAt || undefined,
        isConfidential: novaVaga.isConfidential || false,
        openingReason: novaVaga.openingReason || undefined,
      }
      const created = await jobsApi.create(payload)
      setCreatedJobId(created.id)
      setPubStep(2)
    } catch (err) {
      setPublishError(err.message || 'Erro ao criar vaga')
    } finally {
      setPublishing(false)
    }
  }

  // Step 2 → salvar perguntas e ir para revisão
  const handleSaveQuestions = async () => {
    if (!createdJobId) return
    setPublishError('')
    setPublishing(true)
    try {
      const dtos = questions
        .map((q, i) => {
          if (!q.question.trim()) return null
          return {
            question: q.question,
            type: q.type,
            required: q.required,
            order: i,
            options: q.type === 'TEXT' ? [] : q.type === 'YES_NO'
              ? [{ label: 'Sim', score: q.options[0]?.score || 1, order: 0 }, { label: 'Não', score: q.options[1]?.score || 0, order: 1 }]
              : q.options.filter(o => o.label.trim()).map((o, idx) => ({ label: o.label, score: Number(o.score) || 0, order: idx })),
          }
        })
        .filter(Boolean)
      await Promise.all(dtos.map(dto => jobQuestionsApi.create(createdJobId, dto)))
      setPubStep(3)
    } catch (err) {
      setPublishError(err.message || 'Erro ao salvar perguntas')
    } finally {
      setPublishing(false)
    }
  }

  // Step 3 → publicar
  const handlePublishJob = async () => {
    if (!createdJobId) return
    setPublishError('')
    setPublishing(true)
    try {
      await jobsApi.publish(createdJobId)
      setVagaPublicada(true)
      safeTimeout(() => {
        setVagaPublicada(false)
        setNovaVaga({ ...emptyVaga })
        setQuestions([])
        setCreatedJobId(null)
        setPubStep(1)
        fetchMyJobs()
        setActiveSection('vagas')
      }, 2000)
    } catch (err) {
      setPublishError(err.message || 'Erro ao publicar vaga')
    } finally {
      setPublishing(false)
    }
  }

  // Question helpers
  const addQuestion = () => setQuestions(prev => [...prev, { ...emptyQuestion, options: [{ label: '', score: 0 }, { label: '', score: 0 }] }])
  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx))
  const updateQuestion = (idx, field, value) => setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q))
  const updateOption = (qIdx, oIdx, field, value) => setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, options: q.options.map((o, j) => j === oIdx ? { ...o, [field]: value } : o) } : q))
  const addOption = (qIdx) => setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, options: [...q.options, { label: '', score: 0 }] } : q))
  const removeOption = (qIdx, oIdx) => setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q))

  // ── Course management ──
  const fetchMyCourses = useCallback(async () => {
    setMyCoursesLoading(true)
    try {
      const data = await coursesApi.myCourses()
      const list = Array.isArray(data) ? data : (data.data || data.courses || [])
      setMyCourses(list)
    } catch {
      setMyCourses([])
    } finally {
      setMyCoursesLoading(false)
    }
  }, [])

  useEffect(() => { fetchMyCourses() }, [fetchMyCourses])

  const handleCreateCourse = async () => {
    if (!novoCurso.title || !novoCurso.description) return
    setCoursePublishing(true)
    setCourseError('')
    try {
      const payload = {
        title: novoCurso.title,
        description: novoCurso.description,
        thumbnailUrl: novoCurso.thumbnailUrl || undefined,
        price: 0,
        level: novoCurso.level || 'BEGINNER',
        category: novoCurso.category || 'Geral',
      }
      const created = await coursesApi.create(payload)
      setEditingCourseId(created.id)

      // Create sections and lessons
      for (let si = 0; si < courseSections.length; si++) {
        const sec = courseSections[si]
        if (!sec.title.trim()) continue
        const createdSec = await sectionsApi.create(created.id, { title: sec.title, order: si })
        for (let li = 0; li < (sec.lessons || []).length; li++) {
          const les = sec.lessons[li]
          if (!les.title.trim()) continue
          const createdLesson = await lessonsApi.create(createdSec.id, {
            title: les.title,
            description: les.description || undefined,
            videoUrl: les.videoUrl || undefined,
            duration: les.duration ? Number(les.duration) : undefined,
            isFree: les.isFree || false,
            order: li,
          })
          if (les.videoFile) {
            try {
              await lessonsApi.uploadVideo(createdLesson.id, les.videoFile)
            } catch (err) {
              console.error('Erro ao enviar vídeo:', err)
            }
          }
        }
      }

      setCourseSuccess('Curso criado com sucesso!')
      safeTimeout(() => {
        setCourseSuccess('')
        setNovoCurso({ ...emptyCurso })
        setCourseSections([])
        setEditingCourseId(null)
        setCourseView('list')
        fetchMyCourses()
      }, 2000)
    } catch (err) {
      setCourseError(err.message || 'Erro ao criar curso')
    } finally {
      setCoursePublishing(false)
    }
  }

  const handlePublishCourse = async (courseId) => {
    setCourseError('')
    try {
      await coursesApi.publish(courseId)
      setMyCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'PUBLISHED' } : c))
      setCourseSuccess('Curso publicado com sucesso!')
      safeTimeout(() => setCourseSuccess(''), 3000)
    } catch (err) {
      setCourseError(err.message || 'Erro ao publicar curso.')
    }
  }

  const handleArchiveCourse = async (courseId) => {
    setCourseError('')
    try {
      await coursesApi.archive(courseId)
      setMyCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'ARCHIVED' } : c))
      setCourseSuccess('Curso arquivado.')
      safeTimeout(() => setCourseSuccess(''), 3000)
    } catch (err) {
      setCourseError(err.message || 'Erro ao arquivar curso.')
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Tem certeza que deseja excluir este curso?')) return
    setCourseError('')
    try {
      await coursesApi.delete(courseId)
      setMyCourses(prev => prev.filter(c => c.id !== courseId))
      setCourseSuccess('Curso excluido.')
      safeTimeout(() => setCourseSuccess(''), 3000)
    } catch (err) {
      setCourseError(err.message || 'Erro ao excluir curso.')
    }
  }

  const handleViewCourseStats = async (course) => {
    setEditingCourseId(course.id)
    setCourseView('stats')
    setCourseStatsLoading(true)
    try {
      const [stats, students] = await Promise.all([
        coursesApi.stats(course.id),
        coursesApi.students(course.id),
      ])
      setCourseStats(stats)
      const stuList = Array.isArray(students) ? students : (students.data || [])
      setCourseStudents(stuList)
    } catch (err) {
      console.error('Erro ao carregar stats:', err)
      setCourseStats(null)
      setCourseStudents([])
    } finally {
      setCourseStatsLoading(false)
    }
  }

  // Company management functions
  const handleSaveCompany = async () => {
    setCompanySaving(true)
    setCompanyError('')
    setCompanySuccess('')
    try {
      const payload = { ...companyForm }
      // logoUrl and aboutVideoUrl are managed via upload endpoints, not PATCH
      delete payload.logoUrl
      delete payload.aboutVideoUrl
      // Remove empty strings to avoid validation errors
      Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k] })
      if (myCompany) {
        const updated = await companiesApi.update(myCompany.id, payload)
        populateCompanyForm(updated)
        localStorage.setItem('my_company_id', updated.id)
        setCompanySuccess('Empresa atualizada com sucesso!')
      } else {
        if (!companyForm.name.trim()) { setCompanyError('Nome da empresa e obrigatorio.'); setCompanySaving(false); return }
        const created = await companiesApi.create(payload)
        populateCompanyForm(created)
        localStorage.setItem('my_company_id', created.id)
        setCompanySuccess('Empresa criada com sucesso!')
      }
      safeTimeout(() => setCompanySuccess(''), 4000)
    } catch (err) {
      setCompanyError(err.message || 'Erro ao salvar empresa.')
    } finally {
      setCompanySaving(false)
    }
  }

  const handleUploadLogo = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!myCompany) { setCompanyError('Salve os dados da empresa primeiro antes de enviar o logo.'); return }
    if (!file.type.startsWith('image/')) { setCompanyError('O logo deve ser uma imagem (JPG, PNG, SVG...).'); return }
    if (file.size > 5 * 1024 * 1024) { setCompanyError('O logo deve ter no maximo 5 MB.'); return }
    setCompanyError('')
    setCompanySuccess('')
    try {
      const result = await companiesApi.uploadLogo(myCompany.id, file)
      // Backend returns { company, upload } — company already has logoUrl updated
      const url = result.company?.logoUrl || result.upload?.secureUrl || result.secureUrl || result.logoUrl
      if (url) {
        setCompanyForm(prev => ({ ...prev, logoUrl: url }))
        setMyCompany(prev => ({ ...prev, logoUrl: url }))
        setCompanySuccess('Logo atualizado!')
        safeTimeout(() => setCompanySuccess(''), 4000)
      }
    } catch (err) {
      setCompanyError(err.message || 'Erro ao enviar logo.')
    }
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!myCompany) { setCompanyError('Salve os dados da empresa primeiro antes de enviar o video.'); return }
    if (!file.type.startsWith('video/')) { setCompanyError('O video deve ser um arquivo de video (MP4, MOV...).'); return }
    if (file.size > 200 * 1024 * 1024) { setCompanyError('O video deve ter no maximo 200 MB.'); return }
    setCompanyError('')
    setCompanySuccess('')
    try {
      const result = await companiesApi.uploadVideo(myCompany.id, file)
      // Backend returns { company, upload } — company already has aboutVideoUrl updated
      const url = result.company?.aboutVideoUrl || result.upload?.secureUrl || result.secureUrl || result.aboutVideoUrl
      if (url) {
        setCompanyForm(prev => ({ ...prev, aboutVideoUrl: url }))
        setMyCompany(prev => ({ ...prev, aboutVideoUrl: url }))
        setCompanySuccess('Video atualizado!')
        safeTimeout(() => setCompanySuccess(''), 4000)
      }
    } catch (err) {
      setCompanyError(err.message || 'Erro ao enviar video.')
    }
  }

  // Section/lesson helpers for course builder
  const addSection = () => setCourseSections(prev => [...prev, { title: '', lessons: [] }])
  const removeSection = (idx) => setCourseSections(prev => prev.filter((_, i) => i !== idx))
  const updateSectionTitle = (idx, title) => setCourseSections(prev => prev.map((s, i) => i === idx ? { ...s, title } : s))
  const addLesson = (secIdx) => setCourseSections(prev => prev.map((s, i) => i === secIdx ? { ...s, lessons: [...s.lessons, { title: '', description: '', videoUrl: '', duration: '', isFree: false, videoFile: null }] } : s))
  const removeLesson = (secIdx, lesIdx) => setCourseSections(prev => prev.map((s, i) => i === secIdx ? { ...s, lessons: s.lessons.filter((_, j) => j !== lesIdx) } : s))
  const updateLesson = (secIdx, lesIdx, field, value) => setCourseSections(prev => prev.map((s, i) => i === secIdx ? { ...s, lessons: s.lessons.map((l, j) => j === lesIdx ? { ...l, [field]: value } : l) } : s))

  // Stats
  const vagasAtivas = myJobs.filter(j => j.rawStatus === 'PUBLISHED').length
  const totalAplicacoes = allApplications.length
  const aprovados = allApplications.filter(a => a.stage === 'HIRED').length

  const renderSection = () => {
    switch (activeSection) {

      case 'resumo': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>
            Olá, {user?.name?.split(' ')[0]} 👋
          </h2>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Vagas ativas', value: vagasAtivas, icon: '📢', color: '#1e4a8a' },
              { label: 'Total de aplicações', value: totalAplicacoes, icon: '📋', color: '#f0a500' },
              { label: 'Aprovados', value: aprovados, icon: '✅', color: '#22c55e' },
              { label: 'Talentos no banco', value: '—', icon: '🌟', color: '#8b5cf6' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#778899', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent applications */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 16 }}>Aplicações recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {applicationsLoading ? (
              <div style={{ background: 'white', borderRadius: 12, padding: '24px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando aplicações...</div>
            ) : allApplications.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 12, padding: '24px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Nenhuma aplicação recebida ainda.</div>
            ) : (
              allApplications.slice(0, 3).map(a => (
                <div key={a.id} style={{ background: 'white', borderRadius: 12, padding: '14px 20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f2fc, #c8daf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1e4a8a', fontSize: 14 }}>
                      {(a.name || 'C')[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e3a6e' }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: '#778899' }}>{a.role} · {a.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: `${a.color}18`, color: a.color }}>{a.status}</span>
                </div>
              ))
            )}
          </div>

          {/* CTA publish */}
          <div style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', borderRadius: 16, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 4 }}>Publique uma nova vaga</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Alcance centenas de candidatos qualificados no varejo.</div>
            </div>
            <button onClick={() => setActiveSection('publicar')} style={{ background: 'white', color: '#1e4a8a', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              + Publicar vaga
            </button>
          </div>
        </div>
      )

      case 'empresa': {
        const lbl = { fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }
        const inp = { width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', color: '#334' }
        const companySizes = [
          { label: 'Startup', value: 'STARTUP' },
          { label: 'Pequena', value: 'SMALL' },
          { label: 'Media', value: 'MEDIUM' },
          { label: 'Grande', value: 'LARGE' },
          { label: 'Enterprise', value: 'ENTERPRISE' },
        ]
        const legalNatures = [
          { label: 'Privada', value: 'PRIVATE' },
          { label: 'Publica', value: 'PUBLIC' },
          { label: 'ONG', value: 'NGO' },
          { label: 'Cooperativa', value: 'COOPERATIVE' },
          { label: 'Outra', value: 'OTHER' },
        ]
        const states = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

        return (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 8 }}>Minha Empresa</h2>
            <p style={{ fontSize: 13.5, color: '#778899', marginBottom: 24 }}>
              {myCompany ? 'Edite os dados da sua empresa.' : 'Cadastre sua empresa para publicar vagas.'}
            </p>

            {companyError && <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 10, padding: '10px 16px', color: '#c00', fontSize: 13, marginBottom: 16 }}>{companyError}</div>}
            {companySuccess && <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 10, padding: '10px 16px', color: '#22543d', fontSize: 13, marginBottom: 16 }}>{companySuccess}</div>}

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 20 }}>Dados Basicos</h3>

              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: 12, background: companyForm.logoUrl ? 'transparent' : '#e8f2fc', border: '2px dashed #c0d6ee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {companyForm.logoUrl
                    ? <img src={companyForm.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#778899', fontSize: 12 }}>Logo</span>
                  }
                </div>
                <div>
                  <label style={{ display: 'inline-block', background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>
                    {myCompany ? 'Alterar logo' : 'Enviar logo'}
                    <input type="file" accept="image/*" onChange={handleUploadLogo} style={{ display: 'none' }} disabled={!myCompany} />
                  </label>
                  {!myCompany && <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Salve a empresa primeiro</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Nome da empresa *</label>
                  <input style={inp} value={companyForm.name} onChange={e => setCompanyForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Easy4RH Ltda" />
                </div>
                <div>
                  <label style={lbl}>Razao Social</label>
                  <input style={inp} value={companyForm.razaoSocial} onChange={e => setCompanyForm(p => ({ ...p, razaoSocial: e.target.value }))} placeholder="Razao social" />
                </div>
                <div>
                  <label style={lbl}>CNPJ</label>
                  <input style={inp} value={companyForm.cnpj} onChange={e => setCompanyForm(p => ({ ...p, cnpj: e.target.value }))} placeholder="XX.XXX.XXX/XXXX-XX" />
                </div>
                <div>
                  <label style={lbl}>Setor / Industria</label>
                  <input style={inp} value={companyForm.industry} onChange={e => setCompanyForm(p => ({ ...p, industry: e.target.value }))} placeholder="Ex: Tecnologia, RH, Saude" />
                </div>
                <div>
                  <label style={lbl}>Porte</label>
                  <select style={inp} value={companyForm.size} onChange={e => setCompanyForm(p => ({ ...p, size: e.target.value }))}>
                    <option value="">Selecione</option>
                    {companySizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Natureza Juridica</label>
                  <select style={inp} value={companyForm.legalNature} onChange={e => setCompanyForm(p => ({ ...p, legalNature: e.target.value }))}>
                    <option value="">Selecione</option>
                    {legalNatures.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Website</label>
                  <input style={inp} value={companyForm.website} onChange={e => setCompanyForm(p => ({ ...p, website: e.target.value }))} placeholder="https://suaempresa.com.br" />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Descricao</label>
                <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={companyForm.description} onChange={e => setCompanyForm(p => ({ ...p, description: e.target.value }))} placeholder="Descreva a empresa, o que faz, qual o diferencial..." />
              </div>
            </div>

            {/* Endereco */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 20 }}>Endereco</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 120px 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Rua / Avenida</label>
                  <input style={inp} value={companyForm.address} onChange={e => setCompanyForm(p => ({ ...p, address: e.target.value }))} placeholder="Endereco" />
                </div>
                <div>
                  <label style={lbl}>Numero</label>
                  <input style={inp} value={companyForm.addressNumber} onChange={e => setCompanyForm(p => ({ ...p, addressNumber: e.target.value }))} placeholder="123" />
                </div>
                <div>
                  <label style={lbl}>Complemento</label>
                  <input style={inp} value={companyForm.addressComplement} onChange={e => setCompanyForm(p => ({ ...p, addressComplement: e.target.value }))} placeholder="Sala, andar..." />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 100px 160px', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Bairro</label>
                  <input style={inp} value={companyForm.neighborhood} onChange={e => setCompanyForm(p => ({ ...p, neighborhood: e.target.value }))} placeholder="Bairro" />
                </div>
                <div>
                  <label style={lbl}>Cidade</label>
                  <input style={inp} value={companyForm.city} onChange={e => setCompanyForm(p => ({ ...p, city: e.target.value }))} placeholder="Cidade" />
                </div>
                <div>
                  <label style={lbl}>UF</label>
                  <select style={inp} value={companyForm.state} onChange={e => setCompanyForm(p => ({ ...p, state: e.target.value }))}>
                    <option value="">UF</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>CEP</label>
                  <input style={inp} value={companyForm.zipCode} onChange={e => setCompanyForm(p => ({ ...p, zipCode: e.target.value }))} placeholder="XXXXX-XXX" />
                </div>
              </div>
            </div>

            {/* Missao, Valores */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 20 }}>Missao e Valores</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Missao</label>
                <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={companyForm.mission} onChange={e => setCompanyForm(p => ({ ...p, mission: e.target.value }))} placeholder="Qual a missao da empresa?" />
              </div>
              <div>
                <label style={lbl}>Valores</label>
                <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={companyForm.values} onChange={e => setCompanyForm(p => ({ ...p, values: e.target.value }))} placeholder="Quais os valores da empresa?" />
              </div>
            </div>

            {/* Redes Sociais */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 20 }}>Redes Sociais</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={lbl}>LinkedIn</label>
                  <input style={inp} value={companyForm.linkedinUrl} onChange={e => setCompanyForm(p => ({ ...p, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/company/..." />
                </div>
                <div>
                  <label style={lbl}>Instagram</label>
                  <input style={inp} value={companyForm.instagramUrl} onChange={e => setCompanyForm(p => ({ ...p, instagramUrl: e.target.value }))} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label style={lbl}>Glassdoor</label>
                  <input style={inp} value={companyForm.glassdoorUrl} onChange={e => setCompanyForm(p => ({ ...p, glassdoorUrl: e.target.value }))} placeholder="https://glassdoor.com.br/..." />
                </div>
              </div>
            </div>

            {/* Video institucional */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 20 }}>Video Institucional</h3>
              {companyForm.aboutVideoUrl && (
                <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                  <video src={companyForm.aboutVideoUrl} controls style={{ width: '100%', maxHeight: 320 }} />
                </div>
              )}
              <label style={{ display: 'inline-block', background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>
                {companyForm.aboutVideoUrl ? 'Trocar video' : 'Enviar video'}
                <input type="file" accept="video/*" onChange={handleUploadVideo} style={{ display: 'none' }} disabled={!myCompany} />
              </label>
              {!myCompany && <span style={{ fontSize: 11, color: '#999', marginLeft: 8 }}>Salve a empresa primeiro</span>}
            </div>

            {/* Save button */}
            <button onClick={handleSaveCompany} disabled={companySaving} style={{
              background: companySaving ? '#aaa' : 'linear-gradient(135deg, #1e4a8a, #4a9edd)',
              color: 'white', border: 'none', borderRadius: 24, padding: '14px 36px',
              cursor: companySaving ? 'default' : 'pointer', fontWeight: 700, fontSize: 14,
            }}>
              {companySaving ? 'Salvando...' : myCompany ? 'Salvar alteracoes' : 'Criar empresa'}
            </button>
          </div>
        )
      }

      case 'publicar': {
        const labelStyle = { fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }
        const inputBase = { width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }
        const selectBase = { ...inputBase, background: 'white' }
        const canAdvance = novaVaga.title && novaVaga.companyId && novaVaga.description && novaVaga.requirements

        return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 8 }}>Publicar Nova Vaga</h2>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
            {['Dados da vaga', 'Perguntas de triagem', 'Publicar'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <div style={{ width: 24, height: 2, background: pubStep > i ? '#1e4a8a' : '#d0dae4' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: pubStep > i + 1 ? '#22c55e' : pubStep === i + 1 ? '#1e4a8a' : '#d0dae4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {pubStep > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: pubStep === i + 1 ? 700 : 500, color: pubStep === i + 1 ? '#1e3a6e' : '#999' }}>{s}</span>
                </div>
              </div>
            ))}
          </div>

          {vagaPublicada ? (
            <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ color: '#22c55e', fontSize: 18, fontWeight: 800 }}>Vaga publicada com sucesso!</h3>
              <p style={{ color: '#778899', marginTop: 8 }}>Redirecionando para suas vagas...</p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
              {publishError && (
                <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '10px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>
                  {publishError}
                </div>
              )}

              {/* ── STEP 1: Dados da vaga ── */}
              {pubStep === 1 && (
                <>
                  {!myCompany && (
                    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <div>
                        <span style={{ fontSize: 13.5, color: '#9a3412', fontWeight: 600 }}>Empresa não cadastrada. </span>
                        <span style={{ fontSize: 13, color: '#9a3412' }}>Você precisa cadastrar sua empresa antes de publicar vagas. </span>
                        <span onClick={() => setActiveSection('empresa')} style={{ fontSize: 13, color: '#1e4a8a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Ir para Minha Empresa</span>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Título da vaga *</label>
                      <input value={novaVaga.title} onChange={e => setNovaVaga(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Gerente de Loja" style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Empresa *</label>
                      {myCompany ? (
                        <div style={{ ...inputBase, background: '#f8fafc', color: '#334', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {myCompany.logoUrl && <img src={myCompany.logoUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover' }} />}
                          <span style={{ fontWeight: 500 }}>{myCompany.name}</span>
                        </div>
                      ) : (
                        <div style={{ ...inputBase, background: '#f8fafc', color: '#999', fontSize: 13 }}>
                          Cadastre sua empresa primeiro (aba "Minha Empresa")
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Cidade</label>
                      <input value={novaVaga.city} onChange={e => setNovaVaga(prev => ({ ...prev, city: e.target.value }))} placeholder="São Paulo" style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Estado</label>
                      <input value={novaVaga.state} onChange={e => setNovaVaga(prev => ({ ...prev, state: e.target.value }))} placeholder="SP" maxLength={2} style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Modalidade</label>
                      <select value={novaVaga.locationType} onChange={e => setNovaVaga(prev => ({ ...prev, locationType: e.target.value }))} style={selectBase}>
                        <option value="">Selecione</option>
                        {jobTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Nível de experiência</label>
                      <select value={novaVaga.experienceLevel} onChange={e => setNovaVaga(prev => ({ ...prev, experienceLevel: e.target.value }))} style={selectBase}>
                        <option value="">Selecione</option>
                        {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Tipo de contrato</label>
                      <select value={novaVaga.contractType} onChange={e => setNovaVaga(prev => ({ ...prev, contractType: e.target.value }))} style={selectBase}>
                        <option value="">Selecione</option>
                        {contractTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Área</label>
                      <input value={novaVaga.area} onChange={e => setNovaVaga(prev => ({ ...prev, area: e.target.value }))} placeholder="Ex: Gestão, Vendas, RH" style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Salário mínimo (R$)</label>
                      <input type="number" value={novaVaga.salaryMin} onChange={e => setNovaVaga(prev => ({ ...prev, salaryMin: e.target.value }))} placeholder="3000" style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Salário máximo (R$)</label>
                      <input type="number" value={novaVaga.salaryMax} onChange={e => setNovaVaga(prev => ({ ...prev, salaryMax: e.target.value }))} placeholder="6000" style={inputBase} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={novaVaga.hideSalary} onChange={e => setNovaVaga(prev => ({ ...prev, hideSalary: e.target.checked }))} style={{ accentColor: '#1e4a8a' }} />
                      <label style={{ fontSize: 13, color: '#556677' }}>Ocultar salário na vaga</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={novaVaga.isConfidential} onChange={e => setNovaVaga(prev => ({ ...prev, isConfidential: e.target.checked }))} style={{ accentColor: '#1e4a8a' }} />
                      <label style={{ fontSize: 13, color: '#556677' }}>Vaga confidencial (empresa não divulgada)</label>
                    </div>
                    <div>
                      <label style={labelStyle}>Data de encerramento prevista</label>
                      <input type="date" value={novaVaga.expiresAt} onChange={e => setNovaVaga(prev => ({ ...prev, expiresAt: e.target.value }))} style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Motivo da abertura</label>
                      <select value={novaVaga.openingReason} onChange={e => setNovaVaga(prev => ({ ...prev, openingReason: e.target.value }))} style={inputBase}>
                        <option value=''>Selecione (opcional)</option>
                        {openingReasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Descrição da vaga *</label>
                    <textarea value={novaVaga.description} onChange={e => setNovaVaga(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva as responsabilidades e benefícios da vaga..." rows={4}
                      style={{ ...inputBase, resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Requisitos *</label>
                    <textarea value={novaVaga.requirements} onChange={e => setNovaVaga(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Liste os requisitos da vaga..." rows={4}
                      style={{ ...inputBase, resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Responsabilidades</label>
                    <textarea value={novaVaga.responsibilities} onChange={e => setNovaVaga(prev => ({ ...prev, responsibilities: e.target.value }))}
                      placeholder="Descreva as responsabilidades do cargo..." rows={3}
                      style={{ ...inputBase, resize: 'vertical' }} />
                  </div>
                  <button onClick={handleCreateDraft} disabled={!canAdvance || publishing}
                    style={{ background: canAdvance && !publishing ? 'linear-gradient(135deg, #1a4f8a, #2a7ec8)' : '#ccc', color: 'white', border: 'none', borderRadius: 24, padding: '13px 32px', cursor: canAdvance && !publishing ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 15 }}>
                    {publishing ? 'Salvando...' : 'Avançar para perguntas'}
                  </button>
                </>
              )}

              {/* ── STEP 2: Perguntas de triagem ── */}
              {pubStep === 2 && (
                <>
                  <p style={{ fontSize: 13.5, color: '#556677', marginTop: 0, marginBottom: 20 }}>
                    Adicione perguntas de triagem para filtrar candidatos. As respostas serão pontuadas automaticamente. Você pode pular esta etapa.
                  </p>

                  {questions.map((q, qIdx) => (
                    <div key={qIdx} style={{ background: '#f8fafc', border: '1px solid #e0eaf4', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a6e' }}>Pergunta {qIdx + 1}</span>
                        <button onClick={() => removeQuestion(qIdx)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remover</button>
                      </div>
                      <input value={q.question} onChange={e => updateQuestion(qIdx, 'question', e.target.value)} placeholder="Ex: Você tem experiência com atendimento ao cliente?"
                        style={{ ...inputBase, marginBottom: 12 }} />
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={labelStyle}>Tipo de resposta</label>
                          <select value={q.type} onChange={e => {
                            updateQuestion(qIdx, 'type', e.target.value)
                            if (e.target.value === 'YES_NO') updateQuestion(qIdx, 'options', [{ label: 'Sim', score: 1 }, { label: 'Não', score: 0 }])
                            if (e.target.value === 'TEXT') updateQuestion(qIdx, 'options', [])
                          }} style={selectBase}>
                            {questionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 18 }}>
                          <input type="checkbox" checked={q.required} onChange={e => updateQuestion(qIdx, 'required', e.target.checked)} style={{ accentColor: '#1e4a8a' }} />
                          <label style={{ fontSize: 13, color: '#556677' }}>Obrigatória</label>
                        </div>
                      </div>

                      {/* Options (not for TEXT) */}
                      {q.type !== 'TEXT' && (
                        <div>
                          <label style={{ ...labelStyle, marginBottom: 8 }}>Opções de resposta</label>
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                              <input value={opt.label} onChange={e => updateOption(qIdx, oIdx, 'label', e.target.value)}
                                placeholder={`Opção ${oIdx + 1}`} disabled={q.type === 'YES_NO'}
                                style={{ ...inputBase, flex: 1 }} />
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                                <label style={{ fontSize: 11, color: '#778899' }}>Pontos:</label>
                                <input type="number" value={opt.score} onChange={e => updateOption(qIdx, oIdx, 'score', e.target.value)}
                                  style={{ ...inputBase, width: 60, textAlign: 'center' }} min={0} />
                              </div>
                              {q.type !== 'YES_NO' && q.options.length > 2 && (
                                <button onClick={() => removeOption(qIdx, oIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16, padding: 4 }}>×</button>
                              )}
                            </div>
                          ))}
                          {q.type !== 'YES_NO' && (
                            <button onClick={() => addOption(qIdx)} style={{ background: 'none', border: '1px dashed #c0cee0', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: '#1e4a8a', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                              + Adicionar opção
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <button onClick={addQuestion} style={{ background: '#e8f2fc', color: '#1e4a8a', border: '1px dashed #b0c8e4', borderRadius: 12, padding: '14px', width: '100%', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginBottom: 24 }}>
                    + Adicionar pergunta de triagem
                  </button>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => { setPubStep(3); setPublishError('') }} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                      {questions.length === 0 ? 'Pular' : 'Voltar'}
                    </button>
                    {questions.length > 0 && (
                      <button onClick={handleSaveQuestions} disabled={publishing}
                        style={{ background: publishing ? '#ccc' : 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '13px 32px', cursor: publishing ? 'default' : 'pointer', fontWeight: 700, fontSize: 14 }}>
                        {publishing ? 'Salvando...' : 'Salvar perguntas e avançar'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* ── STEP 3: Revisão e publicação ── */}
              {pubStep === 3 && (
                <>
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px', marginBottom: 20, border: '1px solid #e0eaf4' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 12 }}>Resumo da vaga</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8 }}>
                      {[
                        { l: 'Título', v: novaVaga.title },
                        { l: 'Empresa', v: myCompany?.name || '—' },
                        { l: 'Local', v: [novaVaga.city, novaVaga.state].filter(Boolean).join(', ') || '—' },
                        { l: 'Modalidade', v: jobTypes.find(t => t.value === novaVaga.locationType)?.label || '—' },
                        { l: 'Nível', v: levels.find(l => l.value === novaVaga.experienceLevel)?.label || '—' },
                        { l: 'Contrato', v: contractTypes.find(t => t.value === novaVaga.contractType)?.label || '—' },
                        { l: 'Área', v: novaVaga.area || '—' },
                        { l: 'Salário', v: novaVaga.hideSalary ? 'Oculto' : novaVaga.salaryMin ? `R$ ${novaVaga.salaryMin}${novaVaga.salaryMax ? ` – R$ ${novaVaga.salaryMax}` : ''}` : 'A combinar' },
                        { l: 'Perguntas', v: `${questions.length} pergunta${questions.length !== 1 ? 's' : ''} de triagem` },
                      ].map(item => (
                        <div key={item.l} style={{ fontSize: 13 }}>
                          <span style={{ color: '#778899' }}>{item.l}: </span>
                          <span style={{ color: '#1e3a6e', fontWeight: 600 }}>{item.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => { setPubStep(2); setPublishError('') }} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                      Voltar
                    </button>
                    <button onClick={handlePublishJob} disabled={publishing}
                      style={{ background: publishing ? '#ccc' : 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '13px 32px', cursor: publishing ? 'default' : 'pointer', fontWeight: 700, fontSize: 15 }}>
                      {publishing ? 'Publicando...' : 'Publicar vaga'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      case 'vagas': return (
        <div>
          {jobActionError && (
            <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 10, padding: '10px 16px', color: '#c00', fontSize: 13, marginBottom: 16 }}>
              {jobActionError}
              <button onClick={() => setJobActionError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#c00' }}>×</button>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e' }}>Vagas Publicadas</h2>
            <button onClick={() => setActiveSection('publicar')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              + Nova vaga
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {myJobsLoading ? (
              <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando vagas...</div>
            ) : myJobs.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>
                Você ainda não publicou nenhuma vaga.
              </div>
            ) : (
              myJobs.map(v => {
                const statusColors = { Aberta: ['#dcfce7', '#16a34a'], Pausada: ['#fef9c3', '#ca8a04'], Encerrada: ['#f3f4f6', '#6b7280'], Rascunho: ['#eff6ff', '#3b82f6'], Preenchida: ['#f0fdf4', '#15803d'] }
                const [statusBg, statusColor] = statusColors[v.status] || ['#f3f4f6', '#6b7280']
                const timeSincePublished = v.publishedAt ? (() => {
                  const diff = Date.now() - new Date(v.publishedAt).getTime()
                  const days = Math.floor(diff / 86400000)
                  return days === 0 ? 'Hoje' : days === 1 ? 'Ontem' : `${days} dias`
                })() : null
                const slaText = v.publishedAt && v.expiresAt ? (() => {
                  const open = new Date(v.publishedAt).toLocaleDateString('pt-BR')
                  const close = new Date(v.expiresAt).toLocaleDateString('pt-BR')
                  return `${open} → ${close}`
                })() : null
                const openingReasonLabel = { REPLACEMENT: 'Substituição', TEAM_GROWTH: 'Aumento de equipe' }[v.openingReason] || null
                const experienceLevelLabel = { INTERN: 'Estágio', NO_EXPERIENCE: 'Sem exp.', UP_TO_1_YEAR: 'Até 1 ano', TWO_YEARS_PLUS: '2+ anos', JUNIOR: 'Júnior', MID: 'Pleno', SENIOR: 'Sênior', LEAD: 'Lead', MANAGER: 'Gerente' }[v.experienceLevel] || null
                const contractTypeLabel = { CLT: 'CLT', PJ: 'PJ', INTERNSHIP: 'Estágio', TEMPORARY: 'Temporário', FREELANCE: 'Freelance' }[v.contractType] || null
                return (
                  <div key={v.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e' }}>{v.title}</span>
                          {v.isConfidential && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#fef3c7', color: '#b45309' }}>CONFIDENCIAL</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: '#778899', marginBottom: 10 }}>
                          {[v.location, v.type, v.date && `Criada em ${v.date}`].filter(Boolean).join(' · ')}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: statusBg, color: statusColor }}>{v.status}</span>
                          <span style={{ fontSize: 12, color: '#778899' }}>📋 {v.aplicacoes} aplicação(ões)</span>
                          {experienceLevelLabel && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0f9ff', color: '#0369a1', fontWeight: 600 }}>{experienceLevelLabel}</span>}
                          {contractTypeLabel && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0fdf4', color: '#15803d', fontWeight: 600 }}>{contractTypeLabel}</span>}
                          {timeSincePublished && <span style={{ fontSize: 12, color: '#778899' }}>⏱ Publicada há {timeSincePublished}</span>}
                          {slaText && <span style={{ fontSize: 12, color: '#778899' }}>📅 SLA: {slaText}</span>}
                          {openingReasonLabel && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#eff6ff', color: '#3b82f6', fontWeight: 600 }}>{openingReasonLabel}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
                        <button onClick={() => setActiveSection('aplicacoes')} style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Candidatos</button>
                        <button onClick={() => setPosterJob(v)} style={{ background: '#f5f3ff', color: '#7c3aed', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>🖼 Poster</button>
                        {v.rawStatus === 'PUBLISHED' && (
                          <button onClick={() => handlePauseJob(v.id)} style={{ background: '#fef9c3', color: '#ca8a04', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Pausar</button>
                        )}
                        {(v.rawStatus === 'PUBLISHED' || v.rawStatus === 'PAUSED') && (
                          <button onClick={() => handleCloseJob(v.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Encerrar</button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )

      case 'aplicacoes': {
        // Kanban de seleção — filtra por vaga, agrupa por fase
        const [kanbanJobFilter, setKanbanJobFilter] = [
          // usar state local com um truque — guarda em objeto mutável para este case
          applicationsJobFilter,
          setApplicationsJobFilter,
        ]

        const visibleApps = kanbanJobFilter
          ? allApplications.filter(a => a.jobId === kanbanJobFilter)
          : allApplications

        const rejectedApps = visibleApps.filter(a => normalizeStage(a.stage) === 'REJECTED')

        return (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e' }}>Fases da Seleção</h2>
              <select
                value={kanbanJobFilter || ''}
                onChange={e => setKanbanJobFilter(e.target.value || null)}
                style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '8px 14px', fontSize: 13, outline: 'none', background: 'white', color: '#334', minWidth: 220 }}
              >
                <option value=''>Todas as vagas ({allApplications.length})</option>
                {myJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({allApplications.filter(a => a.jobId === j.id).length})
                  </option>
                ))}
              </select>
            </div>

            {applicationsLoading ? (
              <div style={{ background: 'white', borderRadius: 14, padding: '48px', textAlign: 'center', color: '#778899', fontSize: 13 }}>
                Carregando candidatos...
              </div>
            ) : (
              <>
                {/* Kanban */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${PIPELINE_STAGES.length}, 1fr)`, gap: 12, overflowX: 'auto' }}>
                  {PIPELINE_STAGES.map(stage => {
                    const stageApps = visibleApps.filter(a => normalizeStage(a.stage) === stage.key && normalizeStage(a.stage) !== 'REJECTED')
                    return (
                      <div key={stage.key} style={{ background: '#f8fafc', borderRadius: 14, padding: 12, minHeight: 120 }}>
                        {/* Column header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a6e' }}>{stage.label}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, background: stage.bg, color: stage.color, padding: '2px 8px', borderRadius: 20 }}>
                            {stageApps.length}
                          </span>
                        </div>

                        {/* Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {stageApps.length === 0 ? (
                            <div style={{ border: '2px dashed #e0eaf4', borderRadius: 10, padding: '20px 12px', textAlign: 'center', color: '#b0bec5', fontSize: 11 }}>
                              Nenhum candidato
                            </div>
                          ) : stageApps.map(a => (
                            <div key={a.id} style={{ background: 'white', borderRadius: 10, padding: '12px', boxShadow: '0 1px 4px rgba(30,74,138,0.07)', border: `1px solid ${stage.color}22` }}>
                              {/* Avatar + name */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${stage.bg}, ${stage.color}33)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: stage.color, fontSize: 13, flexShrink: 0 }}>
                                  {(a.name || 'C')[0].toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e3a6e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                                  <div style={{ fontSize: 11, color: '#778899', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.role}</div>
                                </div>
                              </div>

                              {/* Score + date */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 10.5, color: '#778899' }}>{a.date}</span>
                                {a.adherencePercent != null && (
                                  <span style={{ fontSize: 10.5, fontWeight: 700, color: a.adherencePercent >= 70 ? '#16a34a' : a.adherencePercent >= 40 ? '#ca8a04' : '#dc2626' }}>
                                    {a.adherencePercent}% fit
                                  </span>
                                )}
                              </div>

                              {/* Actions */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {a.resumeUrl && (
                                  <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 20, background: '#eff6ff', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
                                    CV
                                  </a>
                                )}
                                {/* Stage advance buttons */}
                                {PIPELINE_STAGES.filter(s => s.key !== stage.key).map(targetStage => (
                                  <button key={targetStage.key}
                                    onClick={() => handleUpdateApplicationStatus(a.id, targetStage.key)}
                                    title={`Mover para ${targetStage.label}`}
                                    style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 20, background: targetStage.bg, color: targetStage.color, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                    → {targetStage.label.split(' ')[0]}
                                  </button>
                                ))}
                                <button
                                  onClick={() => handleUpdateApplicationStatus(a.id, 'REJECTED')}
                                  style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 20, background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                  Reprovar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Reprovados colapsáveis */}
                {rejectedApps.length > 0 && (
                  <details style={{ marginTop: 20 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#ef4444', padding: '10px 0', userSelect: 'none' }}>
                      Reprovados ({rejectedApps.length})
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      {rejectedApps.map(a => (
                        <div key={a.id} style={{ background: 'white', borderRadius: 10, padding: '12px 16px', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a6e' }}>{a.name}</span>
                            <span style={{ fontSize: 12, color: '#778899', marginLeft: 8 }}>{a.role} · {a.date}</span>
                          </div>
                          <button onClick={() => handleUpdateApplicationStatus(a.id, 'APPLIED')}
                            style={{ fontSize: 11.5, padding: '4px 12px', borderRadius: 20, background: '#eff6ff', color: '#3b82f6', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            Reativar
                          </button>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        )
      }

      case 'documentos': {
        const docCategories = [
          { value: 'DRESS_CODE',        label: 'Código de Vestimenta' },
          { value: 'WORK_CONTRACT',     label: 'Contrato Individual de Trabalho' },
          { value: 'ADMISSION_DOCS',    label: 'Ficha de Documentos para Admissão' },
          { value: 'REGISTRATION_INFO', label: 'Ficha de Informação para Registro' },
          { value: 'OFFER_LETTER',      label: 'Carta Proposta' },
          { value: 'OTHER',             label: 'Outro' },
        ]
        const docStatusLabel = { PENDING: 'Pendente', VIEWED: 'Visualizado', SIGNED: 'Assinado', REJECTED: 'Recusado' }
        const docStatusColor = { PENDING: ['#fef9c3', '#ca8a04'], VIEWED: ['#eff6ff', '#3b82f6'], SIGNED: ['#dcfce7', '#16a34a'], REJECTED: ['#fee2e2', '#dc2626'] }
        const categoryLabel = Object.fromEntries(docCategories.map(c => [c.value, c.label]))

        return (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e' }}>Módulo de Documentos</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setDocView('library')} style={{ background: docView === 'library' ? '#1e4a8a' : '#e8f2fc', color: docView === 'library' ? 'white' : '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Biblioteca</button>
                <button onClick={() => { setDocView('sent'); fetchSentDocs() }} style={{ background: docView === 'sent' ? '#1e4a8a' : '#e8f2fc', color: docView === 'sent' ? 'white' : '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Enviados</button>
                {docView !== 'add' && (
                  <button onClick={() => setDocView('add')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>+ Adicionar</button>
                )}
              </div>
            </div>

            {docSuccess && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', color: '#15803d', fontSize: 13, marginBottom: 16 }}>{docSuccess}</div>
            )}
            {docError && (
              <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 10, padding: '10px 16px', color: '#c00', fontSize: 13, marginBottom: 16 }}>
                {docError}
                <button onClick={() => setDocError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#c00' }}>×</button>
              </div>
            )}

            {/* Add document form */}
            {docView === 'add' && (
              <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a6e', marginBottom: 20 }}>Adicionar documento à biblioteca</h3>
                <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Título *</label>
                    <input value={docForm.title} onChange={e => setDocForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Código de Vestimenta 2025" style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Categoria *</label>
                    <select value={docForm.category} onChange={e => setDocForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                      {docCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Descrição</label>
                    <textarea value={docForm.description} onChange={e => setDocForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Descrição opcional..." style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>URL do arquivo * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(Cloudinary, Google Drive, etc.)</span></label>
                    <input value={docForm.fileUrl} onChange={e => setDocForm(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://..." style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Nome do arquivo *</label>
                    <input value={docForm.fileName} onChange={e => setDocForm(p => ({ ...p, fileName: e.target.value }))} placeholder="Ex: codigo-vestimenta.pdf" style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={docSaving} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: docSaving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13 }}>
                      {docSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button type="button" onClick={() => { setDocView('library'); setDocForm({ title: '', description: '', category: 'OTHER', fileUrl: '', fileName: '' }); setDocError('') }} style={{ background: '#f3f4f6', color: '#556677', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {/* Library view */}
            {docView === 'library' && (
              docLibraryLoading ? (
                <div style={{ background: 'white', borderRadius: 14, padding: 48, textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando biblioteca...</div>
              ) : docLibrary.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 14, padding: 48, textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                  <p style={{ color: '#778899', fontSize: 13 }}>Sua biblioteca está vazia. Adicione documentos para enviar aos candidatos.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {docLibrary.map(doc => (
                    <div key={doc.id} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 20 }}>📄</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{doc.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#778899' }}>
                          {categoryLabel[doc.category] || doc.category} · {doc.fileName} · {doc._count?.sentDocuments ?? 0} envio(s)
                        </div>
                        {doc.description && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{doc.description}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>Abrir</a>
                        <button onClick={() => { setSendDocModal({ doc, search: '' }); setSendDocCandidateId(''); setSendDocMessage('') }} style={{ background: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Enviar</button>
                        <button onClick={() => handleDeleteDocument(doc.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Remover</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Sent documents view */}
            {docView === 'sent' && (
              sentDocsLoading ? (
                <div style={{ background: 'white', borderRadius: 14, padding: 48, textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando envios...</div>
              ) : sentDocs.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 14, padding: 48, textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
                  <p style={{ color: '#778899', fontSize: 13 }}>Nenhum documento enviado ainda.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sentDocs.map(sd => {
                    const [sBg, sColor] = docStatusColor[sd.status] || ['#f3f4f6', '#6b7280']
                    return (
                      <div key={sd.id} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e', marginBottom: 2 }}>{sd.companyDocument?.title}</div>
                          <div style={{ fontSize: 12, color: '#778899' }}>
                            Para: {sd.candidate?.candidateProfile?.fullName || sd.candidate?.email} · {new Date(sd.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          {sd.message && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>"{sd.message}"</div>}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: sBg, color: sColor, flexShrink: 0 }}>
                          {docStatusLabel[sd.status] || sd.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            )}

            {/* Send document modal */}
            {sendDocModal && (() => {
              // Deduplicate candidates by candidateId — same person may have applied to multiple jobs
              const candidateMap = new Map()
              allApplications.forEach(a => {
                if (a.candidateId && !candidateMap.has(a.candidateId)) {
                  candidateMap.set(a.candidateId, { id: a.candidateId, name: a.name, role: a.role })
                }
              })
              const candidateOptions = Array.from(candidateMap.values()).sort((a, b) => a.name.localeCompare(b.name))
              const [search, setSearch] = [sendDocModal.search || '', (v) => setSendDocModal(prev => ({ ...prev, search: v }))]
              const filtered = search
                ? candidateOptions.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))
                : candidateOptions

              return (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) { setSendDocModal(null); setSendDocCandidateId(''); setSendDocError('') } }}>
                  <div style={{ background: 'white', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e3a6e', marginBottom: 4 }}>Enviar documento</h3>
                    <p style={{ fontSize: 13, color: '#778899', marginBottom: 20 }}>{sendDocModal.doc.title}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {/* Candidate picker */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Candidato *</label>
                        {candidateOptions.length === 0 ? (
                          <div style={{ background: '#fef9c3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#92400e' }}>
                            Nenhum candidato encontrado. As aplicações precisam ser carregadas primeiro.
                          </div>
                        ) : (
                          <>
                            <input
                              value={search}
                              onChange={e => setSearch(e.target.value)}
                              placeholder="Buscar por nome ou vaga..."
                              style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '9px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 6 }}
                            />
                            <div style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, maxHeight: 180, overflowY: 'auto' }}>
                              {filtered.length === 0 ? (
                                <div style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>Nenhum resultado</div>
                              ) : filtered.map(c => (
                                <button
                                  key={c.id}
                                  onClick={() => setSendDocCandidateId(c.id)}
                                  style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 14px', border: 'none', borderBottom: '1px solid #f0f4f8',
                                    background: sendDocCandidateId === c.id ? '#eff6ff' : 'white',
                                    cursor: 'pointer', textAlign: 'left',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e3a6e' }}>{c.name}</div>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{c.role}</div>
                                  </div>
                                  {sendDocCandidateId === c.id && (
                                    <span style={{ fontSize: 16, color: '#3b82f6', flexShrink: 0 }}>✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }}>Mensagem (opcional)</label>
                        <textarea value={sendDocMessage} onChange={e => setSendDocMessage(e.target.value)} rows={3} placeholder="Ex: Por favor, assine antes do primeiro dia." style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>

                      {sendDocError && (
                        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
                          {sendDocError}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={handleSendDocument} disabled={sendDocSaving || !sendDocCandidateId} style={{ flex: 1, background: sendDocCandidateId ? 'linear-gradient(135deg, #1a4f8a, #2a7ec8)' : '#e0eaf4', color: sendDocCandidateId ? 'white' : '#9ca3af', border: 'none', borderRadius: 10, padding: '10px', cursor: sendDocSaving || !sendDocCandidateId ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13 }}>
                          {sendDocSaving ? 'Enviando...' : 'Enviar'}
                        </button>
                        <button onClick={() => { setSendDocModal(null); setSendDocCandidateId(''); setSendDocError('') }} style={{ background: '#f3f4f6', color: '#556677', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )
      }

      case 'talentos': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Banco de Talentos</h2>
          <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
            <h3 style={{ color: '#1e3a6e', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Em breve</h3>
            <p style={{ color: '#778899', fontSize: 13 }}>O banco de talentos estará disponível em breve.</p>
          </div>
        </div>
      )

      case 'cursos': {
        const labelStyle = { fontSize: 12, fontWeight: 700, color: '#556677', display: 'block', marginBottom: 6 }
        const inputBase = { width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }
        const selectBase = { ...inputBase, background: 'white' }
        const statusColors = { DRAFT: { bg: '#f3f4f6', color: '#6b7280', label: 'Rascunho' }, PUBLISHED: { bg: '#dcfce7', color: '#16a34a', label: 'Publicado' }, ARCHIVED: { bg: '#fef3c7', color: '#d97706', label: 'Arquivado' } }

        if (courseView === 'stats') {
          const selectedCourse = myCourses.find(c => c.id === editingCourseId)
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button onClick={() => setCourseView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#1e4a8a' }}>←</button>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>{selectedCourse?.title || 'Curso'}</h2>
              </div>

              {courseStatsLoading ? (
                <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando dados...</div>
              ) : (
                <>
                  {/* Stats cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                      { label: 'Alunos matriculados', value: courseStats?.totalStudents ?? courseStudents.length, icon: '👥', color: '#1e4a8a' },
                      { label: 'Taxa de conclusão', value: courseStats?.completionRate != null ? `${Math.round(courseStats.completionRate)}%` : '—', icon: '📊', color: '#22c55e' },
                      { label: 'Progresso médio', value: courseStats?.averageProgress != null ? `${Math.round(courseStats.averageProgress)}%` : '—', icon: '📈', color: '#f0a500' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)', borderTop: `3px solid ${s.color}` }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#778899', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Students list */}
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 16 }}>Alunos</h3>
                  {courseStudents.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Nenhum aluno matriculado neste curso.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {courseStudents.map((stu, idx) => {
                        const stuUser = stu.user || stu.student || {}
                        const stuName = stuUser.fullName || stuUser.name || stuUser.email || 'Aluno'
                        const stuProgress = stu.progress || 0
                        return (
                          <div key={stu.id || idx} style={{ background: 'white', borderRadius: 12, padding: '14px 20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f2fc, #c8daf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1e4a8a', fontSize: 14 }}>
                                {(stuName || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e3a6e' }}>{stuName}</div>
                                <div style={{ fontSize: 11.5, color: '#778899' }}>
                                  {stu.enrolledAt ? `Matriculado em ${new Date(stu.enrolledAt).toLocaleDateString('pt-BR')}` : ''}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 80, height: 6, background: '#e8edf4', borderRadius: 3 }}>
                                <div style={{ height: '100%', background: stuProgress >= 100 ? '#22c55e' : '#1e4a8a', borderRadius: 3, width: `${stuProgress}%` }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: stuProgress >= 100 ? '#22c55e' : '#1e4a8a', minWidth: 35 }}>{stuProgress}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        }

        if (courseView === 'create') return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => { setCourseView('list'); setCourseError(''); setCourseSuccess('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#1e4a8a' }}>←</button>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>Criar Novo Curso</h2>
            </div>

            {courseSuccess ? (
              <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: '#22c55e', fontSize: 18, fontWeight: 800 }}>{courseSuccess}</h3>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                {courseError && (
                  <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '10px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>{courseError}</div>
                )}

                {/* Course basic info */}
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 16 }}>Informações do curso</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div style={{ gridColumn: isMobile ? undefined : 'span 2' }}>
                    <label style={labelStyle}>Título do curso *</label>
                    <input value={novoCurso.title} onChange={e => setNovoCurso(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Liderança no Varejo" style={inputBase} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nível</label>
                    <select value={novoCurso.level} onChange={e => setNovoCurso(prev => ({ ...prev, level: e.target.value }))} style={selectBase}>
                      {courseLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Categoria</label>
                    <input value={novoCurso.category} onChange={e => setNovoCurso(prev => ({ ...prev, category: e.target.value }))} placeholder="Ex: Gestão, Vendas, RH" style={inputBase} />
                  </div>
                  <div>
                    <label style={labelStyle}>URL da thumbnail</label>
                    <input value={novoCurso.thumbnailUrl} onChange={e => setNovoCurso(prev => ({ ...prev, thumbnailUrl: e.target.value }))} placeholder="https://..." style={inputBase} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Descrição *</label>
                  <textarea value={novoCurso.description} onChange={e => setNovoCurso(prev => ({ ...prev, description: e.target.value }))} placeholder="Descreva o que o aluno vai aprender neste curso..." rows={4} style={{ ...inputBase, resize: 'vertical' }} />
                </div>

                {/* Sections & Lessons */}
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 16 }}>Conteúdo do curso</h3>
                <p style={{ fontSize: 13, color: '#778899', marginTop: 0, marginBottom: 16 }}>Organize o curso em seções e adicione aulas a cada seção. Você pode adicionar vídeos via URL ou upload.</p>

                {courseSections.map((sec, si) => (
                  <div key={si} style={{ background: '#f8fafc', border: '1px solid #e0eaf4', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a6e' }}>Seção {si + 1}</span>
                      <button onClick={() => removeSection(si)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remover seção</button>
                    </div>
                    <input value={sec.title} onChange={e => updateSectionTitle(si, e.target.value)} placeholder="Título da seção" style={{ ...inputBase, marginBottom: 16 }} />

                    {/* Lessons in this section */}
                    {(sec.lessons || []).map((les, li) => (
                      <div key={li} style={{ background: 'white', border: '1px solid #e8edf2', borderRadius: 10, padding: '16px', marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#556677' }}>Aula {li + 1}</span>
                          <button onClick={() => removeLesson(si, li)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 14 }}>×</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div>
                            <label style={{ ...labelStyle, fontSize: 11 }}>Título da aula *</label>
                            <input value={les.title} onChange={e => updateLesson(si, li, 'title', e.target.value)} placeholder="Ex: Introdução à liderança" style={inputBase} />
                          </div>
                          <div>
                            <label style={{ ...labelStyle, fontSize: 11 }}>Duração (segundos)</label>
                            <input type="number" value={les.duration} onChange={e => updateLesson(si, li, 'duration', e.target.value)} placeholder="600" style={inputBase} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <label style={{ ...labelStyle, fontSize: 11 }}>Descrição</label>
                          <input value={les.description} onChange={e => updateLesson(si, li, 'description', e.target.value)} placeholder="Breve descrição da aula" style={inputBase} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 10, alignItems: 'end' }}>
                          <div>
                            <label style={{ ...labelStyle, fontSize: 11 }}>URL do vídeo (ou use upload abaixo)</label>
                            <input value={les.videoUrl} onChange={e => updateLesson(si, li, 'videoUrl', e.target.value)} placeholder="https://..." style={inputBase} />
                          </div>
                          <div>
                            <label style={{ ...labelStyle, fontSize: 11 }}>Upload de vídeo</label>
                            <input type="file" accept="video/*" onChange={e => {
                              const f = e.target.files[0]
                              if (f && f.size > 500 * 1024 * 1024) { setCourseError('O video deve ter no maximo 500 MB.'); e.target.value = ''; return }
                              updateLesson(si, li, 'videoFile', f || null)
                            }} style={{ fontSize: 12 }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                          <input type="checkbox" checked={les.isFree} onChange={e => updateLesson(si, li, 'isFree', e.target.checked)} style={{ accentColor: '#1e4a8a' }} />
                          <label style={{ fontSize: 12, color: '#556677' }}>Aula gratuita (amostra)</label>
                        </div>
                      </div>
                    ))}

                    <button onClick={() => addLesson(si)} style={{ background: 'none', border: '1px dashed #c0cee0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#1e4a8a', fontSize: 12, fontWeight: 600, width: '100%' }}>
                      + Adicionar aula
                    </button>
                  </div>
                ))}

                <button onClick={addSection} style={{ background: '#e8f2fc', color: '#1e4a8a', border: '1px dashed #b0c8e4', borderRadius: 12, padding: '14px', width: '100%', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginBottom: 24 }}>
                  + Adicionar seção
                </button>

                {/* Create button */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setCourseView('list')} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    Cancelar
                  </button>
                  <button onClick={handleCreateCourse} disabled={coursePublishing || !novoCurso.title || !novoCurso.description}
                    style={{ background: coursePublishing || !novoCurso.title || !novoCurso.description ? '#ccc' : 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '13px 32px', cursor: coursePublishing ? 'default' : 'pointer', fontWeight: 700, fontSize: 15 }}>
                    {coursePublishing ? 'Criando curso...' : 'Criar curso (rascunho)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )

        // Course list view
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>Meus Cursos</h2>
              <button onClick={() => { setCourseView('create'); setNovoCurso({ ...emptyCurso }); setCourseSections([]); setCourseError(''); setCourseSuccess('') }}
                style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                + Novo curso
              </button>
            </div>

            {myCoursesLoading ? (
              <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando cursos...</div>
            ) : myCourses.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
                <h3 style={{ color: '#1e3a6e', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nenhum curso criado</h3>
                <p style={{ color: '#778899', fontSize: 13 }}>Crie seu primeiro curso para compartilhar conhecimento.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {myCourses.map(course => {
                  const st = statusColors[course.status] || statusColors.DRAFT
                  return (
                    <div key={course.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{course.title}</div>
                          <div style={{ fontSize: 13, color: '#778899', marginBottom: 8 }}>
                            {[course.category, courseLevels.find(l => l.value === course.level)?.label].filter(Boolean).join(' · ')}
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: st.bg, color: st.color }}>{st.label}</span>
                            {course._count?.enrollments > 0 && (
                              <span style={{ fontSize: 12, color: '#778899' }}>👥 {course._count.enrollments} alunos</span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button onClick={() => handleViewCourseStats(course)} style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Ver alunos</button>
                          {course.status === 'DRAFT' && (
                            <button onClick={() => handlePublishCourse(course.id)} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Publicar</button>
                          )}
                          {course.status === 'PUBLISHED' && (
                            <button onClick={() => handleArchiveCourse(course.id)} style={{ background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Arquivar</button>
                          )}
                          {course.status === 'DRAFT' && (
                            <button onClick={() => handleDeleteCourse(course.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Excluir</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      }

      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f4f7fb' }}>

      {/* Sidebar */}
      <div style={{ width: 240, background: 'white', borderRight: '1px solid #e8edf2', display: isMobile ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 800, marginBottom: 10 }}>
            {user?.name?.[0]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: '#778899', marginTop: 2 }}>{isInstructor ? 'Instrutor' : 'Recrutador'}</div>
        </div>

        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? '#e8f2fc' : 'transparent', color: activeSection === item.id ? '#1e4a8a' : '#556677', marginBottom: 2, transition: 'all 0.15s', textAlign: 'left' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid #f0f4f8' }}>
          <button onClick={() => navigate('home')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, background: 'transparent', color: '#556677', marginBottom: 2 }}>
            <span>🌐</span> Ver site
          </button>
          <button onClick={() => { logout(); navigate('home') }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, background: 'transparent', color: '#ef4444' }}>
            <span>🚪</span> Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: isMobile ? '24px 16px' : '36px 40px', overflowY: 'auto' }}>
        {isMobile && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            {menuItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? '#1e4a8a' : 'white', color: activeSection === item.id ? 'white' : '#556677' }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
        {renderSection()}
      </div>

      {/* Job Poster Modal */}
      {posterJob && (
        <JobPosterModal
          job={posterJob}
          company={myCompany}
          onClose={() => setPosterJob(null)}
        />
      )}
    </div>
  )
}
