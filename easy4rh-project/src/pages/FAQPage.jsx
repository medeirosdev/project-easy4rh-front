import { useState } from "react";

const faqData = [
  {
    section: "Sobre a Plataforma",
    items: [
      { q: "Como funciona a plataforma?", a: "Após a compra, você recebe acesso imediato à plataforma, onde poderá assistir aos vídeos do curso adquirido e acessar os materiais complementares, tudo de forma online e segura." },
      { q: "Os cursos são presenciais ou online?", a: "Todos os cursos são 100% online, permitindo que você estude no seu ritmo, de onde estiver e no horário que for mais conveniente." },
      { q: "Por quanto tempo terei acesso ao curso?", a: "O acesso varia conforme o curso adquirido. Essa informação estará sempre descrita na página do curso antes da compra." },
    ]
  },
  {
    section: "Sobre os Cursos",
    items: [
      { q: "Os cursos são para pessoas físicas ou empresas?", a: "Temos cursos voltados para desenvolvimento pessoal e também soluções específicas para empresas e equipes. Você pode escolher o que melhor se encaixa no seu momento ou na realidade do seu negócio." },
      { q: "Os cursos possuem certificado?", a: "Sim. Ao concluir o curso, você poderá emitir seu certificado diretamente pela plataforma." },
      { q: "Preciso ter conhecimento prévio para fazer os cursos?", a: "Não. Os cursos são estruturados para atender desde iniciantes até pessoas que já possuem experiência na área." },
    ]
  },
  {
    section: "Suporte e Comunicação",
    items: [
      { q: "Posso tirar dúvidas durante o curso?", a: "Sim. Durante o curso, você poderá enviar suas dúvidas diretamente pela plataforma e nossa equipe estará disponível para te apoiar ao longo do aprendizado." },
      { q: "Em quanto tempo recebo resposta da equipe?", a: "Nosso prazo médio de resposta é de até 2 dias úteis." },
      { q: "Existe acompanhamento ou mentoria?", a: "Alguns cursos e programas incluem acompanhamento ou suporte mais próximo. Essa informação estará detalhada na descrição de cada produto." },
    ]
  },
  {
    section: "Para Empresas",
    items: [
      { q: "A empresa pode contratar cursos para equipes?", a: "Sim. Oferecemos soluções personalizadas para empresas, incluindo acesso para times, trilhas de desenvolvimento e conteúdos sob medida." },
      { q: "Os conteúdos podem ser adaptados à realidade da empresa?", a: "Sim. Para projetos corporativos, realizamos diagnósticos e personalizamos os conteúdos conforme a necessidade do negócio." },
      { q: "É possível acompanhar o desempenho dos colaboradores?", a: "Dependendo do plano contratado, a empresa poderá acompanhar indicadores de engajamento, progresso e conclusão dos cursos." },
    ]
  },
  {
    section: "Pagamento e Acesso",
    items: [
      { q: "Quais formas de pagamento são aceitas?", a: "Aceitamos as principais formas de pagamento, como cartão de crédito, boleto e Pix." },
      { q: "Posso parcelar a compra?", a: "Sim, o parcelamento está disponível conforme as condições exibidas no momento da compra." },
      { q: "Tive problemas para acessar o curso. O que faço?", a: "Entre em contato com nossa equipe pelo canal de suporte da plataforma que iremos te ajudar o mais rápido possível." },
    ]
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8edf2" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 0", textAlign: "left"
      }}>
        <span style={{ fontSize: 14.5, fontWeight: open ? 600 : 400, color: open ? "#1e4a8a" : "#333" }}>
          {item.q}
        </span>
        <span style={{ color: "#4a9edd", fontSize: 18, fontWeight: 700, marginLeft: 12 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 16, paddingLeft: 0 }}>
          <div style={{ borderLeft: "3px solid #4a9edd", paddingLeft: 16 }}>
            <p style={{ color: "#555", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{item.a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage({ navigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a6e, #2a5298, #4a9edd)", padding: "48px 20px", textAlign: "center" }}>
        <h1 style={{ color: "white", fontSize: 36, fontWeight: 800, margin: 0 }}>Perguntas Frequentes</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 10, fontSize: 15 }}>Encontre respostas para as dúvidas mais comuns</p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px" }}>
        {faqData.map(section => (
          <div key={section.section} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e3a6e", marginBottom: 20, paddingBottom: 10, borderBottom: "2px solid #e8edf2" }}>
              {section.section}
            </h2>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e8edf2", padding: "0 20px" }}>
              {section.items.map((item, i) => <FAQItem key={i} item={item} />)}
            </div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg, #1e4a8a, #4a9edd)", borderRadius: 20, padding: "36px", textAlign: "center", marginTop: 20 }}>
          <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ainda tem dúvidas?</h3>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 20, fontSize: 14 }}>Nossa equipe está pronta para te ajudar!</p>
          <button onClick={() => navigate("login")} style={{
            background: "white", color: "#1e4a8a", border: "none",
            borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14
          }}>
            Fale conosco
          </button>
        </div>
      </div>
    </div>
  );
}
