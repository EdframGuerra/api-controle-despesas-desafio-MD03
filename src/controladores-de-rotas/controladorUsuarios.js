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
        const senhaAutenticada = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaAutenticada) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: '12h' })

        const { senha: _, ...usuarioAutorizado } = usuario.rows[0]
        return res.json({ usuario: usuarioAutorizado, token })


    } catch (error) {
        return res.status(401).json({ mensagem: `Não autorizado` })
    }
}



// 3º PASSO: EXPORTAR A FUNÇÃO/CONTROLADOR
module.exports = {
    cadastroUsuario,
    login
  
}
