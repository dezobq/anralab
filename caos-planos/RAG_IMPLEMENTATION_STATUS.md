# RAG + Reranker - Status da Implementação

**Data:** 2025-10-04
**Status:** ⚠️ INFRAESTRUTURA PRONTA, MAS CORE RAG NÃO IMPLEMENTADO

---

## 📊 Resumo Executivo

| Componente | Planejado | Implementado | Status |
|------------|-----------|--------------|--------|
| **OpenSearch** | ✅ BM25+Vector | ✅ Rodando | ✅ OK |
| **Ingestão** | ✅ Code chunking | ✅ Implementado | ✅ OK |
| **BM25 Search** | ✅ Keyword search | ⚠️ Parcial (eval only) | ⚠️ FALTA |
| **Vector Search** | ✅ Embeddings | ❌ Placeholder | ❌ FALTA |
| **Reranker** | ✅ RRF + Cross-Encoder | ❌ Não implementado | ❌ FALTA |
| **RAG Integration** | ✅ MCP Tool | ❌ Não existe | ❌ FALTA |
| **Avaliação** | ✅ Recall@K, MRR | ✅ Script pronto | ✅ OK |

---

## ✅ O Que ESTÁ Implementado

### 1. OpenSearch Infrastructure

**Arquivos:**
- `docker-compose.rag.yml` - OpenSearch + Dashboards
- `.github/workflows/ai_eval.yml` - Avaliação noturna

**Status:** ✅ FUNCIONANDO
```bash
docker compose -f docker-compose.rag.yml up -d
# OpenSearch running on https://localhost:9200
```

### 2. Ingestão de Código

**Arquivo:** `scripts/ingest_to_opensearch.py`

**Features:**
- ✅ Chunk código em símbolos (funções, classes)
- ✅ Indexa no OpenSearch
- ✅ Gera doc_id único (path:start_line)
- ✅ Suporta múltiplas linguagens

**Uso:**
```bash
python scripts/ingest_to_opensearch.py --repo . --lang javascript
```

**Status:** ✅ IMPLEMENTADO E TESTADO

### 3. Avaliação RAG

**Arquivo:** `scripts/eval_rag.py`

**Features:**
- ✅ Recall@K (% docs relevantes recuperados)
- ✅ MRR (Mean Reciprocal Rank)
- ✅ Suporta BM25, Vector, Hybrid
- ✅ Workflow noturno (GitHub Actions)

**Queries de Teste:** `docs/qs.jsonl`
**Gold Standard:** `docs/gold.jsonl`

**Status:** ✅ IMPLEMENTADO MAS SEM RAG REAL

---

## ❌ O Que FALTA (Crítico!)

### 1. BM25 Search Function (Core RAG)

**Planejado:**
```python
def rag_retrieve_bm25(query: str, k: int = 10) -> List[Dict]:
    """
    Retrieve code chunks using BM25 keyword search.

    Returns:
        [
            {
                "doc_id": "src/sum.js:1",
                "content": "export function sum(a,b) { return a+b; }",
                "score": 0.95,
                "path": "src/sum.js",
                "lines": [1, 5]
            },
            ...
        ]
    """
    # BM25 search implementation
```

**Status:** ❌ NÃO EXISTE

**Onde deveria estar:**
- `src/rag/retriever.py` (arquivo não criado)
- Ou `src/core/rag.py`
- Ou integrado em `src/agents/02_retriever.md` (prompt do agente)

---

### 2. Vector Search + Embeddings

**Planejado:**
```python
def rag_retrieve_vector(query: str, k: int = 10) -> List[Dict]:
    """
    Retrieve code chunks using semantic search.

    Steps:
    1. Embed query using all-MiniLM-L6-v2
    2. KNN search in OpenSearch
    3. Return top-k results
    """
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(query)

    # KNN search in OpenSearch
    # ...
```

**Status:** ❌ NÃO EXISTE

**Evidência:** `eval_rag.py:75`
```python
def vector_search(query: str, k: int = 50) -> List[str]:
    """Vector semantic search (requires embeddings)."""
    # This is a placeholder - actual implementation would:
    print("⚠️  Vector search not implemented, using BM25 fallback")
    return bm25_search(query, k)
```

---

### 3. Reranker (RRF + Cross-Encoder)

**Planejado (Blueprint v5.2 linha 19):**
```
| **Reranker RAG** | "simpleRerank" | ✅ RRF + Cross-Encoder (+30% recall) |
```

**Implementação Esperada:**
```python
def rerank_results(
    query: str,
    bm25_results: List[Dict],
    vector_results: List[Dict]
) -> List[Dict]:
    """
    Rerank using:
    1. RRF (Reciprocal Rank Fusion) for score combination
    2. Cross-Encoder for final reranking

    Models:
    - cross-encoder/ms-marco-MiniLM-L-6-v2
    """
    # 1. RRF fusion
    rrf_scores = compute_rrf(bm25_results, vector_results)

    # 2. Cross-Encoder reranking
    from sentence_transformers import CrossEncoder
    reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

    pairs = [(query, doc['content']) for doc in rrf_scores]
    ce_scores = reranker.predict(pairs)

    # Combine and return top-k
    # ...
```

**Status:** ❌ NÃO EXISTE

