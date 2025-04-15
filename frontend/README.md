# Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS)

![SGHSS Logo](./public/favicon.ico)

## Descrição

O Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS) é uma aplicação web desenvolvida para otimizar a gestão de hospitais e clínicas, facilitando o gerenciamento de pacientes, profissionais de saúde, consultas e prontuários médicos.

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript, Vite, Material UI
- **Gerenciamento de Estado**: Redux Toolkit
- **Roteamento**: React Router
- **Backend Simulado**: JSON Server

## Estrutura do Projeto

A aplicação está estruturada com uma arquitetura modular, facilitando a manutenção e escalabilidade:

```
src/
├── api/            # Serviços de API e configurações do Axios
├── components/     # Componentes reutilizáveis
│   ├── layout/     # Componentes de layout (Header, Sidebar, etc)
│   └── ui/         # Componentes de UI compartilhados
├── hooks/          # Hooks personalizados (useAuth, useTypedDispatch, etc)
├── pages/          # Páginas da aplicação
│   ├── auth/       # Páginas de autenticação
│   ├── dashboard/  # Dashboards por perfil de usuário
│   ├── patient/    # Páginas para pacientes
│   ├── professional/ # Páginas para profissionais
│   └── admin/      # Páginas para administradores
├── routes/         # Configuração de rotas
├── store/          # Configuração do Redux e slices
│   ├── slices/     # Slices do Redux Toolkit
│   └── index.ts    # Configuração da store
├── styles/         # Estilos globais e temas
├── types/          # Tipagens TypeScript
├── utils/          # Funções utilitárias
├── App.tsx         # Componente principal
└── main.tsx        # Entrada da aplicação
```

## Funcionalidades Implementadas

### Autenticação e Autorização

- Login com diferentes perfis de usuário (paciente, profissional, admin)
- Rotas protegidas baseadas no perfil do usuário
- Gerenciamento de sessão

### Dashboard Personalizado

- Dashboard para pacientes
- Dashboard para profissionais
- Dashboard para administradores

### Pacientes

- Visualização de consultas
- Histórico médico
- Telemedicina

### Profissionais de Saúde

- Gerenciamento de agenda
- Lista de pacientes
- Prontuários médicos
- Telemedicina

### Layout e UI

- Interface responsiva
- Tema personalizável
- Componentes de layout compartilhados

## Executando o Projeto

### Pré-requisitos

- Node.js 16+
- pnpm ou npm

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/sistema-gestao-hospitalar.git
cd sistema-gestao-hospitalar/frontend
```

2. Instale as dependências:

```bash
pnpm install
# OU
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
# OU
npm run dev
```

4. Em outro terminal, inicie o JSON Server para simular o backend:

```bash
pnpm server
# OU
npm run server
```

5. Acesse a aplicação em <http://localhost:5173>

## Usuários para Teste

A aplicação possui usuários predefinidos para testes:

- **Paciente**
  - Email: `paciente@exemplo.com`
  - Senha: `senha123`

- **Profissional**
  - Email: `profissional@exemplo.com`
  - Senha: `senha123`

- **Administrador**
  - Email: `admin@exemplo.com`
  - Senha: `senha123`

## Próximos Passos

Funcionalidades que podem ser implementadas no futuro:

1. **Testes Automatizados**
   - Configuração do Jest para testes unitários
   - Testes de integração

2. **Implementação de Backend Real**
   - Substituição do JSON Server por uma API real
   - Integração com banco de dados

3. **Recursos Adicionais**
   - Sistema de notificações
   - Relatórios e estatísticas
   - Integrações com outros sistemas

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
