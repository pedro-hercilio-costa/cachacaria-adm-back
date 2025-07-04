const producaoModel = require('../models/producaoModel');

const producaoController = {
    getOrdemProducaoList: async (req, res) => {
        try {
            const ordemList = await producaoModel.getOrdemProducaoList();
            return res.status(200).json(ordemList);
        } catch (error) {
            console.error('Erro ao buscar ordens de produção:', error);
            return res.status(500).json({ message: 'Erro ao buscar ordens de produção.' });
        }
    },

    getComposicaoByOrdemId: async (req, res) => {
        const { IdDocto } = req.params;

        if (!IdDocto) {
            return res.status(400).json({ message: 'Id da ordem de produção não informado.' });
        }

        try {
            const composicao = await producaoModel.getComposicaoByOrdemId(IdDocto);
            if (composicao.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            return res.status(200).json(composicao);
        } catch (error) {
            console.error('Erro ao buscar composição da produção:', error);
            return res.status(500).json({ message: 'Erro ao buscar composição da produção no banco de dados.' });
        }
    },


    getOrdemProducaoByID: async (req, res) => {
        const { IdDocto } = req.params;

        if (!IdDocto) {
            return res.status(400).json({ message: 'Id do documento não informado' });
        }

        try {
            const ordem = await producaoModel.getOrdemProducaoByID(IdDocto);
            return res.status(200).json(ordem);
        } catch (error) {
            console.error('Erro ao buscar ordem de produção:', error);
            return res.status(500).json({ message: 'Erro ao buscar ordem de produção.' });
        }
    },

    insertDocto: async (req, res) => {
        const newDocto = req.body;

        try {
            await producaoModel.insertDocto(newDocto);
            return res.status(201).json({ message: 'Ordem de produção inserida com sucesso.' });
        } catch (error) {
            console.error('Erro ao inserir ordem de produção:', error);
            return res.status(500).json({ message: 'Erro ao inserir a ordem de produção no banco de dados.' });
        }
    },

    deleteDocto: async (req, res) => {
        const id = req.params.id;

        try {
            await producaoModel.deleteDocto(id);
            return res.status(200).json({ message: 'Ordem de produção excluída com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir ordem de produção:', error);
            return res.status(500).json({ message: 'Erro ao excluir ordem de produção.' });
        }
    },
};

module.exports = producaoController;