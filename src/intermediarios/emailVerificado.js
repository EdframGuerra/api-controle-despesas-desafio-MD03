const pool = require('../conexao-banco-de-dados/conexao')
const verificadorDeEmail = async (req, res, next) => {
    const email = req.body
    try {
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])
        if (emailVerificado.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }
        next()

    } catch (error) {
        return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado!!!.' })
    }
}

module.exports = verificadorDeEmail