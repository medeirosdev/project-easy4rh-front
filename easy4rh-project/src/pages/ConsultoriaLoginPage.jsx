import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import illustration from '../assets/login-illustration.png'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ConsultoriaLoginPage({ navigate }) {
  const { login, register } = useAuth()
  const { isMobile } = useBreakpoint()
  const [tab, setTab] = useState('login')

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Register state
  const [regRole, setRegRole] = useState('CANDIDATE')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      const r = result.user?.role
      navigate((r === 'RECRUITER' || r === 'INSTRUCTOR') ? 'dashboard-recrutador' : 'dashboard-candidato')
    } else setError('Email ou senha inválidos.')
  }

  const handleRegister = async () => {
    setRegError('')
    if (!regName || !regEmail || !regPassword || !regConfirm) { setRegError('Preencha todos os campos.'); return }
    if (regPassword !== regConfirm) { setRegError('As senhas não coincidem.'); return }
    if (regPassword.length < 8) { setRegError('A senha deve ter pelo menos 8 caracteres.'); return }
    setRegLoading(true)
    const result = await register({ name: regName, email: regEmail, password: regPassword, role: regRole })
    setRegLoading(false)
    if (result.success) {
      const r = result.user?.role
      navigate((r === 'RECRUITER' || r === 'INSTRUCTOR') ? 'dashboard-recrutador' : 'dashboard-candidato')
    } else setRegError(result.message || 'Erro ao criar conta.')
  }

  const inputStyle = {
    width: '100%', border: 'none', borderBottom: '1.5px solid #c8d4e0',
    padding: '10px 2px', fontSize: 14, outline: 'none',
    background: 'transparent', color: '#334', boxSizing: 'border-box',
    marginBottom: 20,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <Navbar navigate={navigate} page="login" />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px 20px' : '60px 40px' }}>
        <div style={{ maxWidth: 960, width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>

          {/* Left — Card */}
          <div style={{ background: '#f0f3f7', borderRadius: 24, padding: isMobile ? '32px 24px' : '44px 40px', boxShadow: '0 4px 32px rgba(30,74,138,0.08)' }}>

            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e3a6e', marginBottom: 28, textAlign: 'center' }}>
              {tab === 'login' ? 'Entrar' : <><span style={{ color: '#1e3a6e' }}>Criar </span><span style={{ color: '#4a9edd' }}>Conta</span></>}
            </h1>

            {tab === 'login' ? (
              <>
                {error && <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '9px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle} />

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#556677', marginBottom: 28, cursor: 'pointer' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ cursor: 'pointer', accentColor: '#1e4a8a' }} />
                  Me lembrar
                </label>

                <button onClick={handleLogin} disabled={loading} style={{ width: '100%', background: loading ? '#aaa' : 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', cursor: loading ? 'default' : 'pointer', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
                  {loading ? 'Entrando...' : 'Login'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 13, color: '#778899', marginBottom: 0 }}>
                  Não tem conta?{' '}
                  <span onClick={() => setTab('register')} style={{ color: '#1e4a8a', fontWeight: 700, cursor: 'pointer' }}>Crie aqui.</span>
                </p>

                <p style={{ textAlign: 'center', fontSize: 11.5, color: '#aabbcc', marginTop: 32 }}>
                  Ao continuar, você concorda com os{' '}
                  <span style={{ color: '#4a9edd', cursor: 'pointer' }}>Termos de Serviço</span>
                  {' '}e a{' '}
                  <span style={{ color: '#4a9edd', cursor: 'pointer' }}>Política de Privacidade</span>
                </p>
              </>
            ) : (
              <>
                {regError && <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '9px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>⚠️ {regError}</div>}

                {/* Role toggle */}
                <div style={{ display: 'flex', background: '#e4e9f0', borderRadius: 8, padding: 3, marginBottom: 22 }}>
                  {[
                    { value: 'CANDIDATE', label: 'Candidato' },
                    { value: 'RECRUITER', label: 'Recrutador' },
                    { value: 'INSTRUCTOR', label: 'Instrutor' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => { setRegRole(opt.value); setRegError(''); }}
                      style={{
                        flex: 1, padding: '9px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: regRole === opt.value ? 700 : 500, transition: 'all 0.2s',
                        background: regRole === opt.value ? 'white' : 'transparent',
                        color: regRole === opt.value ? '#1e4a8a' : '#778899',
                        boxShadow: regRole === opt.value ? '0 1px 4px rgba(30,74,138,0.12)' : 'none',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                <input type="text" placeholder="Nome completo" value={regName} onChange={e => setRegName(e.target.value)} style={inputStyle} />
                <input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Senha (mínimo 8 caracteres)" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Confirmar senha" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegister()} style={inputStyle} />

                {regRole === 'RECRUITER' && (
                  <div style={{ background: '#f0f8ff', borderRadius: 8, padding: '12px 14px', marginBottom: 20, border: '1px solid #d0e4f4' }}>
                    <p style={{ fontSize: 12.5, color: '#1e4a8a', margin: 0, fontWeight: 600 }}>
                      Após o cadastro, você poderá vincular ou criar sua empresa no painel do recrutador.
                    </p>
                  </div>
                )}

                {regRole === 'INSTRUCTOR' && (
                  <div style={{ background: '#f0fff4', borderRadius: 8, padding: '12px 14px', marginBottom: 20, border: '1px solid #b2e4c8' }}>
                    <p style={{ fontSize: 12.5, color: '#276749', margin: 0, fontWeight: 600 }}>
                      Como instrutor, você poderá criar cursos, adicionar aulas com vídeos e acompanhar o progresso dos alunos.
                    </p>
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#556677', marginBottom: 28, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ cursor: 'pointer', accentColor: '#1e4a8a' }} />
                  Me lembrar
                </label>

                <button onClick={handleRegister} disabled={regLoading} style={{ width: '100%', background: regLoading ? '#aaa' : 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 10, padding: '13px', cursor: regLoading ? 'default' : 'pointer', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
                  {regLoading ? 'Criando conta...' : regRole === 'RECRUITER' ? 'Criar conta de recrutador' : regRole === 'INSTRUCTOR' ? 'Criar conta de instrutor' : 'Criar conta'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 13, color: '#778899', marginBottom: 0 }}>
                  Já tem conta?{' '}
                  <span onClick={() => setTab('login')} style={{ color: '#1e4a8a', fontWeight: 700, cursor: 'pointer' }}>Entre aqui.</span>
                </p>

                <p style={{ textAlign: 'center', fontSize: 11.5, color: '#aabbcc', marginTop: 24 }}>
                  Ao continuar, você concorda com os{' '}
                  <span style={{ color: '#4a9edd', cursor: 'pointer' }}>Termos de Serviço</span>
                  {' '}e a{' '}
                  <span style={{ color: '#4a9edd', cursor: 'pointer' }}>Política de Privacidade.</span>
                </p>
              </>
            )}
          </div>

          {/* Right — Illustration */}
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={illustration} alt="Easy4RH" style={{ width: '100%', maxWidth: 480, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(30,74,138,0.08))' }} />
            </div>
          )}

        </div>
      </div>

      <Footer navigate={navigate} />

    </div>
  )
}
