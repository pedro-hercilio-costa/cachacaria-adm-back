const db = require('../db');

const Product = {

    findAllProducts: async () => {
        const query = `
            SELECT A.ID ID_PRODUTO, A.CODIGO, A.DESCRICAO, A.ATIVO, A.TEMCOMPOSICAO,
                   A.PRECO, A.CAPACIDADE_ML, A.CUSTO, A.ESTOQUEMINIMO, A.CODIGOEAN, A.CODIGOBARRAS,
                   A.DTACADASTRO, A.DTAALTERACAO, A.IDF_CATEGORIA, B.NOME CATEGORIA, A.IDF_SABOR,
                   C.NOME SABOR, A.IDF_UNIDADE, D.NOME UNIDADE
            FROM PRODUTO A
            INNER JOIN CATEGORIA B ON B.ID = A.IDF_CATEGORIA
            INNER JOIN SABOR C ON C.ID = A.IDF_SABOR
            INNER JOIN UNIDADE D ON D.ID = A.IDF_UNIDADE
        `;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar produtos:', error);
            throw new Error('Erro ao retornar produtos do banco de dados');
        }
    },

    getProductByID: async (IdProduct) => {
        const query = `
            SELECT * FROM PRODUTO
            WHERE ID = $1
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

    deleteProduct: async (IdProduct) => {
        const query = 'DELETE FROM produto WHERE id = $1';
        const values = [IdProduct];

        try {
            await db.query(query, values);
        } catch (error) {
            console.error('Erro no model ao deletar:', error);
            throw error;
        }
    },

    updateProduct: async (IdProduct, updatedProduct) => {
        const client = await db.connect();

        try {
            await client.query('BEGIN');

            // Garantir que temComposicao nunca venha null
            const temComposicao = updatedProduct.temComposicao !== undefined ? updatedProduct.temComposicao : 0;

            // Atualizar o produto
            const updateQuery = `
                UPDATE produto SET
                    codigo = $1,
                    descricao = $2,
                    ativo = $3,
                    temcomposicao = $4,
                    preco = $5,
                    capacidade_ml = $6,
                    custo = $7,
                    estoqueminimo = $8,
                    codigoean = $9,
                    codigobarras = $10,
                    idf_categoria = $11,
                    idf_sabor = $12,
                    idf_unidade = $13,
                    dtaalteracao = NOW()
                WHERE id = $14
            `;

            const values = [
                updatedProduct.codigo,
                updatedProduct.descricao,
                parseInt(updatedProduct.ativo ?? 0),
                parseInt(updatedProduct.temcomposicao ?? 0),
                parseFloat(updatedProduct.preco ?? 0),
                parseInt(updatedProduct.capacidade_ml ?? 0),
                parseFloat(updatedProduct.custo ?? 0),
                parseInt(updatedProduct.estoqueminimo) || 0,
                updatedProduct.codigoean,
                updatedProduct.codigobarras,
                parseInt(updatedProduct.idf_categoria ?? 0),
                parseInt(updatedProduct.idf_sabor ?? 0),
                parseInt(updatedProduct.idf_unidade ?? 0),
                parseInt(IdProduct)
            ];
            await client.query(updateQuery, values);

            // Deletar composições antigas
            await client.query('DELETE FROM composicao WHERE idf_produto = $1', [IdProduct]);

            // Inserir novas composições
            if (updatedProduct.composicao && updatedProduct.composicao.length > 0) {
                for (const comp of updatedProduct.composicao) {
                    const insertQuery = `
                        INSERT INTO composicao (idf_produto, idf_produtocomposicao, qtdcomp, idf_unidade)
                        VALUES ($1, $2, $3, $4)
                    `;
                    await client.query(insertQuery, [
                        parseInt(IdProduct),
                        parseInt(comp.item),
                        parseInt(comp.quantidade),
                        parseInt(comp.unidade)
                    ]);
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro ao atualizar produto e composição:', error);
            throw error;
        } finally {
            client.release();
        }
    },

    insertProduct: async (newProduct) => {
        const query = `
    INSERT INTO produto (
      codigo, descricao, ativo, temcomposicao, preco, capacidade_ml,
      custo, estoqueminimo, codigoean, codigobarras,
      idf_categoria, idf_sabor, idf_unidade, dtacadastro, dtaalteracao
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      $11, $12, $13, NOW(), NOW()
    ) RETURNING id
  `;

        const values = [
            newProduct.codigo,
            newProduct.descricao,
            parseInt(newProduct.ativo ?? 0),
            parseInt(newProduct.temcomposicao ?? 0),
            parseFloat(newProduct.preco ?? 0),
            parseInt(newProduct.capacidade_ml ?? 0),
            parseFloat(newProduct.custo ?? 0),
            parseInt(newProduct.estoqueminimo ?? 0),
            newProduct.codigoean,
            newProduct.codigobarras,
            parseInt(newProduct.idf_categoria ?? 0),
            parseInt(newProduct.idf_sabor ?? 0),
            parseInt(newProduct.idf_unidade ?? 0)
        ];

        try {
            const result = await db.query(query, values);
            return { id: result.rows[0].id };
        } catch (error) {
            console.error('Erro no insert do produto:', error);
            throw error;
        }
    },

    getProdPreco: async () => {
        const query = `
            SELECT A.ID, A.DESCRICAO, A.PRECO, B.CODIGO FROM PRODUTO A
            INNER JOIN LOTE B ON B.IDF_PRODUTO = A.ID
            ORDER BY A.ID DESC`;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar produtos:', error);
            throw new Error('Erro ao retornar produtos do banco de dados');
        }
    },
};

module.exports = Product;
