# Spec Design: Remover Arquivos Legados

## Visão Geral
Esta feature tem como objetivo remover arquivos legados do projeto que não são utilizados na aplicação React atual, proporcionando uma limpeza técnica e reduzindo confusão na estrutura do projeto.

## Contexto
O projeto contém arquivos de versões anteriores (login.js, cadastro.js, utils.css) que não fazem parte da aplicação React atual. Manter esses arquivos cria confusão e dificulta a manutenção do projeto.

## Objetivos
- Remover arquivos JavaScript legados não utilizados
- Verificar e remover CSS legado não utilizado
- Limpar imports não utilizados nos arquivos ativos
- Garantir que a aplicação continue funcionando corretamente após a remoção

## Critérios de Sucesso
- [ ] Arquivos legados removidos sem quebrar a aplicação
- [ ] Build e execução da aplicação funcionam corretamente
- [ ] Nenhum erro de console relacionado a arquivos removidos
- [ ] Estrutura do projeto mais limpa e organizada

## Tarefas Detalhadas

### Tarefa 1: Verificar uso dos arquivos legados
**Esforço estimado:** 15 minutos  
**Responsável:** -

**Ações:**
- [ ] Pesquisar por imports/referências a `js/login.js` em todo o projeto
- [ ] Pesquisar por imports/referências a `js/cadastro.js` em todo o projeto
- [ ] Pesquisar por imports/referências a `css/utils.css` em todo o projeto
- [ ] Verificar se há referências no `index.html`
- [ ] Documentar findings no checklist

**Critérios de conclusão:**
- Confirmação de que os arquivos não são referenciados em nenhum lugar do projeto

---

### Tarefa 2: Backup dos arquivos (opcional)
**Esforço estimado:** 5 minutos  
**Responsável:** -

**Ações:**
- [ ] Criar pasta `backup_legados` fora do git
- [ ] Copiar `js/login.js` para backup
- [ ] Copiar `js/cadastro.js` para backup
- [ ] Copiar `css/utils.css` para backup (se existir)
- [ ] Documentar local do backup

**Critérios de conclusão:**
- Backup criado em local seguro fora do controle de versão

---

### Tarefa 3: Remover arquivos JavaScript legados
**Esforço estimado:** 5 minutos  
**Responsável:** -

**Ações:**
- [ ] Remover `js/login.js`
- [ ] Remover `js/cadastro.js`
- [ ] Verificar se pasta `js/` fica vazia e pode ser removida
- [ ] Commit: "Remove arquivos JS legados não utilizados"

**Critérios de conclusão:**
- Arquivos removidos do sistema de arquivos
- Commit criado com mensagem descritiva

---

### Tarefa 4: Verificar e remover CSS legado
**Esforço estimado:** 10 minutos  
**Responsável:** -

**Ações:**
- [ ] Verificar se `css/utils.css` existe
- [ ] Se existir, verificar se é utilizado
- [ ] Se não utilizado, remover `css/utils.css`
- [ ] Verificar se pasta `css/` fica vazia e pode ser removida
- [ ] Commit: "Remove CSS legado não utilizado"

**Critérios de conclusão:**
- CSS legado removido se não utilizado
- Commit criado com mensagem descritiva

---

### Tarefa 5: Limpar imports não utilizados
**Esforço estimado:** 20 minutos  
**Responsável:** -

**Ações:**
- [ ] Analisar arquivos em `src/` para imports não utilizados
- [ ] Usar ESLint para detectar imports não utilizados
- [ ] Remover imports não utilizados encontrados
- [ ] Verificar se há imports de arquivos que foram removidos
- [ ] Commit: "Remove imports não utilizados"

**Critérios de conclusão:**
- Imports não utilizados removidos
- Sem erros de ESLint relacionados a imports
- Commit criado com mensagem descritiva

---

### Tarefa 6: Verificar funcionamento da aplicação
**Esforço estimado:** 15 minutos  
**Responsável:** -

**Ações:**
- [ ] Limpar cache do node_modules se necessário
- [ ] Rodar `npm install` para garantir dependências
- [ ] Iniciar aplicação com `npm run dev`
- [ ] Verificar console do navegador por erros
- [ ] Testar navegação básica da aplicação
- [ ] Verificar se todas as telas carregam corretamente

**Critérios de conclusão:**
- Aplicação inicia sem erros
- Console limpo sem erros relacionados a arquivos removidos
- Funcionalidades básicas funcionando

---

### Tarefa 7: Build de produção
**Esforço estimado:** 10 minutos  
**Responsável:** -

**Ações:**
- [ ] Rodar `npm run build`
- [ ] Verificar se build completa sem erros
- [ ] Verificar tamanho do bundle
- [ ] Testar build localmente se possível

**Critérios de conclusão:**
- Build de produção completa com sucesso
- Sem erros ou warnings relacionados a arquivos removidos

---

### Tarefa 8: Documentação e limpeza final
**Esforço estimado:** 10 minutos  
**Responsável:** -

**Ações:**
- [ ] Atualizar este spec design com findings reais
- [ ] Documentar quais arquivos foram removidos
- [ ] Documentar qualquer impedimento encontrado
- [ ] Remover pasta de backup se tudo estiver funcionando
- [ ] Commit final: "Completa remoção de arquivos legados"

**Critérios de conclusão:**
- Spec design atualizado com lições aprendidas
- Documentação completa do que foi feito
- Limpeza final concluída

---

## Riscos e Mitigações

### Risco: Arquivo pode ser utilizado de forma indireta
**Mitigação:** Pesquisa completa por referências antes da remoção, backup dos arquivos

### Risco: Quebra de build após remoção
**Mitigação:** Testes thorough de build e execução, commit granular para facilitar rollback

### Risco: Referências em arquivos de configuração
**Mitigação:** Verificação de index.html, vite.config.js e outros arquivos de configuração

## Dependências
- Nenhuma dependência externa
- Pode ser executada independentemente de outras features

## Notas
- Esta é uma feature de baixo risco e alto valor
- Deve ser executada com cuidado para garantir que nada importante seja removido
- Commits granulares facilitam rollback se necessário

## Status
- [ ] Tarefa 1: Verificar uso dos arquivos legados
- [ ] Tarefa 2: Backup dos arquivos (opcional)
- [ ] Tarefa 3: Remover arquivos JavaScript legados
- [ ] Tarefa 4: Verificar e remover CSS legado
- [ ] Tarefa 5: Limpar imports não utilizados
- [ ] Tarefa 6: Verificar funcionamento da aplicação
- [ ] Tarefa 7: Build de produção
- [ ] Tarefa 8: Documentação e limpeza final

---

*Data de criação: 30/08/2026*  
*Status: Em planejamento*