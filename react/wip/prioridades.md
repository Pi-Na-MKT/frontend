# Plano de Melhoria Incremental

## Visão Geral

Este documento organiza as melhorias propostas em ordem de prioridade, com foco em entregar valor rápido ao time while mantendo qualidade. Cada melhoria inclui estimativa de esforço e impacto esperado.

## Prioridade Alta

### 1. Remover Arquivos Legados
**Esforço:** 30 minutos  
**Impacto:** Limpeza técnica, remove confusão

**Ações:**
- [ ] Remover `legacy-js/login.js` (não utilizado)
- [ ] Remover `legacy-js/cadastro.js` (não utilizado)
- [ ] Verificar e remover `legacy-css/utils.css` se não usado
- [ ] Limpar imports não utilizados

**Justificativa:** Arquivos de versão anterior que não fazem parte da aplicação React atual.

---

### 2. Refatorar Tarefas.jsx
**Esforço:** 4-6 horas  
**Impacto:** Alta manutenibilidade, teste facilitado

**Ações:**
- [ ] Extrair `KanbanColumn.jsx` como componente separado
- [ ] Criar `useBoard.js` hook para lógica do board
- [ ] Criar `useDragDrop.js` hook para drag & drop
- [ ] Mover `CardModal.jsx` para pasta components
- [ ] Reduzir arquivo principal para <300 linhas

**Justificativa:** Componente de 844 linhas é difícil de manter e testar.

---

### 3. Criar Serviços Centralizados de API
**Esforço:** 2-3 horas  
**Impacto:** Consistência, reutilização

**Ações:**
- [ ] Criar `src/services/taskService.js`
- [ ] Criar `src/services/companyService.js`
- [ ] Criar `src/services/userService.js`
- [ ] Migrar chamadas diretas de API nos componentes
- [ ] Atualizar imports nos componentes

**Justificativa:** Chamadas de API espalhadas dificultam manutenção e testes.

---

### 4. Adicionar Prettier
**Esforço:** 1 hora  
**Impacto:** Consistência de código, menos discussões de estilo

**Ações:**
- [ ] Instalar prettier
- [ ] Criar `.prettierrc` com configuração
- [ ] Adicionar script format no package.json
- [ ] Configurar pre-commit hook (opcional)
- [ ] Formatar todos os arquivos existentes

**Justificativa:** Formatação automática economiza tempo e padroniza código.

---

### 5. Implementar Toast Notifications
**Esforço:** 2-3 horas  
**Impacto:** Melhor feedback ao usuário

**Ações:**
- [ ] Criar `src/components/ui/Toast.jsx`
- [ ] Criar `src/hooks/useToast.js`
- [ ] Implementar em ações importantes (criar, editar, excluir)
- [ ] Adicionar estados: success, error, warning, info

**Justificativa:** Feedback visual claro melhora experiência do usuário.

---

## Prioridade Média

### 6. Criar Custom Hooks Básicos
**Esforço:** 3-4 horas  
**Impacto:** Reutilização de lógica, código mais limpo

**Ações:**
- [ ] Criar `src/hooks/useAsync.js`
- [ ] Criar `src/hooks/useForm.js`
- [ ] Migrar lógica de formulários para useForm
- [ ] Migrar chamadas assíncronas para useAsync

**Justificativa:** Evita repetição de código e padroniza padrões.

---

### 7. Melhorar Tratamento de Erros
**Esforço:** 2 horas  
**Impacto:** Melhor experiência, debugging facilitado

**Ações:**
- [ ] Criar `src/utils/errorHandler.js`
- [ ] Padronizar tratamento em todos os componentes
- [ ] Remover console.error e alert substituindo por toasts
- [ ] Adicionar logging apropriado

**Justificativa:** Tratamento inconsistente confunde usuários e desenvolvedores.

---

### 8. Adicionar Skeleton Loaders
**Esforço:** 2-3 horas  
**Impacto:** Percepção de performance melhor

**Ações:**
- [ ] Criar `src/components/ui/Skeleton.jsx`
- [ ] Criar `TaskCardSkeleton.jsx`
- [ ] Criar `EmpresaCardSkeleton.jsx`
- [ ] Implementar em telas com loading

