const AlunosRepository = require('../repositories/alunosRepository');

const listarAlunos = async(req, res) => {
    try {
        const resultado = await AlunosRepository.getAllAlunos();
        return res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        return res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const listarAlunosByID = async(req, res) => {
    try{
        const id = req.params.id;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Insira um ID valido."
            });
        };

        const resultado = await AlunosRepository.getAlunosByID(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem:"Aluno não encontrado."
            });
        };

        res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        return res.status(500).json({
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
    }catch (error) {
        console.error(error.message);
        return res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const atualizarAlunos = async(req, res) => {
    try{
        const id = req.params.id

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Insira um ID valido."
            });
        };

        const {nome, email} = req.body;

        if (!nome || !email) {
            return res.status(400).json({
                mensagem:"Todos os campos devem ser preenchidos."
            });
        };

        const resultado = await AlunosRepository.atualizarAlunos(id, nome, email);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensagem:"Aluno não encontrado"
            });
        };

        res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        return res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const deletarAluno = async(req, res) => {
    try{
        const id = req.params.id;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Insira um ID valido."
            });
        };

        const resultado = await AlunosRepository.deletarAluno(id);

        if (resultado === 0) {
            return res.status(404).json({
                mensagem:"Aluno não encontrado"
            });
        };

        res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        return res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

module.exports = {listarAlunos, listarAlunosByID, criarAlunos, atualizarAlunos, deletarAluno};