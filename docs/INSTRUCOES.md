# Instruções para Avaliação do Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS)

Prezado Professor,

Este documento contém instruções detalhadas para configurar, executar e avaliar o SGHSS, demonstrando o cumprimento de todos os requisitos solicitados no projeto.

## Requisitos de Sistema

- Node.js versão 16 ou superior
- PNPM (recomendado) ou NPM
- Navegador moderno (Chrome, Firefox, Edge)

## Instalação e Execução do Sistema

### 1. Preparando o Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/Sistema-Gestao-Hospitalar.git
cd Sistema-Gestao-Hospitalar
```

2. Instale o JSON Server globalmente (caso ainda não tenha):

```bash
npm install -g json-server
# ou
pnpm add -g json-server
```

### 2. Executando a API Simulada (Requisito: Simulação de API)

1. Navegue até o diretório da API:

```bash
cd api
```

2. Inicie o JSON Server:

```bash
json-server --watch db.json --port 3001
```

3. Confirme o funcionamento da API acessando:

```
http://localhost:3001/users
```

### 3. Executando o Frontend

1. Em outro terminal, navegue até o diretório do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
pnpm install
# ou
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
# ou
npm run dev
```

4. Acesse o aplicativo no navegador:

```
http://localhost:5173
```

## Credenciais para Avaliação

Utilize estas credenciais para acessar os diferentes perfis do sistema:

| Perfil              | Email                    | Senha     |
|---------------------|--------------------------|-----------|
| **Administrador**   | <admin@sghss.com>          | admin123  |
| **Profissional**    | <ana.oliveira@example.com> | 12345678  |
| **Paciente**        | <carlos@example.com>       | 12345678  |

## Roteiro para Avaliação dos Requisitos Funcionais

### RF001 - Autenticação e Controle de Acesso ✅

1. Acesse a página inicial em `http://localhost:5173`
2. Faça login com as credenciais de cada perfil de usuário
3. **Verificação**: Cada perfil deve ser redirecionado para seu respectivo dashboard
4. **Verificação adicional**: Tente acessar `http://localhost:5173/admin` diretamente com um usuário paciente para testar a proteção de rotas

### RF002 - Dashboard por Perfil ✅

#### Dashboard do Paciente

1. Faça login como paciente
2. **Verificação**: O dashboard deve exibir:
   - Cards com resumo de consultas (agendadas, realizadas, canceladas)
   - Próximas consultas marcadas
   - Gráfico simplificado de histórico médico

#### Dashboard do Profissional

1. Faça login como profissional
2. **Verificação**: O dashboard deve exibir:
   - Agenda do dia com horários e pacientes
   - Lista de prontuários recentes
   - Indicadores de atendimentos

#### Dashboard do Administrador

1. Faça login como administrador
2. **Verificação**: O dashboard deve exibir:
   - Gráficos de ocupação por especialidade
   - Indicadores financeiros simples
   - Visão geral dos atendimentos

### RF003 - Agendamento de Consultas ✅

1. Faça login como paciente
2. No menu lateral, acesse "Consultas"
3. Clique no botão "Agendar Nova Consulta"
4. Preencha o formulário:
   - Selecione um profissional
   - Escolha uma data e horário disponíveis
   - Selecione o tipo de consulta
   - Adicione observações (opcional)
5. Clique em "Confirmar Agendamento"
6. **Verificação**: A consulta criada deve aparecer na lista de "Próximas Consultas"
7. Teste também o cancelamento clicando em "Cancelar Consulta" em uma consulta existente

### RF004 - Gerenciamento de Prontuários ✅

1. Faça login como profissional
2. No menu lateral, acesse "Prontuários"
3. Use a barra de busca para encontrar o paciente "Carlos Ferreira"
4. Clique em "Acessar Prontuário"
5. **Verificação**: Visualize o histórico de atendimentos
6. Crie um novo registro:
   - Clique em "Novo Registro"
   - Preencha os campos (título, tipo, descrição, etc.)
   - Salve o registro
7. **Verificação**: O novo registro deve aparecer na lista de registros do prontuário

### RF005 - Emissão de Receitas Digitais ✅

1. Faça login como profissional
2. Acesse o prontuário de um paciente como descrito acima
3. Clique em "Emitir Prescrição"
4. Adicione um medicamento:
   - Nome: "Paracetamol"
   - Dosagem: "500mg"
   - Frequência: "8/8h"
   - Duração: "3 dias"
5. Adicione instruções adicionais
6. Clique em "Emitir Prescrição"
7. Faça logout e entre como paciente
8. **Verificação**: Acesse "Histórico Médico" para visualizar a receita emitida
9. Teste a opção de visualizar/imprimir a receita

### RF006 - Telemedicina Simulada ✅

1. Faça login como paciente
2. Acesse "Teleconsultas" no menu lateral
3. Entre em uma consulta disponível clicando em "Entrar na Sala"
4. **Verificação**: Deve abrir uma interface com:
   - Áreas para vídeo (médico e paciente)
   - Controles de câmera e microfone
   - Chat para comunicação textual
