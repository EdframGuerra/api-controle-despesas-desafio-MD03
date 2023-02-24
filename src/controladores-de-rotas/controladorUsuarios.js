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

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Favor preencher todos os campos' })
    }

    try {

        if (tipo === "entrada" || tipo === "saida") {

        const verificarCategoriaId = await pool.query(`SELECT * FROM categorias WHERE id = $1`, [categoria_id])

        if (verificarCategoriaId.rowCount === 0) {
            return res.status(404).json({ mensagem: 'A categoria informada é inexistente' })
        }

        const cadastrandoTransacao = await pool.query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo,usuario_id)
        VALUES
        ($1, $2, $3, $4, $5, $6)returning id, tipo, descricao, valor, data, usuario_id, categoria_id`, [descricao, valor, data, categoria_id, tipo, req.usuario.id,])

        return res.status(201).json(cadastrandoTransacao.rows[0])

    } else {
        return res.status(404).json({ mensagem: 'O tipo de transação é invalido' })
    }
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
    listarCategoias,
    cadastrarTransacao

}
