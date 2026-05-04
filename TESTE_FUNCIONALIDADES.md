# Guia de Teste — Funcionalidades Recentes

> Atualizado em: 04/05/2026
> Branch: `main` · Repo: `medeirosdev/project-easy4rh-front`

---

## Índice

1. [Página de Empresa (EmpresaPage)](#1-página-de-empresa)
2. [Dashboard Responsivo](#2-dashboard-responsivo)
3. [Módulo de Cursos — Instrutor/Recrutador](#3-módulo-de-cursos--instrutorrecrutador)
   - 3.1 Editar curso existente
   - 3.2 Reordenar seções e aulas
   - 3.3 Despublicar curso
   - 3.4 Barra de progresso no upload de vídeo
4. [Módulo de Cursos — Candidato](#4-módulo-de-cursos--candidato)
   - 4.1 Botão "Próxima aula"
   - 4.2 Certificado (CursoDetailPage)
   - 4.3 Certificado (Dashboard do Candidato)

---

## Pré-requisitos

- Conta de **Candidato** (role: `CANDIDATE`)
- Conta de **Instrutor** (role: `INSTRUCTOR`) — ou `RECRUITER_INSTRUCTOR`
- Backend rodando com banco atualizado (`prisma migrate deploy` executado)
- Ao menos um curso criado pelo instrutor, com seções e aulas

---

## 1. Página de Empresa

**Onde acessar:** Clique no logo ou nome da empresa em qualquer card de vaga, ou no botão "ver empresa" na página de detalhe da vaga.

### O que testar

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Acessar a página de uma empresa | Hero com logo, nome, badges de setor/localização/porte |
| 2 | Aba **Sobre** | Descrição, missão com ícone, valores em pills, sidebar com links |
| 3 | Aba **Vagas** | Lista de vagas ativas da empresa; clicar numa abre o detalhe normalizado |
| 4 | Aba **Vídeo** | Se empresa tiver `aboutVideoUrl`: embed YouTube ou player nativo |
| 5 | Empresa sem logo | Mostra inicial do nome como fallback |
| 6 | Empresa sem vagas | Mensagem "Nenhuma vaga disponível no momento" |
| 7 | CTA "Ver vagas" no sidebar | Troca para aba Vagas |
| 8 | Botão voltar | Retorna para a página anterior |

---

## 2. Dashboard Responsivo

**Onde testar:** Área logada de Candidato (`/dashboard-candidato`) e Recrutador.

### Breakpoints

| Largura | Layout esperado |
|---------|----------------|
| ≥ 1024px (desktop) | Sidebar fixa à esquerda, conteúdo ao lado |
| 768–1023px (tablet) | Sem sidebar; top bar com avatar + botões; abas horizontais com rolagem |
| < 768px (mobile) | Mesmo que tablet, padding menor, grid 1 coluna |

### O que testar

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Redimensionar janela de 1200px → 800px → 400px | Layout muda nos breakpoints sem quebrar |
| 2 | No mobile, rolar para baixo em seção longa (ex: Candidaturas) | Top bar e abas ficam no topo, conteúdo rola normalmente |
| 3 | Trocar de seção (ex: Resumo → Candidaturas) no mobile | Sidebar esquerda NÃO aparece; abas horizontais funcionam |
| 4 | No desktop, rolar para baixo numa seção longa | Sidebar fica visível e fixa do topo (sem cortar avatar) |
| 5 | Botão "Sair" no mobile | Faz logout e redireciona para home |

---

## 3. Módulo de Cursos — Instrutor/Recrutador

**Onde acessar:** Login como Instrutor → seção **Meus Cursos** no dashboard.

---

### 3.1 Editar curso existente

**Pré-requisito:** ter pelo menos 1 curso criado.

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Clicar em **Editar** num curso da lista | Tela muda imediatamente para "Editar Curso" com **"Carregando..."** visível |
| 2 | Aguardar o carregamento | Formulário preenche automaticamente: título, descrição, nível, categoria, thumbnail, seções e aulas existentes |
| 3 | Alterar o título do curso e clicar **Salvar alterações** | Tela mostra 🎉 "Curso atualizado com sucesso!" e volta para lista |
| 4 | Verificar na lista | Título atualizado aparece |
| 5 | Editar uma aula dentro de uma seção existente (ex: mudar o título da aula) | Aula atualizada após salvar |
| 6 | Adicionar uma nova seção no meio do curso → salvar | Nova seção aparece no curso |
| 7 | Remover uma seção existente → salvar | Seção removida do curso |
| 8 | Clicar **Editar** e logo em seguida clicar **Salvar alterações** (antes de carregar) | Botão fica desabilitado durante o carregamento — nada acontece |
| 9 | Em caso de erro de rede | Formulário mostra mensagem de erro e **volta para a lista** automaticamente |

---

### 3.2 Reordenar seções e aulas

**Disponível em:** modo Criar e modo Editar.

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Criar ou editar um curso com 3+ seções | Cada seção tem botões **↑** e **↓** ao lado do número |
| 2 | Clicar **↑** na Seção 2 | Seção 2 sobe para a posição 1; Seção 1 desce |
| 3 | Clicar **↑** na primeira seção | Botão fica acinzentado/desabilitado |
| 4 | Clicar **↓** na última seção | Botão fica acinzentado/desabilitado |
| 5 | Reordenar aulas dentro de uma seção | Aulas trocam de posição corretamente |
| 6 | Salvar após reordenar | Ordem persiste no backend |

---

### 3.3 Despublicar curso

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Na lista, localizar um curso com status **Publicado** | Botão **Despublicar** visível ao lado de **Arquivar** |
| 2 | Clicar **Despublicar** | Badge muda para "Rascunho"; mensagem "Curso despublicado." |
| 3 | Verificar que o curso sumiu do catálogo público | Candidatos não veem mais o curso em `/plataforma` |
| 4 | Publicar novamente | Badge volta para "Publicado"; curso aparece no catálogo |
| 5 | Curso com status **Rascunho** | **Não** deve ter botão Despublicar (só Publicar e Excluir) |
| 6 | Curso com status **Arquivado** | **Não** deve ter botão Despublicar |

---

### 3.4 Barra de progresso no upload de vídeo

**Como testar:** em Criar ou Editar curso, usar a opção de upload de arquivo de vídeo.

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Selecionar um arquivo de vídeo (MP4 ≤ 500 MB) para uma aula | Barra de progresso aparece abaixo do campo de upload |
| 2 | Durante o upload | Percentual (0% → 100%) e barra azul avançam em tempo real |
| 3 | Upload concluído | Barra desaparece; campo de URL do vídeo atualizado |
| 4 | Tentar arquivo > 500 MB | Mensagem de erro; arquivo rejeitado sem iniciar upload |
| 5 | Upload de múltiplas aulas simultâneas | Cada aula tem sua própria barra independente |

---

## 4. Módulo de Cursos — Candidato

**Onde acessar:** Login como Candidato → `/plataforma` → abrir um curso.

---

### 4.1 Botão "Próxima aula"

**Pré-requisito:** estar matriculado num curso com 2+ aulas.

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Clicar em qualquer aula que não seja a última | Botão **"Próxima aula →"** aparece ao lado de "Marcar como concluída" |
| 2 | Clicar na última aula do curso | Botão "Próxima aula →" **não aparece** |
| 3 | Clicar "Próxima aula →" | Vídeo da próxima aula carrega; seção contendo a aula **abre automaticamente** no sidebar |
| 4 | Próxima aula está em seção colapsada | Seção expande automaticamente; aula fica destacada no sidebar |
| 5 | Próxima aula é paga (não é `isFree`) e usuário não matriculado | Botão não aparece para essa aula |

---

### 4.2 Certificado na página do curso

**Pré-requisito:** estar matriculado e ter completado todas as aulas (progresso = 100%).

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Completar todas as aulas marcando "✓ Marcar como concluída" | Botão **"🏆 Emitir Certificado"** aparece na tela inicial do curso (painel esquerdo) |
| 2 | O botão aparece **sem precisar recarregar a página** | Confirmado — progresso é calculado em tempo real |
| 3 | Clicar "🏆 Emitir Certificado" | Botão mostra "Gerando..." enquanto processa |
| 4 | Certificado gerado com sucesso | Painel muda: "🏆 Certificado emitido!" com link "Baixar certificado" |
| 5 | Código de verificação presente | Exibido em fonte monospace abaixo do link |
| 6 | Clicar "Baixar certificado" | Abre o certificado em nova aba |
| 7 | Usuário com progresso < 100% | Botão de certificado **não aparece** |
| 8 | Usuário não matriculado | Botão de certificado **não aparece** |

---

### 4.3 Certificado no Dashboard do Candidato

**Onde:** Dashboard Candidato → seção **Meus Cursos**.

| # | Ação | Resultado esperado |
|---|------|-------------------|
| 1 | Ver card de curso com progresso **100%** | Botão **"🏆 Certificado"** aparece ao lado de "Continuar" |
| 2 | Clicar "🏆 Certificado" | Botão mostra "Gerando..."; API é chamada |
| 3 | Sucesso | Botão muda para "🏆 Certificado · Baixar" com link funcional |
| 4 | Card de curso com progresso < 100% | Botão de certificado não aparece |
| 5 | Dois cursos concluídos | Cada um tem seu próprio botão de certificado independente |

---

## Casos de erro / regressão a verificar

| # | Cenário | Não deve acontecer |
|---|---------|-------------------|
| 1 | Trocar de seção no dashboard (Resumo → Vagas) | Sidebar não quebra / não corta o avatar |
| 2 | Abrir detalhe de vaga a partir da EmpresaPage | Página de detalhe carrega corretamente (vaga normalizada) |
| 3 | Clicar "Editar" num curso e imediatamente fechar (←) | Sem erros no console; lista volta normal |
| 4 | Marcar aula como concluída sem vídeo carregado | Progresso salvo; sem crash (watchedSeconds = 0) |
| 5 | Acessar `/plataforma` sem login | Cursos gratuitos (isFree) visíveis; aulas pagas bloqueadas |
| 6 | Criar curso sem seções → publicar | Sem erro; curso publicado sem conteúdo (edge case aceitável) |

---

## Rotas de API envolvidas (para testar via Postman/backend)

```
POST /courses/:id/unpublish          → despublicar curso
POST /enrollments/:id/certificate    → gerar certificado
GET  /certificates/my                → listar meus certificados
POST /lessons/:id/upload-video       → upload com progresso (XHR)
PATCH /courses/:id                   → atualizar curso
PATCH /sections/:id                  → atualizar seção
PATCH /lessons/:id                   → atualizar aula
DELETE /sections/:id                 → remover seção
DELETE /lessons/:id                  → remover aula
POST /courses/:id/sections/reorder   → reordenar seções
```

---

## Observações

- O backend precisa ter o endpoint `POST /courses/:id/unpublish` implementado. Se retornar 404, a funcionalidade ficará desabilitada na UI com mensagem de erro.
- O endpoint de certificado `POST /enrollments/:id/certificate` precisa estar implementado no backend para a funcionalidade completa funcionar.
- O upload de vídeo usa **XMLHttpRequest** (não fetch) para ter acesso ao evento `upload.onprogress`. Certifique-se de que o servidor não está bloqueando requests XHR por CORS.
