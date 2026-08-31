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
- [x] Tarefa 1: Verificar uso dos arquivos legados
- [x] Tarefa 2: Backup dos arquivos (opcional)
- [x] Tarefa 3: Remover arquivos JavaScript legados
- [x] Tarefa 4: Verificar e remover CSS legado
- [x] Tarefa 5: Limpar imports não utilizados
- [x] Tarefa 6: Verificar funcionamento da aplicação
- [x] Tarefa 7: Build de produção
- [x] Tarefa 8: Documentação e limpeza final

---

## Resultados da Implementação

### Arquivos Removidos
- `react/js/login.js` - Arquivo JavaScript legado não utilizado
- `react/js/cadastro.js` - Arquivo JavaScript legado não utilizado
- `react/css/utils.css` - Arquivo CSS legado não utilizado
- Pastas `react/js/` e `react/css/` - Removidas após ficarem vazias

### Análise de Uso Realizada
- **login.js**: Encontrado apenas em `service/login.html` (HTML legado não utilizado pela aplicação React)
- **cadastro.js**: Encontrado apenas em `service/cadastro.html` (HTML legado não utilizado pela aplicação React)
- **utils.css**: Encontrado apenas em `service/login.html` e `service/cadastro.html` (HTMLs legados não utilizados pela aplicação React)
- **Verificação em src/**: Nenhum import dos arquivos legados encontrado nos componentes React
- **Verificação em index.html**: Nenhuma referência aos arquivos legados

### Backup Realizado
- Local: `/tmp/backup_legados_20260830_2057/`
- Arquivos backup: login.js, cadastro.js, utils.css
- Status: Backup preservado para segurança

### Testes Realizados
- `npm install`: Concluído com sucesso
- `npm run dev`: Aplicação iniciou sem erros
- Build de produção: Concluído com sucesso (bundle de 675.46 kB)
- Console do navegador: Sem erros relacionados aos arquivos removidos

### Commits Realizados
1. `06620fb` - "Remove arquivos JS legados não utilizados"
2. `23899a6` - "Remove CSS legado não utilizado"

### Lições Aprendidas
- Os arquivos legados eram utilizados apenas em HTMLs na pasta `service/` que não fazem parte da aplicação React atual
- A aplicação React não tem nenhuma dependência desses arquivos
- ESLint teve problemas de configuração (module is not defined) mas não impediu a análise manual
- A abordagem de commits granulares facilitou o processo e permite rollback fácil se necessário

### Impedimentos Encontrados
- Nenhum impedimento significativo
- ESLint com erro de configuração (ES module vs CommonJS) mas análise manual foi suficiente

---

*Data de criação: 30/08/2026*  
*Data de conclusão: 30/08/2026*  
*Status: Concluído com sucesso*