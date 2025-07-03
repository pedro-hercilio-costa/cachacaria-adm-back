
# Cachaçaria ADM - Backend

Este projeto é o backend da aplicação **Cachaçaria ADM**, um sistema de gestão administrativa para controle de produtos, pedidos e usuários de uma cachaçaria.

## 📝 Descrição do Projeto

O objetivo deste projeto é fornecer uma API RESTful robusta que permite realizar operações CRUD (Create, Read, Update, Delete) sobre os principais recursos do sistema, como:

- Produtos (bebidas, ingredientes, etc)
- Consulta de Estoque
- Compras e Vendas
- Usuários / Autenticação
- Relatórios administrativos

## 🚀 Tecnologias Utilizadas

- **Node.js** - Plataforma de execução JavaScript no servidor.
- **Express.js** - Framework web minimalista para Node.js.
- **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional.
- **JWT (JSON Web Token)** - Para autenticação e controle de acesso.

## 📂 Estrutura de Pastas

```
src/
├── controllers/     # Lógica dos endpoints
├── models/          # Definição das entidades via Sequelize
├── routes/          # Definição das rotas da API
├── db.js            # Configurações de banco de dados
└── server.js        # Ponto de entrada da aplicação
```

## ✅ Funcionalidades Principais

- Cadastro e autenticação de usuários
- Cadastro, edição e exclusão de produtos
- Registro de movimentações (compras e vendas)
- Geração de relatórios administrativos
- Autenticação com JWT

## ▶️ Como Executar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/pedro-hercilio-costa/cachacaria-adm-back.git
```

2. Instale as dependências:

```bash
npm install jsonwebtoken
```

3. Inicie o servidor:

```bash
npm start
```

## 🛠️ Requisitos

- Node.js
- PostgreSQL

## 📌 Próximas Melhorias

- Implementação de testes unitários e de integração
- Deploy na nuvem (Railway, Vercel, Render,etc)

## 📄 Licença

Este projeto está sob a licença MIT.
