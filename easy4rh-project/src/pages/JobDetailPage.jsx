import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { jobQuestionsApi } from "../services/api";

const typeColors = {
  Presencial: { bg: "#e8f4fd", color: "#1e6eab" },
  Remoto: { bg: "#e8fdf0", color: "#1e8a4a" },
  "Híbrido": { bg: "#f0e8fd", color: "#6e1eab" }
};

export default function JobDetailPage({ job, navigate }) {
  const { user, savedJobs, toggleSaveJob } = useAuth();
  const { appliedJobs, applyToJob } = useJobs();
  const { isMobile } = useBreakpoint();
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);

  // Application flow state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1); // 1=cover letter, 2=questions, 3=review
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!job) { navigate("vagas"); return null; }

  const tc = typeColors[job.type] || typeColors.Presencial;
  const isApplied = appliedJobs.includes(job.id) || applied;
  const isSaved = savedJobs.includes(job.id);

  const loadQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const data = await jobQuestionsApi.list(job.id);
      const list = Array.isArray(data) ? data : (data.data || data.questions || []);
      setQuestions(list);
    } catch {
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleStartApply = () => {
    if (!user) { navigate("login"); return; }
    setShowApplyModal(true);
    setApplyStep(1);
    setCoverLetter('');
    setAnswers({});
    setSubmitError('');
    loadQuestions();
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {};
      if (coverLetter.trim()) payload.coverLetter = coverLetter.trim();

      if (questions.length > 0) {
        payload.answers = questions.map(q => {
          const ans = answers[q.id];
          if (!ans) return null;
          const entry = { questionId: q.id };
          if (q.type === 'TEXT') {
            entry.textAnswer = ans.textAnswer || '';
          } else if (q.type === 'MULTIPLE_CHOICE') {
            // For multiple choice, send multiple answer entries
            // But backend expects single answer per question, pick first selected
            entry.optionId = ans.optionId || undefined;
          } else {
            entry.optionId = ans.optionId || undefined;
          }
          return entry;
        }).filter(Boolean);
      }

      const result = await applyToJob(job.id, payload);
      if (result.success) {
        setApplied(true);
        setShowApplyModal(false);
        setShowModal(true);
      } else {
        setSubmitError(result.message || 'Erro ao enviar candidatura.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Erro ao enviar candidatura.');
    } finally {
      setSubmitting(false);
    }
  };

  const setAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const hasQuestions = questions.length > 0;
  const totalSteps = hasQuestions ? 3 : 2; // with questions: cover, questions, review. without: cover, review.

  const canProceedFromQuestions = () => {
    const required = questions.filter(q => q.required !== false);
    return required.every(q => {
      const a = answers[q.id];
      if (!a) return false;
      if (q.type === 'TEXT') return a.textAnswer && a.textAnswer.trim();
      return a.optionId;
    });
  };

  const stepLabels = hasQuestions
    ? ['Carta', 'Perguntas', 'Revisar']
    : ['Carta', 'Revisar'];

  const inputStyle = {
    width: '100%', border: '1.5px solid #e0eaf4', borderRadius: 10,
    padding: '10px 14px', fontSize: 13.5, outline: 'none',
    boxSizing: 'border-box', color: '#334',
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a6e, #2a5298, #4a9edd)", padding: "30px 20px 50px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {!isMobile && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 4, maxWidth: 700, marginBottom: 16 }}>
              <input placeholder="Palavras-chave/cargo" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
              <input placeholder="Localidade" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
              <input placeholder="Distancia" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
              <button onClick={() => navigate("vagas")} style={{ background: "#1e3a6e", color: "white", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Procurar</button>
            </div>
          )}
          <h1 style={{ color: "rgba(255,255,255,0.9)", fontSize: isMobile ? 24 : 36, fontWeight: 800, marginTop: 16 }}>
            Encontre sua proxima <span style={{ color: "white" }}>oportunidade</span>
          </h1>
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ background: "white", borderBottom: "1px solid #e8edf2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 20px", display: "flex", gap: isMobile ? 12 : 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Login", action: () => navigate("login") },
            { label: "Registre seu CV", action: () => navigate("register") },
            { label: "Recrutamento", action: () => navigate("login") },
          ].map((item) => (
            <button key={item.label} onClick={item.action} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, fontWeight: 600 }}>{item.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#1e3a6e", marginBottom: 24 }}>Detalhes da vaga</h2>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", gap: 28 }}>
          {/* Sidebar */}
          {!isMobile && (
            <div>
              {[
                { title: "TIPO DE VAGA", options: ["Remoto", "Presencial", "Hibrido"] },
                { title: "NIVEL", options: ["Estagio", "Junior", "Pleno", "Senior"] },
                { title: "LOCALIZACAO", options: ["Sao Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", "Florianopolis, SC", "Porto Alegre, RS", "Campinas, SP", "Recife, PE", "Salvador, BA", "Manaus, AM", "Brasilia, DF", "Goiania, GO"] }
              ].map(section => (
                <div key={section.title} style={{ background: "white", border: "1px solid #e8edf2", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 1, margin: "0 0 10px", textTransform: "uppercase" }}>{section.title}</h4>
                  {section.options.map(opt => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8, fontSize: 13 }}>
                      <input type="checkbox" style={{ cursor: "pointer" }} readOnly />
                      <span style={{ color: "#444" }}>{opt}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Main content */}
          <div>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8edf2", padding: isMobile ? 20 : 28 }}>
              {/* Header bar */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, gap: 8, flexWrap: "wrap" }}>
                <button style={{ background: "none", border: "1px solid #d0d8e4", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555" }}>
                  Compartilhar
                </button>
                <button onClick={() => user ? toggleSaveJob(job.id) : navigate("login")}
                  style={{ background: "none", border: "1px solid #d0d8e4", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: isSaved ? "#1e4a8a" : "#555" }}>
                  {isSaved ? "Salvo" : "Salvar"}
                </button>
              </div>

              {/* Job header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#1e4a8a", margin: "0 0 8px" }}>{job.title}</h2>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>Local: {job.location}</span>
                    <span style={{ fontSize: 13, color: "#555" }}>Nivel: {job.level}</span>
                    <span style={{ fontSize: 13, color: "#2e7d32", fontWeight: 600 }}>Salario: {job.salary}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, margin: 0 }}>{job.description}</p>
                </div>
                {!isMobile && (
                  <div style={{ width: 72, height: 72, borderRadius: 12, background: job.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 14, flexShrink: 0 }}>
                    {job.logo}
                  </div>
                )}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e8edf2", margin: "20px 0" }} />

              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16 }}>Detalhes da vaga</h3>

              <div style={{ marginBottom: 24 }}>
                <p style={{ color: "#555", fontSize: 13.5, lineHeight: 1.7 }}>
                  Estamos em busca de um(a) {job.title} para liderar nossa equipe e garantir a melhor experiencia para nossos clientes.
                </p>
              </div>

              {[
                { title: "Responsabilidades", items: job.responsibilities },
                { title: "Requisitos", items: job.requirements },
                { title: "Diferenciais", items: ["Experiencia no varejo da categoria", "Conhecimento em indicadores de desempenho (KPIs)", "Vivencia em ambientes dinamicos"] },
                { title: "O que oferecemos", items: job.benefits },
              ].map(section => (
                <div key={section.title} style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>{section.title}</h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {section.items.map((item, i) => (
                      <li key={i} style={{ fontSize: 13.5, color: "#555", marginBottom: 6, lineHeight: 1.6 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, fontSize: 13, flexWrap: "wrap" }}>
                <span style={{ color: "#555" }}>Local de trabalho: {typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')}</span>
                <span style={{ color: "#555" }}>Regime: CLT</span>
              </div>

              <button onClick={handleStartApply} disabled={isApplied} style={{
                background: isApplied ? "#38a169" : "linear-gradient(135deg, #1e4a8a, #4a9edd)",
                color: "white", border: "none", borderRadius: 10,
                padding: "14px 28px", cursor: isApplied ? "default" : "pointer",
                fontWeight: 700, fontSize: 14, width: isMobile ? "100%" : "auto"
              }}>
                {isApplied ? "Candidatura enviada!" : "Aplicar para a Vaga"}
              </button>
            </div>

            <button onClick={() => navigate("vagas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13.5, fontWeight: 600, marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              Voltar para vagas
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal — Screening Questions Flow */}
      {showApplyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: isMobile ? 24 : 36, maxWidth: 560, width: "100%", maxHeight: '90vh', overflowY: 'auto', boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>Candidatar-se</h2>
              <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#999' }}>X</button>
            </div>

            {/* Steps indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
              {stepLabels.map((label, i) => {
                const stepNum = i + 1;
                const isActive = applyStep === stepNum;
                const isDone = applyStep > stepNum;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {i > 0 && <div style={{ width: 24, height: 2, background: isDone ? '#1e4a8a' : '#d0dae4' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDone ? '#22c55e' : isActive ? '#1e4a8a' : '#d0dae4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                        {isDone ? '\u2713' : stepNum}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? '#1e3a6e' : '#999' }}>{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {submitError && (
              <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: '10px 14px', color: '#c00', fontSize: 13, marginBottom: 16 }}>{submitError}</div>
            )}

            {/* Step 1 — Cover Letter */}
            {applyStep === 1 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 8 }}>Carta de apresentacao (opcional)</h3>
                <p style={{ fontSize: 13, color: '#778899', marginTop: 0, marginBottom: 16 }}>
                  Conte brevemente por que voce e a pessoa ideal para esta vaga.
                </p>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Escreva aqui sua carta de apresentacao..."
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                  <button onClick={() => setShowApplyModal(false)} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Cancelar
                  </button>
                  <button onClick={() => {
                    if (hasQuestions) setApplyStep(2);
                    else setApplyStep(totalSteps);
                  }} style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', color: 'white', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    {hasQuestions ? 'Proximo' : 'Revisar e enviar'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Screening Questions */}
            {applyStep === 2 && hasQuestions && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 8 }}>Perguntas de triagem</h3>
                <p style={{ fontSize: 13, color: '#778899', marginTop: 0, marginBottom: 20 }}>
                  Responda as perguntas abaixo para completar sua candidatura.
                </p>

                {questionsLoading ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#778899', fontSize: 13 }}>Carregando perguntas...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {questions.map((q, idx) => (
                      <div key={q.id} style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', border: '1px solid #e8edf2' }}>
                        <label style={{ fontSize: 13.5, fontWeight: 700, color: '#334', display: 'block', marginBottom: 10 }}>
                          {idx + 1}. {q.question}
                          {q.required !== false && <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span>}
                        </label>

                        {/* TEXT type */}
                        {q.type === 'TEXT' && (
                          <textarea
                            value={answers[q.id]?.textAnswer || ''}
                            onChange={e => setAnswer(q.id, { textAnswer: e.target.value })}
                            placeholder="Digite sua resposta..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                          />
                        )}

                        {/* YES_NO type */}
                        {q.type === 'YES_NO' && (
                          <div style={{ display: 'flex', gap: 10 }}>
                            {(q.options || []).map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setAnswer(q.id, { optionId: opt.id })}
                                style={{
                                  flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                                  border: answers[q.id]?.optionId === opt.id ? '2px solid #1e4a8a' : '1.5px solid #d0dae4',
                                  background: answers[q.id]?.optionId === opt.id ? '#e8f2fc' : 'white',
                                  color: answers[q.id]?.optionId === opt.id ? '#1e4a8a' : '#556677',
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* SINGLE_CHOICE type */}
                        {q.type === 'SINGLE_CHOICE' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(q.options || []).map(opt => (
                              <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: answers[q.id]?.optionId === opt.id ? '2px solid #1e4a8a' : '1.5px solid #e8edf2', background: answers[q.id]?.optionId === opt.id ? '#e8f2fc' : 'white' }}>
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  checked={answers[q.id]?.optionId === opt.id}
                                  onChange={() => setAnswer(q.id, { optionId: opt.id })}
                                  style={{ accentColor: '#1e4a8a' }}
                                />
                                <span style={{ fontSize: 13, color: '#334' }}>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* MULTIPLE_CHOICE type — select one for backend compatibility */}
                        {q.type === 'MULTIPLE_CHOICE' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(q.options || []).map(opt => (
                              <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: answers[q.id]?.optionId === opt.id ? '2px solid #1e4a8a' : '1.5px solid #e8edf2', background: answers[q.id]?.optionId === opt.id ? '#e8f2fc' : 'white' }}>
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  checked={answers[q.id]?.optionId === opt.id}
                                  onChange={() => setAnswer(q.id, { optionId: opt.id })}
                                  style={{ accentColor: '#1e4a8a' }}
                                />
                                <span style={{ fontSize: 13, color: '#334' }}>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setApplyStep(1)} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Voltar
                  </button>
                  <button
                    onClick={() => setApplyStep(totalSteps)}
                    disabled={!canProceedFromQuestions()}
                    style={{
                      background: !canProceedFromQuestions() ? '#ccc' : 'linear-gradient(135deg, #1e4a8a, #4a9edd)',
                      color: 'white', border: 'none', borderRadius: 24, padding: '11px 24px',
                      cursor: !canProceedFromQuestions() ? 'default' : 'pointer', fontWeight: 700, fontSize: 13
                    }}
                  >
                    Revisar e enviar
                  </button>
                </div>
              </div>
            )}

            {/* Final Step — Review & Submit */}
            {applyStep === totalSteps && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 16 }}>Revisar candidatura</h3>

                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', border: '1px solid #e8edf2', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#778899', marginBottom: 6, textTransform: 'uppercase' }}>Vaga</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e' }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: '#556677', marginTop: 2 }}>
                    {typeof job.company === 'object' && job.company ? job.company.name : (job.company || '')} - {job.location}
                  </div>
                </div>

                {coverLetter.trim() && (
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', border: '1px solid #e8edf2', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#778899', marginBottom: 6, textTransform: 'uppercase' }}>Carta de apresentacao</div>
                    <p style={{ fontSize: 13, color: '#334', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{coverLetter}</p>
                  </div>
                )}

                {hasQuestions && (
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', border: '1px solid #e8edf2', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#778899', marginBottom: 12, textTransform: 'uppercase' }}>Respostas</div>
                    {questions.map((q, idx) => {
                      const a = answers[q.id];
                      let answerText = 'Nao respondida';
                      if (a) {
                        if (q.type === 'TEXT') answerText = a.textAnswer || 'Nao respondida';
                        else if (a.optionId) {
                          const opt = (q.options || []).find(o => o.id === a.optionId);
                          answerText = opt?.label || 'Selecionada';
                        }
                      }
                      return (
                        <div key={q.id} style={{ marginBottom: idx < questions.length - 1 ? 12 : 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#334', marginBottom: 2 }}>{idx + 1}. {q.question}</div>
                          <div style={{ fontSize: 13, color: '#556677' }}>{answerText}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setApplyStep(hasQuestions ? 2 : 1)} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Voltar
                  </button>
                  <button
                    onClick={handleSubmitApplication}
                    disabled={submitting}
                    style={{
                      background: submitting ? '#aaa' : 'linear-gradient(135deg, #1e4a8a, #4a9edd)',
                      color: 'white', border: 'none', borderRadius: 24, padding: '11px 28px',
                      cursor: submitting ? 'default' : 'pointer', fontWeight: 700, fontSize: 14
                    }}
                  >
                    {submitting ? 'Enviando...' : 'Enviar candidatura'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: isMobile ? 28 : 40, maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#22c55e' }}>{'\u2713'}</div>
            <h2 style={{ color: "#1e3a6e", marginBottom: 8 }}>Candidatura enviada!</h2>
            <p style={{ color: "#555", marginBottom: 24, fontSize: 14 }}>Boa sorte! A empresa entrara em contato em breve.</p>
            <button onClick={() => setShowModal(false)} style={{ background: "linear-gradient(135deg, #1e4a8a, #4a9edd)", color: "white", border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 700 }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
