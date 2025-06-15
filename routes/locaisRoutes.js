const express = require('express');
const router = express.Router();
const db = require('../db'); // ajustado para o seu arquivo de conexão PostgreSQL

// Rota para buscar todos os estados
router.get('/estados', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nome, uf
      FROM estado
      ORDER BY nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    res.status(500).json({ message: 'Erro ao buscar estados' });
  }
});

// Rota para buscar cidades de um estado
router.get('/cidades', async (req, res) => {
  const { estado } = req.query;

  if (!estado) {
    return res.status(400).json({ message: 'Parâmetro estado é obrigatório' });
  }

  try {
    const result = await db.query(`
      SELECT id, nome
      FROM cidade
      WHERE idf_estado = $1
      ORDER BY nome
    `, [estado]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    res.status(500).json({ message: 'Erro ao buscar cidades' });
  }
});

// Rota para buscar uma cidade pelo id com estado
router.get('/cidade/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT c.id, c.nome, c.idf_estado, e.nome AS nome_estado
      FROM cidade c
      JOIN estado e ON c.idf_estado = e.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cidade:', error);
    res.status(500).json({ message: 'Erro ao buscar cidade' });
  }
});


// GET /api/cidade/:id - retorna cidade com estado
router.get('/cidade/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT c.id, c.nome, c.idf_estado, e.nome AS nome_estado
      FROM cidade c
      JOIN estado e ON c.idf_estado = e.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cidade por ID:', error);
    res.status(500).json({ message: 'Erro interno ao buscar cidade' });
  }
});


module.exports = router;
