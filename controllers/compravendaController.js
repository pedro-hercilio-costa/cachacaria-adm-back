const compravendatModel = require('../models/compravendaModel');

const compravendaController = {
    getAllDocVenda: async (req, res) => {
        try {

            const vendaList = await compravendatModel.getAllDocVenda();

            if (vendaList.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            return res.status(200).json(vendaList);
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
            return res.status(500).json({ message: 'Erro ao buscar vendas no banco de dados' });
        }
    },

    getAllDocCompra: async (req, res) => {
        try {

            const compraList = await compravendatModel.getAllDocCompra();

            if (compraList.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            return res.status(200).json(compraList);
        } catch (error) {
            console.error('Erro ao buscar compras:', error);
            return res.status(500).json({ message: 'Erro ao buscar compras no banco de dados' });
        }
    },

    getDoctoByID: async (req, res) => {
        const { IdDocto } = req.params;
        try {
            const compra = await compravendatModel.getDoctoByID(IdDocto);

            if (compra.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            const itens = await compravendatModel.getItensDoctoByID(IdDocto);

            const compraComItens = {
                ...compra[0],
                itens: itens
            };

            return res.status(200).json(compraComItens);
        } catch (error) {
            console.error('Erro ao buscar compra:', error);
            return res.status(500).json({ message: 'Erro ao buscar compra no banco de dados' });
        }
    },

    getAllCliente: async (req, res) => {
        try {
            const clientesList = await compravendatModel.getAllCliente();

            if (clientesList.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            return res.status(200).json(clientesList);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return res.status(500).json({ message: 'Erro ao buscar clientes no banco de dados' });
        }
    },

    getAllFornecedor: async (req, res) => {
        try {
            const fornecedoreslist = await compravendatModel.getAllFornecedor();

            if (fornecedoreslist.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            return res.status(200).json(fornecedoreslist);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
            return res.status(500).json({ message: 'Erro ao buscar fornecedores no banco de dados' });
        }
    },
    insertDoctoVenda: async (req, res) => {
        const newDocto = req.body;
        console.log(newDocto);

        try {
            await compravendatModel.insertDoctoVenda(newDocto);
            return res.status(200).json({ message: 'Documento inserido com sucesso.' });
        } catch (error) {
            console.error('Erro ao inserir documento de venda:', error);
            return res.status(500).json({ message: 'Erro ao inserir documento no banco de dados.' });
        }
    },

    insertDoctoCompra: async (req, res) => {
        const newDocto = req.body;
        console.log(newDocto);

        try {
            await compravendatModel.insertDoctoCompra(newDocto);
            return res.status(200).json({ message: 'Documento inserido com sucesso.' });
        } catch (error) {
            console.error('Erro ao inserir documento de venda:', error);
            return res.status(500).json({ message: 'Erro ao inserir documento no banco de dados.' });
        }
    },

};

module.exports = compravendaController;