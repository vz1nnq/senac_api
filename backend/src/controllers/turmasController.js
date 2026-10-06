const TurmasRepository = require('../repositories/turmasRepository');
const cursosRepository = require('../repositories/cursosRepository');

const listaTurmas = async(req, res) => {
    try{
        const resultado = await TurmasRepository.getAllTurmas();
        return res.status(200).json(resultado);
    }catch (error) {
        console.error(error.messsage);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const listarTurmasByID = async(req, res) => {
    try{
        const id = req.params.id;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                mensagem:"Insira um id valido"
            });
        };

        const resultado = await TurmasRepository.getTurmaByID(id);
        return res.status(200).json(resultado);
    }catch (error) {
        console.error(error.messsage);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

const mastricularAluno = async(req, res) => {
    try{
        const {aluno_id, curso_id} = req.body;

        if (!aluno_id || !curso_id) {
            return res.status(400).json({
                mensagem:"Todos os campos devem se preenchidos."
            });
        };

        const curso = await cursosRepository.getCursoByID(curso_id);

        if (!curso) {
            return res.status(404).json({
                mensagem:"Esse curso não existe."
            });
        };

        if (curso.vagas <= 0) {
            return res.status(400).json({
                mensagem:"Não há vagas nesse curso."
            });
        };

        const resultado = await TurmasRepository.matricularAluno(aluno_id, curso_id);

        await cursosRepository.decrementarVaga(curso_id);

        return res.status(201).json(resultado)
    }catch (error) {
        console.error(error.messsage);
        res.status(500).json({
            mensagem:"Erro interno"
        });
    };
};

module.exports = {listaTurmas, listarTurmasByID, mastricularAluno};