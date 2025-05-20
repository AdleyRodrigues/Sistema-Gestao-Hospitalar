# API do Sistema de Gestão Hospitalar VidaPlus

<div align="center">

  <h3>Backend simulado para o sistema de gestão hospitalar</h3>
</div>

## 📋 Visão Geral

A API do VidaPlus fornece uma interface para as operações do sistema de gestão hospitalar. Implementada usando JSON Server, ela simula um backend para desenvolvimento e testes, permitindo que o frontend funcione mesmo sem um servidor real.

Este módulo é uma implementação simulada com JSON Server para desenvolvimento e testes, projetada para ser substituível por uma implementação de backend completa em produção.

## 🚀 Principais Características

- 🔒 **Autenticação Simulada**: Sistema baseado em tokens com múltiplos perfis de acesso
- 🔄 **API RESTful**: Endpoints básicos seguindo padrões REST
- 📄 **Documentação**: Endpoints documentados para fácil utilização
- ⚡ **Ambiente de Simulação**: Perfeito para desenvolvimento e testes sem dependências externas

## 🏗️ Estrutura da API Simulada

```
api/
├── db.json                # Banco de dados em formato JSON
├── server.js              # Configuração principal do servidor
├── middlewares.js         # Middlewares básicos
└── routes/                # Rotas básicas implementadas
```

## 📑 Modelos de Dados

A API simulada gerencia os seguintes recursos principais:

### Usuários (Users)

```json
{
  "id": "string",
  "name": "Nome Completo",
  "email": "email@exemplo.com",
  "password": "senha-hash",
  "role": "admin|professional|patient",
  "status": "active|inactive",
  "createdAt": "date-string"
}
```

### Pacientes (Patients)

```json
{
  "id": "string-referência-users",
  "userId": "string-referência-users",
  "birthDate": "date-string",
  "gender": "string",
  "bloodType": "string",
  "address": {
    "street": "Rua",
    "number": "Número",
    "neighborhood": "Bairro",
    "city": "Cidade",
    "state": "Estado",
    "zipCode": "CEP"
  }
}
```

### Profissionais (Professionals)

```json
{
  "id": "string-referência-users",
  "userId": "string-referência-users",
  "specialty": "Especialidade",
  "crm": "Número de registro"
}
```

## 🔗 Endpoints Básicos da API

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Simular autenticação de usuário |

**Exemplo de login:**

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com", "password":"password"}'
```

### 👤 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Listar todos os usuários |
| GET | `/users/:id` | Obter usuário por ID |
| POST | `/users` | Criar novo usuário |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Remover usuário |

### 👥 Pacientes e Profissionais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/patients` | Listar todos os pacientes |
| GET | `/patients/:id` | Obter paciente por ID |
| GET | `/professionals` | Listar todos os profissionais |
| GET | `/professionals/:id` | Obter profissional por ID |

## 🔐 Simulação de Autenticação

A API simula autenticação com as seguintes características:

- Detecção de perfil baseada no email do usuário:
  - Emails contendo "admin" = perfil administrador
  - Emails contendo "doctor" ou "professional" = perfil profissional
  - Demais emails = perfil paciente

- Para fins de teste e desenvolvimento, qualquer senha é aceita

## 🛠️ Configuração e Execução

### Pré-requisitos

- Node.js 16.x ou superior
- npm ou pnpm

### Instalação

1. **Clone o repositório e navegue até o diretório da API**:

   ```bash
   git clone https://github.com/seu-usuario/Sistema-Gestao-Hospitalar.git
   cd Sistema-Gestao-Hospitalar/api
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm start
   ```

O servidor estará disponível em `http://localhost:3001`.

## 🧪 Testando a API

Recomendamos testar a API usando ferramentas como Postman, Insomnia ou curl.

### Exemplos de Requisições

#### Autenticação (Login)

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "qualquer-senha"
  }'
```

#### Listar Usuários

```bash
curl -X GET http://localhost:3001/users
```

## 📄 Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](../LICENSE) para obter detalhes.

---

<div align="center">
  <p>Parte do <a href="../README.md">Sistema de Gestão Hospitalar VidaPlus</a></p>
  <p>
    <a href="../frontend/README.md">Documentação do Frontend</a> •
    <a href="../docs/">Documentação Técnica</a>
  </p>
</div>
