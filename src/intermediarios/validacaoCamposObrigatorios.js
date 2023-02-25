const validacaoCamposObrigatorios = (req, res, next) => {
    const { nome, email, senha } = req.body

    if (!nome || nome.trim()) {
        return res.status(400).json({ mensagem: 'O campo nome deve ser preenchidos' })
    }

    if (!email || email.trim()) {
        return res.status(400).json({ mensagem: 'O campo e-mail deve ser preenchidos' })
    }

    if (!senha || senha.trim()) {
        return res.status(400).json({ mensagem: 'O campo senha deve ser preenchidos' })
    }


    next()
}
module.exports = validacaoCamposObrigatorios