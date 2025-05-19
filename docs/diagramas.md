# Diagramas do Sistema de Gestão Hospitalar

Este documento contém os diagramas dos principais fluxos do Sistema de Gestão Hospitalar, usando a sintaxe Mermaid para fácil visualização e manutenção.

## Índice

1. [Fluxo de Autenticação](#fluxo-de-autenticação)
2. [Fluxo do Paciente](#fluxo-do-paciente)
3. [Fluxo do Profissional](#fluxo-do-profissional)
4. [Fluxo do Administrador](#fluxo-do-administrador)
5. [Fluxo de Agendamento de Consultas](#fluxo-de-agendamento-de-consultas)
6. [Fluxo de Gerenciamento de Usuários](#fluxo-de-gerenciamento-de-usuários)
7. [Fluxo de Acesso a Prontuários](#fluxo-de-acesso-a-prontuários)
8. [Fluxo da Agenda do Profissional](#fluxo-da-agenda-do-profissional)
9. [Modelo ER](#modelo-er-entidade-relacionamento)

---

## Fluxo de Autenticação

```mermaid
flowchart TD
    A[Usuário acessa sistema] --> B{Já está autenticado?}
    B -->|Sim| C[Redireciona para Dashboard]
    B -->|Não| D[Exibe tela de login]
    D --> D1[Usuário possui cadastro?]
    D1 -->|Sim| E{Credenciais válidas?}
    D1 -->|Não| R[Exibe botão Cadastre-se]
    R --> S[Usuário clica em Cadastre-se]
    S --> T[Exibe modal de cadastro]
    T --> U[Usuário escolhe tipo: Paciente ou Profissional]
    U --> V[Preenche dados de cadastro]
    V --> W[Confirma cadastro]
    W --> X{Tipo de usuário}
    X -->|Paciente| Y[Cadastro concluído - Pode fazer login]
    X -->|Profissional| Z[Cadastro enviado para aprovação]
    Y --> D
    Z --> D
    E -->|Sim| F[Verifica perfil do usuário]
    E -->|Não| G[Exibe mensagem de erro]
    G --> D
    F --> H{Tipo de perfil}
    H -->|Paciente| I[Dashboard do Paciente]
    H -->|Profissional| J[Dashboard do Profissional]
    H -->|Administrador| K[Dashboard do Administrador]
```

## Fluxo do Paciente

```mermaid
flowchart TD
    A[Login como Paciente] --> B[Dashboard do Paciente]
    B --> C{Opções disponíveis}
    
    C --> D[Consultas Agendadas]
    D --> D1[Visualizar detalhes]
    D --> D2[Reagendar consulta]
    
    C --> E[Agendar Nova Consulta]
    E --> E1[Selecionar especialidade]
    E1 --> E2[Selecionar profissional]
    E2 --> E3[Selecionar data/hora]
    E3 --> E4[Confirmar agendamento]
    
    C --> F[Histórico Médico]
    F --> F1[Visualizar consultas anteriores]
    F --> F2[Visualizar prontuários]
    
    C --> G[Exames]
    G --> G1[Visualizar resultados]
    G --> G2[Verificar exames pendentes]
    
    C --> H[Telemedicina]
    H --> H1[Consultas online]
    H --> H2[Chat com profissional]
    
    C --> I[Configurações de Privacidade]
    I --> I1[Gerenciar consentimentos]
    I --> I2[Alterar senha]
```

## Fluxo do Profissional

```mermaid
flowchart TD
    A[Login como Profissional] --> B[Dashboard do Profissional]
    B --> C{Opções disponíveis}
    
    C --> D[Agenda]
    D --> D1[Visualização diária]
    D --> D2[Visualização semanal]
    D --> D3[Gerenciar horários]
    D --> D4[Atualizar consulta]
    D --> D5[Cancelar consulta]
    
    C --> E[Prontuários]
    E --> E1[Buscar paciente]
    E --> E2[Visualizar histórico]
    E --> E3[Adicionar novo registro]
    E --> E4[Prescrever medicamentos]
    
    C --> F[Pacientes]
    F --> F1[Listar pacientes]
    F --> F2[Visualizar detalhes]
    F --> F3[Agendar consulta para paciente]
    
    C --> G[Telemedicina]
    G --> G1[Iniciar consulta online]
    G --> G2[Ver histórico de consultas]
    
    C --> H[Configurações de Privacidade]
    H --> H1[Gerenciar perfil profissional]
    H --> H2[Alterar senha]
```

## Fluxo do Administrador

```mermaid
flowchart TD
    A[Login como Administrador] --> B[Dashboard do Administrador]
    B --> C{Opções disponíveis}
    
    C --> D[Gerenciamento de Usuários]
    D --> D1[Listar todos os usuários]
    D --> D2[Filtrar por tipo]
    D --> D3[Adicionar novo usuário]
    D --> D4[Editar usuário existente]
    D --> D5[Desativar usuário]
    
    C --> E[Estatísticas e Relatórios]
    E --> E1[Visualizar gráficos de uso]
    E --> E2[Relatórios financeiros]
    E --> E3[Taxa de ocupação]
    E --> E4[Exportar dados]
    
    C --> F[Gerenciamento de Hospitais]
    F --> F1[Listar unidades]
    F --> F2[Adicionar nova unidade]
    F --> F3[Editar unidade existente]
    
    C --> G[Gerenciamento de Profissionais]
    G --> G1[Ver estatísticas por profissional]
    G --> G2[Atribuir permissões]
    
    C --> H[Configurações do Sistema]
    H --> H1[Configurações gerais]
    H --> H2[Políticas de privacidade]
    H --> H3[Backup e restauração]
```

## Fluxo de Agendamento de Consultas

```mermaid
flowchart TD
    A[Paciente acessa Agendamento] --> B[Seleciona Especialidade]
    B --> C[Visualiza profissionais disponíveis]
    C --> D[Seleciona profissional]
    D --> E[Visualiza datas/horários disponíveis]
    E --> F[Seleciona data e hora]
    F --> G[Confirma informações da consulta]
    G --> H{Confirma agendamento?}
    H -->|Sim| I[Sistema registra consulta]
    I --> J[Notifica profissional]
    I --> K[Exibe confirmação ao paciente]
    H -->|Não| E
```

## Fluxo de Gerenciamento de Usuários

```mermaid
flowchart TD
    A[Administrador acessa Gerenciamento de Usuários] --> B[Visualiza lista de usuários]
    B --> C{Ação desejada}
    C -->|Visualizar| D[Exibe detalhes do usuário]
    C -->|Criar novo| E[Exibe formulário de novo usuário]
    E --> F[Preenche dados do usuário]
    F --> G[Sistema valida dados]
    G -->|Válidos| H[Cria novo usuário]
    G -->|Inválidos| F
    C -->|Editar| I[Exibe formulário com dados do usuário]
    I --> J[Modifica dados do usuário]
    J --> K[Sistema valida alterações]
    K -->|Válidas| L[Atualiza usuário]
    K -->|Inválidas| J
    C -->|Excluir| M{Confirma exclusão?}
    M -->|Sim| N[Desativa usuário]
    M -->|Não| B
```

## Fluxo de Acesso a Prontuários

```mermaid
flowchart TD
    A[Profissional acessa Prontuários] --> B[Busca paciente]
    B --> C[Seleciona paciente]
    C --> D[Sistema verifica permissões]
    D -->|Permitido| E[Exibe prontuário do paciente]
    D -->|Negado| F[Exibe mensagem de acesso negado]
    E --> G{Ação desejada}
    G -->|Visualizar histórico| H[Exibe histórico médico]
    G -->|Adicionar registro| I[Exibe formulário de novo registro]
    I --> J[Preenche dados do atendimento]
    J --> K[Salva novo registro no prontuário]
    G -->|Prescrever medicamento| L[Exibe formulário de prescrição]
    L --> M[Preenche dados da prescrição]
    M --> N[Salva prescrição]
```

## Fluxo da Agenda do Profissional

```mermaid
flowchart TD
    A[Profissional acessa Agenda] --> B[Visualiza consultas do dia]
    B --> C{Visualização}
    C -->|Diária| D[Exibe lista de consultas do dia]
    C -->|Semanal| E[Exibe grade da semana]
    D --> F{Ações}
    F -->|Ver detalhes| G[Exibe detalhes da consulta]
    F -->|Editar horário| H[Modifica data/hora]
    H --> I[Sistema verifica disponibilidade]
    I -->|Disponível| J[Atualiza consulta]
    I -->|Indisponível| K[Exibe conflito]
    K --> H
    F -->|Cancelar| L{Confirma cancelamento?}
    L -->|Sim| M[Cancela consulta]
    M --> N[Notifica paciente]
    L -->|Não| D
```

## Modelo ER (Entidade-Relacionamento)

```mermaid
erDiagram
    USER ||--o{ PATIENT : "pode ser"
    USER ||--o{ PROFESSIONAL : "pode ser"
    USER ||--o{ ADMIN : "pode ser"
    PATIENT ||--o{ APPOINTMENT : solicita
    PROFESSIONAL ||--o{ APPOINTMENT : atende
    PATIENT ||--o{ MEDICAL_RECORD : possui
    PROFESSIONAL ||--o{ MEDICAL_RECORD : registra
    MEDICAL_RECORD ||--o{ PRESCRIPTION : gera
    APPOINTMENT ||--o{ FEEDBACK : recebe
    
    USER {
        string id
        string name
        string email
        string password
        string role
        string status
        datetime createdAt
    }
    
    PATIENT {
        string id
        date birthDate
        string gender
        string bloodType
        object address
    }
    
    PROFESSIONAL {
        string id
        string specialty
        string crm
        array availableDays
        string startTime
        string endTime
        int appointmentDuration
    }
    
    APPOINTMENT {
        string id
        string patientId
        string professionalId
        datetime date
        string status
        string type
        string notes
    }
    
    MEDICAL_RECORD {
        string id
        string patientId
        string professionalId
        datetime date
        string type
        string title
        string description
        string diagnosis
        string treatment
        string notes
    }
    
    PRESCRIPTION {
        string id
        string medicalRecordId
        string patientId
        string professionalId
        datetime date
        datetime expirationDate
        array medications
        string instructions
        string status
    }
    
    FEEDBACK {
        string id
        string userId
        string appointmentId
        string professionalId
        int rating
        string comment
        datetime date
    }
```
