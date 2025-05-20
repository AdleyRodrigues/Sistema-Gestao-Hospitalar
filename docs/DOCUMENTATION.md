# Documentação Técnica do Sistema de Gestão Hospitalar VidaPlus

<div align="center">

  <h1>Documentação técnica do sistema</h1>
</div>

## 📋 Visão Geral da Documentação

Esta documentação fornece informações técnicas sobre a estrutura, implementação e padrões do Sistema de Gestão Hospitalar VidaPlus. É destinada a desenvolvedores que precisam entender o funcionamento interno do sistema para manutenção ou extensão.

## 📑 Conteúdo da Documentação

- **[Documentação da API](../api/README.md)**: Detalhes sobre endpoints e modelos de dados
- **[Documentação do Frontend](../frontend/README.md)**: Implementação da interface e componentes

## 🏗️ Arquitetura do Sistema

O VidaPlus segue uma arquitetura de aplicação web de três camadas:

### Camada de Apresentação (Frontend)

- Implementada com React, TypeScript e Material UI
- Utiliza padrão de componentes reutilizáveis
- Roteamento via React Router com proteção por perfil

### Camada de Serviço (API)

- API RESTful simulada com JSON Server
- Autenticação simulada para controle de acesso
- Endpoints básicos organizados por recursos

### Camada de Dados

- Simulada por um arquivo JSON (db.json)
- Estrutura relacional simulada com campos de referência

## 🔄 Principais Fluxos Implementados

### Fluxo de Autenticação

1. Usuário fornece credenciais (email/senha)
2. Sistema identifica perfil baseado no email (admin/profissional/paciente)
3. Frontend armazena informações do usuário e redireciona para dashboard apropriado
4. Rotas protegidas verificam o perfil do usuário antes de renderizar

### Fluxo de Gerenciamento de Usuários (Admin)

1. Administrador acessa tela de gerenciamento de usuários
2. Lista de usuários é apresentada com opções de filtro
3. Administrador pode criar, editar ou excluir usuários
4. Alterações são refletidas na interface após atualização

## 📐 Padrões de Projeto Aplicados

### Frontend

- **Custom Hooks**: Encapsulamento de lógica reutilizável (useAuth)
- **Route Guards**: Proteção de rotas baseada em autenticação e perfil
- **Lazy Loading**: Carregamento sob demanda para otimização

## 📊 Modelo de Dados

O sistema utiliza os seguintes modelos principais:

- **Users**: Gerencia usuários do sistema (todos os perfis)
- **Patients**: Informações específicas de pacientes
- **Professionals**: Dados específicos de profissionais de saúde

## 🔧 Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js 16+
- npm ou pnpm
- Git

### Configuração Inicial

1. Clone o repositório
2. Configure variáveis de ambiente
3. Instale dependências do backend e frontend
4. Inicie o servidor API e o aplicativo frontend

Detalhes completos na [documentação principal](../README.md).

## 🔒 Segurança

Implementações de segurança incluem:

- **Autenticação Simulada**: Sistema verifica o tipo de usuário pelo email
- **Autorização por Perfil**: Controle de acesso baseado em perfil
- **Consentimento LGPD**: Implementação de modal de termos e política de privacidade

## 📱 Responsividade

O sistema foi desenvolvido com foco em:

- **Design Responsivo**: Adaptação a diferentes dispositivos
- **Layout Adaptativo**: Reorganização de elementos conforme o tamanho da tela
- **Consistência Visual**: Padrões de design unificados

## 📚 Arquivos Principais

- **frontend/src/App.tsx**: Ponto de entrada do frontend
- **frontend/src/routes/index.tsx**: Configuração de rotas
- **api/server.js**: Configuração principal do servidor
- **api/db.json**: Banco de dados simulado

### Comandos Úteis

```bash
# Iniciar API
cd api && npm start

# Iniciar Frontend em modo desenvolvimento
cd frontend && npm run dev

# Construir Frontend para produção
cd frontend && npm run build
```

---

<div align="center">
  <p>Parte do <a href="../README.md">Sistema de Gestão Hospitalar VidaPlus</a></p>
  <p>
    <a href="../frontend/README.md">Documentação do Frontend</a> •
    <a href="../api/README.md">Documentação da API</a>
  </p>
</div>
