# Melhorias de UX/UI — Easy4RH Frontend

> Auditoria realizada em 10/04/2026. Baseada em análise estática do código React em `src/`.
> Organizada por prioridade: **Alto** → **Médio** → **Baixo**.

---

## 1. Contraste de Cores (WCAG AA)

O padrão mínimo é **4.5:1** para texto normal e **3:1** para texto grande.

### 🔴 Alto

| Arquivo | Linha | Problema | Cor atual | Cor sugerida |
|---|---|---|---|---|
| `ConsultoriaLoginPage.jsx` | ~94 | Texto de termos de serviço quase invisível | `#aabbcc` em branco (~2.8:1) | `#1e4a8a` |
| `RegisterPage.jsx` | ~174 | Texto descritivo de política de privacidade | `#aabbcc` em branco (~2.8:1) | `#555` |

### 🟡 Médio

| Arquivo | Linha | Problema | Cor atual | Cor sugerida |
|---|---|---|---|---|
| `VagasPage.jsx` | ~259 | Label "Ordenar por:" pouco legível | `#778899` em `#f8fafc` (~3.2:1) | `#444` |
| `TreinamentosPage.jsx` | ~96 | Contador de cursos com contraste baixo | `#778899` em branco (~3.2:1) | `#555` |
| `Footer.jsx` | ~73 | Descrição da marca em rodapé | `rgba(255,255,255,0.65)` (~5.2:1, passa mas fraco) | `rgba(255,255,255,0.85)` |

---

## 2. Tamanho de Fonte

Mínimo recomendado para leitura confortável: **12px**. Abaixo disso compromete especialmente mobile e usuários com visão reduzida.

### 🔴 Alto

| Arquivo | Linha | Valor atual | Valor sugerido |
|---|---|---|---|
| `HeroSearch.jsx` | ~232 | `fontSize: 10.5` em descrição de card | `12` |

### 🟡 Médio

| Arquivo | Linha | Valor atual | Valor sugerido |
|---|---|---|---|
| `VagasPage.jsx` | ~168 | `fontSize: 11` em labels de filtro | `12.5` |
| `Navbar.jsx` | ~156 | `fontSize: 11` em descrição de item do menu dropdown | `12.5` |
| `Footer.jsx` | ~177 | `fontSize: 11` em títulos de coluna | `13` |
| `ConsultoriaLoginPage.jsx` | ~94 | `fontSize: 11.5` em aviso de privacidade | `12` |
| `RegisterPage.jsx` | ~181 | `fontSize: 11.5` em aviso de privacidade | `12` |

---

## 3. Espaçamento e Layout

### 🟡 Médio

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `ConsultoriaLoginPage.jsx` | ~56 | `padding: '10px 2px'` nos inputs — lateral muito apertado | `padding: '10px 14px'` |
| `VagasPage.jsx` | ~80 | `padding: '11px 16px'` nos inputs de busca — touch pequeno | `padding: '13px 16px'` |
| `JobDetailPage.jsx` | ~187 | `padding: isMobile ? 20 : 28` — mobile apertado com muito conteúdo | `isMobile ? 24 : 28` |
| `TreinamentosPage.jsx` | ~79 | `marginBottom: 8` entre itens de lista em card | `marginBottom: 10` |

### 🟢 Baixo

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `JobDetailPage.jsx` | ~269 | Modal de aplicação: pouco espaço entre steps em mobile | Aumentar `padding` mobile para 28px |
| `JobCard.jsx` | ~49 | Descrição da vaga truncada no meio de palavras | Usar `WebkitLineClamp: 2` com `overflow: hidden` |

---

## 4. Feedback Visual

### 🔴 Alto

**Modal de candidatura inutilizável em mobile**
- `JobDetailPage.jsx` ~268: modal com `maxHeight: '90vh'` e muitos campos — em telas pequenas o usuário não consegue submeter.
- **Sugestão:** Converter para bottom sheet com `height: 'calc(100vh - 60px)'` e `overflowY: 'auto'` em mobile.

