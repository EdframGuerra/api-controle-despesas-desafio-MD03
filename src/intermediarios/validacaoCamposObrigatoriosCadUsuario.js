const validacaoCamposObrigatorios = (req, res, next) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome deve exitir e ser preenchidos' })
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo nome deve exitir e ser preenchidos' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo nome deve exitir e ser preenchidos' })
    }

    if (!nome.trim()) {
        return res.status(400).json({ mensagem: 'O campo nome deve ser preenchidos' })
    }

    if (!email.trim()) {
        return res.status(400).json({ mensagem: 'O campo e-mail deve ser preenchidos' })
    }

    if (!senha.trim()) {
        return res.status(400).json({ mensagem: 'O campo senha deve ser preenchidos' })
    }

    next()
}
module.exports = validacaoCamposObrigatorios