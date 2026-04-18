import { useState, useEffect } from 'react'
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

// Componente interno que registra o navigate no AuthContext
function AppInner({ navigate }) {
  const { setNavigate } = useAuth()
  useEffect(() => { setNavigate(navigate) }, [navigate, setNavigate])
  return null
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
    <AuthProvider>
      <JobsProvider>
        <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", minHeight: '100vh', background: '#f8fafc' }}>
          <AppInner navigate={navigate} />
          {!hideLayout.includes(page) && <Navbar navigate={navigate} page={page} />}
          {renderPage()}
          {!hideLayout.includes(page) && <Footer navigate={navigate} />}
        </div>
      </JobsProvider>
    </AuthProvider>
  )
}
