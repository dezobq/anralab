# Orion AI Kit - Workflow End-to-End (Sistema Completo)

**Objetivo:** Documentar como o sistema funcionará quando 100% completo e como integrá-lo em um projeto brownfield real.

---

## 🎯 Visão Geral: Sistema Completo

```
┌─────────────────────────────────────────────────────────────┐
│  PROJETO BROWNFIELD (ex: legacy e-commerce app)             │
│  - 150k linhas de código                                     │
│  - Node.js + React + PostgreSQL                              │
│  - Tech debt acumulada                                       │
│  - Documentação desatualizada                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  INTEGRAÇÃO ORION AI KIT                                     │
│  1. Setup inicial (1-2h)                                     │
│  2. Ingestão de código (30 min - 1h)                         │
│  3. Validação com smoke tests (1h)                           │
│  4. Uso em produção                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  WORKFLOW DIÁRIO (Escolha seu modo)                          │
│                                                               │
│  🆓 Sonnet-Only Mode (Manual)                                │
│  └─ Claude Code → @agent prompts → Handoffs manuais         │
│                                                               │
│  💰 Blueprint v5.2 (Automação)                               │
│  └─ Task → Decision Engine → RAG → Agents → Validation      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Fase 1: Setup Inicial em Projeto Brownfield (1-2h)

### Passo 1.1: Clonar Orion AI Kit no Projeto

**Cenário:** Você tem um projeto em `/home/user/legacy-ecommerce`

```bash
cd /home/user/legacy-ecommerce

# Opção A: Git submodule (recomendado)
git submodule add https://github.com/your-org/orion-ai-kit .orion
cd .orion

# Opção B: Clone direto
git clone https://github.com/your-org/orion-ai-kit .orion
cd .orion
```

**Estrutura resultante:**
```
legacy-ecommerce/
├── src/                  # Seu código legacy
├── package.json          # Seu package.json
├── .orion/               # ← Orion AI Kit
│   ├── prompts/agents/   # 6 agentes especializados
│   ├── src/rag/          # RAG + Reranker
│   ├── ai_cli.py         # CLI orchestrator
│   └── docker-compose.rag.yml
└── .git/
```

---

### Passo 1.2: Configurar Ambiente

```bash
cd .orion

# Copiar .env
cp .env.example .env

# Editar configurações
nano .env
```

**Configuração para Brownfield:**

```bash
# .env (Sonnet-Only Mode - Grátis)
AI_MODE=sonnet_only
AI_DISABLE_GPT5=1
AI_LOG_LEVEL=INFO

# Apontar para seu projeto (não para .orion)
PROJECT_ROOT=/home/user/legacy-ecommerce
STACK_DETECT_AUTO=true

# RAG (opcional, se quiser automação depois)
OPENSEARCH_HOST=localhost
OPENSEARCH_PORT=9200

# Quality gates (ajustar para seu projeto)
MIN_COVERAGE=0.70  # Legacy pode ter cobertura menor
MIN_MUTATION=0.50  # Começar conservador
```

---

### Passo 1.3: Instalar Dependências

```bash
# Se usar Sonnet-Only (sem automação)
npm install  # Instala ESLint, Jest, etc (do seu projeto)

# Se usar Blueprint v5.2 (com automação)
pip install -r requirements.txt
docker compose -f docker-compose.rag.yml up -d  # OpenSearch
```

---

## 🔍 Fase 2: Ingestão de Código (30 min - 1h)

**Objetivo:** Indexar seu código legacy no RAG para que agentes possam buscar padrões.

### Passo 2.1: Detectar Stacks no Projeto

```bash
cd /home/user/legacy-ecommerce/.orion