**Evidência:** `eval_rag.py:85`
```python
def hybrid_search(query: str, k: int = 50) -> List[str]:
    """Hybrid search: BM25 + Vector with score fusion."""
    # Placeholder: just does BM25 for now
    print("⚠️  Hybrid search not implemented, using BM25 fallback")
    return bm25_search(query, k)
```

---

### 4. RAG Integration com Agentes

**Planejado:** RETRIEVER agent deve usar RAG para buscar código

**Como deveria funcionar:**

1. **PLANNER gera queries RAG:**
```json
{
  "rag_queries": [
    "How to export functions in this project?",
    "Pattern for Jest test files"
  ]
}
```

2. **RETRIEVER invoca RAG:**
```python
from src.rag.retriever import rag_retrieve_hybrid

results = rag_retrieve_hybrid(
    query="How to export functions in this project?",
    k=10
)
# Returns top 10 code snippets
```

3. **IMPLEMENTER usa snippets:**
```markdown
I found this pattern in src/sum.js:1-5:
export function sum(a,b) { return a+b; }

I'll follow the same pattern for multiply.
```

**Status:** ❌ NÃO INTEGRADO

**O que existe:** RETRIEVER agent usa `grep` e `read` (ferramentas básicas)

---

## 🔧 O Que Precisa Ser Feito

### Fase 1: Core RAG (BM25 Only) - 4-6h

```
1. Criar src/rag/retriever.py
   └─ bm25_search(query, k) → List[Dict]
   └─ format_results(hits) → snippets com context

2. Criar src/rag/__init__.py
   └─ Exports: rag_retrieve_bm25

3. Integrar com RETRIEVER agent
   └─ prompts/agents/02_retriever.md
   └─ Usar rag_retrieve_bm25 em vez de grep

4. Testes
   └─ tests/test_rag_retriever.py (10 tests)
   └─ Validar com docs/qs.jsonl + docs/gold.jsonl
```

### Fase 2: Vector Search + Embeddings - 3-4h

```
1. Adicionar dependency
   └─ requirements.txt: sentence-transformers>=2.0

2. Implementar vector_search()
   └─ Embed query com all-MiniLM-L6-v2
   └─ KNN search no OpenSearch

3. Re-indexar com embeddings
   └─ scripts/ingest_to_opensearch.py --embed

4. Testes
   └─ Validar recall vs BM25
```

### Fase 3: Reranker (RRF + Cross-Encoder) - 2-3h

```
1. Implementar RRF fusion
   └─ src/rag/reranker.py

2. Adicionar Cross-Encoder
   └─ cross-encoder/ms-marco-MiniLM-L-6-v2

3. Implementar hybrid_search()
   └─ BM25 + Vector → RRF → Cross-Encoder

4. Avaliar ganho
   └─ Medir +30% recall (como planejado)
```

### Fase 4: MCP Tool Integration - 2h

```
1. Criar MCP tool: rag_retrieve
   └─ .claude/settings.json

2. Disponibilizar para agentes
   └─ RETRIEVER pode invocar via MCP

3. Documentar uso
   └─ README atualizado
```

**Total Estimado:** 11-15h

---

## 📁 Arquivos Que Deveriam Existir (Mas Não Existem)

```
src/rag/
├── __init__.py          ❌ NÃO EXISTE
├── retriever.py         ❌ NÃO EXISTE (BM25 + Vector)
├── reranker.py          ❌ NÃO EXISTE (RRF + Cross-Encoder)
└── embeddings.py        ❌ NÃO EXISTE (Sentence Transformers)

tests/
├── test_rag_retriever.py    ❌ NÃO EXISTE
├── test_rag_reranker.py     ❌ NÃO EXISTE
└── test_rag_integration.py  ❌ NÃO EXISTE

.claude/
└── mcp_tools/
    └── rag_retrieve.json    ❌ NÃO EXISTE
```

---

## 🎯 Por Que Isso Importa

### Sem RAG:
- ❌ RETRIEVER agent usa grep (limitado)
- ❌ Não encontra padrões semânticos
- ❌ Miss snippets relevantes em arquivos grandes
- ❌ IMPLEMENTER trabalha sem contexto (mais erros)

### Com RAG:
- ✅ Busca semântica (entende intenção)
- ✅ Reranking (+30% recall)
- ✅ IMPLEMENTER vê exemplos reais
- ✅ Imita padrões do projeto (menos bugs)

---

## 📝 Próximos Passos Recomendados

### Opção 1: Implementar RAG Completo (11-15h)
- Seguir fases 1-4 acima
- Rodar avaliação para validar +30% recall
- Integrar com agentes

### Opção 2: MVP RAG (BM25 Only, 4-6h)
- Fase 1 apenas
- Suficiente para 80% dos casos
- Upgrade vector/reranker depois

### Opção 3: Continuar Sem RAG (Sonnet-Only Mode)
- Usar grep/read (ferramentas básicas)
- Funciona para projetos pequenos
- Upgrade quando precisar

---

**Qual opção você prefere?**

1. ✅ Implementar RAG completo (Blueprint v5.2 como planejado)
2. ⚠️ MVP BM25 only (quick win)
3. ❌ Adiar RAG (focar em outras features)

---

**Status:** ⚠️ INFRAESTRUTURA 100%, CORE RAG 0%
**Impacto:** Alto (agentes trabalham sem contexto adequado)
**Prioridade:** Crítica (se quiser Blueprint v5.2 completo)
