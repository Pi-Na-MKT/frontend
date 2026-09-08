# Arquitetura e Estrutura de Pastas

## Diagnóstico Atual

### Pontos Positivos
- ✅ Uso de estrutura padrão React (`src/`, `components/`, `pages/`)
- ✅ Separação básica entre componentes e páginas
- ✅ Uso de contextos para gerenciamento de estado global
- ✅ Serviços centralizados para chamadas de API

### Pontos de Melhoria
- ❌ Arquivos legados em `legacy-js/` que não estão sendo usados (`login.js`, `cadastro.js`)
- ❌ Falta de padronização na nomenclatura de arquivos (mistura de `.jsx` e `.js`)
- ❌ Estrutura de componentes poderia ser mais granular
- ❌ Falta de separação entre hooks customizados, utilitários e constantes
- ❌ Mock files em `mock/` poderiam estar em uma estrutura mais organizada

## Recomendações de Estrutura

### Estrutura Sugerida

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes genéricos (Button, Input, Modal, etc.)
│   ├── layout/          # Componentes de layout (Navbar, Sidebar, etc.)
│   └── business/        # Componentes específicos do domínio (TaskCard, EmpresaCard)
├── pages/               # Páginas/rotas da aplicação
├── hooks/               # Hooks customizados
├── context/             # Contextos do React
├── services/            # Serviços de API e integrações
├── utils/               # Funções utilitárias
├── constants/           # Constantes e configurações
├── types/               # Tipos TypeScript (se adotar TS no futuro)
├── assets/              # Imagens, ícones, fontes
├── styles/              # Estilos globais e temas
└── config/              # Configurações da aplicação
```

### Nomenclatura de Arquivos

**Regras atuais:**
- Mistura entre `.jsx` e `.js`
- Alguns componentes sem sufixo consistente

**Recomendações:**
- Componentes React: `NomeComponente.jsx` (PascalCase)
- Hooks customizados: `useNomeHook.js` (camelCase com prefixo "use")
- Serviços: `nomeServico.js` (camelCase)
- Utilitários: `nomeUtilitario.js` (camelCase)
- Constantes: `CONSTANTE.js` (UPPER_CASE para exportações de constantes)
- Páginas: `NomePagina.jsx` (PascalCase)

### Exemplos de Renomeação

```
src/components/TarefaCard.jsx      ✅ (já correto)
src/components/EmpresaCard.jsx     ✅ (já correto)
src/components/Modal.jsx           ✅ (já correto)
src/context/AuthContext.jsx        ✅ (já correto)
src/services/api.js               ✅ (já correto)

src/components/Spinner.jsx        (deixar como .jsx para consistência)
src/pages/Login.jsx                ✅ (já correto)
src/pages/Dashboard.jsx           ✅ (já correto)
```

## Ações Imediatas

### 1. Remover Arquivos Legados (Prioridade Alta)

**Arquivos para remover:**
- `legacy-js/login.js` - Não utilizado no projeto React atual
- `legacy-js/cadastro.js` - Não utilizado no projeto React atual
- `legacy-css/utils.css` - Verificar se está sendo usado, caso contrário remover

**Justificativa:** Estes arquivos parecem ser de uma versão anterior do projeto em JavaScript puro e não estão integrados com a aplicação React atual.

### 2. Criar Estrutura de Hooks Customizados (Prioridade Média)

**Situação atual:** Lógica de negócios misturada com componentes

**Recomendação:** Extrair lógica reutilizável em hooks customizados

```javascript
// Exemplo: src/hooks/useTasks.js
import { useState, useEffect } from 'react'
import api from '../services/api'

export function useTasks(boardId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [boardId])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/boards/${boardId}/tasks`)
      setTasks(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { tasks, loading, error, reload: loadTasks }
}
```

### 3. Criar Pasta de Constantes (Prioridade Média)

**Situação atual:** Constantes espalhadas pelos componentes

**Recomendação:** Centralizar constantes e configurações

```javascript
// src/constants/priority.js
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  CRITICAL: 'high',
}

export const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'LOW', label: 'Baixa' },
]

export const PRIORITY_CONFIG = {
  high: { label: 'Alta', color: 'red', dot: 'bg-red-400' },
  medium: { label: 'Média', color: 'amber', dot: 'bg-amber-400' },
  low: { label: 'Baixa', color: 'emerald', dot: 'bg-emerald-400' },
}
```

### 4. Organizar Mock Files (Prioridade Baixa)

**Situação atual:** Mock files na raiz do projeto

**Recomendação:** Mover para estrutura mais organizada

```
src/
├── mock/
│   ├── data/
│   │   ├── db.json
│   │   └── userMock.json
│   └── server.js (se necessário)
```

## Exemplo de Implementação

### Reorganização do TaskCard

**Antes (Tarefas.jsx):**
```javascript
// Lógica de mapeamento misturada com componente
const mapCard = (card) => ({
  id: card.id,
  titulo: card.title || 'Sem título',
  // ... mais lógica
})
```

**Depois (hooks/useCardMapping.js):**
```javascript
// src/hooks/useCardMapping.js
export function mapCard(card) {
  return {
    id: card.id,
    titulo: card.title || 'Sem título',
    descricao: card.description || '',
    prioridade: PRIORITY_MAP[card.priority] || 'low',
    // ... mais lógica
  }
}
```

## Benefícios Esperados

1. **Manutenibilidade:** Código mais fácil de encontrar e modificar
2. **Escalabilidade:** Estrutura que cresce com o projeto
3. **Colaboração:** Time sabe onde encontrar cada tipo de arquivo
4. **Consistência:** Padrões claros para nomenclatura e organização

## Próximos Passos

1. Reunir com o time para discutir a estrutura proposta
2. Criar branches para cada reorganização
3. Atualizar documentação conforme mudanças são implementadas
4. Revisar estrutura periodicamente (sugerido: a cada 3 meses)