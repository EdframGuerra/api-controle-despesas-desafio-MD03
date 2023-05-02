const pool = require('../conexao-banco-de-dados/conexao')
const bcrypt = require('bcrypt')

const cadastroUsuario = async (req, res) => {

    const { nome, email, senha } = req.body;

    try {
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])

        if (emailVerificado.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }

        const criptografiaDeSenha = await bcrypt.hash(senha, 10)

        const usuarioCadastrado = await pool.query(`INSERT INTO usuarios (nome, email, senha)
        VALUES
        ($1, $2, $3) returning *`, [nome, email, criptografiaDeSenha])

        const { senha: _, ...usuario } = usuarioCadastrado.rows[0]

        return res.status(201).json(usuario)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const detalharUsuario = async (req, res) => {

    return res.json(req.usuario)
}

const atualizacaoCadastro = async (req, res) => {

    const { nome, email, senha } = req.body


    try {

    const criptografiaDeSenha = await bcrypt.hash(senha, 10)

        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])

        if (emailVerificado.rowCount === 0 || emailVerificado.rows[0].id === req.usuario.id && emailVerificado.rows[0].email === req.usuario.email) {

           await pool.query(`UPDATE usuarios SET nome = $1, email = $2, senha =$3 WHERE id = $4 `, [nome, email, criptografiaDeSenha, req.usuario.id])

        } else {

            return res.status(401).json({ mensagem: 'O e-mail informado á esta sendo utilizado por outro usuario' })
        }

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}
module.exports = {
    cadastroUsuario,
    detalharUsuario,
    atualizacaoCadastro
}