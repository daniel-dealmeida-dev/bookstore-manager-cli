# 📚 Biblioteca Tech: Sistema de Gestão de Empréstimos

Aplicação de linha de comando (CLI) para gerenciamento de bibliotecas, desenvolvida em **Node.js** e **TypeScript**, aplicando princípios de Arquitetura Hexagonal e Clean Code.

---

## Sumário

1. [Descrição do Projeto](#1-descrição-do-projeto)
2. [Objetivo](#2-objetivo)
3. [Tecnologias e Bibliotecas Principais](#3-tecnologias-e-bibliotecas-principais)
4. [Arquitetura do Projeto](#4-arquitetura-do-projeto)
5. [Estrutura de Pastas](#5-estrutura-de-pastas)
6. [Design Patterns e Decisões Técnicas](#6-design-patterns-e-decisões-técnicas)
7. [Funcionalidades Implementadas](#7-funcionalidades-implementadas)
8. [Requisitos para Execução](#8-requisitos-para-execução)
9. [Configuração do Banco de Dados](#9-configuração-do-banco-de-dados)
10. [Instalação](#10-instalação)
11. [Execução](#11-execução)
12. [Exemplos de Utilização](#12-exemplos-de-utilização)
13. [Dificuldades Encontradas](#13-dificuldades-encontradas)
14. [Futuras Implementações](#14-futuras-implementações)
15. [Link do Kanban](#16-link-do-kanban)

---

## 1. Descrição do Projeto

O **Biblioteca Tech** é uma aplicação CLI (Command Line Interface) desenvolvida em Node.js e TypeScript, voltada para o gerenciamento eficiente de bibliotecas. O sistema permite o controle completo de autores, livros, clientes e o processamento de empréstimos e devoluções, garantindo a integridade dos dados através de uma arquitetura organizada em camadas.

## 2. Objetivo

Desenvolver um software resiliente que isole a lógica de negócio dos detalhes de infraestrutura, utilizando padrões de projeto sólidos para facilitar a manutenção, a testabilidade e a escalabilidade da aplicação.

## 3. Tecnologias e Bibliotecas Principais

| Categoria       | Tecnologia                  | Descrição                                      |
| --------------- | --------------------------- | ---------------------------------------------- |
| Linguagem       | **TypeScript**              | Tipagem estática sobre JavaScript              |
| Runtime         | **Node.js**                 | Ambiente de execução                           |
| Banco de Dados  | **PostgreSQL**              | Banco relacional                               |
| Containerização | **Docker / Docker Compose** | Provisionamento do banco de dados              |
| Driver de Banco | `pg`                        | Comunicação direta com o PostgreSQL via SQL    |
| Interface (CLI) | `inquirer`                  | Menus interativos no terminal                  |
| Estilização     | `chalk`                     | Cores e formatação visual no terminal          |
| Ambiente        | `dotenv`                    | Gerenciamento de variáveis de ambiente         |
| Execução em Dev | `tsx`                       | Execução direta de TypeScript sem build prévio |

## 4. Arquitetura do Projeto

O projeto adota princípios da **Arquitetura Hexagonal (Ports & Adapters)**, com o objetivo de manter a lógica de negócio (domínio) independente de detalhes de infraestrutura, como banco de dados ou interface de terminal.

O fluxo de dependências segue uma única direção:

```
CLI (infra) → Use Case (application) → Repository Interface (domain) → Postgres Repository (infra)
```

- **`domain`** é o núcleo da aplicação. Contém as entidades (`Author`, `Book`, `Customer`, `Loan`), suas regras de validação e as interfaces (contratos) dos repositórios. Não depende de nenhuma outra camada.
- **`application`** orquestra os casos de uso do sistema (ex: `CreateAuthorUseCase`), utilizando apenas as interfaces definidas no domínio — nunca uma implementação concreta.
- **`infra`** contém os adaptadores: a interface de linha de comando (`cli`), as implementações concretas dos repositórios com PostgreSQL (`database`) e o sistema de logs (`logger`).
- **`main`** é o ponto de entrada da aplicação, responsável por instanciar as dependências (injeção de dependência manual) e conectar as camadas.

Essa separação garante baixo acoplamento: seria possível, por exemplo, trocar o PostgreSQL por outro banco, ou o terminal por uma API REST, sem alterar uma linha sequer das regras de negócio.

## 5. Estrutura de Pastas

```text
bookstore-manager-cli/
├── init/
│   └── init.sql             # Script de criação das tabelas do banco
├── src/
│   ├── application/
│   │   └── use-cases/       # Orquestração das regras de negócio
│   ├── domain/
│   │   ├── dto/              # Objetos de transferência de dados
│   │   ├── entities/         # Regras de negócio puras (Modelos)
│   │   ├── errors/           # Tratamento de exceções (Domain/System)
│   │   └── repositories/     # Interfaces dos contratos
│   ├── infra/
│   │   ├── cli/ # Adaptadores de entrada (Menus e Relatórios)
│   │   │    ├──reports/ # Menus dos relatório (Empréstimos e Acervo)
│   │   │
│   │   ├── database/          # Adaptadores de saída (Repositórios SQL)
│   │   └── logger/             # Camada de observabilidade
│   └── main/
│       └── main.ts            # Ponto de entrada e injeção de dependências
├── .env.example              # Modelo de variáveis de ambiente
├── docker-compose.yml        # Provisionamento do banco de dados PostgreSQL
├── package.json
├── tsconfig.json
└── README.md
```

6. Design Patterns e Decisões Técnicas

## 6. Design Patterns e Decisões Técnicas

- **Princípios SOLID:** aplicados ao longo de todo o domínio e da camada de aplicação. As entidades e repositórios seguem o **Princípio da Responsabilidade Única (SRP)**, enquanto os casos de uso dependem exclusivamente de interfaces, nunca de implementações concretas (**Princípio da Inversão de Dependência – DIP**), permitindo que a lógica de negócio permaneça isolada dos detalhes de infraestrutura, como o PostgreSQL.

- **Repository Pattern:** cada entidade possui uma interface de repositório no domínio (`AuthorRepository`, `BookRepository`, `CustomerRepository`, `LoanRepository`), implementada de forma concreta na camada de infraestrutura, isolando completamente as queries SQL das regras de negócio.

- **Adapter:** as classes `Postgres*Repository` funcionam como adappters, traduzindo a API da biblioteca `pg` (queries SQL, `client.query()`, `rows`) para o formato esperado pelo domínio (ex.: `save(author: Author): Promise<Author>`). 

- **Factory Method:** o método estático `SystemException.fromUnknown(cause, code)` centraliza e padroniza a criação de exceções de sistema a partir de erros desconhecidos, evitando repetição da lógica de tratamento nos repositórios.

- **Injeção de Dependência (Dependency Injection):** utilizada para desacoplar as camadas, facilitando testes e a substituição de implementações (por exemplo, trocar `PostgresBookRepository` por um mock em testes automatizados). Toda a composição das dependências ocorre de forma centralizada no `main.ts`.

- **Singleton:** aplicado na conexão com o banco de dados (`PgConnection`), garantindo que o pool de conexões seja reutilizado em toda a aplicação, evitando desperdício de recursos.

- **Tratamento de Exceções Customizado:** implementação de uma hierarquia de exceções (`BaseException`, `DomainException`, `SystemException`), permitindo diferenciar falhas de regra de negócio (por exemplo, "estoque insuficiente") de falhas técnicas (como perda de conexão com o banco), com tratamento centralizado no `main.ts`.

- **Atomicidade:** uso de transações SQL (`BEGIN`, `COMMIT` e `ROLLBACK`) em operações críticas, como empréstimos e devoluções, garantindo que o estoque e os registros de empréstimo sejam atualizados de forma consistente.

## 7. Funcionalidades Implementadas

- **Gestão de Autores:** cadastro, listagem, consulta detalhada (com livros vinculados), atualização e remoção.
- **Gestão de Livros:** cadastro (vinculado obrigatoriamente a um autor), listagem, consulta, atualização e remoção.
- **Gestão de Clientes:** cadastro, listagem, consulta, atualização e remoção.
- **Empréstimos:** registro de saída de livros com validação de disponibilidade em estoque.
- **Devoluções:** registro de devolução com atualização automática da quantidade disponível.
- **Relatórios:**
  - Livros disponíveis;
  - Livros emprestados (empréstimos ativos);
  - Livros por autor;
  - Livros mais populares (mais emprestados);
  - Livros nunca emprestados;
  - Autores com mais livros cadastrados;
  - Clientes com empréstimos ativos;
  - Histórico de empréstimos por cliente.
- **Exclusão lógica (soft delete):** registros removidos permanecem no banco marcados como inativos, preservando o histórico de empréstimos.

## 8. Requisitos para Execução

- [Node.js](https://nodejs.org/) v18 ou superior
- [Docker](https://www.docker.com/) e Docker Compose (recomendado), **ou** uma instância local do PostgreSQL 16+

## 9. Configuração do Banco de Dados

O banco de dados é provisionado via Docker Compose, utilizando a imagem `postgres:16-alpine`. O script `init/init.sql` é executado automaticamente na primeira inicialização do container, criando toda a estrutura de tabelas (`authors`, `books`, `customers`, `loans`) e seus relacionamentos.

1. Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

2. Preencha o `.env` com as credenciais desejadas:

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=biblioteca_tech
DB_HOST=localhost
DB_PORT=5433
```

> O `docker-compose.yml` expõe o PostgreSQL na porta `5433` do host (mapeada para a `5432` do container), evitando conflito com instâncias locais do Postgres.

## 10. Instalação

1. Clone o repositório:

```bash
git clone https://github.com/daniel-dealmeida-dev/bookstore-manager-cli.git
cd bookstore-manager-cli
```

2. Instale as dependências:

```bash
npm install
```

3. Suba o banco de dados com Docker Compose (o script `init/init.sql` é executado automaticamente na criação do container):

```bash
docker-compose up -d
```

> Caso prefira não usar Docker, é possível apontar o `.env` para uma instância própria do PostgreSQL e executar o script manualmente:
>
> ```bash
> psql -U seu_usuario -d biblioteca_tech -f init/init.sql
> ```

## 11. Execução

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

Para gerar a build de produção e executá-la:

```bash
npm run build
npm start
```

## 12. Exemplos de Utilização

Ao iniciar a aplicação, o menu principal é apresentado:

```
--- BIBLIOTECA SYSTEM ---
? Escolha uma opção: (Use as setas)
❯ Gerenciar Autores
  Gerenciar Livros
  Gerenciar Clientes
  Gerenciar Relatórios
  Realizar Empréstimo
  Registrar Devolução
  Sair
```

**Exemplo — cadastrando um autor:**

```
--- BIBLIOTECA SYSTEM: Gerenciar Autores ---
? Escolha uma opção: Cadastrar autores
? Nome do Autor: Machado de Assis
? Nacionalidade: Brasileira
? Descrição do autor: Escritor, considerado um dos maiores nomes da literatura brasileira.

✔ Autor salvo com sucesso!
```

**Exemplo — realizando um empréstimo:**

```
? Selecione o livro: Dom Casmurro
? Selecione o cliente: João Silva

✔ Empréstimo registrado com sucesso!
```

**Exemplo — relatório de livros disponíveis:**

```
┌─────────┬────────────────────┬────────────────────┐
│ (index) │ Título              │ Qtd. Disponível     │
├─────────┼────────────────────┼────────────────────┤
│    0    │ 'Dom Casmurro'      │         2           │
│    1    │ 'O Cortiço'         │         5           │
└─────────┴────────────────────┴────────────────────┘
```

## 13. Dificuldades Encontradas

- **Padronização de Erros:** o maior desafio foi criar um fluxo de tratamento de erros que fosse ao mesmo tempo técnico e amigável ao usuário, solucionado através de uma hierarquia de classes de exceção customizadas (`DomainException` x `SystemException`).
- **Gestão de Recursos:** garantir a liberação segura das conexões do pool (`client.release()`) em todos os cenários possíveis — inclusive em caminhos de erro — foi crítico para a estabilidade da aplicação sob uso prolongado.
- **Atomicidade em Operações Compostas:** operações como empréstimo e devolução envolvem múltiplas escritas (atualizar estoque e registrar/atualizar o empréstimo). Garantir que ambas ocorressem de forma atômica exigiu o uso disciplinado de transações SQL com `ROLLBACK` em caso de falha.


## 14. Futuras Implementações

- Cobertura de testes automatizados (unitários e de integração) para as camadas de domínio e aplicação.
- Autenticação e controle de acesso (perfis de bibliotecário e cliente).
- Notificação de empréstimos em atraso.
- Paginação nas listagens, para melhor performance com grandes volumes de dados.
- Exportação de relatórios em CSV/PDF.
- Migração de scripts SQL manuais para uma ferramenta de migrations.
- Melhor tratamento de erros.
  



## 15. Link do Kanban

- [\[Link do Trello\]](https://trello.com/b/LnqQ2y80/biblioteca-cli)
