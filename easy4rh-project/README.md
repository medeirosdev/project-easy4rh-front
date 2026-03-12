# Easy4RH — Plataforma de RH para Varejo

## 🚀 Como rodar o projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem com o Node.js)

### Passo a passo

1. Abra o terminal na pasta do projeto
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador: **http://localhost:5173**

---

## 📁 Estrutura do projeto

```
easy4rh/
├── index.html               # HTML principal
├── package.json             # Dependências
├── vite.config.js           # Configuração do Vite
└── src/
    ├── main.jsx             # Ponto de entrada React
    ├── App.jsx              # Roteamento principal
    ├── index.css            # Estilos globais
    ├── data/
    │   └── mockData.js      # Dados mock (substituir pela API)
    ├── context/
    │   ├── AuthContext.jsx  # Autenticação (login, cadastro)
    │   └── JobsContext.jsx  # Vagas e cursos
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── HeroSearch.jsx
    │   ├── JobCard.jsx
    │   └── QuickLinks.jsx
    └── pages/
        ├── HomePage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── VagasPage.jsx
        ├── JobDetailPage.jsx
        ├── TreinamentosPage.jsx
        ├── SobreNosPage.jsx
        └── FAQPage.jsx
```

---

## 🔌 Conectando ao Backend

Para conectar com sua API real, edite os arquivos em `src/context/`:

### AuthContext.jsx — Login real
```js
const login = async (email, password) => {
  const res = await fetch('https://sua-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (res.ok) {
    setUser(data.user)
    localStorage.setItem('token', data.token)
    return { success: true }
  }
  return { success: false, message: data.message }
}
```

### JobsContext.jsx — Vagas reais
```js
useEffect(() => {
  fetch('https://sua-api.com/jobs')
    .then(r => r.json())
    .then(data => setJobs(data))
}, [])
```

---

## 🛠️ Tecnologias usadas
- **React 18** — Interface
- **Vite** — Build tool
- **Context API** — Gerenciamento de estado
