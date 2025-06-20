const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const client = await pool.connect();

        const user = await client.query(
            'SELECT * FROM "usuario" WHERE email = $1 AND senha = $2',
            [email, password]
        );

        if (user.rows.length > 0) {
            const { id, email } = user.rows[0];
            const role = 'user';
            const token = jwt.sign({ id, email, role }, process.env.SECRET, { expiresIn: 600 });
            client.release();
            return res.json({ auth: true, token, role });
        }

        client.release();
        return res.status(401).json({ auth: false, message: 'Usuário não encontrado ou credenciais inválidas.' });
    } catch (err) {
        console.error('Erro ao executar a consulta', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/logout', (req, res) => {
    res.json({ auth: false, token: null });
});

module.exports = router;