**Justificativa:** Loading mais profissional melhora percepção de performance.

---

### 9. Melhorar Acessibilidade Básica
**Esforço:** 3-4 horas  
**Impacto:** Aplicação mais inclusiva

**Ações:**
- [ ] Adicionar aria-labels em botões sem texto
- [ ] Adicionar roles em elementos interativos
- [ ] Melhorar contraste de cores problemáticas
- [ ] Adicionar focus-visible styles
- [ ] Testar navegação por teclado

**Justificativa:** Acessibilidade é requisito importante e boa prática.

---

### 10. Criar Componentes UI Básicos
**Esforço:** 4-5 horas  
**Impacto:** Consistência visual, desenvolvimento mais rápido

**Ações:**
- [ ] Criar `src/components/ui/Button.jsx`
- [ ] Criar `src/components/ui/Input.jsx`
- [ ] Criar `src/components/ui/Select.jsx`
- [ ] Migrar componentes existentes para usar UI components
- [ ] Documentar componentes

**Justificativa:** Componentes reutilizáveis aceleram desenvolvimento futuro.

---

### 11. Melhorar Responsividade Mobile
**Esforço:** 3-4 horas  
**Impacto:** Experiência mobile melhor

**Ações:**
- [ ] Criar `MobileKanban.jsx` para kanban em mobile
- [ ] Melhorar touch targets (mínimo 44x44px)
- [ ] Otimizar sidebar para mobile
- [ ] Testar em dispositivos reais

**Justificativa:** Mobile-first é padrão moderno e esperado pelos usuários.

---

### 12. Criar Constantes Centralizadas
**Esforço:** 1-2 horas  
**Impacto:** Manutenibilidade, evitar magic numbers

**Ações:**
- [ ] Criar `src/constants/priority.js`
- [ ] Criar `src/constants/config.js`
- [ ] Criar `src/constants/routes.js`
- [ ] Migrar constantes dos componentes

**Justificativa:** Valores mágicos espalhados dificultam manutenção.

---

## Prioridade Baixa

### 13. Adicionar Testes Unitários
**Esforço:** 8-12 horas  
**Impacto:** Qualidade, confiança em mudanças

**Ações:**
- [ ] Configurar Jest e React Testing Library
- [ ] Criar testes para TaskCard
- [ ] Criar testes para EmpresaCard
- [ ] Criar testes para hooks customizados
- [ ] Configurar CI para rodar testes

**Justificativa:** Testes previnem regressões e documentam comportamento.

---

### 14. Melhorar Login.jsx (Remover Inline Styles)
**Esforço:** 2-3 horas  
**Impacto:** Manutenibilidade, consistência

**Ações:**
- [ ] Mover estilos inline para classes Tailwind
- [ ] Criar componente Login separado do estilo
- [ ] Padronizar com outras páginas

**Justificativa:** Inline styles dificultam manutenção e theming.

---

### 15. Criar Empty States
**Esforço:** 2-3 horas  
**Impacto:** Experiência do usuário mais guiada

**Ações:**
- [ ] Criar `src/components/ui/EmptyState.jsx`
- [ ] Implementar em listas vazias
- [ ] Adicionar ilustrações ou ícones
- [ ] Incluir call-to-action quando apropriado

**Justificativa:** Empty states orientam usuários em situações de não-dados.

---

### 16. Otimizar Animações
**Esforço:** 2 horas  
**Impacto:** Performance, experiência mais suave

**Ações:**
- [ ] Melhorar feedback de drag & drop
- [ ] Otimizar transições CSS
- [ ] Adicionar will-change onde necessário
- [ ] Testar performance em dispositivos mais lentos

**Justificativa:** Animações bem implementadas melhoram UX sem prejudicar performance.

---

### 17. Organizar Mock Files
**Esforço:** 1 hora  
**Impacto:** Organização, clareza

**Ações:**
- [ ] Mover mock files para `src/mock/data/`
- [ ] Documentar estrutura de mock
- [ ] Remover mocks não utilizados

