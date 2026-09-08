# Interface e Experiência do Usuário

## Diagnóstico Atual

### Pontos Positivos
- ✅ Design moderno e limpo com Tailwind CSS
- ✅ Uso consistente de cores e espaçamentos
- ✅ Micro-animações suaves (fade-up, scale-in)
- ✅ Layout responsivo básico
- ✅ Feedback visual para estados (loading, hover, focus)
- ✅ Ícones SVG bem integrados

### Pontos de Melhoria
- ❌ Login.jsx com estilos inline hardcoded (dificulta manutenção)
- ❌ Falta de acessibilidade (ARIA labels, roles)
- ❌ Contraste de texto em alguns elementos pode ser melhorado
- ❌ Estados de erro e sucesso inconsistentes
- ❌ Feedback para ações de arrastar e soltar pode ser mais claro
- ❌ Falta de indicadores de progresso visual
- ❌ Design mobile pode ser otimizado
- ❌ Falta de skeletons para loading states

## Recomendações Visuais

### 1. Cores e Tema (Prioridade Alta)

**Situação atual:** Cores definidas no Tailwind config mas uso inconsistente

**Solução:** Criar design system mais robusto

```javascript
// tailwind.config.js - Expansão
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C3C8FF',
          300: '#A5ACFF',
          400: '#8790FF',
          500: '#5B4FE8',  // cor principal
          600: '#4840C8',
          700: '#3A32A0',
          800: '#2D2678',
          900: '#1F1A50',
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      spacing: {
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
      }
    }
  }
}
```

### 2. Tipografia (Prioridade Média)

**Situação atual:** Fonte Plus Jakarta Sans bem escolhida

**Solução:** Padronizar escala tipográfica

```css
/* src/styles/typography.css */
.text-display-xl { font-size: 2.5rem; line-height: 1.2; font-weight: 700; }
.text-display-lg { font-size: 2rem; line-height: 1.3; font-weight: 700; }
.text-display-md { font-size: 1.5rem; line-height: 1.4; font-weight: 600; }
.text-display-sm { font-size: 1.25rem; line-height: 1.5; font-weight: 600; }

.text-body-lg { font-size: 1rem; line-height: 1.6; font-weight: 400; }
.text-body-md { font-size: 0.875rem; line-height: 1.5; font-weight: 400; }
.text-body-sm { font-size: 0.75rem; line-height: 1.4; font-weight: 400; }

.text-label { font-size: 0.75rem; line-height: 1.4; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
```

### 3. Estados de Loading (Prioridade Alta)

**Situação atual:** Spinner simples mas falta skeleton para conteúdos

**Solução:** Adicionar skeleton loaders

```jsx
// src/components/ui/Skeleton.jsx
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  )
}

// Uso em cards:
export function TarefaCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-start gap-2.5 mb-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="flex-1 h-4 rounded" />
      </div>
      <Skeleton className="h-3 rounded mb-3" style={{ marginLeft: '26px' }} />
      <div className="flex items-center gap-2" style={{ marginLeft: '26px' }}>
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
    </div>
  )
}
```

### 4. Feedback Visual (Prioridade Média)

**Situação atual:** Estados básicos mas pode ser mais claro

**Solução:** Toast notifications para feedback

```jsx
// src/components/ui/Toast.jsx
import { useEffect } from 'react'

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl border shadow-lg ${styles[type]} animate-fade-up`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

// Hook para gerenciar toasts:
// src/hooks/useToast.js
export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  return { toast, showToast, hideToast }
}
```

## Acessibilidade

### 1. ARIA Labels e Roles (Prioridade Alta)

**Situação atual:** Elementos interativos sem descrições adequadas

**Solução:** Adicionar atributos ARIA

```jsx
// Antes:
<button onClick={handleToggle}>
  <svg>...</svg>
</button>

// Depois:
<button 
  onClick={handleToggle}
  aria-label={completed ? 'Marcar como não concluída' : 'Marcar como concluída'}
  aria-pressed={completed}
>
  <svg>...</svg>
</button>

// Para inputs:
<input
  type="email"
  id="email"
  aria-label="Endereço de e-mail"
  aria-describedby="email-hint"
  aria-invalid={!!errors.email}
/>
<span id="email-hint" className="text-xs text-gray-400">
  Digite seu e-mail corporativo
</span>
{errors.email && (
  <span role="alert" className="text-sm text-red-600">
    {errors.email}
  </span>
)}
```

### 2. Navegação por Teclado (Prioridade Média)

**Situação atual:** Foco básico mas pode ser melhorado

**Solução:** Melhorar ordem de tabulação e indicadores de foco

```css
/* src/styles/accessibility.css */
/* Melhorar indicador de foco */
*:focus-visible {
  outline: 2px solid #5B4FE8;
  outline-offset: 2px;
}

/* Remover outline quando não está focado */
button:focus:not(:focus-visible) {
  outline: none;
}

