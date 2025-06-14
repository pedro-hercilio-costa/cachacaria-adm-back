const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todos os clientes (cliente = 1)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM cachacaria_adm.identificacao WHERE cliente = 1 ORDER BY nome'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Buscar cliente por id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      'SELECT * FROM cachacaria_adm.identificacao WHERE id = $1 AND cliente = 1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// Criar cliente
router.post('/', async (req, res) => {
  const {
    nome,
    telefone,
    dtanascimento,
    cep,
    logradouro,
    numero,
    complemento,
    emailcontato,
    cpfcnpj,
    idf_cidade
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO cachacaria_adm.identificacao 
      (nome, telefone, dtanascimento, cep, logradouro, numero, complemento, emailcontato, cpfcnpj, idf_cidade, cliente, fornecedor)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,1,0) RETURNING *`,
      [nome, telefone, dtanascimento, cep, logradouro, numero, complemento, emailcontato, cpfcnpj, idf_cidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    nome,
    telefone,
    dtanascimento,
    cep,
    logradouro,
    numero,
    complemento,
    emailcontato,
    cpfcnpj,
    idf_cidade
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE cachacaria_adm.identificacao SET
        nome=$1,
        telefone=$2,
        dtanascimento=$3,
        cep=$4,
        logradouro=$5,
        numero=$6,
        complemento=$7,
        emailcontato=$8,
        cpfcnpj=$9,
        idf_cidade=$10
      WHERE id=$11 AND cliente = 1 RETURNING *`,
      [nome, telefone, dtanascimento, cep, logradouro, numero, complemento, emailcontato, cpfcnpj, idf_cidade, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      'DELETE FROM cachacaria_adm.identificacao WHERE id = $1 AND cliente = 1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

module.exports = router;
