import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [savedJobs, setSavedJobs] = useState([])

  // Substitua estas funções por chamadas reais à sua API
  const login = (email, password) => {
  if (email && password) {
    const mockUser = { id: 1, name: 'João Silva', email, role: 'candidate' }
    setUser(mockUser)
    return { success: true, user: mockUser }  // ← adicione user: mockUser
  }
  return { success: false, message: 'Email ou senha inválidos' }
}

const loginRecruiter = (email, password) => {
  if (email && password) {
    const mockUser = { id: 2, name: 'Ana Recrutadora', email, role: 'recruiter' }
    setUser(mockUser)
    return { success: true, user: mockUser }  // ← adicione user: mockUser
  }
  return { success: false, message: 'Email ou senha inválidos' }
}

  const register = (data) => {
    const newUser = { id: Date.now(), ...data, role: 'candidate' }
    setUser(newUser)
    return { success: true }
  }

  const logout = () => setUser(null)

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  return (
    <AuthContext.Provider
      value={{ user, login, loginRecruiter, register, logout, savedJobs, toggleSaveJob }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