5. Teste o envio de mensagens no chat

### RF007 - Gerenciamento de Usuários ✅

1. Faça login como administrador
2. Acesse "Gerenciamento de Usuários" no menu lateral
3. **Verificação**: Visualize a lista completa de usuários
4. Teste as seguintes ações:
   - Criar novo usuário: clique em "Novo Usuário" e preencha o formulário
   - Editar usuário: clique em "Editar" em um usuário existente
   - Filtrar usuários: use os filtros por perfil e status
   - Buscar usuário: use a barra de busca por nome ou email

### RF008 - Relatórios Básicos ✅

1. Faça login como administrador
2. No dashboard, acesse a seção "Relatórios" (ou link equivalente)
3. **Verificação**: Visualize os seguintes relatórios:
   - Ocupação por especialidade médica
   - Indicadores financeiros básicos
   - Atendimentos por período
4. Teste os filtros por período (semana/mês/ano) onde disponíveis

## Avaliação de Requisitos Não-Funcionais

### RNF001 - Responsividade ✅

1. Acesse o sistema em um computador desktop
2. Use as ferramentas de desenvolvedor do navegador (F12) para simular diferentes dispositivos:
   - Redimensione a janela ou selecione dispositivos como iPhone, iPad, etc.
3. **Verificação**: A interface deve se adaptar dinamicamente a diferentes tamanhos de tela

### RNF002 - Acessibilidade (WCAG) ✅

1. Durante a navegação, observe:
   - Todos os campos de formulário possuem labels associadas
   - Imagens possuem texto alternativo
   - Contraste adequado entre texto e fundo
2. Tente navegar apenas usando o teclado (Tab, Enter, Espaço)
3. **Verificação**: Você deve conseguir interagir com todos os elementos utilizando apenas o teclado

### RNF003 - Segurança e LGPD ✅

1. Crie um novo usuário e verifique:
   - Solicitação explícita de consentimento
   - Link para política de privacidade
2. Acesse "Perfil" quando logado e verifique:
   - Opção para revogar consentimento
   - Opção para solicitar exclusão de dados
3. No rodapé do sistema, acesse o link da política de privacidade

### RNF004 - Testes Automatizados ✅

1. Navegue até o diretório do frontend e execute:

```bash
pnpm test
# ou
npm test
```

2. Para verificar a cobertura de testes, execute:

```bash
pnpm test:coverage
# ou
npm run test:coverage
```

3. **Verificação**: Os testes devem passar com sucesso, demonstrando cobertura para:
   - Autenticação e controle de acesso
   - Componentes principais
   - Integração com API

### RNF005 - Desempenho ✅

1. Observe o tempo de carregamento inicial da aplicação
2. Navegue entre diferentes seções e avalie a rapidez das transições
3. **Verificação**: As operações devem ser responsivas, sem travamentos perceptíveis

## Diagrama de Componentes e Estrutura do Projeto

O sistema segue a seguinte estrutura organizacional:

```
sistema-gestao-hospitalar/
├── api/
│   └── db.json                # Banco de dados simulado com JSON Server
├── frontend/
│   ├── public/                # Arquivos estáticos
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── hooks/             # Custom hooks
│   │   ├── layouts/           # Layouts da aplicação
│   │   ├── pages/             # Páginas organizadas por perfil
│   │   ├── routes/            # Configuração de rotas
│   │   ├── services/          # Serviços e API
│   │   ├── store/             # Estado global (Redux)
│   │   ├── styles/            # Estilos globais
│   │   ├── types/             # Definições de tipos TypeScript
│   │   ├── utils/             # Utilitários
│   │   └── tests/             # Testes automatizados
│   └── jest.config.js         # Configuração de testes
```

## Lista de Verificação Rápida dos Requisitos

### Requisitos Funcionais

- [x] RF001 - Autenticação e Controle de Acesso
- [x] RF002 - Dashboard por Perfil
- [x] RF003 - Agendamento de Consultas
- [x] RF004 - Gerenciamento de Prontuários
- [x] RF005 - Emissão de Receitas Digitais
- [x] RF006 - Telemedicina Simulada
- [x] RF007 - Gerenciamento de Usuários
- [x] RF008 - Relatórios Básicos

### Requisitos Não-Funcionais

- [x] RNF001 - Responsividade
- [x] RNF002 - Acessibilidade (WCAG)
- [x] RNF003 - Segurança e LGPD
- [x] RNF004 - Testes Automatizados
- [x] RNF005 - Desempenho
- [x] RNF006 - Simulação de API

## Solução de Problemas

Se encontrar algum problema durante a avaliação:

- Verifique se o JSON Server está rodando corretamente (porta 3001)
- Certifique-se de que todas as dependências foram instaladas
- Limpe o cache do navegador ou use uma janela anônima
- Em caso de dúvidas: <adleyrc.job@gmail.com>

---

Agradeço pela avaliação e estou à disposição para esclarecimentos adicionais.
