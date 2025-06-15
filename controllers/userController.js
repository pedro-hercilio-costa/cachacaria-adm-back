const pool = require('../db'); // Certifique-se que o db.js exporta a pool do PostgreSQL

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "usuario" ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

exports.createUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO "usuario" (email, senha) VALUES ($1, $2) RETURNING *',
      [email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // erro de email duplicado (unique constraint)
      res.status(400).json({ error: 'Email já cadastrado.' });
    } else {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      'UPDATE "usuario" SET email = $1, senha = $2 WHERE id = $3 RETURNING *',
      [email, senha, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM "usuario" WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
