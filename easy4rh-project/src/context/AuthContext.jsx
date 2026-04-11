import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { authApi, profileApi, saveToken, clearToken, saveUser, loadUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser) // carrega do localStorage se existir
  const navigateRef = useRef(null)
  const [savedJobs, setSavedJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('easy4rh_saved_jobs')) || [] } catch { return [] }
  })
  const [loading, setLoading] = useState(false)

  // Ouve evento de sessao expirada disparado pelo api.js (401 ou token expirado)
  useEffect(() => {
    const handler = () => {
      setUser(null)
      setSavedJobs([])
      if (navigateRef.current) navigateRef.current('login')
    }
    window.addEventListener('auth:expired', handler)
    return () => window.removeEventListener('auth:expired', handler)
  }, [])

  // ── Login (candidato ou recrutador — o backend decide pelo role) ──
  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      // data = { access_token, user: { id, email, role, emailVerified } }
      saveToken(data.access_token)

      // O backend retorna user sem 'name' — vem de UserResponseDto
      const loggedUser = data.user || await authApi.getUser(data.userId)

      // Tenta buscar o nome do perfil do candidato
      if (loggedUser.role === 'CANDIDATE' && !loggedUser.name) {
        try {
          const profile = await profileApi.get()
          if (profile?.fullName) loggedUser.name = profile.fullName
        } catch {
          // perfil pode não existir ainda
        }
      }

      // Fallback: usa a parte antes do @ do email como nome
      if (!loggedUser.name) loggedUser.name = loggedUser.email.split('@')[0]

      saveUser(loggedUser)
      setUser(loggedUser)
      return { success: true, user: loggedUser }
    } catch (err) {
      return { success: false, message: err.message || 'Email ou senha inválidos.' }
    } finally {
      setLoading(false)
    }
  }

  // ── loginRecruiter — aceita RECRUITER e RECRUITER_INSTRUCTOR ──
  const loginRecruiter = async (email, password) => {
    const result = await login(email, password)
    const role = result.user?.role
    const allowed = ['RECRUITER', 'RECRUITER_INSTRUCTOR', 'ADMIN']
    if (result.success && !allowed.includes(role)) {
      logout()
      return { success: false, message: 'Essa conta não é de recrutador.' }
    }
    return result
  }

  // ── loginInstructor — aceita INSTRUCTOR e RECRUITER_INSTRUCTOR ──
  const loginInstructor = async (email, password) => {
    const result = await login(email, password)
    const role = result.user?.role
    const allowed = ['INSTRUCTOR', 'RECRUITER_INSTRUCTOR', 'ADMIN']
    if (result.success && !allowed.includes(role)) {
      logout()
      return { success: false, message: 'Essa conta não é de instrutor.' }
    }
    return result
  }

  // ── Registro ──
  const register = async (data) => {
    setLoading(true)
    try {
      // POST /users — backend aceita apenas email, password e role
      await authApi.register({
        email: data.email,
        password: data.password,
        role: data.role || 'CANDIDATE',
      })
      // Após registrar, faz login automaticamente
      const result = await login(data.email, data.password)

      // Se tem dados extras (nome, telefone), cria o perfil do candidato
      if (result.success && (data.role || 'CANDIDATE') === 'CANDIDATE') {
        try {
          await profileApi.create({
            fullName: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            phone: data.phone || undefined,
          })
        } catch {
          // perfil pode falhar mas o registro já foi feito
        }
      }

      return result
    } catch (err) {
      return { success: false, message: err.message || 'Erro ao criar conta.' }
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ──
  const logout = () => {
    clearToken()
    localStorage.removeItem('easy4rh_saved_jobs')
    // Remove user-scoped company cache keys
    Object.keys(localStorage)
      .filter(k => k.startsWith('my_company_id_'))
      .forEach(k => localStorage.removeItem(k))
    setUser(null)
    setSavedJobs([])
  }

  // ── Salvar/remover vagas (persistido no localStorage) ──
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const next = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      localStorage.setItem('easy4rh_saved_jobs', JSON.stringify(next))
      return next
    })
  }

  const setNavigate = (fn) => { navigateRef.current = fn }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginRecruiter,
      loginInstructor,
      register,
      logout,
      savedJobs,
      toggleSaveJob,
      setNavigate,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
