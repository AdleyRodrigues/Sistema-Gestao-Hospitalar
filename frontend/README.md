# Frontend do Sistema de Gestão Hospitalar VidaPlus

<div align="center">
  <img src="./public/favicon.ico" alt="VidaPlus Logo" width="80" />
  <h3>Interface moderna e responsiva para gestão hospitalar</h3>
</div>

## 📋 Visão Geral

O frontend do VidaPlus é construído com React e TypeScript, seguindo as melhores práticas de desenvolvimento moderno para criar uma interface robusta, segura e com excelente experiência do usuário. A aplicação é projetada para ser responsiva, acessível e modular, facilitando a manutenção e extensão do código.

## 🚀 Principais Tecnologias

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40"/><br/>React 18</td>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40"/><br/>TypeScript</td>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" width="40"/><br/>Material UI</td>
    </tr>
  </table>
</div>

- 🧭 **Roteamento**: React Router v6 com rotas protegidas por perfil
- 📝 **Formulários**: React Hook Form com validação Zod
- 🎨 **Componentes de UI**: Material UI v5 com tema personalizado

## 🏗️ Arquitetura Implementada

A aplicação segue uma arquitetura em camadas com separação clara de responsabilidades:

```
src/
├── components/               # Componentes reutilizáveis
│   ├── layout/               # Layout principal da aplicação
│   │   ├── MainLayout.tsx    # Componente de layout com Sidebar/Header
│   │   ├── Sidebar.tsx       # Barra lateral navegacional
│   │   └── Header.tsx        # Cabeçalho com perfil e configurações
│   │
│   ├── common/               # Componentes genéricos compartilhados
│   ├── forms/                # Componentes de formulário (campos, validações)
│   ├── modals/               # Diálogos e modais reutilizáveis
│   ├── privacy/              # Componentes relacionados à privacidade
│   └── ...
│
├── pages/                    # Páginas da aplicação
│   ├── auth/                 # Páginas de autenticação
│   │   ├── Login.tsx         # Tela de login
│   │   └── Register.tsx      # Tela de cadastro 
│   │
│   ├── dashboard/            # Dashboards por perfil
│   │   ├── admin/            # Dashboard de administrador
│   │   ├── patient/          # Dashboard de paciente
│   │   └── professional/     # Dashboard de profissional
│   │
│   ├── patient/              # Páginas do paciente
│   ├── professional/         # Páginas do profissional
│   ├── admin/                # Páginas do administrador
│   └── privacy/              # Páginas de privacidade e LGPD
│
├── hooks/                    # Hooks personalizados
│   ├── useAuth.tsx           # Hook de autenticação
│   └── useApi.tsx            # Hook para chamadas de API
│
├── services/                 # Serviços e APIs
│   ├── api.ts                # Cliente Axios configurado
│   └── authService.ts        # Serviço de autenticação
│
├── routes/                   # Configurações de rota
│   └── index.tsx             # Definição de rotas protegidas
│
├── styles/                   # Estilos e temas
│   ├── theme.ts              # Configuração do tema Material UI
│   └── global.css            # Estilos globais
│
├── App.tsx                   # Componente raiz
└── main.tsx                  # Ponto de entrada
```

## 🔀 Fluxos Implementados

### Fluxo de Autenticação

1. O usuário acessa a tela de login (`/login`)
2. Após autenticação bem-sucedida, o token é armazenado
3. O usuário é redirecionado para o dashboard específico do seu perfil
4. Rotas protegidas verificam a autenticação e o perfil do usuário antes de renderizar

### Fluxo de Gerenciamento de Usuários (Administrador)

1. Administrador acessa a página de gerenciamento de usuários
2. Visualiza lista de usuários com opções de filtro
3. Pode adicionar novo usuário, editar existente ou alterar status
4. Formulários validados garantem integridade dos dados

## 🧩 Padrões de Projeto Aplicados

- **Custom Hooks**: Encapsulamento de lógica reutilizável (useAuth, useApi)
- **Route Guards**: Proteção de rotas baseada em perfil de usuário
- **Lazy Loading**: Carregamento sob demanda para otimizar performance

## 🎨 Sistema de Design

A aplicação usa Material UI como framework de UI, com um tema personalizado:

- Componentes reutilizáveis e consistentes
- Sistema de grid responsivo para diferentes tamanhos de tela
- Padronização de espaçamentos e tipografia

## ⚙️ Instruções para Desenvolvedores

### Configuração Inicial

1. **Instalação de Dependências**

   ```bash
   # Usando npm
   npm install
   
   # Usando pnpm (para melhor performance)
   pnpm install
   ```

2. **Variáveis de Ambiente**

   Crie um arquivo `.env.local` baseado no `.env.example`:

   ```
   VITE_API_URL=http://localhost:3001
   VITE_APP_ENV=development
   ```

### Scripts Disponíveis

- **Desenvolvimento**: Inicia o servidor de desenvolvimento

  ```bash
  npm run dev
  ```

- **Build**: Gera a versão de produção

  ```bash
  npm run build
  ```

- **Lint**: Executa o linting do código

  ```bash
  npm run lint
  ```

## 📱 Responsividade

A aplicação foi projetada para funcionar em múltiplos dispositivos:

- Desktop (1280px+): Layout completo com sidebar
- Tablet (768px-1279px): Layout adaptado com elementos reorganizados
- Mobile (até 767px): Layout otimizado para telas pequenas

## 🔒 Segurança no Frontend

- **Controle de Acesso**: Rotas protegidas baseadas em perfil
- **Validação de Dados**: Entradas de usuário são validadas com React Hook Form e Zod
- **Consentimento LGPD**: Modal de política de privacidade e termos de uso

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](../LICENSE) para detalhes.

---

<div align="center">
  <p>Parte do <a href="../README.md">Sistema de Gestão Hospitalar VidaPlus</a></p>
  <p>
    <a href="../api/README.md">Documentação da API</a> •
    <a href="../docs/">Documentação Técnica</a>
  </p>
</div>