/* Para modais, garantir trap de foco */
[role="dialog"] {
  /* Implementar lógica de trap de foco */
}
```

### 3. Contraste de Cores (Prioridade Média)

**Situação atual:** Algumas combinações podem ter contraste insuficiente

**Solução:** Verificar e ajustar conforme WCAG AA

```javascript
// Cores com melhor contraste:
// primary-500 (#5B4FE8) com branco: contraste 4.5:1 ✅ (passa WCAG AA)
// primary-500 com texto cinza escuro: contraste 7:1 ✅ (passa WCAG AAA)

// Ajustes sugeridos:
.text-gray-400 { color: #6B7280; }  // contraste melhor com fundo claro
.text-gray-500 { color: #4B5563; }  // contraste melhor com fundo claro
```

### 4. Screen Readers (Prioridade Baixa)

**Solução:** Adicionar regiões live para atualizações dinâmicas

```jsx
// Para atualizações dinâmicas (loading, notificações):
<div role="status" aria-live="polite" aria-atomic="true">
  {loading && <span>Carregando dados...</span>}
</div>

// Para mensagens de erro importantes:
<div role="alert" aria-live="assertive">
  {error && <span>{error}</span>}
</div>
```

## Responsividade

### 1. Mobile Optimization (Prioridade Alta)

**Situação atual:** Layout responsivo básico mas pode ser melhorado

**Solução:** Otimizar para mobile

```jsx
// Kanban board em mobile:
// Em vez de scroll horizontal, mostrar colunas como abas ou lista

// src/pages/Tarefas/MobileKanban.jsx
export function MobileKanban({ columns, cardsByColumn }) {
  const [activeColumn, setActiveColumn] = useState(0)

  return (
    <div className="lg:hidden">
      {/* Abas para seleção de coluna */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {columns.map((col, index) => (
          <button
            key={col.id}
            onClick={() => setActiveColumn(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeColumn === index 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {col.label} ({cardsByColumn[col.id]?.length || 0})
          </button>
        ))}
      </div>

      {/* Cards da coluna ativa */}
      <div className="mt-4 space-y-3">
        {(cardsByColumn[columns[activeColumn]?.id] || []).map(card => (
          <TarefaCard key={card.id} tarefa={card} />
        ))}
      </div>
    </div>
  )
}
```

### 2. Touch Targets (Prioridade Média)

**Solução:** Garantir áreas de toque adequadas (mínimo 44x44px)

```jsx
// Botões pequenos em mobile:
<button className="p-3 min-w-[44px] min-h-[44px] lg:p-2 lg:min-w-0 lg:min-h-0">
  <svg className="w-4 h-4" />
</button>
```

### 3. Orientação de Dispositivo (Prioridade Baixa)

**Solução:** Otimizar para landscape em tablets

```css
/* Em landscape, aproveitar espaço horizontal */
@media (orientation: landscape) and (max-height: 600px) {
  .kanban-board {
    flex-direction: row;
  }
}
```

## Micro-interações

### 1. Animações de Drag & Drop (Prioridade Média)

**Situação atual:** Feedback básico mas pode ser mais claro

**Solução:** Melhorar feedback visual

```css
/* Adicionar ao index.css */
.dragging {
  opacity: 0.5;
  transform: rotate(3deg);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.drag-over {
  background: rgba(91, 79, 232, 0.08);
  border: 2px dashed #5B4FE8;
}

.drag-over-card {
  transform: translateY(4px);
  opacity: 0.8;
}
```

### 2. Hover States (Prioridade Baixa)

**Solução:** Tornar interações mais suaves

```css
.card-hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91,79,232,0.15);
}
```

## Estados Vazios

### 1. Empty States (Prioridade Média)

**Situação atual:** Mensagens básicas mas podem ser mais ilustrativas

**Solução:** Criar componente de empty state

```jsx
// src/components/ui/EmptyState.jsx
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  illustration 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {illustration || (
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

// Uso:
<EmptyState
  icon={<svg className="w-8 h-8 text-gray-400">...</svg>}
  title="Nenhuma tarefa encontrada"
  description="Crie sua primeira tarefa para começar a organizar seu trabalho."
  action={<button className="btn-primary">Criar tarefa</button>}
/>
```

## Design System

### 1. Componentes UI Reutilizáveis (Prioridade Alta)

**Solução:** Criar biblioteca de componentes básicos

```jsx
// src/components/ui/Button.jsx
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${sizes[size]}`}
      disabled={loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}

// src/components/ui/Input.jsx
export function Input({ 
  label, 
  error, 
  hint, 
  icon, 
  ...props 
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
            error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'
          } ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {hint && !error && (
        <span className="text-xs text-gray-400">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}
```

## Benefícios Esperados

1. **Acessibilidade:** Aplicação usável por todos os usuários
2. **Consistência:** Interface unificada em toda a aplicação
3. **Performance:** Melhor experiência em dispositivos variados
4. **Manutenibilidade:** Componentes reutilizáveis e padronizados
5. **Profissionalismo:** Interface mais polida e cuidada

## Próximos Passos

1. Criar componentes UI básicos (Button, Input, Card)
2. Adicionar skeleton loaders para estados de loading
3. Implementar sistema de toast notifications
4. Melhorar acessibilidade com ARIA labels
5. Otimizar layout para mobile
6. Criar empty states ilustrativos