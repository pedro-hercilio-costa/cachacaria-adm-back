const pool = require('../db'); // Ajuste para seu arquivo de conexão com o banco

// Listar todos os clientes
const getClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar clientes' });
  }
};

// Buscar cliente por id
const getClienteById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar cliente' });
  }
};

// Criar cliente
const createCliente = async (req, res) => {
  const {
    nome, datanasc, email, telefone, cep,
    logradouro, numero, complemento, bairro,
    cidade, uf, cliente
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO clientes (nome, datanasc, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, cliente)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [nome, datanasc, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, cliente]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
};

// Atualizar cliente
const updateCliente = async (req, res) => {
  const id = req.params.id;
  const {
    nome, datanasc, email, telefone, cep,
    logradouro, numero, complemento, bairro,
    cidade, uf, cliente
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE clientes SET
       nome=$1, datanasc=$2, email=$3, telefone=$4, cep=$5,
       logradouro=$6, numero=$7, complemento=$8, bairro=$9,
       cidade=$10, uf=$11, cliente=$12
       WHERE id=$13
       RETURNING *`,
      [nome, datanasc, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, cliente, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
};

// Exporta as funções para usar nas rotas
module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
};
