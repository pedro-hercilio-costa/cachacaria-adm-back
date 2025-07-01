const productModel = require('../models/productModel');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            // Busca produtos no model
            const productItems = await productModel.findAllProducts();

            // Verifique se há itens no retorno
            if (productItems.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando os produtos
            return res.status(200).json(productItems);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },

    getIngredientes: async (req, res) => {
        try {
            // Busca produtos no model
            const productItems = await productModel.getIngredientes();

            // Verifique se há itens no retorno
            if (productItems.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando os produtos
            return res.status(200).json(productItems);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },

    getProduzidos: async (req, res) => {
        try {
            // Busca produtos no model
            const productItems = await productModel.getProduzidos();

            // Verifique se há itens no retorno
            if (productItems.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando os produtos
            return res.status(200).json(productItems);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },

    getProductByID: async (req, res) => {
        const { IdProduct } = req.params;
        try {

            if (!IdProduct) {
                return res.status(400).json({ message: 'Id do produto não informado' });
            }

            // Busca produtos no model
            const productItems = await productModel.getProductByID(IdProduct);

            // Verifique se há itens no retorno
            if (productItems.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            // Retornando os produtos
            return res.status(200).json(productItems);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },

    deleteProduct: async (req, res) => {
        const { IdProduct } = req.params;

        if (!IdProduct) {
            return res.status(400).json({ message: 'Id do produto não informado' });
        }

        try {
            await productModel.deleteProduct(IdProduct);
            return res.status(200).json({ message: 'Produto deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar item:', error);

            let errorMessage = 'Erro ao deletar item no banco de dados.';

            if (error.detail) {
                const match = error.detail.match(/tabela\s+"([^"]+)"/i);
                if (match && match[1]) {
                    const tableName = match[1];
                    errorMessage = `Não é possível excluir o produto porque ele está vinculado à tabela '${tableName}'.`;
                } else {
                    errorMessage += ` Detalhe: ${error.detail}`;
                }
            }

            return res.status(500).json({ message: errorMessage });
        }
    },

    updateProduct: async (req, res) => {
        const { IdProduct } = req.params;
        const updatedProduct = req.body;

        if (!IdProduct) {
            return res.status(400).json({ message: 'Id do produto não informado' });
        }

        try {
            await productModel.updateProduct(IdProduct, updatedProduct);
            return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return res.status(500).json({ message: 'Erro ao atualizar o produto no banco de dados.' });
        }
    },

    insertProduct: async (req, res) => {
        const newProduct = req.body;

        try {
            const result = await productModel.insertProduct(newProduct);
            return res.status(201).json({ message: 'Produto inserido com sucesso.', id: result.id });
        } catch (error) {
            console.error('Erro ao inserir produto:', error);
            return res.status(500).json({ message: 'Erro ao inserir produto no banco de dados.' });
        }
    },

    getProdPreco: async (req, res) => {
        try {
            const productItems = await productModel.getProdPreco();

            if (productItems.length === 0) {
                return res.status(200).json({ message: 'EmptyList' });
            }

            return res.status(200).json(productItems);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro ao buscar produtos no banco de dados' });
        }
    },
};

module.exports = productController;