### 🟡 Médio

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `ConsultoriaLoginPage.jsx` | ~85 | Botão desabilitado vira `#aaa` apagado — parece quebrado | Manter gradiente com `opacity: 0.6` + `⏳` |
| `RegisterPage.jsx` | ~165 | Mesmo problema no botão de cadastro | Idem |
| `JobDetailPage.jsx` | ~250 | Mudança de "Candidatar" → "Aplicado" sem transição | Adicionar `transition: 'background 0.3s ease'` |
| `TreinamentosPage.jsx` | ~139 | Clique no card de curso sem nenhum feedback visual | Adicionar escurecimento ou `cursor: 'wait'` ao clicar |

### 🟢 Baixo

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `VagasPage.jsx` | ~262 | Botões de sort sem hover visível | `onMouseEnter`: `opacity: 0.8` |
| `Navbar.jsx` | ~132 | Itens de nav sem hover intermediário (só ativo/inativo) | Adicionar cor hover entre `#666` e `#1e4a8a` |
| `JobDetailPage.jsx` | ~298 | Mensagem de erro sem ícone visual | Prefixar com `⚠️` |

---

## 5. Responsividade

### 🔴 Alto

**Filtros de vaga somem no mobile**
- `VagasPage.jsx` ~284: sidebar de filtros desaparece em mobile sem alternativa.
- **Sugestão:** Adicionar botão fixo "🔧 Filtros" no topo que abre um drawer com os filtros.

### 🟡 Médio

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `TreinamentosPage.jsx` | ~137 | `minmax(300px, 1fr)` — cards muito largos em telas 320-360px | Usar `minmax(280px, 1fr)` |
| `VagasPage.jsx` | ~104 | Grid de busca (`1fr 1fr auto`) quebra mal em tablet | Adicionar breakpoint intermediário |
| `JobDetailPage.jsx` | ~200 | Metadados da vaga transbordam em mobile pequeno | `gap: isMobile ? 8 : 12` e grid 2x2 em mobile |

### 🟢 Baixo

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `Navbar.jsx` | ~234 | Mobile menu ocupa `80vh` — pouco espaço em telas curtas | Reduzir para `70vh` |
| `ConsultoriaLoginPage.jsx` | ~69 | Pula direto de 1 coluna para 2 sem breakpoint tablet | Adicionar breakpoint 768px |

---

## 6. Acessibilidade

### 🔴 Alto

