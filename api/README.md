# API do Sistema de Gestão Hospitalar (SGHSS)

Backend simulado usando JSON Server para o Sistema de Gestão Hospitalar.

## 📋 Descrição

Esta API simula um backend completo para o Sistema de Gestão Hospitalar usando JSON Server, um pacote que permite criar rapidamente uma API REST falsa a partir de um arquivo JSON.

## 🗂️ Estrutura de Arquivos

```
api/
├── db.json              # Banco de dados em formato JSON
├── json-server.json     # Configurações do JSON Server
├── middlewares.js       # Middlewares personalizados
├── routes.json          # Configuração de rotas personalizadas
└── server.js            # Servidor personalizado com autenticação
```

## 📊 Modelos de Dados

O arquivo `db.json` contém os seguintes modelos:

- **users**: Usuários do sistema (pacientes, profissionais, administradores)
- **appointments**: Consultas e agendamentos
- **medical_records**: Prontuários médicos

## 🔑 Autenticação

A API inclui uma rota de autenticação simulada:

- **POST /api/login**: Autentica um usuário com email e senha, retornando um token e os dados do usuário

## 🛣️ Rotas Disponíveis

### Usuários

- `GET /users`: Lista todos os usuários
- `GET /users/:id`: Busca usuário por ID
- `POST /users`: Cria novo usuário
- `PUT /users/:id`: Atualiza usuário
- `DELETE /users/:id`: Remove usuário

### Consultas

- `GET /appointments`: Lista todas as consultas
- `GET /appointments/:id`: Busca consulta por ID
- `POST /appointments`: Cria nova consulta
- `PUT /appointments/:id`: Atualiza consulta
- `DELETE /appointments/:id`: Cancela/remove consulta

### Prontuários

- `GET /medical_records`: Lista todos os prontuários
- `GET /medical_records/:id`: Busca prontuário por ID
- `POST /medical_records`: Cria novo prontuário
- `PUT /medical_records/:id`: Atualiza prontuário
- `DELETE /medical_records/:id`: Remove prontuário

## 🛠️ Como Executar

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Inicie o servidor**

   ```bash
   npm start
   ```

   O servidor estará disponível em <http://localhost:3001>

## 🔧 Configurações Adicionais

- **CORS**: Configurado para permitir solicitações de qualquer origem
- **Timestamp**: Adiciona automaticamente timestamps nas operações POST/PUT/PATCH

## 🧪 Teste da API

Use ferramentas como Postman, Insomnia ou curl para testar as rotas:

```bash
# Exemplo de login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@vidaplus.com", "password":"123456"}'
```

## 📝 Nota

Esta API é apenas uma simulação para desenvolvimento e testes. Em um ambiente de produção, recomenda-se implementar uma API real com autenticação segura, criptografia e banco de dados adequado.
