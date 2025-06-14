const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar um novo maquinário (POST)
router.post('/', async (req, res) => {
  const { nome, aquisicao } = req.body;

  if (!nome || !aquisicao) {
    return res.status(400).json({ error: 'Nome e data de aquisição são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO cachacaria_adm.maquinario (nome, dataaquisicao) VALUES ($1, $2) RETURNING *',
      [nome, aquisicao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir maquinário:', err);
    res.status(500).json({ error: 'Erro ao salvar o maquinário no banco de dados.' });
  }
});

// Listar todos os maquinários (GET)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cachacaria_adm.maquinario ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar maquinários:', err);
    res.status(500).json({ error: 'Erro ao buscar maquinários.' });
  }
});

// Excluir um maquinário pelo ID (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM cachacaria_adm.maquinario WHERE id = $1', [id]);
    res.status(204).send(); // sucesso sem conteúdo
  } catch (err) {
    console.error('Erro ao deletar maquinário:', err);
    res.status(500).json({ error: 'Erro ao deletar maquinário.' });
  }
});

// Buscar maquinário pelo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM cachacaria_adm.maquinario WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maquinário não encontrado.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar maquinário:', err);
    res.status(500).json({ error: 'Erro ao buscar maquinário.' });
  }
});

// Atualizar um maquinário pelo ID (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, aquisicao } = req.body;

  if (!nome || !aquisicao) {
    return res.status(400).json({ error: 'Nome e data de aquisição são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'UPDATE cachacaria_adm.maquinario SET nome = $1, dataaquisicao = $2 WHERE id = $3 RETURNING *',
      [nome, aquisicao, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maquinário não encontrado.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar maquinário:', err);
    res.status(500).json({ error: 'Erro ao atualizar maquinário.' });
  }
});

module.exports = router;
