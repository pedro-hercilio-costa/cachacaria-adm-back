const composicaoModel = require('../models/composicaoModel');

const composicaoController = {
    getComposicaoProductByID: async (req, res) => {
        const { IdProduct } = req.params;
        try {

            if (!IdProduct) {
                return res.status(400).json({ message: 'Id do produto não informado' });
            }

            // Busca composicao produtos no model
            const composicaoItems = await composicaoModel.getComposicaoProductByID(IdProduct);

            // Verifique se há itens no retorno
            if (composicaoItems.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando as composicoes
            return res.status(200).json(composicaoItems);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },

        getAllComposicoes: async (req, res) => {        
        try {
            // Busca todas as composicao no model
            const composicoes = await composicaoModel.getAllComposicoes();

            // Verifique se há itens no retorno
            if (composicoes.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando as composicoes
            return res.status(200).json(composicoes);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },
};

module.exports = composicaoController;