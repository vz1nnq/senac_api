const CursoRepository = require('../repositories/cursosRepository');

const listarCursos = async(req, res) => {
    try{
        const resultado = await CursoRepository.getAllCursos();
        return res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const listarCursoByID = async(req, res) => {
    try{
        const id = req.params.id;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem:"Insira um id valido"
            });
        };

        const resultado = await CursoRepository.getCursoByID(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem:"Curso não encontrado"
            });
        };

        return res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const criarCurso = async(req, res) => {
    try{
        const {nome, vagas} = req.body;

        if (!nome || vagas === undefined) {
            return res.status(400).json({
                mensagem:"Todos os campos devem ser preenchidos."
            });
        };

        if (vagas < 0) {
            return res.status(400).json({
                mensagem:"O numero de vagas deve ser maior ou igual a 0."
            });
        };

        const resultado = await CursoRepository.criarCurso(nome, vagas);
        return res.status(201).json(resultado);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const atualizarCursos = async(req, res) => {
    try{
        const id = req.params.id

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Insira um ID valido."
            });
        };

        const {nome, vagas} = req.body;

        if (!nome || vagas === undefined || vagas === null || vagas === "") {
            return res.status(400).json({
                mensagem:"Todos os campos devem ser preenchidos."
            });
        };

        const resultado = await CursoRepository.atualizarCursos(id, nome, vagas);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensagem:"Curso não encontrado"
            });
        };

        res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const deletarCurso = async(req, res) => {
    try{
        const id = req.params.id;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "Insira um ID valido."
            });
        };

        const resultado = await CursoRepository.deletarCurso(id);

        if (resultado === 0) {
            return res.status(404).json({
                mensagem:"Aluno não encontrado"
            });
        };

        res.status(200).json(resultado);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

module.exports = {listarCursos, listarCursoByID, criarCurso, atualizarCursos, deletarCurso};