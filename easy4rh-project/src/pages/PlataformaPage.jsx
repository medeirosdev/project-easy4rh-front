import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { coursesApi } from '../services/api'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function PlataformaPage({ navigate }) {
  const { user, logout } = useAuth()
  const { isMobile } = useBreakpoint()
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('todos') // 'todos' | 'meus'
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          coursesApi.list(),
          coursesApi.myEnrollments(),
        ])
        const list = Array.isArray(coursesData) ? coursesData : (coursesData.data || coursesData.courses || [])
        const enrList = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData.data || enrollmentsData.enrollments || [])
        setCourses(list)
        setEnrollments(enrList)
      } catch (err) {
        console.error('Erro ao carregar cursos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const enrolledCourseIds = enrollments.map(e => e.courseId || e.course?.id)

  const categories = useMemo(() => [...new Set(courses.map(c => c.category).filter(Boolean))], [courses])
  const levels = useMemo(() => [...new Set(courses.map(c => c.level).filter(Boolean))], [courses])

  const displayCourses = useMemo(() => {
    let list = tab === 'meus' ? courses.filter(c => enrolledCourseIds.includes(c.id)) : courses
    if (search) list = list.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()))
    if (filterCategory) list = list.filter(c => c.category === filterCategory)
    if (filterLevel) list = list.filter(c => c.level === filterLevel)
    return list
  }, [courses, enrollments, tab, search, filterCategory, filterLevel])

  const hasFilters = search || filterCategory || filterLevel

  const getProgress = (courseId) => {
    const enr = enrollments.find(e => (e.courseId || e.course?.id) === courseId)
    return enr?.progress || 0
  }

  const levelLabel = { BEGINNER: 'Iniciante', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' }
  const levelColor = { BEGINNER: '#2a7a4e', INTERMEDIATE: '#1e4a8a', ADVANCED: '#7a3a9e' }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a6e, #2a5298)', padding: isMobile ? '16px 20px' : '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? 'auto' : 64, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>Easy4RH</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Plataforma de Cursos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            {user?.name || user?.email?.split('@')[0]}
          </span>
          <button onClick={() => navigate('home')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 14px', color: 'white', fontSize: 13, cursor: 'pointer' }}>
            Ver site
          </button>
          <button onClick={() => { logout(); navigate('home') }} style={{ background: 'rgba(255,0,0,0.2)', border: 'none', borderRadius: 8, padding: '6px 14px', color: '#ffaaaa', fontSize: 13, cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a6e 0%, #2a5298 60%, #4a9edd 100%)', padding: isMobile ? '32px 20px' : '48px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Bem-vindo à plataforma</p>
          <h1 style={{ color: 'white', fontSize: isMobile ? 26 : 36, fontWeight: 800, marginBottom: 8 }}>
            Desenvolva seu potencial de liderança
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
            Acesse cursos exclusivos para líderes do varejo
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 40px', width: '100%', boxSizing: 'border-box' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid #dde4ee' }}>
          {[
            { key: 'todos', label: 'Todos os cursos' },
            { key: 'meus', label: `Meus cursos (${enrollments.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 20px', fontSize: 14, fontWeight: 600,
              color: tab === t.key ? '#1e4a8a' : '#778',
              borderBottom: tab === t.key ? '2px solid #1e4a8a' : '2px solid transparent',
              marginBottom: -2, transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Busca e filtros */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#aaa' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 12px 10px 36px', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', background: 'white' }}
            />
          </div>
          {categories.length > 0 && (
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white', cursor: 'pointer', minWidth: 160 }}>
              <option value="">Todas as categorias</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          {levels.length > 0 && (
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ border: '1.5px solid #e0eaf4', borderRadius: 10, padding: '10px 14px', fontSize: 13.5, outline: 'none', background: 'white', cursor: 'pointer', minWidth: 150 }}>
              <option value="">Todos os níveis</option>
              {levels.map(l => <option key={l} value={l}>{{ BEGINNER: 'Iniciante', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' }[l] || l}</option>)}
            </select>
          )}
          {hasFilters && (
            <button onClick={() => { setSearch(''); setFilterCategory(''); setFilterLevel('') }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
              ✕ Limpar
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        {!loading && hasFilters && (
          <p style={{ fontSize: 13, color: '#778', marginBottom: 16, marginTop: -8 }}>
            {displayCourses.length} resultado{displayCourses.length !== 1 ? 's' : ''} encontrado{displayCourses.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#778' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
            <p>Carregando cursos...</p>
          </div>
        ) : displayCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#778' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{hasFilters ? '🔍' : '🎓'}</div>
            <h3 style={{ color: '#334', marginBottom: 8 }}>
              {hasFilters ? 'Nenhum curso encontrado' : tab === 'meus' ? 'Você ainda não está matriculado em nenhum curso' : 'Nenhum curso disponível no momento'}
            </h3>
            {hasFilters && (
              <button onClick={() => { setSearch(''); setFilterCategory(''); setFilterLevel('') }} style={{ background: '#1e4a8a', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700, marginTop: 8, fontSize: 13 }}>
                Limpar filtros
              </button>
            )}
            {!hasFilters && tab === 'meus' && (
              <button onClick={() => setTab('todos')} style={{ background: '#1e4a8a', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700, marginTop: 8 }}>
                Explorar cursos
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {displayCourses.map(course => {
              const isEnrolled = enrolledCourseIds.includes(course.id)
              const progress = getProgress(course.id)
              return (
                <div key={course.id}
                  onClick={() => navigate(`curso-${course.id}`)}
                  style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,74,138,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,74,138,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(30,74,138,0.08)' }}
                >
                  {/* Thumbnail */}
                  <div style={{ height: 160, background: 'linear-gradient(135deg, #1e3a6e, #4a9edd)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {course.thumbnailUrl
                      ? <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 48 }}>🎓</span>
                    }
                    {isEnrolled && (
                      <div style={{ position: 'absolute', top: 12, right: 12, background: '#2a7a4e', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        Matriculado
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                      {course.level && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: levelColor[course.level] || '#1e4a8a', background: `${levelColor[course.level] || '#1e4a8a'}15`, padding: '3px 10px', borderRadius: 20 }}>
                          {levelLabel[course.level] || course.level}
                        </span>
                      )}
                      {course.category && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#778', background: '#f0f4f8', padding: '3px 10px', borderRadius: 20 }}>
                          {course.category}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a6e', marginBottom: 8, lineHeight: 1.3 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#667', lineHeight: 1.6, marginBottom: 16 }}>
                      {course.description?.slice(0, 100)}{course.description?.length > 100 ? '...' : ''}
                    </p>

                    {/* Progress bar if enrolled */}
                    {isEnrolled && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#778', marginBottom: 6 }}>
                          <span>Progresso</span>
                          <span>{progress}%</span>
                        </div>
                        <div style={{ height: 6, background: '#e8edf4', borderRadius: 3 }}>
                          <div style={{ height: '100%', background: 'linear-gradient(90deg, #2a7a4e, #4aaa6e)', borderRadius: 3, width: `${progress}%`, transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 13, color: '#556' }}>
                        {course.lessonsCount || course._count?.lessons || 0} aulas
                        {course.duration ? ` · ${Math.round(course.duration / 60)}h` : ''}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`curso-${course.id}`) }}
                        style={{ background: isEnrolled ? '#1e4a8a' : 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                      >
                        {isEnrolled ? 'Continuar' : 'Ver curso'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
