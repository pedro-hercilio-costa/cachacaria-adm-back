const saborModel = require('../models/saborModel');

const saborController = {
  getAllSabores: async (req, res) => {
    try {
      const sabores = await saborModel.getAllSabores();
      return res.status(200).json(sabores);
    } catch (error) {
      console.error('Erro no controller ao buscar sabores:', error);
      return res.status(500).json({ message: 'Erro ao buscar sabores no banco de dados.' });
    }
  }
};

module.exports = saborController;
