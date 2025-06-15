const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todos os fornecedores (fornecedor = 1)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM identificacao WHERE fornecedor = 1 ORDER BY nome'
    );

    // Formatar dtanascimento para YYYY-MM-DD (se existir)
    const fornecedores = result.rows.map(f => ({
      ...f,
      dtanascimento: f.dtanascimento ? f.dtanascimento.toISOString().slice(0, 10) : null
    }));

    res.json(fornecedores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});

// Buscar fornecedor por id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      'SELECT * FROM identificacao WHERE id = $1 AND fornecedor = 1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }

    const fornecedor = result.rows[0];
    fornecedor.dtanascimento = fornecedor.dtanascimento ? fornecedor.dtanascimento.toISOString().slice(0, 10) : null;

    res.json(fornecedor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar fornecedor' });
  }
});

// Criar fornecedor
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
      `INSERT INTO identificacao 
      (nome, telefone, dtanascimento, cep, logradouro, numero, complemento, emailcontato, cpfcnpj, idf_cidade, cliente, fornecedor)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,0,1) RETURNING *`,
      [nome, telefone, dtanascimento, cep, logradouro, numero, complemento, emailcontato, cpfcnpj, idf_cidade]
    );

    const fornecedor = result.rows[0];
    fornecedor.dtanascimento = fornecedor.dtanascimento ? fornecedor.dtanascimento.toISOString().slice(0, 10) : null;

    res.status(201).json(fornecedor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
});

// Atualizar fornecedor
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
      `UPDATE identificacao SET
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
      WHERE id=$11 AND fornecedor = 1 RETURNING *`,
      [nome, telefone, dtanascimento, cep, logradouro, numero, complemento, emailcontato, cpfcnpj, idf_cidade, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }

    const fornecedor = result.rows[0];
    fornecedor.dtanascimento = fornecedor.dtanascimento ? fornecedor.dtanascimento.toISOString().slice(0, 10) : null;

    res.json(fornecedor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

// Deletar fornecedor
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      'DELETE FROM identificacao WHERE id = $1 AND fornecedor = 1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json({ message: 'Fornecedor excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir fornecedor' });
  }
});

module.exports = router;
