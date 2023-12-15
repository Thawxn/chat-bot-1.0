import * as Yup from 'yup';
import OilFilter from '../models/OilFilter.js';

class OilFilterController {
  // Método para listar todos os filtros de óleos
  async index(req, res) {
    try {
      // Busca todos os registros de filtro de óleo no banco de dados
      const response = await OilFilter.find();
      return res.status(200).json(response);
    } catch (err) {
      // Loga e retorna um erro em caso de falha na busca
      console.error('Erro ao buscar filtros de óleos:', err);
      return res.status(500).json({ err: 'Erro ao buscar filtros de óleos' });
    }
  }

  // Método para buscar um filtro de óleo por nome
  async indexOne(req, res) {
    const { name } = req.params;

    try {
      // Realiza a pesquisa com base nos critérios fornecidos
      const searchName = await OilFilter.find({ name });

      // Retorna os resultados da pesquisa ou uma mensagem de nenhum resultado
      if (searchName.length > 0) {
        return res.status(200).json(searchName);
      }
      return res.status(404).json({ message: 'Nenhum resultado encontrado.' });
    } catch (err) {
      // Loga e retorna um erro em caso de falha na busca
      console.error('Erro ao tentar buscar filtro de óleo.', err);
      return res
        .status(500)
        .json({ err: 'Erro ao tentar buscar filtro de óleo.' });
    }
  }

  // Método para registrar filtro de óleo
  async register(req, res) {
    // Define um schema de validação usando o Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      specification: Yup.string().required(),
      price: Yup.number().required(),
    });

    const { name, specification, price } = req.body;

    try {
      // Valida os dados de entrada usando o schema definido
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      // Cria um novo registro de filtro de óleo no banco de dados
      const newOilFilter = await OilFilter.create({
        name,
        specification,
        price,
      });

      // Retorna o filtro de óleo recém-criado como resposta
      return res.status(200).json(newOilFilter);
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Error ao registrar filtro de óleo:', err);

      // Verifica se o erro é de validação e retorna detalhes específicos
      if (err.name === 'ValidationError') {
        const validationErrors = err.errors.map(error => ({
          field: error.path,
          message: error.message,
        }));
        return res.status(400).json({ validationErrors });
      }

      return res.status(500).json({ err: 'Erro ao registrar filtro de óleo' });
    }
  }

  // Método para editar filtro de óleo
  async edit(req, res) {
    const { id } = req.params;
    const { name, specification, price } = req.body;

    try {
      // Verifica se o ID do filtro de óleo foi fornecido
      if (!id) {
        return res
          .status(400)
          .json({ err: 'ID do filtro óleo não fornecido.' });
      }

      // Atualiza as informações do filtro de óleo no banco de dados
      const updateOilFilter = await OilFilter.findByIdAndUpdate(id, {
        name,
        specification,
        price,
      });

      // Verifica se o filtro de óleo foi encontrado para atualização
      if (!updateOilFilter) {
        return res.status(404).json({ err: 'Filtro de Óleo não encontrado.' });
      }

      // Retorna uma resposta de sucesso
      return res
        .status(200)
        .json({ ok: 'Informações do filtro de óleo atualizado com sucesso.' });
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Error ao tentar editar filtro de óleo:', err);
      return res
        .status(500)
        .json({ err: 'Erro ao tentar editar filtro de óleo' });
    }
  }

  // Método para deletar filtro de óleo
  async delete(req, res) {
    const { id } = req.params;

    try {
      // Verifica se o ID do filtro de óleo foi fornecido
      if (!id) {
        return res
          .status(400)
          .json({ err: 'ID do filtro de óleo não fornecido' });
      }

      // Deleta o filtro de óleo do banco de dados
      const deleteOilFilter = await OilFilter.findByIdAndDelete(id);

      // Verifica se o filtro de óleo foi encontrado para deleção
      if (!deleteOilFilter) {
        return res.status(404).json({ err: 'Filtro de Óleo não encontrado.' });
      }

      // Retorna uma resposta de sucesso
      return res
        .status(200)
        .json({ ok: 'Filtro de Óleo deletado com sucesso.' });
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Erro ao tentar deletar óleo:', err);
      return res.status(500).json({ err: 'Erro ao tentar deletar óleo' });
    }
  }
}

export default new OilFilterController();
