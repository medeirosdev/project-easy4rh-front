import { useState, useEffect } from 'react'
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
  const [markingComplete, setMarkingComplete] = useState(false)
  const [progressError, setProgressError] = useState('')

  useEffect(() => {
    if (!courseId) return
    const load = async () => {
      setLoading(true)
      try {
        const requests = [coursesApi.get(courseId), coursesApi.sections(courseId)]
        if (user) requests.push(coursesApi.myEnrollments())

        const [courseData, sectionsData, enrollmentsData] = await Promise.all(requests)
        setCourse(courseData)
        const secList = Array.isArray(sectionsData) ? sectionsData : (sectionsData.data || sectionsData.sections || [])
        setSections(secList)
        if (secList.length > 0) setOpenSections({ [secList[0].id]: true })

        if (enrollmentsData) {
          const enrList = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData.data || [])
          const enr = enrList.find(e => (e.courseId || e.course?.id) === courseId)
          setEnrollment(enr || null)
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user?.id])

  const handleLessonClick = async (lesson) => {
    if (!enrollment) return
    setActiveLesson(lesson)
    setLessonLoading(true)
    try {
      const data = await lessonsApi.get(lesson.id)
      setLessonData(data)
    } catch (err) {
      console.error('Erro ao carregar aula:', err)
    } finally {
      setLessonLoading(false)
    }
  }

  const handleProgress = async (completed) => {
    if (!activeLesson || markingComplete) return
    setMarkingComplete(true)
    setProgressError('')
    try {
      await lessonsApi.updateProgress(activeLesson.id, { completed, watchedSeconds: 0 })
      if (completed) {
        setCompletedLessons(prev => new Set([...prev, activeLesson.id]))
      }
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err)
      setProgressError('Não foi possível salvar o progresso. Tente novamente.')
    } finally {
      setMarkingComplete(false)
    }
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

  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)

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

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a6e, #2a5298)', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 16 }}>
        <button onClick={() => navigate('plataforma')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 22, padding: 0 }}>
          ←
        </button>
        <span style={{ color: 'white', fontSize: 15, fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {course.title}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          {totalLessons} aulas
        </span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: 24 }}>

        {/* Main — Video Player or Course Info */}
        <div>
          {activeLesson && enrollment ? (
            /* Video Player */
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,74,138,0.08)' }}>
              <div style={{ background: '#0d1a2e', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {lessonLoading ? (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Carregando aula...</span>
                ) : lessonData?.videoUrl ? (
                  <video
                    src={lessonData.videoUrl}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onEnded={() => handleProgress(true)}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
                    <p style={{ fontSize: 14 }}>Vídeo não disponível ainda</p>
                  </div>
                )}
              </div>
              <div style={{ padding: '20px 24px' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e3a6e', marginBottom: 8 }}>{activeLesson.title}</h2>
                {lessonData?.description && (
                  <p style={{ fontSize: 14, color: '#556', lineHeight: 1.7 }}>{lessonData.description}</p>
                )}
                {completedLessons.has(activeLesson.id) ? (
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#2a7a4e', fontWeight: 700, fontSize: 13 }}>
                    <span style={{ fontSize: 18 }}>✓</span> Aula concluida!
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleProgress(true)}
                      disabled={markingComplete}
                      style={{ marginTop: 16, background: markingComplete ? '#aaa' : '#2a7a4e', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: markingComplete ? 'default' : 'pointer', fontWeight: 700, fontSize: 13 }}
                    >
                      {markingComplete ? 'Salvando...' : '✓ Marcar como concluida'}
                    </button>
                    {progressError && (
                      <p style={{ marginTop: 8, fontSize: 12.5, color: '#dc2626' }}>{progressError}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Course Info */
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
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
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
                <div style={{ background: '#f0fff4', borderRadius: 12, padding: '16px 20px', border: '1px solid #b2e4c8', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>✅</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#2a7a4e', margin: 0 }}>Você está matriculado!</p>
                    <p style={{ fontSize: 13, color: '#557', margin: 0, marginTop: 2 }}>Clique em uma aula ao lado para começar.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — Sections & Lessons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a6e', margin: '0 0 8px' }}>Conteúdo do curso</h3>
          {sections.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: '24px', textAlign: 'center', color: '#778' }}>
              <p>Nenhuma aula disponível ainda.</p>
            </div>
          ) : sections.map((section, si) => (
            <div key={section.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(30,74,138,0.06)' }}>
              {/* Section header */}
              <div
                onClick={() => toggleSection(section.id)}
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: openSections[section.id] ? '#f4f8ff' : 'white' }}
              >
                <div>
                  <span style={{ fontSize: 11, color: '#4a9edd', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                    Seção {si + 1}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1e3a6e' }}>{section.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#778' }}>{section.lessons?.length || 0} aulas</span>
                  <span style={{ fontSize: 12, color: '#4a9edd', transform: openSections[section.id] ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                </div>
              </div>

              {/* Lessons */}
              {openSections[section.id] && (section.lessons || []).map((lesson, li) => {
                const isActive = activeLesson?.id === lesson.id
                const isLocked = !enrollment
                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isLocked && handleLessonClick(lesson)}
                    style={{
                      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                      borderTop: '1px solid #f0f4f8',
                      background: isActive ? '#e8f0ff' : 'white',
                      cursor: isLocked ? 'default' : 'pointer',
                      opacity: isLocked ? 0.6 : 1,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isLocked && !isActive) e.currentTarget.style.background = '#f4f8ff' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white' }}
                  >
                    {(() => {
                      const isDone = completedLessons.has(lesson.id)
                      return (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDone ? '#2a7a4e' : isActive ? '#1e4a8a' : '#e8edf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: (isDone || isActive) ? 'white' : '#778' }}>
                          {isLocked ? '🔒' : isDone ? '✓' : isActive ? '▶' : li + 1}
                        </div>
                      )
                    })()}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#1e4a8a' : '#334', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
          ))}
        </div>
      </div>
    </div>
  )
}
