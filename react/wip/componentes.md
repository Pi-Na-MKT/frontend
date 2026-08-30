# Boas Práticas de Código e Componentes

## Diagnóstico Atual

### Pontos Positivos
- ✅ Uso correto de hooks básicos (useState, useEffect, useContext)
- ✅ Componentes funcionais modernos
- ✅ Separação de concerns com contextos
- ✅ Uso de interceptors no axios para autenticação
- ✅ Configuração de ESLint básica

### Pontos de Melhoria
- ❌ Componentes muito grandes (ex: Tarefas.jsx com 844 linhas)
- ❌ Lógica de negócios misturada com apresentação
- ❌ Repetição de código em alguns lugares
- ❌ Falta de tratamento de erros consistente
- ❌ Uso de inline styles em alguns componentes (Login.jsx)
- ❌ Nomes de variáveis pouco descritivos em alguns casos
- ❌ Falta de custom hooks para lógica reutilizável
- ❌ Comentários excessivos ou não necessários em alguns pontos

## Recomendações de Código

### 1. Componentes Grandes (Prioridade Alta)

**Problema:** `Tarefas.jsx` tem 844 linhas, tornando difícil manutenção

**Solução:** Dividir em componentes menores e mais focados

```javascript
// Estrutura sugerida para Tarefas.jsx dividido:
src/pages/Tarefas/
├── index.jsx           # Componente principal (coordena os outros)
├── KanbanBoard.jsx     # Lógica do board kanban
├── KanbanColumn.jsx    # Componente de coluna individual
├── CardModal.jsx       # Modal de criação/edição (já existe, extrair)
└── hooks/
    ├── useBoard.js     # Hook para gerenciar board
    └── useDragDrop.js  # Hook para lógica de drag & drop
```

**Exemplo de refatoração:**

```javascript
// src/pages/Tarefas/KanbanColumn.jsx
export function KanbanColumn({ column, cards, onDrop, onAddCard, ...props }) {
  return (
    <div className="flex flex-col bg-gray-100/70 rounded-2xl flex-shrink-0 w-80">
      <ColumnHeader column={column} cardCount={cards.length} />
      <ColumnContent cards={cards} onDrop={onDrop} />
      <ColumnFooter onAddCard={onAddCard} />
    </div>
  )
}
```

### 2. Custom Hooks (Prioridade Alta)

**Problema:** Lógica repetida e misturada com UI

**Solução:** Extrair lógica em hooks customizados

```javascript
// src/hooks/useAsync.js - Hook genérico para operações assíncronas
export function useAsync(asyncFunction) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, execute }
}

// Uso:
const { data, loading, error, execute } = useAsync(api.getCompanies)
```

```javascript
// src/hooks/useForm.js - Hook para gerenciamento de formulários
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const fieldError = validate?.({ ...values, [name]: value })
      setErrors(prev => ({ ...prev, [name]: fieldError?.[name] }))
    }
  }

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const fieldError = validate?.(values)
    setErrors(prev => ({ ...prev, [name]: fieldError?.[name] }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return { values, errors, touched, handleChange, handleBlur, reset }
}
```

### 3. Tratamento de Erros (Prioridade Média)

**Problema:** Tratamento inconsistente de erros (console.error em alguns lugares, alert em outros)

**Solução:** Padronizar tratamento de erros

```javascript
// src/utils/errorHandler.js
export function handleApiError(error, fallbackMessage = 'Ocorreu um erro inesperado') {
  if (error.response) {
    // Erro de resposta do servidor
    const message = error.response.data?.detail || 
                   error.response.data?.message || 
                   fallbackMessage
    return { message, status: error.response.status }
  } else if (error.request) {
    // Erro de rede/sem resposta
    return { message: 'Erro de conexão. Verifique sua internet.', status: null }
  } else {
    // Erro na configuração da requisição
    return { message: fallbackMessage, status: null }
  }
}

// Uso:
try {
  await api.post('/cards', data)
} catch (error) {
  const { message } = handleApiError(error, 'Erro ao criar card')
  setError(message)
}
```

### 4. Nomenclatura de Variáveis (Prioridade Média)

**Problema:** Nomes pouco descritivos em alguns casos

**Exemplos de melhoria:**

```javascript
// Antes:
const [pri, setPri] = useState('low')  // pri não é claro
const col = columns.find(c => c.id === id)  // col poderia ser column

// Depois:
const [priority, setPriority] = useState('low')
const column = columns.find(c => c.id === id)
```

### 5. Remover Inline Styles (Prioridade Média)

**Problema:** Login.jsx usa muitos inline styles

**Solução:** Mover para CSS classes ou styled-components

```javascript
// Antes (Login.jsx):
<div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#0F172A' }}>

// Depois (usando Tailwind):
<div className="font-sans bg-slate-900">
```

### 6. Constantes e Configurações (Prioridade Baixa)

