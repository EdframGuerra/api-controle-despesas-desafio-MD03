// 1º PASSO: IMPORTAR O POOL NO ARQUIVO CONEXÃO.JS
const pool = require('../conexao-banco-de-dados/conexao')
const bcrypt = require('bcrypt')
const senhaJwt = require('../senhaJwt/senhaJwt')
const jwt = require('jsonwebtoken')


//2º PASSO: CRIAR A FUNÇÃO QUE SERÁ EXECUTADA NA ROTA E APÓS,  IMPLEMENTAR NO CÓDIGO DE EXECUÇÃO EM ROTAS O NOME DA FUNÇÃO NO 6º PASSO DO ARQUIVO DE ROTAS.JS

const cadastroUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    // validação de campos obrigatórios via intermediario

    try {
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])
        if (emailVerificado.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }

        const salt = 10
        const criptografiaDeSenha = await bcrypt.hash(senha, salt)

        const usuarioCadastrado = await pool.query(`INSERT INTO usuarios (nome, email, senha)
        VALUES
        ($1, $2, $3) returning *`, [nome, email, criptografiaDeSenha])

        const { senha: _, ...usuario } = usuarioCadastrado.rows[0]

        return res.status(201).json(usuario)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body
    // validação de campos obrigatórios via intermediario

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

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: '12h' })

        return res.json({ usuario: usuarioAutorizado, token })


    } catch (error) {
        return res.status(401).json({ mensagem: `Não autorizado` })
    }
}

const detalharUsuario = async (req, res) => {

    return res.json(req.usuario)
}

const atualizacaoCadastro = async (req, res) => {
    const { nome, email, senha } = req.body


    //validação via intermediario de campos obrigatorios e se email existe?
    try {
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])

        const criptografiaDeSenha = await bcrypt.hash(senha, 10)

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

const listarCategoias = async (req, res) => {

    try {
        const categorias = await pool.query(`SELECT * FROM categorias`)
        return res.status(201).json(categorias.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

// 3º PASSO: EXPORTAR A FUNÇÃO/CONTROLADOR
module.exports = {
    cadastroUsuario,
    login,
    detalharUsuario,
    atualizacaoCadastro,
    listarCategoias

}
