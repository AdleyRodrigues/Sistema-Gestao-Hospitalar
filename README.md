# Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS)

Sistema completo para gestão hospitalar e serviços de saúde, desenvolvido em React + TypeScript com arquitetura moderna.

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estado Global**: Redux Toolkit
- **Roteamento**: React Router
- **UI & Componentes**: Material UI + TailwindCSS
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Testes**: Jest + React Testing Library
- **API Simulada**: JSON Server

## Funcionalidades Implementadas

### Autenticação e Controle de Acesso

- Login com diferentes perfis: Paciente, Profissional de Saúde e Administrador
- Redirecionamento para dashboards específicos de cada perfil
- Proteção de rotas por perfil de usuário

### Dashboard por Perfil

- **Paciente**: Resumo de consultas, exames e histórico médico
- **Profissional de Saúde**: Agenda do dia e acesso rápido a prontuários
- **Administrador**: Indicadores de ocupação e financeiros

### Agendamento de Consultas

- Criação de novos agendamentos pelo paciente
- Visualização de agendamentos futuros, passados e cancelados
- Cancelamento de agendamentos

### Gerenciamento de Prontuários

- Visualização completa do histórico médico pelo paciente
- Cadastro e edição de informações clínicas pelo profissional
- Detalhamento de diagnósticos, sintomas e tratamentos

### Emissão de Receitas Digitais

- Emissão de prescrições médicas pelos profissionais
- Visualização, download e impressão de receitas pelos pacientes
- Controle de medicamentos, dosagens e instruções

### Telemedicina Simulada

- Interface para teleconsultas com controle de vídeo e áudio
- Chat integrado durante a consulta
- Avaliação pós-atendimento

### Gerenciamento de Usuários

- CRUD completo de pacientes, profissionais e administradores
- Filtros e busca avançada
- Controle de status de usuários

### Relatórios e Indicadores

- Visualização de métricas de ocupação
- Relatórios financeiros
- Análises de atendimento por especialidade

### Conformidade com LGPD

- Consentimento explícito para tratamento de dados
- Política de privacidade acessível
- Mecanismo para solicitação de exclusão de dados

## Como Executar o Projeto

### Pré-requisitos

- Node.js versão 16 ou superior
- NPM ou Yarn

### Instalação e Execução

1. Clone o repositório:

```
git clone https://github.com/seu-usuario/Sistema-Gestao-Hospitalar.git
cd Sistema-Gestao-Hospitalar
```

2. Instale as dependências do frontend:

```
cd frontend
npm install
```

3. Execute o JSON Server para simular a API:

```
cd api
npm install -g json-server
json-server --watch db.json --port 3001
```

4. Execute o frontend em outro terminal:

```
cd frontend
npm run dev
```

5. Acesse o sistema no navegador:

```
http://localhost:5173
```

### Credenciais para Teste

| Perfil           | Email                     | Senha     |
|------------------|-----------------------------|-----------|
| Administrador    | <admin@sghss.com>            | admin123  |
| Profissional     | <ana.oliveira@example.com>   | 12345678  |
| Paciente         | <carlos@example.com>         | 12345678  |

## Requisitos Atendidos

### Requisitos Funcionais

- [x] Autenticação e Controle de Acesso
- [x] Dashboard por Perfil
- [x] Agendamento de Consultas
- [x] Gerenciamento de Prontuários
- [x] Emissão de Receitas Digitais
- [x] Telemedicina Simulada
- [x] Gerenciamento de Usuários
- [x] Relatórios Básicos

### Requisitos Não Funcionais

- **Responsividade:** A interface se adapta a diferentes tamanhos de tela (desktop, tablet e mobile)
- **Acessibilidade:** Implementação seguindo diretrizes WCAG com uso apropriado de tags semânticas, contraste adequado e suporte a navegação por teclado
- **Segurança e LGPD:** Sistema de autenticação, consentimento de dados e opção de exclusão de dados
- **Testes Automatizados:** Cobertura de testes unitários e de componentes utilizando Jest e React Testing Library para as principais funcionalidades
- **Desempenho:** Otimização de carregamento e uso eficiente de recursos
- **API Simulada:** Backend simulado com JSON Server para desenvolvimento e testes

## Estrutura do Projeto

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
│   │   ├── App.tsx            # Componente principal
│   │   └── main.tsx           # Ponto de entrada
│   ├── package.json
│   └── vite.config.ts
```

## Licença

MIT
