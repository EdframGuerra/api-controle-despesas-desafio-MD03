const validacaoCamposObrigatoriosTransacoes = async (req, res, next) => {

    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatorios devem ser informados' })
    }
    if (!descricao.trim() || !data.trim() || !tipo.trim()) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatorios devem ser preenchidos' })
    }

    if (!['entrada', 'saida'].includes(tipo)) {
        return res.status(404).json({ mensagem: 'O tipo de transação invalida' })
    }

    next()
}

module.exports = {
    validacaoCamposObrigatoriosTransacoes
}