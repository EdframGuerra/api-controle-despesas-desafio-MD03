const pool = require('../conexao-banco-de-dados/conexao')
const bcrypt = require('bcrypt')
const senhaJwt = require('../senhaJwt/senhaJwt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        const usuario = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])
        if (usuario.rowCount == 0) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const { senha: _, ...usuarioAutorizado } = usuario.rows[0]

        const senhaAutenticada = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaAutenticada) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, process.env.JWT_HASH || senhaJwt, { expiresIn: '12h' })

        return res.json({ usuario: usuarioAutorizado, token })

    } catch (error) {
        return res.status(401).json({ mensagem: `Não autorizado` })
    }
}

module.exports = {
    login
}