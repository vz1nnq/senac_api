const AlunosRepository = require('../repositories/alunosRepository');

const listarAlunos = async(req, res) => {
    try {
        const resultado = await AlunosRepository.getAllAlunos();
        return res.status(200).json(resultado);
    } catch (error) {
        console.error(error.messsage);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const criarAlunos = async(req, res) => {
    try {
        const {nome, email} = req.body;

        if (!nome || !email) {
            return res.status(400).json({
                mensagem:"Todos os campos devem ser preenchidos"
            });
        };

        const resultado = await AlunosRepository.criarAlunos(nome, email);
        return res.status(201).json(resultado)
    } catch (error) {
        console.error(error.messsage);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

module.exports = {listarAlunos, criarAlunos};