//REQUERENDO AS BIBLIOTECAS A SEREM USADAS NO PROJETO
const pool = require('../conexao-banco-de-dados/conexao')
const bcrypt = require('bcrypt')



//CRIAR AS FUNÇÃO QUE SERÃO EXECUTADAS NAS ROTAS

//Função cadastrar usuario
const cadastroUsuario = async (req, res) => {

    const { nome, email, senha } = req.body;

    // validação de campos obrigatórios via middleware
    try {

        //verifica se e-mail existe no banco de dados
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])

        if (emailVerificado.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }

        //criptografando a senha com 10 caracteres
        const criptografiaDeSenha = await bcrypt.hash(senha, 10)

        //cadastrando o usuario no banco de dados
        const usuarioCadastrado = await pool.query(`INSERT INTO usuarios (nome, email, senha)
        VALUES
        ($1, $2, $3) returning *`, [nome, email, criptografiaDeSenha])

        //devolvendo o objeto do usuario cadastrado sem a senha 
        const { senha: _, ...usuario } = usuarioCadastrado.rows[0]

        return res.status(201).json(usuario)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}


//função detalhar usuario
const detalharUsuario = async (req, res) => {

    return res.json(req.usuario)
}

//função atualizar cadastro usuario
const atualizacaoCadastro = async (req, res) => {

    const { nome, email, senha } = req.body


    try {

        //criptografa a senha com 10 caracteres
        const criptografiaDeSenha = await bcrypt.hash(senha, 10)

        //verifica se e-mail  e ID já esta cadastrado no banco de dados e se pertence ao usuario
        const emailVerificado = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email])

        if (emailVerificado.rowCount === 0 || emailVerificado.rows[0].id === req.usuario.id && emailVerificado.rows[0].email === req.usuario.email) {

            // atualiza o usuario
            await pool.query(`UPDATE usuarios SET nome = $1, email = $2, senha =$3 WHERE id = $4 `, [nome, email, criptografiaDeSenha, req.usuario.id])

        } else {

            return res.status(401).json({ mensagem: 'O e-mail informado á esta sendo utilizado por outro usuario' })
        }

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}




//EXPORTANDO AS FUNÇÕES/CONTROLADOR
module.exports = {
    cadastroUsuario,
    detalharUsuario,
    atualizacaoCadastro
}
