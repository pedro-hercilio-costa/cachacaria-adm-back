const pool = require('../db'); 

// Listar todos os fornecedores
const getFornecedores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE fornecedor = true ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar fornecedores' });
  }
};

// Buscar fornecedor por ID
const getFornecedorById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1 AND fornecedor = true', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar fornecedor' });
  }
};

// Criar fornecedor
const createFornecedor = async (req, res) => {
  const {
    nome, email, telefone, cep,
    logradouro, numero, complemento, bairro,
    cidade, uf, cpfcnpj
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO clientes 
      (nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, cpfcnpj, fornecedor) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true) 
      RETURNING *`,
      [nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, cpfcnpj]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar fornecedor' });
  }
};

// Atualizar fornecedor
const updateFornecedor = async (req, res) => {
  const id = req.params.id;
  const {
    nome, email, telefone, cep,
    logradouro, numero, complemento, bairro,
    cidade, uf, cpfcnpj
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE clientes SET 
      nome = $1, email = $2, telefone = $3, cep = $4,
      logradouro = $5, numero = $6, complemento = $7, bairro = $8,
      cidade = $9, uf = $10, cpfcnpj = $11
      WHERE id = $12 AND fornecedor = true 
      RETURNING *`,
      [nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, cpfcnpj, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar fornecedor' });
  }
};

// Deletar fornecedor
const deleteFornecedor = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 AND fornecedor = true RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fornecedor não encontrado ou já excluído' });
    }
    res.json({ message: 'Fornecedor excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir fornecedor' });
  }
};

// Exporta os controladores
module.exports = {
  getFornecedores,
  getFornecedorById,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor
};
