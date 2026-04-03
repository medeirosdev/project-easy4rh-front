import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { coursesApi, lessonsApi } from '../services/api'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function CursoDetailPage({ navigate, courseId }) {
  const { user } = useAuth()
  const { isMobile } = useBreakpoint()
  const [course, setCourse] = useState(null)
  const [sections, setSections] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [lessonData, setLessonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [openSections, setOpenSections] = useState({})
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [showCertificate, setShowCertificate] = useState(false)
  const [markingDone, setMarkingDone] = useState(false)

  useEffect(() => {
    if (!courseId) return
    const load = async () => {
      setLoading(true)
      try {
        const [courseData, sectionsData, enrollmentsData] = await Promise.all([
          coursesApi.get(courseId),
          coursesApi.sections(courseId),
          coursesApi.myEnrollments(),
        ])
        setCourse(courseData)
        const secList = Array.isArray(sectionsData) ? sectionsData : (sectionsData.data || sectionsData.sections || [])
        setSections(secList)
        if (secList.length > 0) setOpenSections({ [secList[0].id]: true })

        const enrList = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData.data || [])
        const enr = enrList.find(e => (e.courseId || e.course?.id) === courseId)
        setEnrollment(enr || null)

        // Inicializa aulas concluídas a partir do enrollment
        if (enr?.completedLessons) {
          setCompletedLessons(new Set(enr.completedLessons))
        } else if (enr) {
          const lessonProgress = enr.lessonProgress || enr.lessons || []
          const done = lessonProgress.filter(l => l.completed).map(l => l.lessonId || l.id)
          setCompletedLessons(new Set(done))
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId])

  // Lista plana de todas as aulas
  const allLessons = sections.flatMap(s => s.lessons || [])
  const totalLessons = allLessons.length

  // Progresso calculado localmente
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessons.size / totalLessons) * 100)
    : (enrollment?.progress || 0)

  const isCourseComplete = totalLessons > 0 && completedLessons.size >= totalLessons

  // Proxima aula
  const getNextLesson = useCallback(() => {
    if (!activeLesson) return allLessons[0] || null
    const idx = allLessons.findIndex(l => l.id === activeLesson.id)
    return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null
  }, [activeLesson, allLessons])

  const handleLessonClick = async (lesson) => {
    if (!enrollment) return
    setActiveLesson(lesson)
    setLessonLoading(true)
    const parentSection = sections.find(s => s.lessons?.some(l => l.id === lesson.id))
    if (parentSection) setOpenSections(prev => ({ ...prev, [parentSection.id]: true }))
    try {
      const data = await lessonsApi.get(lesson.id)
      setLessonData(data)
    } catch (err) {
      console.error('Erro ao carregar aula:', err)
    } finally {
      setLessonLoading(false)
    }
  }

  const handleMarkDone = async () => {
    if (!activeLesson || markingDone) return
    setMarkingDone(true)
    try {
      await lessonsApi.updateProgress(activeLesson.id, { completed: true, watchedSeconds: 0 })
      const newCompleted = new Set(completedLessons)
      newCompleted.add(activeLesson.id)
      setCompletedLessons(newCompleted)
      if (newCompleted.size >= totalLessons && totalLessons > 0) {
        setTimeout(() => setShowCertificate(true), 600)
      }
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err)
    } finally {
      setMarkingDone(false)
    }
  }

  const handleNextLesson = () => {
    const next = getNextLesson()
    if (next) handleLessonClick(next)
  }

  const handleEnroll = async () => {
    if (!user) { navigate('login'); return }
    setEnrolling(true)
    try {
      const enr = await coursesApi.enroll(courseId)
      setEnrollment(enr)
    } catch (err) {
      console.error('Erro ao matricular:', err)
      alert(err.message || 'Erro ao matricular')
    } finally {
      setEnrolling(false)
    }
  }

  const toggleSection = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))

  const nextLesson = getNextLesson()
  const isActiveLessonDone = activeLesson ? completedLessons.has(activeLesson.id) : false

  // Loading
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{ textAlign: 'center', color: '#778' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
        <p>Carregando curso...</p>
      </div>
    </div>
  )

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#778' }}>Curso não encontrado.</p>
        <button onClick={() => navigate('plataforma')} style={{ background: '#1e4a8a', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', marginTop: 12 }}>
          Voltar
        </button>
      </div>
    </div>
  )

  // Modal Certificado
  if (showCertificate) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2650 0%, #1e4a8a 50%, #2a7fc8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: isMobile ? '36px 24px' : '56px 64px', maxWidth: 620, width: '100%', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #f0a500, #ffd060)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 44, boxShadow: '0 8px 24px rgba(240,165,0,0.35)' }}>
          🏆
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#4a9edd', textTransform: 'uppercase', marginBottom: 12 }}>
          Certificado de Conclusão
        </div>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', marginBottom: 8 }}>
          Parabéns, {user?.name || 'aluno'}!
        </h1>
        <p style={{ fontSize: 15, color: '#556', marginBottom: 8 }}>Você concluiu com sucesso o curso</p>
        <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: '#1e3a6e', marginBottom: 8 }}>{course.title}</p>
        <p style={{ fontSize: 13, color: '#778', marginBottom: 32 }}>
          {totalLessons} aulas concluídas · {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <div style={{ background: '#e8f5ee', borderRadius: 8, height: 10, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #2a7a4e, #4aaa6e)', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} style={{ background: 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 12, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            🖨️ Imprimir certificado
          </button>
          <button onClick={() => { setShowCertificate(false); setActiveLesson(null) }} style={{ background: '#f0f4f8', color: '#556', border: 'none', borderRadius: 12, padding: '13px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Voltar ao curso
          </button>
          <button onClick={() => navigate('plataforma')} style={{ background: '#f0f4f8', color: '#556', border: 'none', borderRadius: 12, padding: '13px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Ver outros cursos
          </button>
        </div>
      </div>
    </div>
  )

  // Página principal
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>

      {/* Header com barra de progresso */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a6e, #2a5298)', padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: enrollment ? 6 : 0 }}>
          <button onClick={() => navigate('plataforma')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 22, padding: 0, flexShrink: 0 }}>
            ←
          </button>
          <span style={{ color: 'white', fontSize: 15, fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {course.title}
          </span>
          {enrollment ? (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, flexShrink: 0, fontWeight: 600 }}>
              {progressPercent}% concluído
            </span>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{totalLessons} aulas</span>
          )}
        </div>
        {enrollment && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ marginLeft: 38, flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: progressPercent >= 100 ? '#4aaa6e' : 'rgba(255,255,255,0.85)', borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, flexShrink: 0 }}>
              {completedLessons.size}/{totalLessons}
            </span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: 24 }}>

        {/* Coluna principal */}
        <div>
          {activeLesson && enrollment ? (
            /* Player */
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,74,138,0.08)' }}>
              <div style={{ background: '#0d1a2e', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {lessonLoading ? (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Carregando aula...</span>
                ) : lessonData?.videoUrl ? (
                  <video
                    key={lessonData.videoUrl}
                    src={lessonData.videoUrl}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onEnded={handleMarkDone}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
                    <p style={{ fontSize: 14 }}>Vídeo não disponível ainda</p>
                  </div>
                )}
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e3a6e', margin: 0, flex: 1 }}>
                    {activeLesson.title}
                  </h2>
                  {isActiveLessonDone && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2a7a4e', background: '#e8f5ee', borderRadius: 20, padding: '4px 12px', flexShrink: 0 }}>
                      ✓ Concluída
                    </span>
                  )}
                </div>

                {lessonData?.description && (
                  <p style={{ fontSize: 14, color: '#556', lineHeight: 1.7, marginBottom: 20 }}>{lessonData.description}</p>
                )}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  {!isActiveLessonDone ? (
                    <button
                      onClick={handleMarkDone}
                      disabled={markingDone}
                      style={{ background: markingDone ? '#aaa' : 'linear-gradient(135deg, #2a7a4e, #38a169)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 22px', cursor: markingDone ? 'default' : 'pointer', fontWeight: 700, fontSize: 14 }}
                    >
                      {markingDone ? 'Salvando...' : '✓ Marcar como concluída'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#e8f5ee', borderRadius: 10, padding: '11px 18px' }}>
                      <span style={{ fontSize: 16 }}>✅</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#2a7a4e' }}>Aula concluída!</span>
                    </div>
                  )}

                  {nextLesson && (
                    <button
                      onClick={handleNextLesson}
                      style={{ background: 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 22px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                    >
                      Próxima aula →
                    </button>
                  )}

                  {isCourseComplete && (
                    <button
                      onClick={() => setShowCertificate(true)}
                      style={{ background: 'linear-gradient(135deg, #b8860b, #f0a500)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 22px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                    >
                      🏆 Ver certificado
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Capa do curso */
            <div style={{ background: 'white', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(30,74,138,0.08)' }}>
              {course.thumbnailUrl && (
                <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', borderRadius: 12, marginBottom: 24, maxHeight: 300, objectFit: 'cover' }} />
              )}
              <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', marginBottom: 12 }}>{course.title}</h1>
              <p style={{ fontSize: 15, color: '#556', lineHeight: 1.8, marginBottom: 24 }}>{course.description}</p>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
                {[
                  { icon: '📚', label: `${totalLessons} aulas` },
                  { icon: '🎯', label: course.level ? { BEGINNER: 'Iniciante', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' }[course.level] : 'Todos os níveis' },
                  { icon: '👤', label: course.instructor?.name || 'Instrutor' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#556' }}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
              </div>

              {!enrollment ? (
                <div style={{ background: '#f0f6ff', borderRadius: 12, padding: '20px', border: '1px solid #d0e4f8' }}>
                  <p style={{ fontSize: 14, color: '#334', marginBottom: 16 }}>
                    Você ainda não está matriculado neste curso. Inscreva-se para assistir todas as aulas.
                  </p>
                  <button onClick={handleEnroll} disabled={enrolling} style={{ background: enrolling ? '#aaa' : 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 10, padding: '13px 28px', cursor: enrolling ? 'default' : 'pointer', fontWeight: 700, fontSize: 15 }}>
                    {enrolling ? 'Matriculando...' : 'Matricular-se gratuitamente'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {totalLessons > 0 && (
                    <div style={{ background: '#f0f6ff', borderRadius: 12, padding: '16px 20px', border: '1px solid #d0e4f8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#556', marginBottom: 8, fontWeight: 600 }}>
                        <span>Seu progresso</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div style={{ height: 8, background: '#dce8f8', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #1e4a8a, #4a9edd)', borderRadius: 4, transition: 'width 0.4s' }} />
                      </div>
                      <p style={{ fontSize: 12, color: '#778', marginTop: 8, marginBottom: 0 }}>
                        {completedLessons.size} de {totalLessons} aulas concluídas
                      </p>
                    </div>
                  )}

                  <div style={{ background: '#f0fff4', borderRadius: 12, padding: '16px 20px', border: '1px solid #b2e4c8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{isCourseComplete ? '🏆' : '✅'}</span>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#2a7a4e', margin: 0 }}>
                          {isCourseComplete ? 'Curso concluído!' : 'Você está matriculado!'}
                        </p>
                        <p style={{ fontSize: 13, color: '#557', margin: 0, marginTop: 2 }}>
                          {isCourseComplete ? 'Parabéns! Clique para ver seu certificado.' : 'Clique em uma aula ao lado para começar.'}
                        </p>
                      </div>
                    </div>
                    {isCourseComplete && (
                      <button onClick={() => setShowCertificate(true)} style={{ background: 'linear-gradient(135deg, #b8860b, #f0a500)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        🏆 Ver certificado
                      </button>
                    )}
                    {!isCourseComplete && allLessons.length > 0 && (
                      <button
                        onClick={() => {
                          const nextUnfinished = allLessons.find(l => !completedLessons.has(l.id))
                          if (nextUnfinished) handleLessonClick(nextUnfinished)
                        }}
                        style={{ background: 'linear-gradient(135deg, #2a7a4e, #38a169)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, flexShrink: 0 }}
                      >
                        {completedLessons.size > 0 ? '▶ Continuar' : '▶ Começar'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a6e', margin: 0 }}>Conteúdo do curso</h3>
            {enrollment && totalLessons > 0 && (
              <span style={{ fontSize: 12, color: '#778', fontWeight: 600 }}>{completedLessons.size}/{totalLessons}</span>
            )}
          </div>

          {sections.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: '24px', textAlign: 'center', color: '#778' }}>
              <p>Nenhuma aula disponível ainda.</p>
            </div>
          ) : sections.map((section, si) => {
            const sectionDone = (section.lessons || []).filter(l => completedLessons.has(l.id)).length
            const sectionTotal = section.lessons?.length || 0
            const allSectionDone = sectionTotal > 0 && sectionDone === sectionTotal

            return (
              <div key={section.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(30,74,138,0.06)' }}>
                <div onClick={() => toggleSection(section.id)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: openSections[section.id] ? '#f4f8ff' : 'white' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 11, color: '#4a9edd', fontWeight: 700, display: 'block', marginBottom: 2 }}>Seção {si + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: allSectionDone ? '#2a7a4e' : '#1e3a6e' }}>
                      {allSectionDone ? '✓ ' : ''}{section.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {enrollment && sectionTotal > 0 ? (
                      <span style={{ fontSize: 11, color: allSectionDone ? '#2a7a4e' : '#778', fontWeight: allSectionDone ? 700 : 400 }}>
                        {sectionDone}/{sectionTotal}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#778' }}>{sectionTotal} aulas</span>
                    )}
                    <span style={{ fontSize: 12, color: '#4a9edd', transform: openSections[section.id] ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                  </div>
                </div>

                {openSections[section.id] && (section.lessons || []).map((lesson, li) => {
                  const isActive = activeLesson?.id === lesson.id
                  const isLocked = !enrollment
                  const isDone = completedLessons.has(lesson.id)

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => !isLocked && handleLessonClick(lesson)}
                      style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #f0f4f8', background: isActive ? '#e8f0ff' : 'white', cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.6 : 1, transition: 'background 0.15s' }}
                      onMouseEnter={e => { if (!isLocked && !isActive) e.currentTarget.style.background = '#f4f8ff' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white' }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: isActive ? '#1e4a8a' : isDone ? '#e8f5ee' : '#e8edf4', color: isActive ? 'white' : isDone ? '#2a7a4e' : '#778', border: isDone && !isActive ? '1.5px solid #b2e4c8' : 'none', fontWeight: 700 }}>
                        {isLocked ? '🔒' : isActive ? '▶' : isDone ? '✓' : li + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#1e4a8a' : isDone ? '#2a7a4e' : '#334', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lesson.title}
                        </p>
                        {lesson.duration > 0 && (
                          <p style={{ fontSize: 11, color: '#889', margin: 0, marginTop: 2 }}>
                            {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')} min
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Botão certificado no rodapé */}
          {isCourseComplete && enrollment && (
            <button
              onClick={() => setShowCertificate(true)}
              style={{ background: 'linear-gradient(135deg, #b8860b, #f0a500)', color: 'white', border: 'none', borderRadius: 12, padding: '14px', cursor: 'pointer', fontWeight: 700, fontSize: 14, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(240,165,0,0.3)' }}
            >
              🏆 Ver meu certificado
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
