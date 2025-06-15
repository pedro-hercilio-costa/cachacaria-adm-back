const pool = require('../db');

const getManutencoes = async (req, res) => {
  try {
    const { maquinario } = req.query;

    let query = `
      SELECT 
        mm.id,
        mm.datamanutencao,
        mm.proximamanutencao,
        mm.descricao,
        mm.custo,
        mm.obersvacao AS observacoes,
        tm.nome AS tipo,
        u.nome AS responsavel,
        m.nome AS maquinario
      FROM manutencao_maquinario mm
      JOIN tipo_manutencao tm ON mm.idf_tipomanutencao = tm.id
      JOIN usuario u ON mm.idf_usuario = u.id
      JOIN maquinario m ON mm.idf_maquinario = m.id
    `;

    const values = [];

    if (maquinario) {
      query += ' WHERE mm.idf_maquinario = $1';
      values.push(maquinario);
    }

    query += ' ORDER BY mm.datamanutencao DESC';

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar manutenções:', error);
    res.status(500).json({ error: 'Erro ao buscar manutenções' });
  }
};

const getManutencaoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM manutencao_maquinario WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar manutenção' });
  }
};

const createManutencao = async (req, res) => {
  try {
    const {
      idf_maquinario,
      idf_tipomanutencao,
      idf_usuario,
      datamanutencao,
      descricao,
      custo,
      proximamanutencao,
      obersvacao
    } = req.body;

    const query = `
      INSERT INTO manutencao_maquinario (
        idf_maquinario,
        idf_tipomanutencao,
        idf_usuario,
        datamanutencao,
        descricao,
        custo,
        proximamanutencao,
        obersvacao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      idf_maquinario,
      idf_tipomanutencao,
      idf_usuario,
      datamanutencao,
      descricao,
      custo,
      proximamanutencao,
      obersvacao
    ];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar manutenção:', error);
    res.status(500).json({ error: 'Erro ao criar manutenção' });
  }
};

const updateManutencao = async (req, res) => {
  const { id } = req.params;
  const {
    idf_maquinario, idf_tipomanutencao, idf_usuario,
    datamanutencao, descricao, custo,
    proximamanutencao, obersvacao
  } = req.body;
  const query = `
    UPDATE manutencao_maquinario
    SET idf_tipomanutencao=$1, idf_usuario=$2,
        datamanutencao=$3, descricao=$4,custo=$5,
        proximamanutencao=$6, obersvacao=$7
    WHERE id = $8 RETURNING *`;
  const values = [idf_tipomanutencao,idf_usuario,datamanutencao,
    descricao,custo,proximamanutencao,obersvacao,id];
  try {
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar manutenção' });
  }
};

const deleteManutencao = async (req, res) => {
  try {
    await pool.query('DELETE FROM manutencao_maquinario WHERE id = $1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir manutenção' });
  }
};

module.exports = {
  getManutencoes,
  getManutencaoById,
  createManutencao,
  updateManutencao,
  deleteManutencao
};
