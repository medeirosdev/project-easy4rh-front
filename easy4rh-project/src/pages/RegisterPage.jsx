import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage({ navigate }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", password: "", phone: "", location: "", currentRole: "", cv: null });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email obrigatório";
    if (!form.firstName) e.firstName = "Nome obrigatório";
    if (!form.password || form.password.length < 5) e.password = "Senha precisa ter pelo menos 5 caracteres";
    if (!form.phone) e.phone = "Celular obrigatório";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    register({ email: form.email, name: `${form.firstName} ${form.lastName}`, phone: form.phone });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("home"), 1500);
  };

  const inputStyle = (field) => ({
    width: "100%", border: `1px solid ${errors[field] ? "#e53e3e" : "#d0d8e4"}`,
    borderRadius: 8, padding: "13px 16px", fontSize: 14, outline: "none",
    boxSizing: "border-box", background: "white"
  });

  return (
    <div>
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
            <p style={{ color: "#555" }}>Redirecionando para a home...</p>
          </div>
        ) : (
          <div style={{ background: "#f0f4f8", borderRadius: 16, padding: 40 }}>
            <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#1e3a6e", marginTop: 0, marginBottom: 32 }}>
              Inscreva-se no <span style={{ color: "#4a9edd" }}>EASY</span><span style={{ color: "#1e3a6e" }}>4</span><span style={{ color: "#4a9edd" }}>RH</span>
            </h2>
            <div style={{ background: "white", borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginTop: 0, marginBottom: 20 }}>Registre-se</h3>

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
                <input type="password" placeholder="Criar senha (precisa ter 5 caracteres)" value={form.password} onChange={e => update("password", e.target.value)} style={inputStyle("password")} />
                {errors.password && <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
              </div>

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
                  borderRadius: 8, padding: "10px 20px", cursor: "pointer",
                  background: "white", fontSize: 13.5, color: "#555", fontWeight: 500
                }}>
                  📎 Carregue seu CV
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => update("cv", e.target.files[0])} />
                </label>
                {form.cv && <span style={{ fontSize: 12.5, color: "#38a169", marginLeft: 10 }}>✅ {form.cv.name}</span>}
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{
                background: loading ? "#aaa" : "linear-gradient(135deg, #1e4a8a, #4a9edd)",
                color: "white", border: "none", borderRadius: 10,
                padding: "14px 32px", cursor: loading ? "default" : "pointer",
                fontWeight: 700, fontSize: 14, transition: "all 0.2s"
              }}>
                {loading ? "Registrando..." : "Criar conta"}
              </button>

              <p style={{ fontSize: 12.5, color: "#888", marginTop: 14 }}>
                Já tem conta?{" "}
                <button onClick={() => navigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e4a8a", fontWeight: 600, fontSize: 12.5 }}>
                  Faça login
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
