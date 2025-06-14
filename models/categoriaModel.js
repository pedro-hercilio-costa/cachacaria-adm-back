const db = require('../db');

const Categoria = {
  getAllCategorias: async () => {
    const query = 'SELECT id, nome FROM categoria WHERE ativo = 1 ORDER BY nome';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }
};

module.exports = Categoria;