**Problema:** Valores mágicos espalhados pelo código

**Solução:** Extrair para constantes

```javascript
// src/constants/config.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
}

export const UI_CONFIG = {
  MAX_VISIBLE_AVATARS: 3,
  DRAG_OVERLAY_COLOR: 'rgba(91,79,232,0.04)',
}

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPRESAS: '/empresas',
}
```

### 7. Comentários (Prioridade Baixa)

**Problema:** Comentários desnecessários ou óbvios

**Exemplos de remoção:**

```javascript
// Remover comentários óbvios:
const [loading, setLoading] = useState(false)  // estado de loading ❌

// Manter comentários explicativos quando necessário:
// Mapeia prioridade da API para formato interno do componente
const PRIORITY_MAP = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' } ✅
```

## Testes Unitários

### Configuração Básica (Prioridade Média)

**Recomendação:** Adicionar Jest e React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

**Exemplo de teste simples:**

```javascript
// src/components/__tests__/TarefaCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import TarefaCard from '../TarefaCard'

describe('TarefaCard', () => {
  const mockTarefa = {
    id: 1,
    titulo: 'Test Task',
    descricao: 'Test description',
    prioridade: 'high',
    completed: false,
    horas: '01/01/2026',
  }

  it('deve renderizar o título da tarefa', () => {
    render(<TarefaCard tarefa={mockTarefa} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('deve chamar onToggleComplete quando checkbox é clicado', () => {
    const mockToggle = jest.fn()
    render(<TarefaCard tarefa={mockTarefa} onToggleComplete={mockToggle} />)
    
    const checkbox = screen.getByRole('button')
    fireEvent.click(checkbox)
    
    expect(mockToggle).toHaveBeenCalledWith(1, true)
  })
})
```

## Integração com Backend

### Serviços Centralizados (Prioridade Alta)

**Problema:** Chamadas de API espalhadas pelos componentes

**Solução:** Centralizar em serviços específicos

```javascript
// src/services/taskService.js
import api from './api'

export const taskService = {
  getAll: (columnId) => api.get(`/cards/column/${columnId}`),
  create: (columnId, data) => api.post(`/cards/column/${columnId}`, data),
  update: (id, data) => api.put(`/cards/${id}`, data),
  delete: (id) => api.delete(`/cards/${id}`),
  move: (id, columnId, position) => api.put(`/cards/${id}`, { columnId, position }),
  toggleComplete: (id, completed) => api.put(`/cards/${id}`, { completed }),
  createCalendarEvent: (id) => api.post(`/cards/${id}/calendar-event`),
}

// src/services/companyService.js
export const companyService = {
  getAll: () => api.get('/companies'),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
  linkCalendar: (id) => api.post(`/companies/${id}/calendar`),
}
```

### Loading States (Prioridade Média)

**Problema:** Tratamento inconsistente de estados de carregamento

**Solução:** Padrão consistente com hooks

```javascript
// Componente wrapper para loading
export function withLoading(Component) {
  return function WrappedComponent({ loading, ...props }) {
    if (loading) {
      return <Spinner />
    }
    return <Component {...props} />
  }
}

// Ou usar o hook useAsync criado anteriormente
```

## Padrões de Código

### 1. Regras de Hooks

Já está sendo seguido corretamente, mas reforçar:
- Hooks só no topo de componentes
- Hooks só dentro de componentes React ou custom hooks
- Ordem consistente dos hooks

### 2. Props Destructuring

```javascript
// Recomendado:
function Component({ title, description, onAction }) {
  // ...
}

// Ao invés de:
function Component(props) {
  const { title, description, onAction } = props
  // ...
}
```

### 3. Default Props

```javascript
// Recomendado:
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  // ...
}

// Evitar defaultProps (padrão antigo):
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
}
```

## Ferramentas de Qualidade

### 1. Prettier (Prioridade Alta)

Adicionar Prettier para formatação automática:

```bash
npm install --save-dev prettier
```

```javascript
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 2. Melhorar ESLint (Prioridade Média)

Expandir configuração do ESLint:

```javascript
// eslint.config.js
module.exports = {
  // ... configuração existente
  rules: {
    // ... regras existentes
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
}
```

## Benefícios Esperados

1. **Manutenibilidade:** Código mais fácil de entender e modificar
2. **Testabilidade:** Componentes menores são mais fáceis de testar
3. **Reutilização:** Lógica compartilhada via custom hooks
4. **Consistência:** Padrões claros seguidos por todo o time
5. **Performance:** Componentes menores podem ter melhor renderização

## Próximos Passos

1. Escolher um componente grande para refatorar como exemplo (sugerido: Tarefas.jsx)
2. Implementar custom hooks básicos (useAsync, useForm)
3. Criar serviços centralizados para API
4. Adicionar testes para componentes principais
5. Configurar Prettier no projeto