const db = require('../db');

const Unidade = {
  getAllUnidades: async () => {
    const query = 'SELECT id, nome FROM unidade ORDER BY nome';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      throw error;
    }
  }
};

module.exports = Unidade;
