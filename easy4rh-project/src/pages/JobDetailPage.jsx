import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";

const typeColors = {
  Presencial: { bg: "#e8f4fd", color: "#1e6eab" },
  Remoto: { bg: "#e8fdf0", color: "#1e8a4a" },
  Híbrido: { bg: "#f0e8fd", color: "#6e1eab" }
};

export default function JobDetailPage({ job, navigate }) {
  const { user, savedJobs, toggleSaveJob } = useAuth();
  const { appliedJobs, applyToJob } = useJobs();
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) { navigate("vagas"); return null; }

  const tc = typeColors[job.type] || typeColors.Presencial;
  const isApplied = appliedJobs.includes(job.id) || applied;
  const isSaved = savedJobs.includes(job.id);

  const handleApply = () => {
    if (!user) { navigate("login"); return; }
    applyToJob(job.id);
    setApplied(true);
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #1e3a6e, #2a5298, #4a9edd)", padding: "30px 20px 50px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 4, maxWidth: 700 }}>
            <input placeholder="Palavras-chave/cargo" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
            <input placeholder="Localidade" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
            <input placeholder="Distância" style={{ border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none" }} />
            <button onClick={() => navigate("vagas")} style={{ background: "#1e3a6e", color: "white", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Procurar</button>
          </div>
          <h1 style={{ color: "rgba(255,255,255,0.9)", fontSize: 36, fontWeight: 800, marginTop: 16 }}>
            Encontre sua próxima <span style={{ color: "white" }}>oportunidade</span>
          </h1>
        </div>
      </div>

      <div style={{ background: "white", borderBottom: "1px solid #e8edf2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 20px", display: "flex", gap: 20 }}>
          {["🔐 Login", "📝 Registre seu CV", "🔍 Recrutamento", "🏢 Empresas"].map((item, i) => (
            <button key={i} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13, fontWeight: 600 }}>{item}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#1e3a6e", marginBottom: 24 }}>Detalhes da vaga</h2>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28 }}>
          {/* Sidebar */}
          <div>
            {[
              { title: "TIPO DE VAGA", options: ["Remoto", "Presencial", "Híbrido"] },
              { title: "NÍVEL", options: ["Estágio", "Júnior", "Pleno", "Sênior"] },
              {
                title: "LOCALIZAÇÃO",
                options: ["São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", "Florianópolis, SC", "Porto Alegre, RS", "Campinas, SP", "Recife, PE", "Salvador, BA", "Manaus, AM", "Brasília, DF", "Goiânia, GO"]
              }
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

          {/* Main content */}
          <div>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8edf2", padding: 28 }}>
              {/* Header bar */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <button style={{ background: "none", border: "1px solid #d0d8e4", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555" }}>
                  🔗 Compartilhar
                </button>
                <button onClick={() => user ? toggleSaveJob(job.id) : navigate("login")}
                  style={{ background: "none", border: "1px solid #d0d8e4", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: isSaved ? "#1e4a8a" : "#555" }}>
                  {isSaved ? "🔖 Salvo" : "🔖 Salvar"}
                </button>
              </div>

              {/* Job header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e4a8a", margin: "0 0 8px" }}>{job.title}</h2>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>📍 {job.location}</span>
                    <span style={{ fontSize: 13, color: "#555" }}>🎓 {job.level}</span>
                    <span style={{ fontSize: 13, color: "#2e7d32", fontWeight: 600 }}>💰 {job.salary}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, margin: 0 }}>{job.description}</p>
                </div>
                <div style={{
                  width: 72, height: 72, borderRadius: 12,
                  background: job.logoColor, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 800, color: "white", fontSize: 14,
                  marginLeft: 20, flexShrink: 0
                }}>
                  {job.logo}
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e8edf2", margin: "20px 0" }} />

              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16 }}>Detalhes da vaga</h3>

              <div style={{ marginBottom: 24 }}>
                <p style={{ color: "#555", fontSize: 13.5, lineHeight: 1.7 }}>
                  Estamos em busca de um(a) {job.title} para liderar nossa equipe e garantir a melhor experiência para nossos clientes.
                </p>
              </div>

              {[
                { title: "Responsabilidades", items: job.responsibilities, icon: "📋" },
                { title: "Requisitos", items: job.requirements, icon: "✅" },
                { title: "Diferenciais", items: ["Experiência no varejo da categoria", "Conhecimento em indicadores de desempenho (KPIs)", "Vivência em ambientes dinâmicos"], icon: "⭐" },
                { title: "O que oferecemos", items: job.benefits, icon: "🎁" },
              ].map(section => (
                <div key={section.title} style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>{section.icon} {section.title}</h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {section.items.map((item, i) => (
                      <li key={i} style={{ fontSize: 13.5, color: "#555", marginBottom: 6, lineHeight: 1.6 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, fontSize: 13 }}>
                <span style={{ color: "#555" }}>📍 Local de trabalho: {job.company}</span>
                <span style={{ color: "#555", marginLeft: 16 }}>📄 Regime: CLT</span>
              </div>

              <button onClick={handleApply} disabled={isApplied} style={{
                background: isApplied ? "#38a169" : "linear-gradient(135deg, #1e4a8a, #4a9edd)",
                color: "white", border: "none", borderRadius: 10,
                padding: "14px 28px", cursor: isApplied ? "default" : "pointer",
                fontWeight: 700, fontSize: 14
              }}>
                {isApplied ? "✅ Candidatura enviada!" : "Aplicar para a Vaga"}
              </button>
            </div>

            <button onClick={() => navigate("vagas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontSize: 13.5, fontWeight: 600, marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              ← Voltar para vagas
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 40, maxWidth: 420, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 60 }}>🎉</div>
            <h2 style={{ color: "#1e3a6e", marginBottom: 8 }}>Candidatura enviada!</h2>
            <p style={{ color: "#555", marginBottom: 24 }}>Boa sorte! A empresa entrará em contato em breve.</p>
            <button onClick={() => setShowModal(false)} style={{
              background: "linear-gradient(135deg, #1e4a8a, #4a9edd)", color: "white",
              border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 700
            }}>
              Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
