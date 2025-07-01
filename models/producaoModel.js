const db = require('../db');

const Producao = {
    getOrdemProducaoList: async () => {
        const query = `SELECT A.ID, A.NROORDEMPRODUCAO, A.DTAPRODUCAO, A.DTAVALIDADE, A.QTDPRODUZIDA, A.CUSTOPRODUCAO, A.CODIGOLOTE, A.IDF_PRODUTO, B.DESCRICAO, A.IDF_USUARIO, C.NOME
                        FROM PRODUCAO A
                        INNER JOIN PRODUTO B ON B.ID = A.IDF_PRODUTO
                        INNER JOIN USUARIO C ON C.ID = A.IDF_USUARIO
                        ORDER BY A.ID DESC`;
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao buscar ordens de produção:', error);
            throw error;
        }
    },

    getComposicaoByOrdemId: async (IdDocto) => {
        const query = `SELECT A.ID, A.QTDNECESSIDADE, A.QTDREQUISITADO, A.QTDSALDO, A.IDF_PRODUTOCOMPOSICAO, B.DESCRICAO, A.IDF_PRODUCAO, A.IDF_UNIDADE, C.NOME FROM ITEM_PRODUCAO A
                        INNER JOIN PRODUTO  B ON B.ID = A.IDF_PRODUTOCOMPOSICAO 
                        INNER JOIN UNIDADE C ON C.ID = A.IDF_UNIDADE
                        WHERE IDF_PRODUCAO = $1 `;
        const values = [IdDocto];

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao buscar composição da produção:', error);
            throw error;
        }
    },


    getOrdemProducaoByID: async (IdDocto) => {
        const query = `SELECT A.ID, A.NROORDEMPRODUCAO, A.DTAPRODUCAO, A.DTAVALIDADE, A.QTDPRODUZIDA, A.CUSTOPRODUCAO, A.CODIGOLOTE, A.IDF_PRODUTO, B.DESCRICAO, A.IDF_USUARIO, C.NOME FROM PRODUCAO A
                        INNER JOIN PRODUTO B ON B.ID = A.IDF_PRODUTO
                        INNER JOIN USUARIO C ON C.ID = A.IDF_USUARIO
                        WHERE A.ID = $1`;
        const values = [IdDocto];
        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Erro ao buscar ordem de produção:', error);
            throw error;
        }
    },

    getNextOrdemNumero: async () => {
        const query = `
            SELECT nroordemproducao
            FROM producao
            ORDER BY id DESC
            LIMIT 1
        `;

        try {
            const result = await db.query(query);
            if (result.rows.length > 0) {
                const ultimoNumero = result.rows[0].nroordemproducao;
                const ultimoSequencial = parseInt(ultimoNumero.substring(12)) || 0;
                const novoSequencial = (ultimoSequencial + 1).toString().padStart(3, '0');
                const hoje = new Date();
                const dataFormatada = hoje.toISOString().split('T')[0].replace(/-/g, '');
                return `OP-${dataFormatada}-${novoSequencial}`;
            } else {
                const hoje = new Date();
                const dataFormatada = hoje.toISOString().split('T')[0].replace(/-/g, '');
                return `OP-${dataFormatada}-001`;
            }
        } catch (error) {
            console.error('Erro ao gerar próximo número de ordem:', error);
            throw error;
        }
    },

    insertDocto: async (newDocto) => {
        const client = await db.connect();

        const safeParseInt = (value, fallback = 0) => {
            const parsed = parseInt(value);
            return isNaN(parsed) ? fallback : parsed;
        };

        try {
            await client.query('BEGIN');

            const nroDocumento = await Producao.getNextOrdemNumero();

            // INSERT INTO producao
            const insertOrdemQuery = `
      INSERT INTO producao (
        nroordemproducao, dtaproducao, dtavalidade,
        qtdproduzida, custoproducao, codigolote, idf_produto, idf_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
            const ordemValues = [
                nroDocumento,
                newDocto.dataProducao,
                newDocto.dataValidade,
                newDocto.quantidadeProduzida,
                newDocto.custoProducao,
                safeParseInt(newDocto.codigoLote),
                safeParseInt(newDocto.idf_produto),
                safeParseInt(newDocto.usuario)
            ];
            const resOrdem = await client.query(insertOrdemQuery, ordemValues);
            const idProducaoGerado = resOrdem.rows[0].id;

            // INSERT INTO lote (registro do lote gerado para o produto produzido)
            const insertLoteQuery = `
      INSERT INTO lote (
        codigo,
        dtaproducao,
        dtavalidade,
        idf_produto,
        qtdproduzido
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
            const loteValues = [
                newDocto.codigoLote,          // Código do lote (gerado ou passado pelo front)
                newDocto.dataProducao,
                newDocto.dataValidade,
                safeParseInt(newDocto.idf_produto),
                safeParseInt(newDocto.quantidadeProduzida)
            ];
            const resLote = await client.query(insertLoteQuery, loteValues);
            const idLoteGerado = resLote.rows[0].id;

            // INSERT INTO saldo → entrada do produto produzido
            const insertSaldoProducaoQuery = `
        INSERT INTO saldo_produto (
          qtdmov,
          dtamov,
          nrodocto,
          origemmovimento,
          natureza,
          idf_produto,
          idf_lote,
          idProducaoGerado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
            const saldoProducaoValues = [
                safeParseInt(newDocto.quantidadeProduzida),
                newDocto.dataProducao,
                nroDocumento,
                'Documento Ordem de Produção',
                'ENT',
                safeParseInt(newDocto.idf_produto), 
                idLoteGerado,
                idProducaoGerado
            ];
            await client.query(insertSaldoProducaoQuery, saldoProducaoValues);

            // INSERT INTO item_producao e saldo de saída (baixa dos insumos)
            for (const item of newDocto.composicao) {
                const insertItemQuery = `
        INSERT INTO item_producao (
          qtdnecessidade,
          qtdrequisitado,
          qtdsaldo,
          idf_produtocomposicao,
          idf_unidade,
          idf_producao
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
                const itemValues = [
                    parseFloat(item.qtdnecessidade ?? 0),
                    parseFloat(item.qtdrequisitado ?? 0),
                    parseFloat(item.qtdsaldo ?? (item.qtdnecessidade - item.qtdrequisitado) ?? 0),
                    safeParseInt(item.idf_produtocomposicao ?? item.id),
                    safeParseInt(item.idf_unidade ?? 1),
                    safeParseInt(idProducaoGerado)
                ];
                await client.query(insertItemQuery, itemValues);

                // Insert na tabela saldo → baixa dos insumos (quantidade negativa)
                const insertSaldoQuery = `
        INSERT INTO saldo_produto (
          qtdmov,
          dtamov,
          nrodocto,
          origemmovimento,
          natureza,
          idf_produto,
          idf_lote
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
                const saldoValues = [
                    parseFloat(item.qtdrequisitado ?? 0),
                    newDocto.dataProducao,
                    nroDocumento,
                    'Documento Ordem de Produção',
                    'SAI',
                    safeParseInt(item.idf_produtocomposicao ?? item.id),
                    null
                ];
                await client.query(insertSaldoQuery, saldoValues);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro no insert da produção:', error);
            throw error;
        } finally {
            client.release();
        }
    },


};

module.exports = Producao;
