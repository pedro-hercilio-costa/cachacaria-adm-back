const db = require('../db');

const Composicao = {
    getComposicaoProductByID: async (IdProduct) => {
        const query = 'SELECT A.ID, A.QTDCOMP, A.IDF_PRODUTOCOMPOSICAO, B.DESCRICAO, A.IDF_UNIDADE, C.NOME  FROM COMPOSICAO A ' +
            'INNER JOIN PRODUTO B ON B.ID = A.IDF_PRODUTOCOMPOSICAO ' +
            'INNER JOIN UNIDADE C ON C.ID = A.IDF_UNIDADE ' +
            'WHERE A.IDF_PRODUTO = $1 ' +
            'ORDER BY A.ID ';
        const values = [IdProduct];


        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar Composição:', error);
            throw new Error('Erro ao retornar Composição do banco de dados');
        }
    },

    getAllComposicoes: async () => {
        const query = 'SELECT ID, DESCRICAO FROM PRODUTO WHERE IDF_CATEGORIA = 5';

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar Composição:', error);
            throw new Error('Erro ao retornar Composição do banco de dados');
        }
    },
};

module.exports = Composicao;