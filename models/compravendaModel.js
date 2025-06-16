const db = require('../db');

const CompraVenda = {

    getAllDocVenda: async () => {
        const query = `
            SELECT A.ID, A.NRODOCTO, A.PROTOCOLOAUT, A.CHAVENFE, A.DTAEMISSAO, A.DTAENTRADA, A.VALORBRUTO, A.VALORLIQUIDO, A.VALORFRETE, A.NATUREZAMOVIMENTACAO, A.IDF_IDENTIFICACAO, B.NOME, A.IDF_USUARIO, C.NOME
            FROM COMPRA_VENDA A
            INNER JOIN IDENTIFICACAO B ON B.ID = A.IDF_IDENTIFICACAO
            INNER JOIN USUARIO C ON C.ID = A.IDF_USUARIO
            WHERE A.NATUREZAMOVIMENTACAO = 'venda'`;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar vendas:', error);
            throw new Error('Erro ao retornar vendas do banco de dados');
        }
    },

    getAllDocCompra: async () => {
        const query = `
           SELECT A.ID, A.NRODOCTO, A.PROTOCOLOAUT, A.CHAVENFE, A.DTAEMISSAO, A.DTAENTRADA, A.VALORBRUTO, A.VALORLIQUIDO, A.VALORFRETE, A.NATUREZAMOVIMENTACAO, A.IDF_IDENTIFICACAO, B.NOME, A.IDF_USUARIO, C.NOME
            FROM COMPRA_VENDA A
            INNER JOIN IDENTIFICACAO B ON B.ID = A.IDF_IDENTIFICACAO
            INNER JOIN USUARIO C ON C.ID = A.IDF_USUARIO
            WHERE A.NATUREZAMOVIMENTACAO = 'compra'`;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar compras:', error);
            throw new Error('Erro ao retornar compras do banco de dados');
        }
    },

    getDoctoByID: async (IdDocto) => {
        const query = `
           SELECT A.ID, A.NRODOCTO, A.PROTOCOLOAUT, A.CHAVENFE, A.DTAEMISSAO, A.DTAENTRADA, A.VALORBRUTO, A.VALORLIQUIDO, A.VALORFRETE, A.NATUREZAMOVIMENTACAO, A.IDF_IDENTIFICACAO, B.NOME, A.IDF_USUARIO, C.NOME
            FROM COMPRA_VENDA A
            INNER JOIN IDENTIFICACAO B ON B.ID = A.IDF_IDENTIFICACAO
            INNER JOIN USUARIO C ON C.ID = A.IDF_USUARIO
            WHERE A.ID = $1`;
        const values = [IdDocto];

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar compra:', error);
            throw new Error('Erro ao retornar compra do banco de dados');
        }
    },

    getItensDoctoByID: async (IdDocto) => {
        const query = `
           SELECT A.ID, A.QTDMOV, A.VALORUNITARIO, A.IDF_PRODUTO, B.DESCRICAO, A.IDF_COMPRAVENDA, A.IDF_LOTE, C.CODIGO, A.IDF_UNIDADE, D.NOME FROM ITEM_COMPRA_VENDA A
            INNER JOIN PRODUTO B ON B.ID = A.IDF_PRODUTO
            INNER JOIN LOTE C ON C.ID = A.IDF_LOTE
            INNER JOIN UNIDADE D ON D.ID = A.IDF_UNIDADE
            WHERE IDF_COMPRAVENDA = $1`;
        const values = [IdDocto];

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar itens da compra:', error);
            throw new Error('Erro ao retornar itens da compra no banco de dados');
        }
    },

    getAllCliente: async () => {
        const query = `
           SELECT * FROM IDENTIFICACAO
            WHERE CLIENTE = 1`;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar clientes:', error);
            throw new Error('Erro ao retornar clientes no banco de dados');
        }
    },

    getAllFornecedor: async () => {
        const query = `
           SELECT * FROM IDENTIFICACAO
            WHERE FORNECEDOR = 1`;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao retornar clientes:', error);
            throw new Error('Erro ao retornar clientes no banco de dados');
        }
    },


    insertDoctoVenda: async (newDocto) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Inserir o documento principal
            const insertDocQuery = `
      INSERT INTO compra_venda (
        nrodocto,
        protocoloaut,
        chavenfe,
        dtaemissao,
        dtaentrada,
        valorbruto,
        valorliquido,
        valorfrete,
        naturezamovimentacao,
        idf_identificacao,
        idf_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

            const docValues = [
                newDocto.nrodocto,
                newDocto.protocoloaut,
                newDocto.chavenfe,
                newDocto.dtaemissao,
                newDocto.dtaentrada,
                newDocto.valorbruto,
                newDocto.valorliquido,
                newDocto.valorfrete,
                newDocto.naturezamovimentacao,
                newDocto.idf_identificacao,
                newDocto.idf_usuario,
            ];

            const docResult = await client.query(insertDocQuery, docValues);
            const idCompraVenda = docResult.rows[0].id;

            // Inserir os itens
            for (const item of newDocto.itens) {
                const insertItemQuery = `
        INSERT INTO item_compra_venda (
          qtdmov,
          valorunitario,
          idf_produto,
          idf_compravenda,
          idf_lote,
          idf_unidade
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;

                const itemValues = [
                    item.qtdmov,
                    item.valorunitario,
                    item.idf_produto,
                    idCompraVenda,
                    item.idf_lote,
                    item.idf_unidade
                ];

                await client.query(insertItemQuery, itemValues);

                const insertSaldoQuery = `
        INSERT INTO saldo_produto (
          idf_produto,
          idf_lote,
          qtdmov,
          dtamov,
          origemmovimento,
          natureza,
          nrodocto
        ) VALUES ($1, $2, $3, NOW(), $4, $5, $6)
      `;

                await client.query(insertSaldoQuery, [
                    item.idf_produto,
                    item.idf_lote,
                    (item.qtdmov * -1),
                    'Documento Nota de Venda',
                    'SAI',
                    newDocto.nrodocto
                ]);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro no insert de compra/venda:', error);
            throw error;
        } finally {
            client.release();
        }
    },

    insertDoctoCompra: async (newDocto) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Inserir o documento principal
            const insertDocQuery = `
      INSERT INTO compra_venda (
        nrodocto,
        protocoloaut,
        chavenfe,
        dtaemissao,
        dtaentrada,
        valorbruto,
        valorliquido,
        valorfrete,
        naturezamovimentacao,
        idf_identificacao,
        idf_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

            const docValues = [
                newDocto.nrodocto,
                newDocto.protocoloaut,
                newDocto.chavenfe,
                newDocto.dtaemissao,
                newDocto.dtaentrada,
                newDocto.valorbruto,
                newDocto.valorliquido,
                newDocto.valorfrete,
                newDocto.naturezamovimentacao,
                newDocto.idf_identificacao,
                newDocto.idf_usuario,
            ];

            const docResult = await client.query(insertDocQuery, docValues);
            const idCompraVenda = docResult.rows[0].id;

            // Inserir os itens
            for (const item of newDocto.itens) {
                const insertItemQuery = `
        INSERT INTO item_compra_venda (
          qtdmov,
          valorunitario,
          idf_produto,
          idf_compravenda,
          idf_lote,
          idf_unidade
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;

                const itemValues = [
                    item.qtdmov,
                    item.valorunitario,
                    item.idf_produto,
                    idCompraVenda,
                    item.idf_lote,
                    item.idf_unidade
                ];

                await client.query(insertItemQuery, itemValues);

                const insertSaldoQuery = `
        INSERT INTO saldo_produto (
          idf_produto,
          idf_lote,
          qtdmov,
          dtamov,
          origemmovimento,
          natureza,
          nrodocto
        ) VALUES ($1, $2, $3, NOW(), $4, $5, $6)
      `;

                await client.query(insertSaldoQuery, [
                    item.idf_produto,
                    item.idf_lote,
                    (item.qtdmov*-1),
                    'Documento Nota Compra',
                    'ENT',
                    newDocto.nrodocto
                ]);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro no insert de compra/venda:', error);
            throw error;
        } finally {
            client.release();
        }
    },

};

module.exports = CompraVenda;
