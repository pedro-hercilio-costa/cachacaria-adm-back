const db = require('../db');

const Sabor = {
  getAllSabores: async () => {
    const query = 'SELECT id, nome FROM sabor WHERE ativo = 1 ORDER BY nome';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar sabores:', error);
      throw error;
    }
  }
};

module.exports = Sabor;