# Detecta Node.js, Python, etc no projeto pai
python ai_cli.py detect --project-root ..
```

**Output esperado:**
```json
{
  "stacks": [
    {
      "stack": "nodejs",
      "root": "/home/user/legacy-ecommerce",
      "files": ["package.json"],
      "capabilities": ["build", "test", "lint", "coverage"]
    }
  ],
  "count": 1
}
```

---

### Passo 2.2: Ingerir Código no OpenSearch

**Se usar RAG (Blueprint v5.2 automação):**

```bash
# Chunkar código em símbolos (funções, classes)
python scripts/ingest_to_opensearch.py \
  --repo /home/user/legacy-ecommerce \
  --lang javascript \
  --lang typescript \
  --exclude node_modules \
  --exclude dist

# Output:
# ✅ Indexed 1,247 code chunks
# ✅ Languages: javascript (892), typescript (355)
# ⏱️  Duration: 42s
```

**Verificar ingestão:**
```bash
curl -k -u admin:MyS3curePassw0rd!2025 \
  "https://localhost:9200/code-chunks/_count?pretty"

# {
#   "count": 1247
# }
```

**Se usar Sonnet-Only (sem RAG):**
- Pular este passo (agentes usarão grep/read)

---

### Passo 2.3: Gerar Queries de Teste (Gold Standard)

**Criar `docs/qs.jsonl`** com perguntas comuns sobre SEU projeto:

```jsonl
{"id":"q1","query":"How do we handle user authentication in this project?"}
{"id":"q2","query":"What's the pattern for database migrations?"}
{"id":"q3","query":"How to add a new API endpoint?"}
{"id":"q4","query":"Where is error logging configured?"}
{"id":"q5","query":"How are React components structured?"}
```

**Criar `docs/gold.jsonl`** com respostas corretas:

```jsonl
{"id":"q1","relevant_docs":["src/auth/passport.js:1","src/middleware/auth.js:15"]}
{"id":"q2","relevant_docs":["migrations/README.md:1","knexfile.js:5"]}
{"id":"q3","relevant_docs":["src/routes/api.js:20","src/controllers/baseController.js:1"]}
{"id":"q4","relevant_docs":["src/utils/logger.js:1","config/winston.js:10"]}
{"id":"q5","relevant_docs":["src/components/README.md:1","src/components/BaseComponent.jsx:1"]}
```

**Avaliar RAG:**
```bash
python scripts/eval_rag.py \
  --q docs/qs.jsonl \
  --gold docs/gold.jsonl \
  --k 10 \
  --strategy bm25

