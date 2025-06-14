const categoriaModel = require('../models/categoriaModel');

const categoriaController = {
  getAllCategorias: async (req, res) => {
    try {
      const categorias = await categoriaModel.getAllCategorias();
      return res.status(200).json(categorias);
    } catch (error) {
      console.error('Erro no controller ao buscar categorias:', error);
      return res.status(500).json({ message: 'Erro ao buscar categorias no banco de dados.' });
    }
  }
};

module.exports = categoriaController;
