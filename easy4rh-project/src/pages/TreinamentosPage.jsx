import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";

const categoryColors = {
  Gestão: "#1e4a8a", Marketing: "#9b2c8a", Operações: "#c05621", Vendas: "#276749",
  RH: "#2c5282", "E-commerce": "#2d3748"
};

export default function TreinamentosPage({ navigate }) {
  const { courses, coursesLoading } = useJobs();
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a6e 0%, #2a5298 60%, #4a9edd 100%)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Capacite-se</p>
          <h1 style={{ color: "white", fontSize: 38, fontWeight: 800, marginBottom: 12 }}>Treinamentos para o Varejo</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            Desenvolva suas habilidades com cursos especializados no setor varejista, criados por especialistas do mercado.
          </p>
        </div>
      </div>

      {/* Individual/Corporate options */}
      <div style={{ background: "#f8fafc", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#1e3a6e", marginBottom: 8 }}>Escolha o Caminho ideal para você.</h2>
          <p style={{ textAlign: "center", color: "#666", marginBottom: 36, fontSize: 14 }}>Conte com a Easy4RH para o desenvolvimento que o seu momento pede, com clareza, foco e resultado.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
            {[
              {
                title: "Consultoria para Empresas",
                icon: "🏢",
                items: ["Diagnóstico de RH completo", "Estruturação de processos seletivos", "Políticas de gestão de pessoas", "Acompanhamento mensal de KPIs"],
                cta: "Fale com um especialista",
                dark: true
              },
              {
                title: "Desenvolvimento Pessoal",
                icon: "🎯",
                items: ["Cursos 100% online", "Certificado digital ao concluir", "Conteúdo prático do varejo", "Acesso vitalício ao material"],
                cta: "Ver cursos disponíveis",
                dark: false
              }
            ].map(card => (
              <div key={card.title} style={{
                background: card.dark ? "linear-gradient(135deg, #1e3a6e, #2a5298)" : "white",
                borderRadius: 20, padding: "32px 28px",
                border: card.dark ? "none" : "1px solid #e8edf2",
                boxShadow: "0 4px 20px rgba(30,74,138,0.08)"
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: card.dark ? "white" : "#1e3a6e", marginBottom: 16 }}>{card.title}</h3>
                <ul style={{ margin: "0 0 24px", paddingLeft: 20 }}>
                  {card.items.map(item => (
                    <li key={item} style={{ color: card.dark ? "rgba(255,255,255,0.8)" : "#555", fontSize: 13.5, marginBottom: 8, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
                <button onClick={() => navigate("login")} style={{
                  background: card.dark ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg, #1e4a8a, #4a9edd)",
                  color: card.dark ? "white" : "white",
                  border: card.dark ? "1px solid rgba(255,255,255,0.3)" : "none",
                  borderRadius: 10, padding: "11px 22px", cursor: "pointer", fontWeight: 700, fontSize: 13
                }}>
                  {card.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Courses grid */}
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e3a6e", marginBottom: 24 }}>Cursos Disponíveis</h2>
          {coursesLoading ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#778899", fontSize: 14 }}>Carregando cursos...</div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#778899", fontSize: 14 }}>Nenhum curso disponível no momento.</div>
          ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {courses.map(course => (
              <div key={course.id} style={{
                background: "white", borderRadius: 16, border: "1px solid #e8edf2",
                overflow: "hidden", boxShadow: "0 4px 16px rgba(30,74,138,0.06)",
                transition: "all 0.2s", cursor: "pointer"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(30,74,138,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(30,74,138,0.06)"; }}>

                {/* Card header */}
                <div style={{ background: `linear-gradient(135deg, ${categoryColors[course.category] || "#1e4a8a"}22, ${categoryColors[course.category] || "#1e4a8a"}11)`, padding: "24px 20px 20px", borderBottom: "1px solid #e8edf2" }}>
                  <span style={{
                    background: categoryColors[course.category] || "#1e4a8a", color: "white",
                    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, marginBottom: 12, display: "inline-block"
                  }}>
                    {course.category}
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a6e", margin: "0 0 8px" }}>{course.title}</h3>
                  <p style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5, margin: 0 }}>{course.description}</p>
                </div>

                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#555" }}>⏱️ {course.duration}</span>
                    <span style={{ fontSize: 12, color: "#555" }}>📊 {course.level}</span>
                    <span style={{ fontSize: 12, color: "#555" }}>👥 {(course.students || 0).toLocaleString()} alunos</span>
                    {course.rating > 0 && <span style={{ fontSize: 12, color: "#f59e0b" }}>{"⭐".repeat(Math.floor(course.rating))} {course.rating}</span>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <button onClick={() => navigate(user ? `curso-${course.id}` : "login")} style={{
                      background: "linear-gradient(135deg, #1e4a8a, #4a9edd)", color: "white",
                      border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 12.5
                    }}>
                      {user ? "Ver curso" : "Inscrever-se"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
