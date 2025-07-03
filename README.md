
# Cachaçaria ADM - Backend

Este projeto é o backend da aplicação **Cachaçaria ADM**, um sistema de gestão administrativa para controle de produtos, pedidos e usuários de uma cachaçaria.

## 📝 Descrição do Projeto

O objetivo deste projeto é fornecer uma API RESTful robusta que permite realizar operações CRUD (Create, Read, Update, Delete) sobre os principais recursos do sistema, como:

- Produtos (bebidas, cachaças, etc)
- Pedidos
- Usuários / Autenticação
- Relatórios administrativos

## 🚀 Tecnologias Utilizadas

- **Node.js** - Plataforma de execução JavaScript no servidor.
- **Express.js** - Framework web minimalista para Node.js.
- **Sequelize** - ORM para Node.js, utilizado para modelagem e manipulação do banco de dados.
- **MySQL / PostgreSQL / SQLite (dependendo do seu projeto)** - Sistema de gerenciamento de banco de dados relacional.
- **JWT (JSON Web Token)** - Para autenticação e controle de acesso.
- **dotenv** - Para gerenciamento de variáveis de ambiente.

## 📂 Estrutura de Pastas

```
src/
├── config/          # Configurações (ex: banco de dados, autenticação)
├── controllers/     # Lógica dos endpoints
├── models/          # Definição das entidades via Sequelize
├── routes/          # Definição das rotas da API
├── middlewares/     # Middlewares (ex: autenticação)
└── index.js         # Ponto de entrada da aplicação
```

## ✅ Funcionalidades Principais

- Cadastro e autenticação de usuários
- Cadastro, edição e exclusão de produtos
- Registro e atualização de pedidos
- Geração de relatórios administrativos
- Proteção de rotas com autenticação JWT

## ▶️ Como Executar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/pedro-hercilio-costa/cachacaria-adm-back.git
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
npm start
```

## 🛠️ Requisitos

- Node.js
- MySQL / PostgreSQL
- Sequelize CLI (opcional, se usar migrações)

## 📌 Próximas Melhorias

- Implementação de testes unitários e de integração
- Documentação com Swagger
- Deploy na nuvem (Heroku, Vercel, etc)

## 📄 Licença

Este projeto está sob a licença MIT.
