import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ navigate, initialTab }) {
  const { login, loginRecruiter } = useAuth();
  const [tab, setTab] = useState(initialTab || "candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const fn = tab === "candidate" ? login : loginRecruiter;
    const result = await fn(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'RECRUITER') navigate('dashboard-recrutador')
      else navigate('dashboard-candidato')
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
          { label: "🔐 Login",          action: () => { setTab("candidate"); } },
          { label: "📝 Registre seu CV", action: () => navigate("register") },
          { label: "🔍 Recrutamento",    action: () => { setTab("recruiter"); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
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
          {["candidate", "recruiter"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 28px", fontSize: 15, fontWeight: 600,
              color: tab === t ? "#1e4a8a" : "#888",
              borderBottom: tab === t ? "2px solid #1e4a8a" : "2px solid transparent",
              marginBottom: -2, transition: "all 0.2s"
            }}>
              {t === "candidate" ? "Login" : "Login do recrutador"}
            </button>
          ))}
        </div>

        <div style={{ background: "#f0f4f8", borderRadius: "0 16px 16px 16px", padding: "36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          {/* Form */}
          <div>
            {error && (
              <div style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 8, padding: "10px 14px", color: "#c00", fontSize: 13, marginBottom: 16 }}>
                ⚠️ {error}
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
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, marginBottom: 20 }}>
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
              {tab === "candidate" ? "Ainda não registrado?" : "Quer anunciar vagas?"}
            </h3>
            <p style={{ color: "#555", fontSize: 13.5, marginBottom: 24 }}>
              {tab === "candidate"
                ? "Crie sua conta e encontre oportunidades que combinam com você."
                : "Cadastre sua empresa e publique vagas para os melhores candidatos do varejo."}
            </p>
            {tab === "candidate" ? (
              <>
                {[
                  { icon: "🔍", title: "Busque vagas com facilidade", desc: "Encontre oportunidades de acordo com seu perfil." },
                  { icon: "📄", title: "Cadastre seu currículo uma única vez", desc: "Candidate-se a várias vagas em poucos cliques." },
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
            ) : (
              <>
                {[
                  { icon: "📢", title: "Publique vagas gratuitamente", desc: "Alcance candidatos qualificados do setor varejista." },
                  { icon: "👥", title: "Gerencie candidaturas", desc: "Acompanhe todos os candidatos em um só lugar." },
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
    </div>
  );
}
