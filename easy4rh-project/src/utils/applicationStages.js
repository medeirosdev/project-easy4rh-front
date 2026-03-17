const stages = {
  APPLIED:      { label: 'Aplicado',       color: '#3b82f6', progress: 14 },
  SCREENING:    { label: 'Em análise',     color: '#f0a500', progress: 28 },
  INTERVIEW_1:  { label: 'Entrevista 1',   color: '#8b5cf6', progress: 42 },
  INTERVIEW_2:  { label: 'Entrevista 2',   color: '#8b5cf6', progress: 57 },
  TECHNICAL:    { label: 'Teste técnico',  color: '#a855f7', progress: 71 },
  OFFER:        { label: 'Proposta',       color: '#22c55e', progress: 85 },
  HIRED:        { label: 'Aprovado',       color: '#22c55e', progress: 100 },
  REJECTED:     { label: 'Reprovado',      color: '#ef4444', progress: 0 },
}

const fallback = { label: 'Desconhecido', color: '#999', progress: 0 }

export function getStageLabel(stage) {
  return (stages[stage] || fallback).label
}

export function getStageColor(stage) {
  return (stages[stage] || fallback).color
}

export function getStageProgress(stage) {
  return (stages[stage] || fallback).progress
}

export const pipelineSteps = ['Aplicado', 'Em análise', 'Entrevista', 'Teste', 'Proposta', 'Decisão']

export function getStageStepIndex(stage) {
  const map = {
    APPLIED: 0, SCREENING: 1, INTERVIEW_1: 2, INTERVIEW_2: 2,
    TECHNICAL: 3, OFFER: 4, HIRED: 5, REJECTED: 5,
  }
  return map[stage] ?? 0
}
