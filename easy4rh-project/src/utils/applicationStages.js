// ============================================================
// Pipeline de seleção — 5 fases principais visíveis ao usuário
// Legados (INTERVIEW_1, INTERVIEW_2, TECHNICAL) mapeados para
// EM PROCESSO para compatibilidade com dados antigos.
// ============================================================

export const PIPELINE_STAGES = [
  { key: 'APPLIED',        label: 'Inscritos',    color: '#3b82f6', bg: '#eff6ff', progress: 10 },
  { key: 'SCREENING',      label: 'Em Processo',  color: '#f59e0b', bg: '#fffbeb', progress: 30 },
  { key: 'PRE_SELECTION',  label: 'Pré Seleção',  color: '#8b5cf6', bg: '#f5f3ff', progress: 55 },
  { key: 'OFFER',          label: 'Finalistas',   color: '#0ea5e9', bg: '#f0f9ff', progress: 78 },
  { key: 'HIRED',          label: 'Contratados',  color: '#22c55e', bg: '#f0fdf4', progress: 100 },
]

// Legacy stages map to their closest active equivalent for display
const LEGACY_MAP = {
  INTERVIEW_1: 'SCREENING',
  INTERVIEW_2: 'SCREENING',
  TECHNICAL:   'PRE_SELECTION',
}

// Normalize any stage (including legacy) to the 5 active ones
export function normalizeStage(stage) {
  return LEGACY_MAP[stage] || stage
}

const stageMap = Object.fromEntries(PIPELINE_STAGES.map(s => [s.key, s]))
const fallback = { label: 'Desconhecido', color: '#9ca3af', bg: '#f9fafb', progress: 0 }

function getStageData(stage) {
  return stageMap[normalizeStage(stage)] || fallback
}

export function getStageLabel(stage) {
  if (stage === 'REJECTED') return 'Reprovado'
  return getStageData(stage).label
}

export function getStageColor(stage) {
  if (stage === 'REJECTED') return '#ef4444'
  return getStageData(stage).color
}

export function getStageBackground(stage) {
  if (stage === 'REJECTED') return '#fef2f2'
  return getStageData(stage).bg
}

export function getStageProgress(stage) {
  if (stage === 'REJECTED') return 0
  return getStageData(stage).progress
}

// For the candidate's progress bar (only active stages, no REJECTED)
export const pipelineSteps = PIPELINE_STAGES.map(s => s.label)

export function getStageStepIndex(stage) {
  if (stage === 'REJECTED') return -1
  const normalized = normalizeStage(stage)
  return PIPELINE_STAGES.findIndex(s => s.key === normalized)
}
