const estoqueModel = require('../models/estoqueModel');

const productController = {

    getProductByID: async (req, res) => {
        const { IdProduct } = req.params;
        try {

            if (!IdProduct) {
                return res.status(400).json({ message: 'Id do produto não informado' });
            }

            // Busca produtos no model
            const result = await estoqueModel.getProductByID(IdProduct);

            // Verifique se há itens no retorno
            if (result.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando os produtos
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },

        getSaldoProductByID: async (req, res) => {
        const { IdProduct } = req.params;
        try {

            if (!IdProduct) {
                return res.status(400).json({ message: 'Id do produto não informado' });
            }

            // Busca produtos no model
            const result = await estoqueModel.getSaldoProductByID(IdProduct);

            // Verifique se há itens no retorno
            if (result.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando os produtos
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },
};

module.exports = productController;