**Justificativa:** Estrutura organizada facilita finding e manutenção.

---

### 18. Melhorar Contraste de Cores
**Esforço:** 1-2 horas  
**Impacto:** Acessibilidade, legibilidade

**Ações:**
- [ ] Auditar contraste com ferramenta online
- [ ] Ajustar cores problemáticas
- [ ] Documentar paleta acessível

**Justificativa:** Contraste adequado é requisito de acessibilidade.

---

### 19. Adicionar Screen Reader Support
**Esforço:** 2-3 horas  
**Impacto:** Acessibilidade avançada

**Ações:**
- [ ] Adicionar aria-live regions
- [ ] Adicionar descrições para elementos complexos
- [ ] Testar com screen reader

**Justificativa:** Suporte a screen readers torna aplicação verdadeiramente acessível.

---

### 20. Melhorar ESLint Config
**Esforço:** 1 hora  
**Impacto:** Qualidade de código, catching bugs

**Ações:**
- [ ] Adicionar regras adicionais
- [ ] Configurar no-console como warn
- [ ] Adicionar prefer-const e no-var
- [ ] Documentar regras customizadas

**Justificativa:** Linting mais rigoroso previne problemas comuns.

---

## Cronograma Sugerido

### Semana 1 (Quick Wins)
- Dia 1-2: Remover arquivos legados, adicionar Prettier
- Dia 3-4: Criar serviços centralizados de API
- Dia 5: Implementar toast notifications

### Semana 2 (Componentes e Hooks)
- Dia 1-2: Refatorar Tarefas.jsx (parte 1)
- Dia 3-4: Criar custom hooks básicos
- Dia 5: Continuar refatoração Tarefas.jsx

### Semana 3 (UI e UX)
- Dia 1-2: Criar componentes UI básicos
- Dia 3-4: Adicionar skeleton loaders
- Dia 5: Melhorar tratamento de erros

### Semana 4 (Acessibilidade e Mobile)
- Dia 1-2: Melhorar acessibilidade básica
- Dia 3-4: Melhorar responsividade mobile
- Dia 5: Criar constantes centralizadas

### Semana 5+ (Itens de Prioridade Baixa)
- Implementar conforme disponibilidade e prioridade do time

## Critérios de Conclusão

Cada item é considerado completo quando:
- [ ] Código implementado e testado manualmente
- [ ] Code review realizado por outro membro do time
- [ ] Documentação atualizada se necessário
- [ ] Sem regressões em funcionalidades existentes

## Métricas de Sucesso

### Qualitativas
- Time consegue encontrar arquivos mais rapidamente
- Novos membros entendem estrutura com menos ajuda
- Mudanças causam menos bugs não intencionais
- Interface parece mais profissional e consistente

### Quantitativas
- Tempo de onboarding de novos membros reduz em 30%
- Número de bugs relacionados a UI reduz em 25%
- Tempo para implementar novas features reduz em 20%
- Score de acessibilidade (Lighthouse) aumenta para >90

## Riscos e Mitigações

### Risco: Time resistente a mudanças
**Mitigação:** Implementar gradualmente, demonstrar benefícios, permitir feedback

### Risco: Estimativas incorretas de tempo
**Mitigação:** Começar com itens pequenos, ajustar estimativas baseado em experiência real

### Risco: Regressões em funcionalidades existentes
**Mitigação:** Testes manuais cuidadosos, implementar em branches, code review rigoroso

### Risco: Escopo aumentando durante implementação
**Mitigação:** Manter foco no item específico, documentar ideias extras para futuro

## Próximos Passos Imediatos

1. **Reunião com o time** (30 min)
   - Apresentar plano completo
   - Discutir prioridades
   - Definir responsáveis por cada item

2. **Setup inicial** (1 dia)
   - Configurar Prettier
   - Remover arquivos legados
   - Configurar branch de trabalho

3. **Começar pelo primeiro item de alta prioridade**
   - Escolher item com maior impacto/ menor esforço
   - Documentar processo para servir de exemplo

---

*Este é um documento vivo. Atualize conforme progresso e aprendizados do time.*