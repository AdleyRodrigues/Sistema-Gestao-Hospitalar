# Instruções para Avaliação do Sistema de Gestão Hospitalar VidaPlus

Prezado Professor,

Este documento contém instruções detalhadas para configurar, executar e avaliar o Sistema de Gestão Hospitalar VidaPlus, demonstrando as funcionalidades implementadas.

## Requisitos de Sistema

- Node.js versão 16 ou superior
- NPM ou PNPM
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
npm install
# ou
pnpm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
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
2. Faça login usando um email conforme as regras acima
3. **Verificação**: Cada perfil é redirecionado para seu respectivo dashboard
4. Tente acessar rotas não autorizadas para confirmar a proteção baseada em perfil

### RF002 - Dashboard por Perfil ✅

1. Faça login com diferentes perfis
2. **Verificação**: O sistema exibe um dashboard personalizado para cada tipo de usuário
3. Observe as diferenças na navegação lateral disponível para cada perfil

### RF003 - Gerenciamento de Usuários ✅

1. Faça login como administrador (email contendo "admin")
2. Acesse "Gerenciamento de Usuários" no menu lateral
3. **Verificação**: Visualize a lista de usuários
4. Teste as seguintes ações:
   - Criar novo usuário: clique em "Novo Usuário" e preencha o formulário
   - Editar usuário: clique em "Editar" em um usuário existente
   - Filtrar usuários: use os filtros por perfil e status
   - Buscar usuário: use a barra de busca por nome ou email

### RF004 - Formulários Avançados ✅

1. Teste o formulário de cadastro na tela de login
2. **Verificação**: O sistema deve realizar validações em tempo real
3. Teste o formulário de criação/edição de usuários como administrador
4. **Verificação**: Os campos obrigatórios são validados corretamente

### RF005 - Política de Privacidade e LGPD ✅

1. Na tela de login, acesse o link "Política de Privacidade"
2. **Verificação**: Visualize os termos de privacidade detalhados
3. Durante o cadastro de um novo usuário, observe o processo de consentimento

## Avaliação de Requisitos Não-Funcionais

### RNF001 - Responsividade ✅

1. Acesse o sistema em um computador desktop
2. Use as ferramentas de desenvolvedor do navegador (F12) para simular diferentes dispositivos
3. **Verificação**: A interface deve se adaptar dinamicamente a diferentes tamanhos de tela

### RNF002 - Segurança ✅

1. Observe a proteção das rotas para diferentes perfis de usuário
2. **Verificação**: Usuários não podem acessar áreas restritas a outros perfis
3. Observe o tratamento de erros em casos de acesso não autorizado

### RNF003 - Simulação de API ✅

1. Verifique o funcionamento do JSON Server (porta 3001)
2. **Verificação**: O sistema deve se comunicar adequadamente com a API simulada
3. Teste as operações CRUD através da interface

## Documentação

Todo o sistema está documentado em:

1. [README principal](../README.md) - Visão geral do sistema
2. [Documentação do Frontend](../frontend/README.md) - Detalhes da implementação frontend
3. [Documentação da API](../api/README.md) - Documentação da API simulada
4. [Documentação Técnica](./DOCUMENTATION.md) - Detalhes técnicos adicionais

## Lista de Verificação Rápida dos Requisitos

### Requisitos Funcionais

- [x] RF001 - Autenticação e Controle de Acesso
- [x] RF002 - Dashboard por Perfil
- [x] RF003 - Gerenciamento de Usuários
- [x] RF004 - Formulários Avançados
- [x] RF005 - Política de Privacidade e LGPD

### Requisitos Não-Funcionais

- [x] RNF001 - Responsividade
- [x] RNF002 - Segurança
- [x] RNF003 - Simulação de API

Essa documentação foi elaborada para facilitar a compreensão do sistema, sua arquitetura e funcionamento, além de fornecer instruções claras para execução e avaliação.