# Output:
# 📊 RAG Evaluation Results
# Strategy: BM25
# Avg Recall@10: 0.78 (78%)
# Avg MRR: 0.65
```

**Meta:** Recall@10 ≥ 70% antes de confiar no RAG.

---

## ✅ Fase 3: Smoke Tests (1h)

**Objetivo:** Validar que Orion AI Kit funciona no SEU projeto.

### Teste 1: Bug Trivial (ESLint Rule)

**Task:** "Change ESLint no-console rule from error to warning"

**Sonnet-Only Mode:**
```
# No Claude Code (VS Code):
@.orion/prompts/agents/00_supervisor.md Change ESLint no-console from error to warning
```

**Blueprint v5.2 (quando implementado):**
```bash
python ai_cli.py agent-run --objective "Change ESLint no-console to warning"
```

**Resultado esperado:**
- SUPERVISOR → PLANNER (skip RAG) → IMPLEMENTER → VALIDATOR → REPORTER
- Arquivo modificado: `.eslintrc.js`
- Validação: `npm run lint` passa
- Tempo: ~2-3 min (manual) ou ~30 seg (auto)

---

### Teste 2: Small Feature (Adicionar Endpoint)

**Task:** "Add GET /api/health endpoint that returns server status"

**Fluxo esperado:**

1. **SUPERVISOR:**
   - Analisa: tarefa simples, 2 arquivos
   - HANDOFF: PLANNER

2. **PLANNER:**
   - Tasks: ["Create health route", "Add to router", "Write test"]
   - Files: ["src/routes/health.js", "src/routes/index.js", "tests/health.test.js"]
   - RAG queries: ["How are routes structured?", "Pattern for API tests?"]
   - HANDOFF: RETRIEVER

3. **RETRIEVER (com RAG):**
   - Busca: "How are routes structured?"
   - Encontra: `src/routes/api.js:1-20` (exemplo de rota)
   - Busca: "Pattern for API tests?"
   - Encontra: `tests/api.test.js:1-30` (exemplo de teste)
   - HANDOFF: IMPLEMENTER

4. **IMPLEMENTER:**
   - Imita padrão de `src/routes/api.js`
   - Cria:
     ```javascript
     // src/routes/health.js
     const express = require('express');
     const router = express.Router();

     router.get('/', (req, res) => {
       res.json({ status: 'ok', timestamp: new Date().toISOString() });
     });

     module.exports = router;
     ```
   - Atualiza `src/routes/index.js`:
     ```javascript
     app.use('/api/health', require('./health'));
     ```
   - Cria teste (imitando `tests/api.test.js`)
   - HANDOFF: VALIDATOR

5. **VALIDATOR:**
   - Roda: `npm run build` → PASS
   - Roda: `npm test` → PASS
   - Roda: `npm run lint` → PASS
   - Coverage: 85% → PASS (≥70%)
   - HANDOFF: REPORTER

6. **REPORTER:**
   - Status: ✅ SUCCESS
   - Changes: 3 files (1 new, 2 modified)
   - FIM

**Tempo:** ~5 min (manual) ou ~45 seg (auto)

---

### Teste 3: RAG Discovery (Encontrar Config)

**Task:** "Where is the database connection configured? Update pool size to 20"

**Fluxo esperado:**

1. **SUPERVISOR → PLANNER:**
   - RAG queries: ["database connection config", "pool size setting"]

2. **RETRIEVER (com RAG):**
   - Encontra: `config/database.js:15-30`
   - Snippet:
     ```javascript
     const pool = new Pool({
       host: process.env.DB_HOST,
       port: 5432,
       max: 10  // ← pool size atual
     });
     ```

3. **IMPLEMENTER:**
   - Modifica: `max: 10` → `max: 20`

4. **VALIDATOR:**
   - Testa conexão (se tiver teste de integração)
   - PASS

**Tempo:** ~3 min (manual) ou ~30 seg (auto)

---

## 🚀 Fase 4: Uso em Produção (Workflow Diário)

### Modo A: Sonnet-Only (Manual, $0/mês)

**Workflow típico:**

1. **Recebe task do Jira/Linear:**
   ```
   TASK-1234: Add pagination to /api/products endpoint
   ```

2. **Abre Claude Code (VS Code):**
   ```
   @.orion/prompts/agents/00_supervisor.md Add pagination to /api/products endpoint
   ```

3. **SUPERVISOR analisa:**
   ```markdown
   Complexity: MEDIUM
   Scope: 3 files (route, controller, test)
   Skip RAG: No (precisa ver padrão de paginação)

   HANDOFF: PLANNER | STATE: {"objective":"Add pagination to /api/products","skip_rag":false}
   ```

4. **Copia STATE, invoca PLANNER:**
   ```
   @.orion/prompts/agents/01_planner.md

   Current State:
   {"objective":"Add pagination to /api/products","skip_rag":false}
   ```

5. **PLANNER responde:**
   ```markdown
   Tasks:
   1. Add query params (page, limit) to route
   2. Update controller with OFFSET/LIMIT logic
   3. Update tests for pagination

   RAG queries: ["pagination pattern in API", "how to test paginated responses"]

   HANDOFF: RETRIEVER | STATE: {...}
   ```

6. **Continua workflow até REPORTER retornar FIM**

7. **Aplica mudanças, testa, commita:**
   ```bash
   npm test
   git add .
   git commit -m "feat: add pagination to /api/products (TASK-1234)"
   ```

**Tempo total:** ~10-15 min (incluindo aplicar mudanças)

---

### Modo B: Blueprint v5.2 (Automação, ~$2,200/mês)

**Workflow típico:**

1. **Recebe task do Jira:**
   ```
   TASK-1234: Add pagination to /api/products endpoint
   ```

2. **Roda comando:**
   ```bash
   cd /home/user/legacy-ecommerce/.orion

   python ai_cli.py agent-run \
     --objective "Add pagination to /api/products endpoint" \
     --jira TASK-1234
   ```

3. **Sistema executa automaticamente:**
   ```
   [AGENT] Starting workflow...
   [SUPERVISOR] Analyzing task... Complexity: MEDIUM
   [PLANNER] Breaking down into 3 tasks...
   [RETRIEVER] Searching codebase for pagination patterns...
   [RETRIEVER] Found 3 relevant snippets
   [IMPLEMENTER] Generating code based on patterns...
   [IMPLEMENTER] Changes: 3 files (1 route, 1 controller, 1 test)
   [VALIDATOR] Running tests... PASS
   [VALIDATOR] Coverage: 87% (≥70%) PASS
   [REPORTER] Task complete! Duration: 42s
   ```

4. **Review output:**
   ```bash
   git diff  # Vê mudanças geradas
   npm test  # Valida localmente
   ```

5. **Commita (ou cria PR automaticamente):**
   ```bash
   git add .
   git commit -m "feat: add pagination to /api/products (TASK-1234)"
   git push origin feature/TASK-1234

   # Ou automatiza PR:
   gh pr create --title "TASK-1234: Add pagination" --body "$(cat reports/summary.md)"
   ```

**Tempo total:** ~2-3 min (incluindo review)

---

## 📊 Comparação: Antes vs Depois

### Antes (Sem Orion AI Kit)

**Task:** "Add pagination to /api/products"

1. Ler documentação (ou buscar no código) - 10 min
2. Entender padrão de paginação existente - 15 min
3. Implementar mudanças - 20 min
4. Escrever testes - 15 min
5. Rodar validações - 5 min
6. Corrigir erros - 10 min

**Total:** ~75 min (1h15min)

---

### Depois (Com Orion AI Kit)

#### Sonnet-Only Mode (Manual):

1. SUPERVISOR → PLANNER → RETRIEVER - 2 min (copia STATE)
2. RAG encontra padrões - 30 seg
3. IMPLEMENTER gera código - 2 min
4. Aplicar mudanças - 3 min
5. VALIDATOR roda testes - 2 min
6. Ajustes (se precisar) - 5 min

**Total:** ~15 min (5x mais rápido)

#### Blueprint v5.2 (Automação):

1. Roda comando - 10 seg
2. Sistema executa workflow - 42 seg
3. Review output - 2 min
4. Commita - 1 min

**Total:** ~4 min (19x mais rápido)

---

## 🔄 Integração com CI/CD (Blueprint v5.2)

### GitHub Actions Workflow

**Arquivo:** `.github/workflows/ai-assist.yml`

```yaml
name: AI-Assisted Development

