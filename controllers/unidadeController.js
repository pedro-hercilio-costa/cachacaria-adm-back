const unidadeModel = require('../models/unidadeModel');

const unidadeController = {
  getAllUnidades: async (req, res) => {
    try {
      const unidades = await unidadeModel.getAllUnidades();
      return res.status(200).json(unidades);
    } catch (error) {
      console.error('Erro no controller ao buscar unidades:', error);
      return res.status(500).json({ message: 'Erro ao buscar unidades no banco de dados.' });
    }
  }
};

module.exports = unidadeController;
