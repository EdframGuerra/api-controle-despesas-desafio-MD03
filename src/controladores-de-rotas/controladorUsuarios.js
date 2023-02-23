// 1º PASSO: IMPORTAR O POOL NO ARQUIVO CONEXÃO.JS
const pool = require('../conexao-banco-de-dados/conexao')
const bcrypt = require('bcrypt')

//2º PASSO: CRIAR A FUNÇÃO QUE SERÁ EXECUTADA NA ROTA E APÓS,  IMPLEMENTAR NO CÓDIGO DE EXECUÇÃO EM ROTAS O NOME DA FUNÇÃO NO 6º PASSO DO ARQUIVO DE ROTAS.JS

const cadastroUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Favor preencher todos os campos!' })
    }

    try {
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])
        if (emailVerificado.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }
        const salt = 10
        const criptografiaDeSenha = await bcrypt.hash(senha, salt)

        const usuarioCadastrado = await pool.query(`INSERT INTO usuarios (nome, email, senha)
        VALUES
        ($1, $2, $3) returning*`, [nome, email, criptografiaDeSenha])

        return res.status(201).json(usuarioCadastrado.rows[0])

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

// 3º PASSO: EXPORTAR A FUNÇÃO/CONTROLADOR
module.exports = {
    cadastroUsuario
}
