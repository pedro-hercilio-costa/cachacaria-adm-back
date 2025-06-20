const pool = require('../db');

// Criação de maquinário
const criarMaquinario = async (req, res) => {
  const { nome, aquisicao } = req.body;

  if (!nome || !aquisicao) {
    return res.status(400).json({ error: 'Nome e data de aquisição são obrigatórios.' });
  }

  try {

    const dataAjustada = new Date(aquisicao);
    dataAjustada.setHours(dataAjustada.getHours() + 3);

    const result = await pool.query(
      'INSERT INTO maquinario (nome, dataaquisicao) VALUES ($1, $2) RETURNING *',
      [nome, dataAjustada]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar maquinário:', err);
    res.status(500).json({ error: 'Erro ao salvar o maquinário.' });
  }
};

// Listagem de maquinários (opcional, se quiser usar)
const listarMaquinarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinario ORDER BY nome');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar maquinários:', err);
    res.status(500).json({ error: 'Erro ao buscar maquinários.' });
  }
};

module.exports = {
  criarMaquinario,
  listarMaquinarios, // pode remover se não quiser ainda
};
