const db = require('../db');

const Product = {

    getProductByID: async (IdProduct) => {
        const query = `            
        SELECT A.ID, A.QTDMOV, A.DTAMOV, A.ORIGEMMOVIMENTO, A.NRODOCTO, A.IDF_LOTE, B.CODIGO FROM SALDO_PRODUTO A
        LEFT JOIN LOTE B ON B.ID = A.IDF_LOTE
        WHERE A.IDF_PRODUTO = $1
        `;
        const values = [IdProduct];

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar produto:', error);
            throw new Error('Erro ao retornar produto do banco de dados');
        }
    },

        getSaldoProductByID: async (IdProduct) => {
        const query = `            
        SELECT 
                A.ID,
                A.CODIGO,
                A.DTAPRODUCAO,
                A.DTAVALIDADE,
                A.QTDPRODUZIDO,
                (
                    SELECT SUM(B.QTDMOV)
                    FROM SALDO_PRODUTO B
                    WHERE B.IDF_PRODUTO = A.IDF_PRODUTO
                    AND B.IDF_LOTE = A.ID
                ) AS SALDO
            FROM LOTE A
            WHERE A.IDF_PRODUTO = $1;`;
        const values = [IdProduct];

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar produto:', error);
            throw new Error('Erro ao retornar produto do banco de dados');
        }
    },
};

module.exports = Product;
