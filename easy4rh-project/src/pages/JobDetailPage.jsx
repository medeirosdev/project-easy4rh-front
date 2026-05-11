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
  const [isDuplicateApply, setIsDuplicateApply] = useState(false);

  // Hero search state
  const [heroKeyword, setHeroKeyword] = useState('');
  const [heroLocation, setHeroLocation] = useState('');

  // Application flow state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1); // 1=cover letter, 2=questions, 3=review
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // CV step
  const [profileResume, setProfileResume] = useState(null); // null=loading, {fileName:string|null}
  const [cvAction, setCvAction] = useState('keep'); // 'keep' | 'upload'
  const [cvNewFile, setCvNewFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploadProgress, setCvUploadProgress] = useState(0);

  if (!job) { navigate("vagas"); return null; }

  const tc = typeColors[job.type] || typeColors.Presencial;
  const isApplied = appliedJobs.includes(job.id) || applied;
  const isSaved = savedJobs.includes(job.id);

  const loadProfileResume = async () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${apiBase}/candidate-profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfileResume({ fileName: data.resumeFileName || null });
      } else {
        setProfileResume({ fileName: null });
      }
    } catch {
      setProfileResume({ fileName: null });
    }
  };

  const loadQuestions = async () => {
    if (!job?.id) { setQuestions([]); return; }
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
    if (isApplied) return;
    setShowApplyModal(true);
    setApplyStep(1);
    setCoverLetter('');
    setAnswers({});
    setSubmitError('');
    setCvAction('keep');
    setCvNewFile(null);
    setProfileResume(null);
    loadQuestions();
    loadProfileResume();
  };

  const handleProceedFromCV = async () => {
    if (cvAction === 'upload' && cvNewFile) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('access_token');
      setCvUploading(true);
      setCvUploadProgress(0);
      setSubmitError('');
      try {
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const fd = new FormData();
          fd.append('file', cvNewFile);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setCvUploadProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const res = JSON.parse(xhr.responseText);
              setProfileResume({ fileName: res.fileName || cvNewFile.name });
              setCvAction('keep');
              resolve();
            } else {
              const err = JSON.parse(xhr.responseText || '{}');
              reject(new Error(err.message || `Erro ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error('Erro de conexão'));
          xhr.open('POST', `${apiBase}/candidate-profiles/me/resume`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(fd);
        });
      } catch (err) {
        setSubmitError(err.message || 'Erro ao enviar CV');
        setCvUploading(false);
        setCvUploadProgress(0);
        return;
      }
      setCvUploading(false);
      setCvUploadProgress(0);
    }
    if (hasQuestions) setApplyStep(3);
    else setApplyStep(totalSteps);
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {};
      if (coverLetter.trim()) payload.coverLetter = coverLetter.trim();

      if (questions.length > 0) {
        payload.answers = questions.flatMap(q => {
          const ans = answers[q.id];
          if (!ans) return [];
          if (q.type === 'TEXT') {
            const text = ans.textAnswer?.trim();
            return text ? [{ questionId: q.id, textAnswer: text }] : [];
          }
          if (q.type === 'MULTIPLE_CHOICE') {
            // Send one entry per selected option
            const selected = ans.optionIds || [];
            return selected.map(optId => ({ questionId: q.id, optionId: optId }));
          }
          // SINGLE_CHOICE, YES_NO
          return ans.optionId ? [{ questionId: q.id, optionId: ans.optionId }] : [];
        });
      }

      const result = await applyToJob(job.id, payload);
      if (result.success) {
        setApplied(true);
        setShowApplyModal(false);
        setShowModal(true);
      } else if (result.isDuplicate) {
        setApplied(true);
        setShowApplyModal(false);
        setIsDuplicateApply(true);
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
  const totalSteps = hasQuestions ? 4 : 3; // cover, cv, [questions], review

  const canProceedFromQuestions = () => {
    const required = questions.filter(q => q.required !== false);
    return required.every(q => {
      const a = answers[q.id];
      if (!a) return false;
      if (q.type === 'TEXT') return a.textAnswer && a.textAnswer.trim();
      if (q.type === 'MULTIPLE_CHOICE') return a.optionIds && a.optionIds.length > 0;
      return a.optionId;
    });
  };

  const stepLabels = hasQuestions
    ? ['Carta', 'CV', 'Perguntas', 'Revisar']
    : ['Carta', 'CV', 'Revisar'];

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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 4, maxWidth: 600, marginBottom: 16 }}>
              <input
                placeholder="Palavras-chave/cargo"
                value={heroKeyword}
                onChange={e => setHeroKeyword(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { const kw = heroKeyword.trim(); const loc = heroLocation.trim(); navigate('vagas', kw || loc ? { keyword: kw, location: loc } : null); } }}
                style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }}
              />
              <input
                placeholder="Localidade"
                value={heroLocation}
                onChange={e => setHeroLocation(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { const kw = heroKeyword.trim(); const loc = heroLocation.trim(); navigate('vagas', kw || loc ? { keyword: kw, location: loc } : null); } }}
                style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }}
              />
              <button
                onClick={() => { const kw = heroKeyword.trim(); const loc = heroLocation.trim(); navigate('vagas', kw || loc ? { keyword: kw, location: loc } : null); }}
                style={{ background: "#1e3a6e", color: "white", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              >
                Procurar
              </button>
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
          {!user ? (
            <>
              <button onClick={() => navigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, fontWeight: 600 }}>Login</button>
              <button onClick={() => navigate("register")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, fontWeight: 600 }}>Registre seu CV</button>
            </>
          ) : (
            <button
              onClick={() => navigate(user.role === 'CANDIDATE' ? 'dashboard-candidato' : 'dashboard-recrutador')}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, fontWeight: 600 }}
            >
              Meu Painel
            </button>
          )}
          <button
            onClick={() => {
              if (user && ['RECRUITER', 'RECRUITER_INSTRUCTOR', 'ADMIN'].includes(user.role)) {
                navigate(user.role === 'ADMIN' ? 'admin' : 'dashboard-recrutador');
              } else {
                navigate('login');
              }
            }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, fontWeight: 600 }}
          >
            Portal do Recrutador
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#1e3a6e", marginBottom: 24 }}>Detalhes da vaga</h2>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", gap: 28 }}>
          {/* Sidebar */}
          {!isMobile && (
            <div>
              {[
                { title: "TIPO DE VAGA", key: "types", options: ["Remoto", "Presencial", "Híbrido"] },
                { title: "NÍVEL", key: "levels", options: ["Estágio", "Júnior", "Pleno", "Sênior"] },
                { title: "LOCALIZAÇÃO", key: "locations", options: ["São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", "Florianópolis, SC", "Porto Alegre, RS", "Campinas, SP", "Recife, PE", "Salvador, BA", "Manaus, AM", "Brasília, DF", "Goiânia, GO"] }
              ].map(section => (
                <div key={section.title} style={{ background: "white", border: "1px solid #e8edf2", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 1, margin: "0 0 10px", textTransform: "uppercase" }}>{section.title}</h4>
                  {section.options.map(opt => (
                    <label
                      key={opt}
                      onClick={() => navigate('vagas', { filters: { [section.key]: [opt] } })}
                      style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8, fontSize: 13 }}
                    >
                      <input type="checkbox" style={{ cursor: "pointer", pointerEvents: 'none' }} readOnly />
                      <span style={{ color: "#1e4a8a", fontWeight: 500 }}>{opt}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Main content */}
          <div>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8edf2", padding: isMobile ? 24 : 28 }}>
              {/* Header bar */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, gap: 8, flexWrap: "wrap" }}>
                <button aria-label="Compartilhar vaga" style={{ background: "none", border: "1px solid #d0d8e4", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555" }}>
                  Compartilhar
                </button>
                <button
                  aria-label={isSaved ? "Remover vaga salva" : "Salvar vaga"}
                  onClick={() => user ? toggleSaveJob(job.id) : navigate("login")}
                  style={{ background: "none", border: "1px solid #d0d8e4", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: isSaved ? "#1e4a8a" : "#555" }}>
                  {isSaved ? "Salvo" : "Salvar"}
                </button>
              </div>

              {/* Job header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#1e4a8a", margin: "0 0 4px" }}>{job.title}</h2>
                  {typeof job.company === 'object' && job.company?.id && (
                    <button
                      onClick={() => navigate('empresa', job.company)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, color: '#2a7ec8', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      🏢 {job.company.name} <span style={{ fontSize: 11, color: '#9ca3af' }}>→ ver empresa</span>
                    </button>
                  )}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#555" }}>Local: {job.location || 'A definir'}</span>
                    <span style={{ fontSize: 13, color: "#555" }}>Nível: {job.level}</span>
                    {job.type && <span style={{ fontSize: 13, color: "#555" }}>Modalidade: {job.type}</span>}
                    {job.contract && <span style={{ fontSize: 13, color: "#555" }}>Contrato: {job.contract}</span>}
                    {job.salary && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#276749', background: '#f0ffe4', borderRadius: 20, padding: '3px 10px' }}>
                        💰 {job.salary}
                      </span>
                    )}
                    {(job.isFreelance || job.contract === 'Freelance') && (
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#f5f3ff', color: '#7c3aed' }}>
                        Freelance
                      </span>
                    )}
                  </div>

                  {(job.isFreelance || job.contract === 'Freelance') && (job.freelanceDuration || job.freelancePaymentType || job.freelanceHoursPerWeek) && (
                    <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {job.freelanceDuration && (
                        <div style={{ fontSize: 12.5 }}>
                          <span style={{ color: '#7c3aed', fontWeight: 700 }}>Duração: </span>
                          <span style={{ color: '#4c1d95' }}>{job.freelanceDuration}</span>
                        </div>
                      )}
                      {job.freelancePaymentType && (
                        <div style={{ fontSize: 12.5 }}>
                          <span style={{ color: '#7c3aed', fontWeight: 700 }}>Pagamento: </span>
                          <span style={{ color: '#4c1d95' }}>{{ POR_HORA: 'Por hora', VALOR_FIXO: 'Valor fixo', POR_ENTREGA: 'Por entrega' }[job.freelancePaymentType] || job.freelancePaymentType}</span>
                        </div>
                      )}
                      {job.freelanceHoursPerWeek && (
                        <div style={{ fontSize: 12.5 }}>
                          <span style={{ color: '#7c3aed', fontWeight: 700 }}>Horas/semana: </span>
                          <span style={{ color: '#4c1d95' }}>{job.freelanceHoursPerWeek}h</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!isMobile && (
                  <div
                    onClick={() => { const co = typeof job.company === 'object' && job.company; if (co?.id) navigate('empresa', co) }}
                    style={{ width: 72, height: 72, borderRadius: 12, background: job.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 14, flexShrink: 0, overflow: 'hidden', cursor: typeof job.company === 'object' && job.company?.id ? 'pointer' : 'default' }}
                  >
                    {job.logo && (job.logo.startsWith('http') || job.logo.startsWith('/'))
                      ? <img src={job.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : job.logo
                    }
                  </div>
                )}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e8edf2", margin: "20px 0" }} />

              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16 }}>Detalhes da vaga</h3>

              {job.description && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: "#555", fontSize: 13.5, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {job.description}
                  </p>
                </div>
              )}

              {[
                { title: "Responsabilidades", items: job.responsibilities },
                { title: "Requisitos", items: job.requirements },
                { title: "O que oferecemos", items: job.benefits },
              ].filter(s => s.items && s.items.length > 0).map(section => (
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
                {job.contract && <span style={{ color: "#555" }}>Regime: {job.contract}</span>}
              </div>

              <button onClick={handleStartApply} disabled={isApplied} style={{
                background: isApplied ? "#38a169" : "linear-gradient(135deg, #1e4a8a, #4a9edd)",
                color: "white", border: "none", borderRadius: 10,
                padding: "14px 28px", cursor: isApplied ? "default" : "pointer",
                fontWeight: 700, fontSize: 14, width: isMobile ? "100%" : "auto",
                transition: 'background 0.3s ease',
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 2000, padding: isMobile ? 0 : "20px" }}>
          <div style={{ background: "white", borderRadius: isMobile ? "20px 20px 0 0" : 20, padding: isMobile ? 24 : 36, maxWidth: isMobile ? "100%" : 560, width: "100%", maxHeight: isMobile ? 'calc(100vh - 60px)' : '90vh', overflowY: 'auto', boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

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
                  <button onClick={() => setApplyStep(2)} style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', color: 'white', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — CV */}
            {applyStep === 2 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a6e', marginTop: 0, marginBottom: 6 }}>Currículo</h3>
                <p style={{ fontSize: 13, color: '#778899', marginTop: 0, marginBottom: 20 }}>
                  {profileResume?.fileName
                    ? 'Seu currículo já está salvo. Você pode mantê-lo ou enviar um novo.'
                    : 'Opcional — envie seu CV em PDF (máx. 5MB). Recrutadores poderão visualizá-lo.'}
                </p>

                {profileResume === null && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: '#778899', fontSize: 13 }}>
                    Carregando...
                  </div>
                )}

                {profileResume !== null && profileResume.fileName && cvAction === 'keep' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#f0fdf4', borderRadius: 12, marginBottom: 16, border: '1px solid #86efac' }}>
                    <span style={{ fontSize: 30 }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d', marginBottom: 2 }}>Currículo salvo</div>
                      <div style={{ fontSize: 12, color: '#556677', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileResume.fileName}</div>
                    </div>
                    <button
                      onClick={() => { setCvAction('upload'); setCvNewFile(null); }}
                      style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, background: '#eff6ff', color: '#1e4a8a', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                    >
                      Trocar PDF
                    </button>
                  </div>
                )}

                {profileResume !== null && (profileResume.fileName === null || cvAction === 'upload') && (
                  <div>
                    {cvAction === 'upload' && profileResume.fileName && (
                      <button
                        onClick={() => { setCvAction('keep'); setCvNewFile(null); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#778899', fontSize: 13, marginBottom: 12, padding: 0 }}
                      >
                        ← Cancelar troca
                      </button>
                    )}
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, border: `2px dashed ${cvNewFile ? '#1e4a8a' : '#c7d9f0'}`, borderRadius: 12, padding: '20px', cursor: cvUploading ? 'default' : 'pointer', background: cvNewFile ? '#eff6ff' : '#f8fafc', marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>📎</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e4a8a' }}>
                          {cvNewFile ? cvNewFile.name : 'Selecionar PDF'}
                        </div>
                        <div style={{ fontSize: 12, color: '#778899' }}>Somente PDF · máx. 5MB</div>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        disabled={cvUploading}
                        onChange={e => { if (e.target.files[0]) setCvNewFile(e.target.files[0]); e.target.value = ''; }}
                      />
                    </label>
                    {cvNewFile && (
                      <button
                        onClick={() => setCvNewFile(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12, padding: 0, marginBottom: 4 }}
                      >
                        Remover arquivo
                      </button>
                    )}
                  </div>
                )}

                {cvUploading && cvUploadProgress > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#556677', marginBottom: 4 }}>
                      <span>Enviando...</span><span>{cvUploadProgress}%</span>
                    </div>
                    <div style={{ background: '#e0eaf4', borderRadius: 8, height: 8 }}>
                      <div style={{ width: `${cvUploadProgress}%`, background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', height: 8, borderRadius: 8, transition: 'width 0.2s' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setApplyStep(1)} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Voltar
                  </button>
                  <button
                    onClick={handleProceedFromCV}
                    disabled={cvUploading || (cvAction === 'upload' && !cvNewFile && !profileResume?.fileName)}
                    style={{
                      background: (cvUploading || (cvAction === 'upload' && !cvNewFile && !profileResume?.fileName)) ? '#aaa' : 'linear-gradient(135deg, #1e4a8a, #4a9edd)',
                      color: 'white', border: 'none', borderRadius: 24, padding: '11px 24px',
                      cursor: (cvUploading || (cvAction === 'upload' && !cvNewFile && !profileResume?.fileName)) ? 'default' : 'pointer',
                      fontWeight: 700, fontSize: 13,
                    }}
                  >
                    {cvUploading ? 'Enviando...' : (hasQuestions ? 'Próximo' : 'Revisar e enviar')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Screening Questions */}
            {applyStep === 3 && hasQuestions && (
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

                        {/* MULTIPLE_CHOICE — múltipla seleção com checkboxes */}
                        {q.type === 'MULTIPLE_CHOICE' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(q.options || []).map(opt => {
                              const selected = answers[q.id]?.optionIds || []
                              const isChecked = selected.includes(opt.id)
                              const toggleOption = () => {
                                const next = isChecked
                                  ? selected.filter(id => id !== opt.id)
                                  : [...selected, opt.id]
                                setAnswer(q.id, { optionIds: next })
                              }
                              return (
                                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: isChecked ? '2px solid #1e4a8a' : '1.5px solid #e8edf2', background: isChecked ? '#e8f2fc' : 'white' }}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={toggleOption}
                                    style={{ accentColor: '#1e4a8a', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: 13, color: '#334' }}>{opt.label}</span>
                                </label>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setApplyStep(2)} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
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

                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', border: '1px solid #e8edf2', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#778899', marginBottom: 6, textTransform: 'uppercase' }}>Currículo</div>
                  {profileResume?.fileName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                      📄 {profileResume.fileName}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: '#778899' }}>Não anexado</div>
                  )}
                </div>

                {hasQuestions && (
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', border: '1px solid #e8edf2', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#778899', marginBottom: 12, textTransform: 'uppercase' }}>Respostas</div>
                    {questions.map((q, idx) => {
                      const a = answers[q.id];
                      let answerText = 'Não respondida';
                      if (a) {
                        if (q.type === 'TEXT') {
                          answerText = a.textAnswer?.trim() || 'Não respondida';
                        } else if (q.type === 'MULTIPLE_CHOICE') {
                          const selected = (a.optionIds || [])
                            .map(id => (q.options || []).find(o => o.id === id)?.label)
                            .filter(Boolean);
                          answerText = selected.length ? selected.join(', ') : 'Não respondida';
                        } else if (a.optionId) {
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
                  <button onClick={() => setApplyStep(hasQuestions ? 3 : 2)} style={{ background: '#f0f4f8', color: '#556677', border: 'none', borderRadius: 24, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
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

      {/* Success / Duplicate Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: isMobile ? 28 : 40, maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: isDuplicateApply ? '#fef9c3' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: isDuplicateApply ? '#ca8a04' : '#22c55e' }}>
              {isDuplicateApply ? '\u2139' : '\u2713'}
            </div>
            {isDuplicateApply ? (
              <>
                <h2 style={{ color: "#1e3a6e", marginBottom: 8 }}>Voc\u00ea j\u00e1 se candidatou!</h2>
                <p style={{ color: "#555", marginBottom: 24, fontSize: 14 }}>Sua candidatura para esta vaga j\u00e1 havia sido registrada anteriormente.</p>
              </>
            ) : (
              <>
                <h2 style={{ color: "#1e3a6e", marginBottom: 8 }}>Candidatura enviada!</h2>
                <p style={{ color: "#555", marginBottom: 24, fontSize: 14 }}>Boa sorte! A empresa entrar\u00e1 em contato em breve.</p>
              </>
            )}
            <button onClick={() => setShowModal(false)} style={{ background: "linear-gradient(135deg, #1e4a8a, #4a9edd)", color: "white", border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 700 }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
