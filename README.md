# Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS)

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/license-MIT-blue)

Um sistema de gerenciamento hospitalar moderno desenvolvido com React, TypeScript e Material UI para o frontend, e JSON Server para simular o backend.

## 📋 Descrição

O Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS) é uma aplicação web abrangente que permite a gestão eficiente de hospitais e clínicas, proporcionando recursos para pacientes, profissionais de saúde e administradores do sistema.

## 🏗️ Estrutura do Projeto

O projeto está dividido em duas partes principais:

### 📱 Frontend

Localizado na pasta `/frontend`, o cliente web é desenvolvido com:

- **React** com **TypeScript** e **Vite**
- **Material UI** para a interface
- **Redux Toolkit** para gerenciamento de estado
- **React Router** para navegação
- Suporte a testes com **Jest** e **Testing Library**

A estrutura de diretórios segue padrões modernos de organização:

```
frontend/
├── src/
│   ├── api/          # Configuração do axios e serviços HTTP
│   ├── components/   # Componentes reutilizáveis
│   ├── hooks/        # Hooks personalizados
│   ├── pages/        # Páginas da aplicação
│   ├── routes/       # Configuração de rotas
│   ├── store/        # Estado global (Redux)
│   ├── styles/       # Tema e estilos globais
│   └── types/        # Tipagens TypeScript
└── ...
```

### ⚙️ API (Backend Simulado)

Localizado na pasta `/api`, utiliza JSON Server para simular uma API RESTful:

- Banco de dados em JSON (`db.json`)
- Middleware para autenticação
- Rotas personalizadas
- CORS configurado para integração com o frontend

## 🚀 Principais Funcionalidades

### 🔒 Autenticação e Autorização

- Sistema de login com múltiplos perfis (paciente, profissional, administrador)
- Rotas protegidas com base no perfil do usuário

### 👤 Pacientes

- Visualização de consultas agendadas
- Acesso ao histórico médico pessoal
- Telemedicina para consultas online

### 👨‍⚕️ Profissionais de Saúde

- Gerenciamento de agenda
- Cadastro e visualização de prontuários
- Gestão de pacientes
- Consultas via telemedicina

### 👩‍💼 Administradores

- Gestão de usuários do sistema
- Configurações gerais
- Relatórios e estatísticas

## 🛠️ Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16+)
- pnpm ou npm

### Passos para execução

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/Sistema-Gestao-Hospitalar.git
   cd Sistema-Gestao-Hospitalar
   ```

2. **Inicie o backend simulado**

   ```bash
   cd api
   npm install
   npm start
   # API estará disponível em http://localhost:3001
   ```

3. **Inicie o frontend**

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   # Frontend estará disponível em http://localhost:5173
   ```

4. **Usuários de teste**
   - **Paciente:** <joao@vidaplus.com> / 123456
   - **Profissional:** <maria@vidaplus.com> / 123456
   - **Admin:** <admin@vidaplus.com> / 123456

## 📚 Documentação Adicional

Para mais detalhes sobre cada parte do projeto, consulte:

- [Documentação do Frontend](./frontend/README.md)
- [Documentação da API](./api/README.md)

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
