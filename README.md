# Sistema de Gestão Hospitalar VidaPlus

<div align="center">

  <h3>Sistema completo para gestão hospitalar e serviços de saúde</h3>
</div>

## 📋 Visão Geral

O Sistema de Gestão Hospitalar VidaPlus é uma solução abrangente projetada para otimizar processos hospitalares e clínicos, fornecendo ferramentas para gerenciamento de pacientes, profissionais de saúde e agendamentos. A plataforma oferece interfaces personalizadas para cada tipo de usuário, garantindo uma experiência intuitiva e eficiente.

### Principais Benefícios

- **Fluxo de trabalho otimizado** para profissionais de saúde
- **Experiência aprimorada** para pacientes
- **Interface adaptativa** para diferentes dispositivos
- **Segurança e controle de acesso** baseado em perfis

### 🔗 Documentação Detalhada

- [Documentação do Frontend](./frontend/README.md) - Detalhes sobre a implementação React/TypeScript
- [Documentação da API](./api/README.md) - Documentação da API e modelos de dados
- [Documentação Técnica Adicional](./docs/) - Diagramas e documentação técnica

## 🛠️ Tecnologias Utilizadas

<div align="center">
  <table>
    <tr>
      <th>Frontend</th>
      <th>Backend</th>
      <th>DevOps</th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>React 18</li>
          <li>TypeScript</li>
          <li>Material UI</li>
          <li>React Router</li>
          <li>React Hook Form + Zod</li>
          <li>Vite</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>JSON Server (simulação)</li>
          <li>Node.js</li>
          <li>Express</li>
          <li>RESTful API</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Git/GitHub</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## ✨ Principais Recursos

### Autenticação e Controle de Acesso

- Sistema de login multi-perfil (Paciente, Profissional, Administrador)
- Proteção de rotas baseada em perfis de usuário
- Gestão de sessão e consentimento de dados (LGPD)

### Dashboards Personalizados

- Interfaces adaptadas para cada tipo de usuário
- Layout responsivo para diferentes dispositivos
- Visualização de informações relevantes por perfil

### Gerenciamento de Usuários

- Cadastro completo de usuários
- Definição de perfis e permissões
- Edição e visualização de dados cadastrais

### Formulários Avançados

- Validação em tempo real com feedback visual
- Suporte a múltiplos passos de cadastro
- Campos dinâmicos baseados no tipo de usuário

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js versão 16 ou superior
- NPM ou pnpm

### Passos para Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/Sistema-Gestao-Hospitalar.git
   cd Sistema-Gestao-Hospitalar
   ```

2. **Configure e execute o backend**

   ```bash
   cd api
   npm install
   npm start
   ```

   O servidor estará disponível em <http://localhost:3001>

3. **Configure e execute o frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   O aplicativo estará disponível em <http://localhost:5173>

### Credenciais para Teste

| Perfil | Email | Senha | Descrição |
|--------|-------|-------|-----------|
| Administrador | email com "admin" | qualquer senha | Acesso a funcionalidades administrativas |
| Profissional | email com "doctor" ou "professional" | qualquer senha | Acesso a funcionalidades médicas |
| Paciente | qualquer outro email | qualquer senha | Acesso a funcionalidades de paciente |

## 📊 Arquitetura do Sistema

A solução segue uma arquitetura em camadas:

```
Sistema VidaPlus
│
├── Interface de Usuário (React/TypeScript)
│   ├── Componentes Reutilizáveis
│   ├── Páginas por Perfil
│   └── Gerenciamento de Estado
│
├── Camada de Serviço 
│   ├── Autenticação
│   └── API Clients
│
└── Backend (API RESTful)
    ├── Modelos de Dados
    └── Controladores
```

Para mais detalhes sobre a arquitetura, consulte nossa [documentação técnica](./docs/DOCUMENTATION.md).

## 👥 Equipe e Contribuição

Este projeto foi desenvolvido como parte de um trabalho acadêmico/profissional. Contribuições são bem-vindas através de issues e pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

<div align="center">
  Desenvolvido com ❤️ para melhorar a gestão hospitalar e o atendimento em saúde.
  
  <br />
  
  <a href="./api/README.md">Documentação da API</a> •
  <a href="./frontend/README.md">Documentação do Frontend</a> •
  <a href="./docs/">Documentação Técnica</a>
</div>
