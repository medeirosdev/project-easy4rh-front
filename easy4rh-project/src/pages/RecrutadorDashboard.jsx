import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { jobsApi, companiesApi, applicationsApi, jobQuestionsApi, coursesApi, sectionsApi, lessonsApi } from '../services/api'
import { locationTypeMap } from '../context/JobsContext'
import { getStageLabel, getStageColor } from '../utils/applicationStages'

const recruiterMenuItems = [
  { id: 'resumo',      icon: '🏠', label: 'Resumo' },
  { id: 'empresa',     icon: '🏢', label: 'Minha Empresa' },
  { id: 'publicar',    icon: '➕', label: 'Publicar Vaga' },
  { id: 'vagas',       icon: '📢', label: 'Vagas Publicadas' },
  { id: 'aplicacoes',  icon: '📋', label: 'Aplicações' },
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
  { label: 'Júnior', value: 'JUNIOR' },
  { label: 'Pleno', value: 'MID' },
  { label: 'Sênior', value: 'SENIOR' },
  { label: 'Gerente', value: 'MANAGER' },
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
const emptyVaga = { title: '', companyId: '', city: '', state: '', locationType: '', experienceLevel: '', contractType: '', description: '', requirements: '', responsibilities: '', area: '', salaryMin: '', salaryMax: '', hideSalary: false, expiresAt: '' }
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
  const menuItems = isInstructor ? instructorMenuItems : recruiterMenuItems
  const [activeSection, setActiveSection] = useState(isInstructor ? 'cursos' : 'resumo')
  const [novaVaga, setNovaVaga] = useState({ ...emptyVaga })
  const [vagaPublicada, setVagaPublicada] = useState(false)
  const [companies, setCompanies] = useState([])
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

  // Company management
  const [myCompany, setMyCompany] = useState(null)
  const [companyLoading, setCompanyLoading] = useState(false)
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

  useEffect(() => {
    companiesApi.list().then(data => {
      const list = Array.isArray(data) ? data : (data.data || [])
      setCompanies(list)
      // Try to find the recruiter's company:
      // 1. By user.companyId if backend returns it
      // 2. By localStorage saved company id
      // 3. First company in list as fallback for single-company recruiters
      const savedCompanyId = localStorage.getItem('my_company_id')
      const mine = (user?.companyId && list.find(c => c.id === user.companyId))
        || (savedCompanyId && list.find(c => c.id === savedCompanyId))
        || null
      if (mine) populateCompanyForm(mine)
    }).catch(() => {})
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
        status: job.status === 'PUBLISHED' ? 'Ativa' : job.status === 'CLOSED' ? 'Encerrada' : (job.status || 'Rascunho'),
        rawStatus: job.status,
        date: job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : '',
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
            return list.map(app => ({
              id: app.id,
              name: app.candidate?.fullName || app.candidate?.email || app.user?.email || 'Candidato',
              role: job.title,
              jobId: job.id,
              date: app.createdAt ? new Date(app.createdAt).toLocaleDateString('pt-BR') : '',
              stage: app.stage || 'APPLIED',
              status: getStageLabel(app.stage || 'APPLIED'),
              color: getStageColor(app.stage || 'APPLIED'),
              resumeUrl: app.candidate?.resumeUrl || null,
            }))
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

  const handleCloseJob = async (jobId) => {
    try {
      await jobsApi.close(jobId)
      setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Encerrada', rawStatus: 'CLOSED' } : j))
    } catch (err) {
      console.error('Erro ao encerrar vaga:', err)
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
    // BUG-10: se rascunho já foi criado, apenas avança para o passo 2
    if (createdJobId) { setPubStep(2); return; }
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
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (!q.question.trim()) continue
        const dto = {
          question: q.question,
          type: q.type,
          required: q.required,
          order: i,
          options: q.type === 'TEXT' ? [] : q.type === 'YES_NO'
            ? [{ label: 'Sim', score: q.options[0]?.score || 1, order: 0 }, { label: 'Não', score: q.options[1]?.score || 0, order: 1 }]
            : q.options.filter(o => o.label.trim()).map((o, idx) => ({ label: o.label, score: Number(o.score) || 0, order: idx })),
        }
        await jobQuestionsApi.create(createdJobId, dto)
      }
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
      setTimeout(() => {
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
      setTimeout(() => {
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
    try {
      await coursesApi.publish(courseId)
      setMyCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'PUBLISHED' } : c))
    } catch (err) {
      console.error('Erro ao publicar curso:', err)
    }
  }

  const handleArchiveCourse = async (courseId) => {
    try {
      await coursesApi.archive(courseId)
      setMyCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'ARCHIVED' } : c))
    } catch (err) {
      console.error('Erro ao arquivar curso:', err)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    try {
      await coursesApi.delete(courseId)
      setMyCourses(prev => prev.filter(c => c.id !== courseId))
    } catch (err) {
      console.error('Erro ao deletar curso:', err)
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

  const handleEditCourse = async (course) => {
    setEditingCourseId(course.id)
    setNovoCurso({ title: course.title, description: course.description, thumbnailUrl: course.thumbnailUrl || '', level: course.level || 'BEGINNER', category: course.category || '' })
    setCourseError('')
    setCourseSuccess('')
    setCoursePublishing(false)
    setCourseView('edit')
    try {
      const sectionsData = await sectionsApi.list(course.id)
      const secList = Array.isArray(sectionsData) ? sectionsData : (sectionsData.data || sectionsData.sections || [])
      setCourseSections(secList.map(sec => ({
        id: sec.id,
        title: sec.title,
        lessons: (sec.lessons || []).map(l => ({
          id: l.id,
          title: l.title,
          description: l.description || '',
          videoUrl: l.videoUrl || '',
          duration: l.duration || '',
          isFree: l.isFree || false,
          videoFile: null,
        }))
      })))
    } catch (err) {
      console.error('Erro ao carregar seções:', err)
      setCourseSections([])
    }
  }

  const handleSaveEditCourse = async () => {
    if (!novoCurso.title || !novoCurso.description) return
    setCoursePublishing(true)
    setCourseError('')
    try {
      await coursesApi.update(editingCourseId, {
        title: novoCurso.title,
        description: novoCurso.description,
        thumbnailUrl: novoCurso.thumbnailUrl || undefined,
        level: novoCurso.level || 'BEGINNER',
        category: novoCurso.category || 'Geral',
      })

      for (let si = 0; si < courseSections.length; si++) {
        const sec = courseSections[si]
        if (!sec.title.trim()) continue
        let sectionId = sec.id
        if (sectionId) {
          await sectionsApi.update(sectionId, { title: sec.title, order: si })
        } else {
          const created = await sectionsApi.create(editingCourseId, { title: sec.title, order: si })
          sectionId = created.id
        }
        for (let li = 0; li < (sec.lessons || []).length; li++) {
          const les = sec.lessons[li]
          if (!les.title.trim()) continue
          if (les.id) {
            await lessonsApi.update(les.id, {
              title: les.title,
              description: les.description || undefined,
              videoUrl: les.videoUrl || undefined,
              duration: les.duration ? Number(les.duration) : undefined,
              isFree: les.isFree || false,
              order: li,
            })
          } else {
            const createdLesson = await lessonsApi.create(sectionId, {
              title: les.title,
              description: les.description || undefined,
              videoUrl: les.videoUrl || undefined,
              duration: les.duration ? Number(les.duration) : undefined,
              isFree: les.isFree || false,
              order: li,
            })
            if (les.videoFile) {
              try { await lessonsApi.uploadVideo(createdLesson.id, les.videoFile) } catch {}
            }
          }
        }
      }

      setCourseSuccess('Curso atualizado com sucesso!')
      fetchMyCourses()
      setTimeout(() => {
        setCourseSuccess('')
        setCourseView('list')
        setEditingCourseId(null)
        setCourseSections([])
      }, 2000)
    } catch (err) {
      setCourseError(err.message || 'Erro ao salvar curso')
    } finally {
      setCoursePublishing(false)
    }
  }

  // Company management functions
  const handleSaveCompany = async () => {
    if (!companyForm.name.trim()) { setCompanyError('Nome da empresa é obrigatório.'); return }
    setCompanySaving(true)
    setCompanyError('')
    setCompanySuccess('')
    try {
      const payload = { ...companyForm }
      delete payload.logoUrl
      delete payload.aboutVideoUrl
      Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k] })
      if (myCompany) {
        const updated = await companiesApi.update(myCompany.id, payload)
        populateCompanyForm(updated)
        localStorage.setItem('my_company_id', updated.id)
        setCompanySuccess('Empresa atualizada com sucesso!')
      } else {
        const created = await companiesApi.create(payload)
        populateCompanyForm(created)
        setCompanies(prev => [...prev, created])
        localStorage.setItem('my_company_id', created.id)
        setCompanySuccess('Empresa criada! Agora você pode enviar o logo e o vídeo institucional abaixo.')
      }
      setTimeout(() => setCompanySuccess(''), 6000)
    } catch (err) {
      const msg = err.message || 'Erro ao salvar empresa.'
      setCompanyError(`Erro: ${msg} — verifique os dados e tente novamente.`)
    } finally {
      setCompanySaving(false)
    }
  }

  const handleUploadLogo = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !myCompany) return
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
        setTimeout(() => setCompanySuccess(''), 4000)
      }
    } catch (err) {
      setCompanyError(err.message || 'Erro ao enviar logo.')
    }
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !myCompany) return
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
        setTimeout(() => setCompanySuccess(''), 4000)
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

            {/* Botão salvar — sempre visível */}
            <button onClick={handleSaveCompany} disabled={companySaving || !companyForm.name.trim()} style={{
              background: companySaving || !companyForm.name.trim() ? '#aaa' : 'linear-gradient(135deg, #1e4a8a, #4a9edd)',
              color: 'white', border: 'none', borderRadius: 24, padding: '14px 36px',
              cursor: companySaving || !companyForm.name.trim() ? 'default' : 'pointer', fontWeight: 700, fontSize: 14,
            }}>
              {companySaving ? 'Salvando...' : myCompany ? 'Salvar alterações' : 'Criar empresa'}
            </button>
            {!companyForm.name.trim() && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>⚠️ Preencha o nome da empresa para continuar.</p>
            )}

            {/* Logo e Vídeo — só aparecem após empresa criada */}
            {myCompany && (
              <>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginTop: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 16 }}>Logo da Empresa</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, background: companyForm.logoUrl ? 'transparent' : '#e8f2fc', border: '2px dashed #c0d6ee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {companyForm.logoUrl
                        ? <img src={companyForm.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ color: '#778899', fontSize: 12 }}>Logo</span>
                      }
                    </div>
                    <div>
                      <label style={{ display: 'inline-block', background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>
                        {companyForm.logoUrl ? 'Alterar logo' : 'Enviar logo'}
                        <input type="file" accept="image/*" onChange={handleUploadLogo} style={{ display: 'none' }} />
                      </label>
                      <p style={{ fontSize: 11, color: '#778', marginTop: 4 }}>PNG ou JPG, recomendado 200x200px</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf2', padding: isMobile ? 20 : 28, marginTop: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 16 }}>Vídeo Institucional</h3>
                  {companyForm.aboutVideoUrl && (
                    <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                      <video src={companyForm.aboutVideoUrl} controls style={{ width: '100%', maxHeight: 320 }} />
                    </div>
                  )}
                  <label style={{ display: 'inline-block', background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>
                    {companyForm.aboutVideoUrl ? 'Trocar vídeo' : 'Enviar vídeo'}
                    <input type="file" accept="video/*" onChange={handleUploadVideo} style={{ display: 'none' }} />
                  </label>
                  <p style={{ fontSize: 11, color: '#778', marginTop: 8 }}>MP4 recomendado · máx. depende do servidor</p>
                </div>
              </>
            )}
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
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Título da vaga *</label>
                      <input value={novaVaga.title} onChange={e => setNovaVaga(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Gerente de Loja" style={inputBase} />
                    </div>
                    <div>
                      <label style={labelStyle}>Empresa *</label>
                      <select value={novaVaga.companyId} onChange={e => setNovaVaga(prev => ({ ...prev, companyId: e.target.value }))} style={selectBase}>
                        <option value="">Selecione a empresa</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
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
                    <div>
                      <label style={labelStyle}>Data de expiração</label>
                      <input type="date" value={novaVaga.expiresAt} onChange={e => setNovaVaga(prev => ({ ...prev, expiresAt: e.target.value }))} style={inputBase} />
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
                        { l: 'Empresa', v: companies.find(c => c.id === novaVaga.companyId)?.name || '—' },
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
              myJobs.map(v => (
                <div key={v.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>{v.title}</div>
                      <div style={{ fontSize: 13, color: '#778899' }}>{[v.location, v.type, v.date && `Publicada em ${v.date}`].filter(Boolean).join(' · ')}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: v.status === 'Ativa' ? '#dcfce7' : '#f3f4f6', color: v.status === 'Ativa' ? '#16a34a' : '#6b7280' }}>{v.status}</span>
                        <span style={{ fontSize: 12, color: '#778899' }}>📋 {v.aplicacoes} aplicações</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setActiveSection('aplicacoes')} style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Ver candidatos</button>
                      {v.rawStatus === 'PUBLISHED' && (
                        <button onClick={() => handleCloseJob(v.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Encerrar</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )

      case 'aplicacoes': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 24 }}>Aplicações Recebidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {applicationsLoading ? (
              <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>Carregando aplicações...</div>
            ) : allApplications.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#778899', fontSize: 13 }}>
                Nenhuma aplicação recebida ainda.
              </div>
            ) : (
              allApplications.map(a => (
                <div key={a.id} style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(30,74,138,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f2fc, #c8daf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1e4a8a', fontSize: 16, flexShrink: 0 }}>
                      {(a.name || 'C')[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: '#778899' }}>{a.role} · {a.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: `${a.color}18`, color: a.color }}>{a.status}</span>
                    {a.resumeUrl && (
                      <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#e8f2fc', color: '#1e4a8a', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>Ver CV</a>
                    )}
                    {a.stage !== 'HIRED' && a.stage !== 'REJECTED' && (
                      <>
                        <button onClick={() => handleUpdateApplicationStatus(a.id, 'HIRED')} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Aprovar</button>
                        <button onClick={() => handleUpdateApplicationStatus(a.id, 'REJECTED')} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Reprovar</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )

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

        if (courseView === 'edit') return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => { setCourseView('list'); setCourseError(''); setCourseSuccess(''); setCourseSections([]) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#1e4a8a' }}>←</button>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>Editar Curso</h2>
            </div>

            {courseSuccess ? (
              <div style={{ background: 'white', borderRadius: 16, padding: '48px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: '#22c55e', fontSize: 18, fontWeight: 800 }}>{courseSuccess}</h3>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.07)' }}>
                {courseError && (
                  <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '10px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>{courseError}</div>
                )}

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
                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>Descrição *</label>
                  <textarea value={novoCurso.description} onChange={e => setNovoCurso(prev => ({ ...prev, description: e.target.value }))} placeholder="Descreva o que o aluno vai aprender..." rows={4} style={{ ...inputBase, resize: 'vertical' }} />
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginBottom: 8 }}>Conteúdo do curso</h3>
                <p style={{ fontSize: 13, color: '#778899', marginTop: 0, marginBottom: 16 }}>Edite seções e aulas existentes ou adicione novas.</p>

                {courseSections.map((sec, si) => (
                  <div key={sec.id || si} style={{ background: '#f8fafc', border: '1px solid #e0eaf4', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a6e' }}>Seção {si + 1}{sec.id ? '' : ' (nova)'}</span>
                      <button onClick={() => removeSection(si)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remover</button>
                    </div>
                    <input value={sec.title} onChange={e => updateSectionTitle(si, e.target.value)} placeholder="Título da seção" style={{ ...inputBase, marginBottom: 16 }} />

                    {(sec.lessons || []).map((les, li) => (
                      <div key={les.id || li} style={{ background: 'white', border: '1px solid #e8edf2', borderRadius: 10, padding: '16px', marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#556677' }}>Aula {li + 1}{les.id ? '' : ' (nova)'}</span>
                          <button onClick={() => removeLesson(si, li)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16 }}>×</button>
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
                            <label style={{ ...labelStyle, fontSize: 11 }}>URL do vídeo</label>
                            <input value={les.videoUrl} onChange={e => updateLesson(si, li, 'videoUrl', e.target.value)} placeholder="https://..." style={inputBase} />
                          </div>
                          {!les.id && (
                            <div>
                              <label style={{ ...labelStyle, fontSize: 11 }}>Upload de vídeo</label>
                              <input type="file" accept="video/*" onChange={e => updateLesson(si, li, 'videoFile', e.target.files[0] || null)} style={{ fontSize: 12 }} />
                            </div>
                          )}
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
                  + Adicionar nova seção
                </button>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { setCourseView('list'); setCourseSections([]) }} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEditCourse}
                    disabled={coursePublishing || !novoCurso.title || !novoCurso.description}
                    style={{ background: coursePublishing || !novoCurso.title || !novoCurso.description ? '#ccc' : 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 24, padding: '13px 32px', cursor: coursePublishing ? 'default' : 'pointer', fontWeight: 700, fontSize: 15 }}
                  >
                    {coursePublishing ? 'Salvando...' : '💾 Salvar alterações'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )

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
                            <input type="file" accept="video/*" onChange={e => updateLesson(si, li, 'videoFile', e.target.files[0] || null)} style={{ fontSize: 12 }} />
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
                          <button onClick={() => handleEditCourse(course)} style={{ background: '#f0f4f8', color: '#334455', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>✏️ Editar</button>
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
    </div>
  )
}
