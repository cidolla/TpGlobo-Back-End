# TelePrompt Inteligente — API Backend

API REST desenvolvida para o projeto **TelePrompt Inteligente**, uma proposta de solução tecnológica voltada à automação de teleprompters, utilizando inteligência artificial para relacionar a fala do apresentador ao conteúdo textual dos roteiros.

O backend é responsável pelo gerenciamento dos roteiros, autenticação de usuários, controle de permissões e disponibilização dos dados para integração com o Front-End.

**Status do projeto:** Em desenvolvimento.

---

## Sobre o projeto

O TelePrompt Inteligente tem como objetivo desenvolver uma solução capaz de acompanhar a apresentação de um profissional em tempo real, reconhecendo sua fala e relacionando-a ao conteúdo previamente cadastrado no teleprompter.

A proposta busca reduzir a necessidade de operação manual do equipamento, proporcionando maior autonomia durante a apresentação dos roteiros.

Esta API representa a camada de backend do projeto, responsável por disponibilizar os serviços de gerenciamento e armazenamento das informações.

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução JavaScript |
| Express.js | Construção da API REST |
| MongoDB Atlas | Banco de dados NoSQL em nuvem |
| Mongoose | Modelagem e comunicação com MongoDB |
| bcrypt | Hash e verificação de senhas |
| JSON Web Token (JWT) | Autenticação e autorização |
| Swagger / OpenAPI 3.0 | Documentação e testes da API |
| Nodemon | Reinicialização automática no desenvolvimento |
| dotenv | Gerenciamento de variáveis de ambiente |
| express-rate-limit | Limitação de tentativas de autenticação |
| CORS | Controle de acesso entre diferentes origens |

## Funcionalidades implementadas

### Autenticação e segurança
- Login de usuários com e-mail e senha.
- Armazenamento de senhas utilizando hash bcrypt.
- Autenticação baseada em JWT.
- Verificação de validade dos tokens.
- Controle de acesso por perfil de usuário.
- Limitação de tentativas de login.
- Proteção das rotas privadas por middleware.

### Gerenciamento de roteiros
- Cadastro de roteiros.
- Listagem de roteiros ativos.
- Consulta de roteiro por identificador.
- Atualização parcial de informações com PATCH.
- Arquivamento lógico de roteiros utilizando DELETE.
- Registro do usuário responsável pela criação e atualização.
- Validação de campos e dados recebidos pela API.

### Documentação
- Documentação dos endpoints utilizando OpenAPI 3.0.
- Interface interativa Swagger UI.
- Testes de requisições diretamente pelo navegador.
- Autenticação JWT integrada à documentação.

## Arquitetura do projeto

O backend utiliza uma organização modular, separando responsabilidades entre configuração, modelos, controllers, middlewares e rotas.

```text
TpGlobo-Back-End/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── roteiroController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Usuario.js
│   │   └── Roteiro.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── roteiroRoutes.js
│   │
│   ├── scripts/
│   │   └── criarAdmin.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Modelagem dos dados

### Usuário

O sistema possui controle de usuários com diferentes níveis de permissão.

Principais atributos:

| Campo | Descrição |
|---|---|
| nome | Nome do usuário |
| email | E-mail utilizado para autenticação |
| senhaHash | Hash da senha armazenado com bcrypt |
| perfil | Nível de acesso do usuário |
| ativo | Indica se o usuário está habilitado |

Perfis disponíveis:

- `admin` — administrador do sistema.
- `editor` — responsável pela criação e edição de roteiros.
- `operador` — usuário com permissão de consulta dos roteiros.

### Roteiro

| Campo | Descrição |
|---|---|
| titulo | Título do roteiro |
| categoria | Classificação editorial |
| status | Situação atual do roteiro |
| blocos | Conteúdo organizado em blocos |
| criadoPor | Usuário responsável pela criação |
| atualizadoPor | Usuário responsável pela última alteração |
| createdAt | Data de criação |
| updatedAt | Data da última atualização |

Categorias disponíveis:

`politica`, `economia`, `esportes`, `saude`, `educacao`, `seguranca`, `cultura`, `tecnologia`, `previsao-do-tempo` e `outros`.

Status disponíveis:

- `rascunho`
- `em_revisao`
- `aprovado`
- `publicado`
- `arquivado`

Cada roteiro é composto por blocos de conteúdo, que podem ser classificados como:

- `fala`
- `vinheta`
- `pausa`
- `orientacao`

## Endpoints da API

A API utiliza o padrão REST e disponibiliza os seguintes endpoints:

### Autenticação

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/login` | Realizar login | Público |
| GET | `/api/auth/me` | Consultar usuário autenticado | Autenticado |

### Roteiros

| Método | Endpoint | Descrição | Permissão |
|---|---|---|---|
| POST | `/api/roteiros` | Cadastrar roteiro | Admin / Editor |
| GET | `/api/roteiros` | Listar roteiros não arquivados | Todos os perfis |
| GET | `/api/roteiros/:id` | Consultar roteiro por ID | Todos os perfis |
| PATCH | `/api/roteiros/:id` | Atualizar parcialmente um roteiro | Admin / Editor |
| DELETE | `/api/roteiros/:id` | Arquivar roteiro | Admin / Editor |

**Observação:** o endpoint DELETE implementa exclusão lógica. O documento não é removido fisicamente do MongoDB; seu status passa a ser `arquivado`. Roteiros arquivados não aparecem na listagem normal, mas continuam acessíveis pela consulta individual por ID.

### Endpoints auxiliares

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verificar funcionamento da API |
| GET | `/health` | Verificar disponibilidade do serviço |

## Códigos HTTP

A API utiliza os seguintes códigos de resposta, conforme a operação:

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Requisição ou dados inválidos |
| 401 | Não autenticado |
| 403 | Sem permissão para realizar a operação |
| 404 | Recurso não encontrado |
| 409 | Conflito, como tentativa de arquivar um roteiro já arquivado |
| 429 | Limite de tentativas excedido |
| 500 | Erro interno do servidor |

## Instalação e execução local

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Conta e cluster configurados no MongoDB Atlas.
- Git instalado.
- Editor de código, como Visual Studio Code.

### 1. Clonar o repositório

```bash
git clone https://github.com/cidolla/TpGlobo-Back-End.git
```

### 2. Acessar a pasta

```bash
cd TpGlobo-Back-End
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando `.env.example` como referência.

Exemplo:

```env
PORT=3000

MONGODB_URI=sua_uri_do_mongodb_atlas

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=15m