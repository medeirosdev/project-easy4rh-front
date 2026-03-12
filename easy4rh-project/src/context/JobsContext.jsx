import { createContext, useContext, useState } from 'react'
import { mockJobs, mockCourses } from '../data/mockData'

const JobsContext = createContext()

export function JobsProvider({ children }) {
  const [jobs] = useState(mockJobs)
  const [courses] = useState(mockCourses)
  const [appliedJobs, setAppliedJobs] = useState([])

  // Substitua por chamada real à sua API
  const applyToJob = (jobId) => {
    setAppliedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]))
    return { success: true }
  }

  return (
    <JobsContext.Provider value={{ jobs, courses, appliedJobs, applyToJob }}>
      {children}
    </JobsContext.Provider>
  )
}

export const useJobs = () => useContext(JobsContext)
