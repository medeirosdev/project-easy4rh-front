import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { JobsProvider, normalizeJob } from './context/JobsContext'
import { jobsApi } from './services/api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import VagasPage from './pages/VagasPage'
import JobDetailPage from './pages/JobDetailPage'
import TreinamentosPage from './pages/TreinamentosPage'
import SobreNosPage from './pages/SobreNosPage'
import FAQPage from './pages/FAQPage'
import CandidatoDashboard from './pages/CandidatoDashboard'
import RecrutadorDashboard from './pages/RecrutadorDashboard'
import ConsultoriaLoginPage from './pages/ConsultoriaLoginPage'
import EmConstrucaoPage from './pages/EmConstrucaoPage'
import PlataformaPage from './pages/PlataformaPage'
import CursoDetailPage from './pages/CursoDetailPage'
import AdminAuditPage from './pages/AdminAuditPage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 60, textAlign: 'center', fontFamily: 'inherit' }}>
          <h2 style={{ color: '#c00', marginBottom: 12 }}>Algo deu errado</h2>
          <p style={{ color: '#556677', marginBottom: 24 }}>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ background: '#1e3a6e', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Componente interno que acessa AuthContext, protege rotas e registra o navigate
function AppContent({ page, navigate, selectedJob }) {
  const { user, setNavigate } = useAuth()
  useEffect(() => { setNavigate(navigate) }, [navigate, setNavigate])

  const PROTECTED = ['dashboard-candidato', 'dashboard-recrutador']
  const needsAuth = PROTECTED.includes(page) && !user
  useEffect(() => {
    if (needsAuth) navigate('login')
  }, [needsAuth, navigate])

  if (needsAuth) return null

  const hideLayout = ['login', 'consultoria-login', 'register', 'dashboard-candidato', 'dashboard-recrutador', 'admin']

  const renderPage = () => {
    switch (page) {
      case 'home':             return <HomePage navigate={navigate} />
      case 'login':            return <ConsultoriaLoginPage navigate={navigate} />
      case 'register':         return <RegisterPage navigate={navigate} />
      case 'vagas':            return <VagasPage navigate={navigate} />
      case 'job-detail':       return <JobDetailPage job={selectedJob} navigate={navigate} />
      case 'treinamentos':     return <TreinamentosPage navigate={navigate} />
      case 'sobre':            return <SobreNosPage navigate={navigate} />
      case 'faq':              return <FAQPage navigate={navigate} />
      case 'pessoas':          return <EmConstrucaoPage navigate={navigate} />
      case 'processos':        return <EmConstrucaoPage navigate={navigate} />
      case 'performance':      return <EmConstrucaoPage navigate={navigate} />
      case 'prevencao':        return <EmConstrucaoPage navigate={navigate} />
      case 'dashboard-candidato':  return <CandidatoDashboard navigate={navigate} />
      case 'dashboard-recrutador': return <RecrutadorDashboard navigate={navigate} />
      case 'consultoria-login':    return <ConsultoriaLoginPage navigate={navigate} />
      case 'em-construcao':        return <EmConstrucaoPage navigate={navigate} />
      case 'plataforma':           return <PlataformaPage navigate={navigate} />
      case 'admin':                return <AdminAuditPage navigate={navigate} />
      default:
        if (page?.startsWith('curso-')) {
          const courseId = page.replace('curso-', '')
          if (!courseId) return <HomePage navigate={navigate} />
          return <CursoDetailPage navigate={navigate} courseId={courseId} />
        }
        return <HomePage navigate={navigate} />
    }
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", minHeight: '100vh', background: '#f8fafc' }}>
      {!hideLayout.includes(page) && <Navbar navigate={navigate} page={page} />}
      <ErrorBoundary key={page}>
        {renderPage()}
      </ErrorBoundary>
      {!hideLayout.includes(page) && <Footer navigate={navigate} />}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedJob, setSelectedJob] = useState(null)

  const pageTitles = {
    home: 'Easy4RH — Plataforma de RH',
    login: 'Entrar — Easy4RH',
    register: 'Criar conta — Easy4RH',
    vagas: 'Vagas — Easy4RH',
    'job-detail': 'Vaga — Easy4RH',
    treinamentos: 'Treinamentos — Easy4RH',
    sobre: 'Sobre nós — Easy4RH',
    faq: 'Perguntas frequentes — Easy4RH',
    plataforma: 'Plataforma — Easy4RH',
    'dashboard-candidato': 'Meu Painel — Easy4RH',
    'dashboard-recrutador': 'Painel do Recrutador — Easy4RH',
    'consultoria-login': 'Acessar — Easy4RH',
    'admin': 'Auditoria — Easy4RH',
  }

  const navigate = (pg, data = null) => {
    setPage(pg)
    if (data) setSelectedJob(data)
    window.scrollTo(0, 0)
    const title = pageTitles[pg] || (pg?.startsWith('curso-') ? 'Curso — Easy4RH' : 'Easy4RH')
    document.title = title
    // Atualiza URL sem recarregar: limpa ?job= quando sai da vaga
    const url = new URL(window.location.href)
    if (pg === 'job-detail' && data?.id) {
      url.searchParams.set('job', data.id)
    } else {
      url.searchParams.delete('job')
    }
    window.history.replaceState(null, '', url.toString())
  }

  // Lê ?page=<rota> na URL ao montar e navega diretamente (ex: ?page=admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pg = params.get('page')
    if (pg && pg !== 'home') {
      setPage(pg)
      document.title = pageTitles[pg] || 'Easy4RH'
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Lê ?job=<id> na URL ao montar e navega diretamente para a vaga
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const jobId = params.get('job')
    if (!jobId) return
    jobsApi.get(jobId)
      .then(job => {
        if (job) {
          setSelectedJob(normalizeJob(job))
          setPage('job-detail')
          document.title = `${job.title} — Easy4RH`
        }
      })
      .catch(() => {
        // Job não encontrado — remove param e fica na home
        const url = new URL(window.location.href)
        url.searchParams.delete('job')
        window.history.replaceState(null, '', url.toString())
      })
  }, [])

  return (
    <AuthProvider>
      <JobsProvider>
        <AppContent page={page} navigate={navigate} selectedJob={selectedJob} />
      </JobsProvider>
    </AuthProvider>
  )
}
