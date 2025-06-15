const pool = require('../db');

const getTiposManutencao = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM tipo_manutencao ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar tipos de manutenção:', error);
    res.status(500).json({ error: 'Erro ao buscar tipos de manutenção' });
  }
};

module.exports = {
  getTiposManutencao
};
