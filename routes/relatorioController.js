// src/controllers/relatorioController.js
const db = require('../db');

exports.getMovimentacaoBebidas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT A.CODIGO, A.DESCRICAO, B.NOME, A.ESTOQUEMINIMO, 
             C.QTDMOV, C.DTAMOV, C.NRODOCTO, C.ORIGEMMOVIMENTO, C.NATUREZA
      FROM PRODUTO A
      INNER JOIN CATEGORIA B ON B.ID = A.IDF_CATEGORIA
      INNER JOIN SALDO_PRODUTO C ON C.IDF_PRODUTO = A.ID
      WHERE A.IDF_CATEGORIA <> 5
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar movimentações de bebidas', error });
  }
};

exports.getMovimentacaoIngredientes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT A.CODIGO, A.DESCRICAO, ESTOQUEMINIMO, 
             C.QTDMOV, C.DTAMOV, C.NRODOCTO, C.ORIGEMMOVIMENTO, C.NATUREZA
      FROM PRODUTO A
      INNER JOIN CATEGORIA B ON B.ID = A.IDF_CATEGORIA
      INNER JOIN SALDO_PRODUTO C ON C.IDF_PRODUTO = A.ID
      WHERE A.IDF_CATEGORIA = 5
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar movimentações de ingredientes', error });
  }
};

exports.getVendasPorPeriodo = async (req, res) => {
  const { inicio, fim } = req.query;

  try {
    const result = await db.query(`
      SELECT A.NRODOCTO, A.DTAEMISSAO, A.DTAENTRADA, A.VALORLIQUIDO, 
             A.VALORBRUTO, A.VALORFRETE, B.NOME, A.CHAVENFE
      FROM COMPRA_VENDA A
      INNER JOIN IDENTIFICACAO B ON B.ID = A.IDF_IDENTIFICACAO
      WHERE A.NATUREZAMOVIMENTACAO = 'venda'
        AND A.DTAEMISSAO >= $1
        AND A.DTAEMISSAO <= $2
    `, [inicio, fim]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar vendas', error });
  }
};
