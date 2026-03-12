import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { JobsProvider } from './context/JobsContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VagasPage from './pages/VagasPage'
import JobDetailPage from './pages/JobDetailPage'
import TreinamentosPage from './pages/TreinamentosPage'
import SobreNosPage from './pages/SobreNosPage'
import FAQPage from './pages/FAQPage'
import PessoasPage from './pages/PessoasPage'
import ProcessosPage from './pages/ProcessosPage'
import PerformancePage from './pages/PerformancePage'
import PrevencaoPage from './pages/PrevencaoPage'
import CandidatoDashboard from './pages/CandidatoDashboard'
import RecrutadorDashboard from './pages/RecrutadorDashboard'
import ConsultoriaLoginPage from './pages/ConsultoriaLoginPage'



export default function App() {
  const [page, setPage] = useState('home')
  const [selectedJob, setSelectedJob] = useState(null)

  const navigate = (pg, data = null) => {
    setPage(pg)
    if (data) setSelectedJob(data)
    window.scrollTo(0, 0)
  }

  const renderPage = () => {
    switch (page) {
      case 'home':        return <HomePage navigate={navigate} />
      case 'login':       return <LoginPage navigate={navigate} />
      case 'register':    return <RegisterPage navigate={navigate} />
      case 'vagas':       return <VagasPage navigate={navigate} />
      case 'job-detail':  return <JobDetailPage job={selectedJob} navigate={navigate} />
      case 'treinamentos':return <TreinamentosPage navigate={navigate} />
      case 'sobre':       return <SobreNosPage navigate={navigate} />
      case 'faq':         return <FAQPage navigate={navigate} />
      case 'pessoas':     return <PessoasPage navigate={navigate} />
      case 'processos':   return <ProcessosPage navigate={navigate} />
      case 'performance': return <PerformancePage navigate={navigate} />
      case 'prevencao':   return <PrevencaoPage navigate={navigate} />
      case 'dashboard-candidato':  return <CandidatoDashboard navigate={navigate} />
      case 'dashboard-recrutador': return <RecrutadorDashboard navigate={navigate} />
      case 'consultoria-login': return <ConsultoriaLoginPage navigate={navigate} />
      default:            return <HomePage navigate={navigate} />
    }
  }

  return (
    <AuthProvider>
      <JobsProvider>
        <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", minHeight: '100vh', background: '#f8fafc' }}>
          <Navbar navigate={navigate} page={page} />
          {renderPage()}
          <Footer navigate={navigate} />
        </div>
      </JobsProvider>
    </AuthProvider>
  )
}