on:
  issues:
    types: [labeled]

jobs:
  ai-implement:
    if: github.event.label.name == 'ai-assist'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Orion AI Kit
        run: |
          cd .orion
          pip install -r requirements.txt
          docker compose -f docker-compose.rag.yml up -d

      - name: Run AI Agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          cd .orion
          python ai_cli.py agent-run \
            --objective "${{ github.event.issue.title }}" \
            --issue ${{ github.event.issue.number }}

      - name: Create PR
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git config user.name "AI Agent"
          git config user.email "ai@example.com"
          git checkout -b ai/issue-${{ github.event.issue.number }}
          git add .
          git commit -m "feat: ${{ github.event.issue.title }}"
          git push origin ai/issue-${{ github.event.issue.number }}

          gh pr create \
            --title "AI: ${{ github.event.issue.title }}" \
            --body "$(cat .orion/reports/summary.md)" \
            --label "ai-generated"
```

**Uso:**

1. Cria issue no GitHub: "Add pagination to /api/products"
2. Adiciona label: `ai-assist`
3. Bot cria PR automaticamente
4. Você revisa e merge (ou pede ajustes)

---

## 📈 Métricas de Sucesso (Após 2-4 Semanas)

**Telemetry:** `reports/ai_events.jsonl`

```bash
# Taxa de sucesso na primeira tentativa
grep '"t":"done"' reports/ai_events.jsonl | \
  jq -s 'map(select(.attempts==1 and .success)) | length'

