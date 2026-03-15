import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, saveToken, clearToken, saveUser, loadUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser) // carrega do localStorage se existir
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(false)

  // ── Login (candidato ou recrutador — o backend decide pelo role) ──
  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      // data = { access_token: '...', user: { id, name, email, role, ... } }
      saveToken(data.access_token)

      // Se o backend retornar o user junto do token, usa direto.
      // Caso contrário, faz GET /users/:id
      const loggedUser = data.user || await authApi.getUser(data.userId)
      saveUser(loggedUser)
      setUser(loggedUser)
      return { success: true, user: loggedUser }
    } catch (err) {
      return { success: false, message: err.message || 'Email ou senha inválidos.' }
    } finally {
      setLoading(false)
    }
  }

  // ── loginRecruiter reutiliza o mesmo endpoint — o role vem do backend ──
  const loginRecruiter = async (email, password) => {
    const result = await login(email, password)
    if (result.success && result.user?.role !== 'RECRUITER') {
      // Se logou mas não é recrutador, desloga e retorna erro
      logout()
      return { success: false, message: 'Essa conta não é de recrutador.' }
    }
    return result
  }

  // ── Registro ──
  const register = async (data) => {
    setLoading(true)
    try {
      // POST /users — cria o usuário
      await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name || `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        role: data.role || 'CANDIDATE',
      })
      // Após registrar, faz login automaticamente
      return await login(data.email, data.password)
    } catch (err) {
      return { success: false, message: err.message || 'Erro ao criar conta.' }
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ──
  const logout = () => {
    clearToken()
    setUser(null)
    setSavedJobs([])
  }

  // ── Salvar/remover vagas ──
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginRecruiter,
      register,
      logout,
      savedJobs,
      toggleSaveJob,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