**Foco de teclado invisível em toda a aplicação**
- Nenhum componente tem estilo `:focus` visível. Usuários que navegam por teclado ficam completamente perdidos.
- **Sugestão:** Adicionar regra global em `index.css`:
```css
*:focus-visible {
  outline: 2px solid #1e4a8a;
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Inputs sem `<label>` em páginas críticas**

| Arquivo | Campos afetados |
|---|---|
| `ConsultoriaLoginPage.jsx` | Email, Senha |
| `RegisterPage.jsx` | Nome, Email, Senha, Telefone |
| `VagasPage.jsx` | Palavras-chave, Localização |

- **Sugestão:** Adicionar `<label htmlFor="campo-id">` acima de cada input, ou usar `aria-label` se o design não permitir label visível.

### 🟡 Médio

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `JobCard.jsx` | ~35 | Botão 🔖 sem texto — screen reader diz apenas "button" | `aria-label={isSaved ? "Remover vaga salva" : "Salvar vaga"}` |
| `TreinamentosPage.jsx` | ~169 | Botão "Ver curso" sem contexto de qual curso | `aria-label={\`Ver curso: ${course.title}\`}` |
| `JobDetailPage.jsx` | ~190 | Botões "Compartilhar" e "Salvar" sem aria-label | `aria-label="Compartilhar vaga"` |
| `HomePage.jsx` | ~31 | `alt=""` em imagem decorativa que poderia ter descrição | `alt="Profissional da Easy4RH"` |
| `HeroSearch.jsx` | ~110 | `alt="Hero"` genérico demais | Descrição contextual |

---

## 7. Consistência Visual

### 🟡 Médio

**Gradiente de botão primário com duas variações:**
- `linear-gradient(135deg, #1e4a8a, #4a9edd)` — usado em alguns lugares
- `linear-gradient(135deg, #1a4f8a, #2a7ec8)` — usado em outros

Padronizar para um único valor em toda a aplicação (sugerido: o primeiro).

**Arquivos afetados:** `JobDetailPage.jsx`, `CandidatoDashboard.jsx`, `RecrutadorDashboard.jsx`, `TreinamentosPage.jsx`.

### 🟢 Baixo

| Item | Situação atual | Padrão sugerido |
|---|---|---|
| `border-radius` de inputs | Mix de 8, 10, 12 | Fixar em `10` |
| `border-radius` de cards | Mix de 12, 16 | Fixar em `16` para cards grandes, `12` para menores |
| `box-shadow` de cards | Valores ligeiramente diferentes entre páginas | `0 2px 12px rgba(30,74,138,0.08)` como padrão |
| Espaçamento de seção | 32px, 48px, 56px, 64px misturados | Escala: `32 / 48 / 64` |

---

## 8. Empty States

### 🟡 Médio

| Arquivo | Problema | Sugestão |
|---|---|---|
| `VagasPage.jsx` | "Nenhuma vaga encontrada" sem contexto do filtro ativo | Mostrar o termo buscado: `Nenhuma vaga para "${appliedKeyword}"` |
| `TreinamentosPage.jsx` | "Nenhum curso encontrado" sem listar filtros ativos | Listar quais filtros estão aplicados e oferecer botão limpar |

---

## 9. Hierarquia Visual

### 🟡 Médio

| Arquivo | Linha | Problema | Sugestão |
|---|---|---|---|
| `JobDetailPage.jsx` | ~200 | Salário exibido com mesmo peso visual que localização | Usar badge: `background: '#f0ffe4'`, `color: '#276749'` |
| `HomePage.jsx` | ~62 | Título de seção (24px) e parágrafo (13px) com distância visual pequena | Aumentar título para 28-32px |

### 🟢 Baixo

- CTAs primários poderiam ter mais destaque com leve sombra (`box-shadow: 0 4px 12px rgba(30,74,138,0.3)`)
- Seção "Vagas em Destaque" em `VagasPage.jsx` — título genérico, sem gancho

---

## 10. Touch Targets (Mobile UX)

O mínimo recomendado para áreas de toque é **44×44px**.

### 🟡 Médio

| Arquivo | Linha | Padding atual | Padding sugerido |
|---|---|---|---|
| `VagasPage.jsx` | ~173 | `padding: '5px 12px'` nos botões de filtro | `padding: '8px 16px'` |
| `TreinamentosPage.jsx` | ~84 | `padding: '11px 22px'` no botão — OK em desktop, checar mobile | Mínimo garantido |

### 🟢 Baixo

- Footer accordion em mobile: items com espaçamento grande mas área de toque do toggle pequena
- Navbar mobile: links com `padding: 12px 16px` — limite aceitável, mas poderia ser 14px

---

## Prioridade de Execução

### Semana 1 — Funcional (alto impacto sem mudar design)
1. Adicionar estilo `:focus-visible` global em `index.css`
2. Corrigir contraste de `#aabbcc` → `#555` ou `#1e4a8a` (Login e Register)
3. Adicionar `<label>` ou `aria-label` nos inputs de Login, Register e VagasPage
4. Aumentar `fontSize: 11` → `12.5` nos labels de filtro e Navbar
5. Corrigir `fontSize: 10.5` → `12` no HeroSearch

### Semana 2 — UX mobile
6. Converter modal de candidatura (JobDetailPage) para bottom sheet em mobile
7. Adicionar drawer de filtros na VagasPage para mobile
8. Aumentar touch targets dos botões de filtro para `padding: '8px 16px'`
9. Melhorar feedback de loading em botões (manter gradiente com `opacity: 0.6`)

### Semana 3 — Polimento visual
10. Padronizar gradiente de botão primário em todos os arquivos
11. Padronizar `border-radius`, `box-shadow` e escala de espaçamento
12. Melhorar empty states com contexto do filtro ativo
13. Adicionar `aria-label` em botões de ação (salvar vaga, ver curso)
14. Badge visual para salário em `JobDetailPage`