# Duração média por task
grep '"t":"done"' reports/ai_events.jsonl | \
  jq -s 'map(.duration) | add / length'

# Tasks por dia
grep '"t":"start"' reports/ai_events.jsonl | \
  jq -s 'group_by(.timestamp[:10]) | map({date: .[0].timestamp[:10], count: length})'
```

**Metas:**
- Taxa de sucesso: ≥70% (primeira tentativa)
- Duração média: ≤5 min (Sonnet-Only) ou ≤1 min (Blueprint)
- Volume: 5-20 tasks/dia (Sonnet-Only) ou 20-100 tasks/dia (Blueprint)

---

## 🎓 Aprendizado Progressivo

### Semana 1: Tarefas Triviais
- Mudanças de config
- Ajustes de lint
- Rename de variáveis

**Objetivo:** Calibrar agentes, entender workflow

---

### Semana 2-3: Tarefas Simples
- Novos endpoints
- Novas funções utilitárias
- Testes unitários

**Objetivo:** Aumentar confiança, medir taxa de sucesso

---

### Semana 4+: Tarefas Médias
- Refatorações
- Features com múltiplos arquivos
- Integrações

**Objetivo:** Trabalhar em produção, medir ROI

---

## 🔧 Troubleshooting Comum

### Problema 1: RAG Não Encontra Padrões

**Sintoma:**
```
[RETRIEVER] Found 0 relevant snippets (confidence: 0.0)
```

**Solução:**
```bash
# Re-indexar com mais arquivos
python scripts/ingest_to_opensearch.py --repo .. --lang javascript --lang python

# Verificar queries
python scripts/eval_rag.py --q docs/qs.jsonl --gold docs/gold.jsonl

# Ajustar gold.jsonl se recall < 70%
```

---

### Problema 2: VALIDATOR Sempre Falha

**Sintoma:**
```
[VALIDATOR] Tests FAIL (3/10 passing)
[VALIDATOR] HANDOFF: IMPLEMENTER (retry, attempt=2)
```

**Solução:**
```bash
# Investigar padrão de falhas
grep "VALIDATOR.*FAIL" reports/ai_events.jsonl

# Ajustar acceptance criteria em PLANNER
# Treinar IMPLEMENTER com exemplos melhores
```

---

### Problema 3: Código Gerado Não Segue Padrões

**Sintoma:** IMPLEMENTER gera código diferente do estilo do projeto

**Solução:**
```bash
# Adicionar exemplos ao gold.jsonl
# Melhorar snippets retornados pelo RAG
# Reforçar instruções no prompt de IMPLEMENTER
```

---

## 🎯 Resumo: Do Zero ao Produtivo

```
Dia 0:
  └─ Setup (1-2h) → Ingestão (30 min) → Smoke tests (1h)
  └─ Total: 2.5-4h

Semana 1:
  └─ Tarefas triviais (5-10 tasks)
  └─ Calibração dos agentes

Semana 2-4:
  └─ Tarefas simples/médias (20-40 tasks)
  └─ Medir taxa de sucesso (meta: ≥70%)

Mês 2+:
  └─ Uso em produção
  └─ Decidir: continuar Sonnet-Only ou migrar Blueprint v5.2
```

**ROI Esperado:**
- Sonnet-Only: 5x mais rápido (75 min → 15 min)
- Blueprint v5.2: 19x mais rápido (75 min → 4 min)

---

**Pronto para começar?** Escolha seu modo e siga a Fase 1! 🚀
