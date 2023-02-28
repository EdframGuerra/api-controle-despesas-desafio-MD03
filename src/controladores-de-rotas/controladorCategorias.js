//requerendo biblioteca para manipular o banco de dados
const pool = require('../conexao-banco-de-dados/conexao')

//Função listar categorias
const listarCategorias = async (req, res) => {

    try {
        const categorias = await pool.query(`SELECT * FROM categorias`)
        return res.status(201).json(categorias.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = {
    listarCategorias
}