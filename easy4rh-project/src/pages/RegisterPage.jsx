import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegisterPage({ navigate }) {
  const { register } = useAuth();
  const [role, setRole] = useState("CANDIDATE");
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", password: "", phone: "", location: "", currentRole: "", cv: null });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email obrigatório";
    if (!form.firstName) e.firstName = "Nome obrigatório";
    if (!form.password || form.password.length < 8) e.password = "Senha precisa ter pelo menos 8 caracteres";
    if (role === "CANDIDATE" && !form.phone) e.phone = "Celular obrigatório";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    const result = await register({ email: form.email, password: form.password, role, name: `${form.firstName} ${form.lastName}`.trim(), phone: form.phone });
    if (!result.success) { setErrors({ general: result.message }); setLoading(false); return; }
    setLoading(false);
    const r = result.user?.role
    const isRecruiterSide = ['RECRUITER', 'INSTRUCTOR', 'RECRUITER_INSTRUCTOR', 'ADMIN'].includes(r)
    navigate(isRecruiterSide ? 'dashboard-recrutador' : 'dashboard-candidato')
  };

  const inputStyle = (field) => ({
    width: "100%", border: `1px solid ${errors[field] ? "#e53e3e" : "#d0d8e4"}`,
    borderRadius: 10, padding: "13px 16px", fontSize: 14, outline: "none",
    boxSizing: "border-box", background: "white"
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <Navbar navigate={navigate} page="register" />

      <div style={{ flex: 1 }}>
        <div style={{ background: "linear-gradient(135deg, #1e3a6e, #2a5298, #4a9edd)", padding: "40px 20px 60px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ color: "rgba(255,255,255,0.9)", fontSize: 36, fontWeight: 800, margin: 0 }}>
              Encontre sua próxima <span style={{ color: "white" }}>oportunidade</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Explore centenas de vagas nas melhores redes de varejo do Brasil</p>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "40px auto", padding: "0 20px" }}>
          {success ? (
            <div style={{ background: "#e8fdf0", border: "2px solid #38a169", borderRadius: 16, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 56 }}>✅</div>
              <h2 style={{ color: "#38a169" }}>Cadastro realizado com sucesso!</h2>
              <p style={{ color: "#555" }}>Redirecionando para o painel...</p>
            </div>
          ) : (
            <div style={{ background: "#f0f4f8", borderRadius: 16, padding: 40 }}>
              <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#1e3a6e", marginTop: 0, marginBottom: 32 }}>
                Inscreva-se no <span style={{ color: "#4a9edd" }}>EASY</span><span style={{ color: "#1e3a6e" }}>4</span><span style={{ color: "#4a9edd" }}>RH</span>
              </h2>
              <div style={{ background: "white", borderRadius: 12, padding: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginTop: 0, marginBottom: 20 }}>Registre-se</h3>

                {/* Role toggle */}
                <div style={{ display: "flex", background: "#f0f4f8", borderRadius: 10, padding: 4, marginBottom: 20 }}>
                  {[
                    { value: "CANDIDATE", label: "Candidato" },
                    { value: "RECRUITER", label: "Recrutador" },
                    { value: "INSTRUCTOR", label: "Instrutor" },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => { setRole(opt.value); setErrors({}); }}
                      style={{
                        flex: 1, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                        fontSize: 13.5, fontWeight: role === opt.value ? 700 : 500, transition: "all 0.2s",
                        background: role === opt.value ? "white" : "transparent",
                        color: role === opt.value ? "#1e4a8a" : "#778899",
                        boxShadow: role === opt.value ? "0 2px 8px rgba(30,74,138,0.1)" : "none",
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {errors.general && (
                  <div style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", color: "#c00", fontSize: 13, marginBottom: 16 }}>
                    {errors.general}
                  </div>
                )}

                <div style={{ marginBottom: 14 }}>
                  <input type="email" placeholder="Endereço de email" value={form.email} onChange={e => update("email", e.target.value)} style={inputStyle("email")} />
                  {errors.email && <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <input placeholder="Primeiro nome" value={form.firstName} onChange={e => update("firstName", e.target.value)} style={inputStyle("firstName")} />
                    {errors.firstName && <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 4 }}>{errors.firstName}</div>}
                  </div>
                  <input placeholder="Sobrenome" value={form.lastName} onChange={e => update("lastName", e.target.value)} style={inputStyle("lastName")} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <input type="password" placeholder="Criar senha (mínimo 8 caracteres)" value={form.password} onChange={e => update("password", e.target.value)} style={inputStyle("password")} />
                  {errors.password && <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
                </div>

                {role === "CANDIDATE" && (
                  <>
                    <div style={{ marginBottom: 14 }}>
                      <input placeholder="Número de celular" value={form.phone} onChange={e => update("phone", e.target.value)} style={inputStyle("phone")} />
                      {errors.phone && <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <input placeholder="Localização" value={form.location} onChange={e => update("location", e.target.value)} style={inputStyle("location")} />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <input placeholder="Cargo atual/recente" value={form.currentRole} onChange={e => update("currentRole", e.target.value)} style={inputStyle("currentRole")} />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{
                        display: "inline-block", border: "1px solid #d0d8e4",
                        borderRadius: 10, padding: "10px 20px", cursor: "pointer",
                        background: "white", fontSize: 13.5, color: "#555", fontWeight: 500
                      }}>
                        Carregue seu CV
                        <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => update("cv", e.target.files[0])} />
                      </label>
                      {form.cv && <span style={{ fontSize: 12.5, color: "#38a169", marginLeft: 10 }}>{form.cv.name}</span>}
                    </div>
                  </>
                )}

                {role === "RECRUITER" && (
                  <div style={{ background: "#f0f8ff", borderRadius: 10, padding: "16px", marginBottom: 20, border: "1px solid #d0e4f4" }}>
                    <p style={{ fontSize: 13, color: "#1e4a8a", margin: 0, fontWeight: 600 }}>
                      Após o cadastro, você poderá vincular ou criar sua empresa no painel do recrutador.
                    </p>
                  </div>
                )}

                {role === "INSTRUCTOR" && (
                  <div style={{ background: "#f0fff4", borderRadius: 10, padding: "16px", marginBottom: 20, border: "1px solid #b2e4c8" }}>
                    <p style={{ fontSize: 13, color: "#276749", margin: 0, fontWeight: 600 }}>
                      Como instrutor, você poderá criar cursos, adicionar aulas com vídeos e acompanhar o progresso dos alunos.
                    </p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={loading} style={{
                  background: "linear-gradient(135deg, #1e4a8a, #4a9edd)",
                  opacity: loading ? 0.6 : 1,
                  color: "white", border: "none", borderRadius: 10,
                  padding: "14px 32px", cursor: loading ? "default" : "pointer",
                  fontWeight: 700, fontSize: 14, transition: "opacity 0.2s"
                }}>
                  {loading ? "Registrando..." : role === "RECRUITER" ? "Criar conta de recrutador" : role === "INSTRUCTOR" ? "Criar conta de instrutor" : "Criar conta"}
                </button>

                <p style={{ fontSize: 12.5, color: "#888", marginTop: 14 }}>
                  Já tem conta?{" "}
                  <button onClick={() => navigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontWeight: 600, fontSize: 12.5 }}>
                    Faça login
                  </button>
                </p>

                <p style={{ fontSize: 12, color: "#555", marginTop: 16 }}>
                  Ao continuar, você concorda com os{" "}
                  <span style={{ color: "#4a9edd", cursor: "pointer" }}>Termos de Serviço</span>
                  {" "}e a{" "}
                  <span style={{ color: "#4a9edd", cursor: "pointer" }}>Política de Privacidade.</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer navigate={navigate} />

    </div>
  );
}
