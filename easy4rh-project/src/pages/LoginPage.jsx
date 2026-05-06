import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Search, GraduationCap, AlertTriangle, FileText, BarChart2, Trophy, Users } from '../utils/icons.jsx'
import { authApi } from "../services/api";

export default function LoginPage({ navigate, initialTab }) {
  const { login, loginRecruiter, loginInstructor } = useAuth();
  const [tab, setTab] = useState(initialTab || "candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState("input");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleForgotSubmit = async () => {
    if (!forgotEmail) { setForgotError("Informe seu e-mail."); return; }
    setForgotLoading(true);
    setForgotError("");
    try {
      await authApi.requestPasswordReset(forgotEmail);
      setForgotStep("sent");
    } catch (err) {
      setForgotError(err.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => { setForgotOpen(false); setForgotStep("input"); setForgotEmail(""); setForgotError(""); };

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    const fn = tab === "candidate" ? login : tab === "instructor" ? loginInstructor : loginRecruiter;
    const result = await fn(email, password);
    setLoading(false);
    if (result.success) {
      const r = result.user?.role
      const isRecruiterSide = ['RECRUITER', 'RECRUITER_INSTRUCTOR', 'INSTRUCTOR', 'ADMIN'].includes(r)
      navigate(isRecruiterSide ? 'dashboard-recrutador' : 'dashboard-candidato')
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a6e, #2a5298, #4a9edd)", padding: "40px 20px 60px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 4, marginBottom: 16, maxWidth: 700 }}>
            <input placeholder="Palavras-chave/cargo" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
            <input placeholder="Localidade" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
            <input placeholder="Distância" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
            <button onClick={() => navigate("vagas")} style={{ background: "#1e3a6e", color: "white", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Procurar</button>
          </div>
          <h1 style={{ color: "rgba(255,255,255,0.9)", fontSize: 38, fontWeight: 800, margin: 0 }}>
            Encontre sua próxima <span style={{ color: "white" }}>oportunidade</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Explore centenas de vagas nas melhores redes de varejo do Brasil</p>
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ background: "white", borderBottom: "1px solid #e8edf2", textAlign: "center", padding: "12px 20px" }}>
        {[
          { label: "Login",           action: () => { setTab("candidate"); } },
          { label: "Registre seu CV", action: () => navigate("register") },
          { label: "Recrutamento",    action: () => { setTab("recruiter"); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
          { label: "Instrutor",       action: () => { setTab("instructor"); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
        ].map((item) => (
          <button key={item.label} onClick={item.action} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13.5, fontWeight: 600, margin: "0 16px" }}>
            {item.label}
          </button>
        ))}
      </div>

      {/* Login Card */}
      <div style={{ maxWidth: 880, margin: "40px auto", padding: "0 20px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: 0, borderBottom: "2px solid #e8edf2" }}>
          {[
            { key: "candidate", label: "Login" },
            { key: "recruiter", label: "Recrutador" },
            { key: "instructor", label: "Instrutor" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 28px", fontSize: 15, fontWeight: 600,
              color: tab === t.key ? "#1e4a8a" : "#888",
              borderBottom: tab === t.key ? "2px solid #1e4a8a" : "2px solid transparent",
              marginBottom: -2, transition: "all 0.2s"
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#f0f4f8", borderRadius: "0 16px 16px 16px", padding: "36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          {/* Form */}
          <div>
            {error && (
              <div style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", color: "#c00", fontSize: 13, marginBottom: 16 }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><AlertTriangle size={14} /> {error}</span>
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <input
                type="email" placeholder="Endereço de email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", border: "1px solid #d0d8e4", borderRadius: 8, padding: "13px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "white" }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", border: "1px solid #d0d8e4", borderRadius: 8, padding: "13px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "white" }}
              />
            </div>
            <button onClick={() => setForgotOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, marginBottom: 20 }}>
              Esqueceu sua senha?
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{
              background: loading ? "#aaa" : "linear-gradient(135deg, #3a7bd5, #5ba4e6)",
              color: "white", border: "none", borderRadius: 10, padding: "13px 30px",
              cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 14
            }}>
              {loading ? "Entrando..." : "Login"}
            </button>
          </div>

          {/* Right side */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e4a8a", marginTop: 0, marginBottom: 20 }}>
              {tab === "candidate" ? "Ainda não registrado?" : tab === "instructor" ? "Quer criar cursos?" : "Quer anunciar vagas?"}
            </h3>
            <p style={{ color: "#555", fontSize: 13.5, marginBottom: 24 }}>
              {tab === "candidate"
                ? "Crie sua conta e encontre oportunidades que combinam com você."
                : tab === "instructor"
                ? "Compartilhe seu conhecimento criando cursos para profissionais do varejo."
                : "Cadastre sua empresa e publique vagas para os melhores candidatos do varejo."}
            </p>
            {tab === "candidate" ? (
              <>
                {[
                  { icon: <Search size={20} />, title: "Busque vagas com facilidade", desc: "Encontre oportunidades de acordo com seu perfil." },
                  { icon: <FileText size={20} />, title: "Cadastre seu currículo uma única vez", desc: "Candidate-se a várias vagas em poucos cliques." },
                  { icon: "🔔", title: "Receba alertas de vagas", desc: "Seja avisado quando surgirem novas oportunidades." },
                ].map(item => (
                  <div key={item.title} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 2 }}>{item.icon} {item.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666" }}>{item.desc}</div>
                  </div>
                ))}
                <button onClick={() => navigate("register")} style={{
                  background: "#1e3a6e", color: "white", border: "none",
                  borderRadius: 10, padding: "13px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14, marginTop: 8
                }}>
                  Se cadastre
                </button>
              </>
            ) : tab === "instructor" ? (
              <>
                {[
                  { icon: <GraduationCap size={20} />, title: "Crie cursos completos", desc: "Monte seções, aulas e faça upload de vídeos." },
                  { icon: <BarChart2 size={20} />, title: "Acompanhe seus alunos", desc: "Veja progresso, taxas de conclusão e matrículas." },
                  { icon: <Trophy size={20} />, title: "Emita certificados", desc: "Alunos recebem certificado digital ao concluir." },
                ].map(item => (
                  <div key={item.title} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 2 }}>{item.icon} {item.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666" }}>{item.desc}</div>
                  </div>
                ))}
                <button onClick={() => navigate("register")} style={{
                  background: "#1e3a6e", color: "white", border: "none",
                  borderRadius: 10, padding: "13px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14, marginTop: 8
                }}>
                  Criar conta de instrutor
                </button>
              </>
            ) : (
              <>
                {[
                  { icon: "📢", title: "Publique vagas gratuitamente", desc: "Alcance candidatos qualificados do setor varejista." },
                  { icon: <Users size={20} />, title: "Gerencie candidaturas", desc: "Acompanhe todos os candidatos em um só lugar." },
                  { icon: "⚡", title: "Contrate mais rápido", desc: "Filtros inteligentes para encontrar o perfil certo." },
                ].map(item => (
                  <div key={item.title} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 2 }}>{item.icon} {item.title}</div>
                    <div style={{ fontSize: 12.5, color: "#666" }}>{item.desc}</div>
                  </div>
                ))}
                <button onClick={() => navigate("register")} style={{
                  background: "#1e3a6e", color: "white", border: "none",
                  borderRadius: 10, padding: "13px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14, marginTop: 8
                }}>
                  Cadastrar empresa
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {forgotOpen && (
        <div onClick={closeForgot} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {forgotStep === "sent" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a6e", marginBottom: 8 }}>E-mail enviado!</h3>
                <p style={{ fontSize: 14, color: "#556677", marginBottom: 24 }}>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                <button onClick={closeForgot} style={{ background: "#1e3a6e", color: "white", border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Fechar</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a6e", marginBottom: 8, marginTop: 0 }}>Redefinir senha</h3>
                <p style={{ fontSize: 13.5, color: "#556677", marginBottom: 20 }}>Informe seu e-mail e enviaremos um link para redefinir sua senha.</p>
                {forgotError && (
                  <div style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", color: "#c00", fontSize: 13, marginBottom: 16 }}>{forgotError}</div>
                )}
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleForgotSubmit()}
                  style={{ width: "100%", border: "1px solid #d0d8e4", borderRadius: 8, padding: "13px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={closeForgot} style={{ flex: 1, background: "#f0f4f8", color: "#556677", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancelar</button>
                  <button onClick={handleForgotSubmit} disabled={forgotLoading} style={{ flex: 1, background: forgotLoading ? "#aaa" : "#1e3a6e", color: "white", border: "none", borderRadius: 10, padding: "12px", cursor: forgotLoading ? "default" : "pointer", fontWeight: 700, fontSize: 14 }}>
                    {forgotLoading ? "Enviando..." : "Enviar link"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
