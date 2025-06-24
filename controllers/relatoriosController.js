const db = require('../db');

// Relatório de movimentação de bebidas
exports.movimentacao = async (req, res) => {
  const query = `
    SELECT A.CODIGO, A.DESCRICAO, B.NOME, A.ESTOQUEMINIMO, 
           C.QTDMOV, C.DTAMOV, C.NRODOCTO, C.ORIGEMMOVIMENTO, C.NATUREZA
    FROM PRODUTO A
    INNER JOIN CATEGORIA B ON B.ID = A.IDF_CATEGORIA
    INNER JOIN SALDO_PRODUTO C ON C.IDF_PRODUTO = A.ID
    WHERE A.IDF_CATEGORIA <> 5
  `;

  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao gerar relatório de movimentação:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de movimentação.' });
  }
};

// Relatório de ingredientes utilizados
exports.ingredientes = async (req, res) => {
  const query = `
    SELECT A.CODIGO, A.DESCRICAO, A.ESTOQUEMINIMO, 
           C.QTDMOV, C.DTAMOV, C.NRODOCTO, C.ORIGEMMOVIMENTO, C.NATUREZA
    FROM PRODUTO A
    INNER JOIN CATEGORIA B ON B.ID = A.IDF_CATEGORIA
    INNER JOIN SALDO_PRODUTO C ON C.IDF_PRODUTO = A.ID
    WHERE A.IDF_CATEGORIA = 5
  `;

  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao gerar relatório de ingredientes:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de ingredientes.' });
  }
};

// Relatório de vendas por período
exports.porPeriodo = async (req, res) => {
  const { inicio, fim } = req.query;

  const query = `
    SELECT A.NRODOCTO, A.DTAEMISSAO, A.DTAENTRADA, A.VALORLIQUIDO, 
           A.VALORBRUTO, A.VALORFRETE, B.NOME, A.CHAVENFE
    FROM COMPRA_VENDA A
    INNER JOIN IDENTIFICACAO B ON B.ID = A.IDF_IDENTIFICACAO
    WHERE A.NATUREZAMOVIMENTACAO = 'venda'
      AND A.DTAEMISSAO >= $1
      AND A.DTAEMISSAO <= $2
  `;

  try {
    const result = await db.query(query, [inicio, fim]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao gerar relatório por período:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório por período.' });
  }
};