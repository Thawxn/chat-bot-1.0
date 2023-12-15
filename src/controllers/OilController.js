import * as Yup from 'yup';
import Oil from '../models/Oil.js';

class OilController {
  // Método para listar todos os óleos
  async index(req, res) {
    try {
      // Busca todos os registros de óleo no banco de dados
      const response = await Oil.find();
      return res.status(200).json(response);
    } catch (err) {
      // Loga e retorna um erro em caso de falha na busca
      console.error('Erro ao buscar óleos:', err);
      return res.status(500).json({ err: 'Erro ao buscar óleos' });
    }
  }

  // Método para buscar um óleo por nome e/ou viscosidade
  async indexOne(req, res) {
    const { name, viscosity } = req.params;

    try {
      // Configuração da consulta com base nos parâmetros fornecidos
      const searchQuery = {};

      // Verifica se há um nome na pesquisa
      if (name) {
        // Utiliza uma expressão regular para fazer a pesquisa do nome exato
        searchQuery.name = new RegExp(`^${name}$`, 'i');
      }

      // Verifica se há uma viscosidade na pesquisa
      if (viscosity) {
        // Utiliza uma expressão regular para fazer a pesquisa da viscosidade exata
        searchQuery.viscosity = new RegExp(`^${viscosity}$`, 'i');
      }

      // Realiza a pesquisa com base nos critérios fornecidos
      const searchResults = await Oil.find(searchQuery);

      // Retorna os resultados da pesquisa ou uma mensagem de nenhum resultado
      if (searchResults.length > 0) {
        return res.status(200).json(searchResults);
      }
      return res.status(404).json({ message: 'Nenhum resultado encontrado.' });
    } catch (err) {
      // Loga e retorna um erro em caso de falha na busca
      console.error('Erro ao tentar buscar óleo.', err);
      return res.status(500).json({ err: 'Erro ao tentar buscar óleo.' });
    }
  }

  // Método para registrar óleo
  async register(req, res) {
    // Define um schema de validação usando o Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      viscosity: Yup.string().required(),
      price: Yup.number().required(),
    });

    const { name, viscosity, price } = req.body;

    try {
      // Valida os dados de entrada usando o schema definido
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      // Cria um novo registro de óleo no banco de dados
      const newOil = await Oil.create({
        name,
        viscosity,
        price,
      });

      // Retorna o óleo recém-criado como resposta
      return res.status(200).json(newOil);
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Error ao registrar óleo:', err);

      // Verifica se o erro é de validação e retorna detalhes específicos
      if (err.name === 'ValidationError') {
        const validationErrors = err.errors.map(error => ({
          field: error.path,
          message: error.message,
        }));
        return res.status(400).json({ validationErrors });
      }

      return res.status(500).json({ err: 'Erro ao registrar óleo' });
    }
  }

  // Método para editar óleo
  async edit(req, res) {
    const { id } = req.params;
    const { name, viscosity, price } = req.body;

    try {
      // Verifica se o ID do óleo foi fornecido
      if (!id) {
        return res.status(400).json({ err: 'ID do óleo não fornecido.' });
      }

      // Atualiza as informações do óleo no banco de dados
      const updateOil = await Oil.findByIdAndUpdate(id, {
        name,
        viscosity,
        price,
      });

      // Verifica se o óleo foi encontrado para atualização
      if (!updateOil) {
        return res.status(404).json({ err: 'Óleo não encontrado.' });
      }

      // Retorna uma resposta de sucesso
      return res
        .status(200)
        .json({ ok: 'Informações do óleo atualizado com sucesso.' });
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Error ao tentar editar óleo:', err);
      return res.status(500).json({ err: 'Erro ao tentar editar óleo' });
    }
  }

  // Método para deletar óleo
  async delete(req, res) {
    const { id } = req.params;

    try {
      // Verifica se o ID do óleo foi fornecido
      if (!id) {
        return res.status(400).json({ err: 'ID do óleo não fornecido' });
      }

      // Deleta o óleo do banco de dados
      const deleteOil = await Oil.findByIdAndDelete(id);

      // Verifica se o óleo foi encontrado para deleção
      if (!deleteOil) {
        return res.status(404).json({ err: 'Óleo não encontrado.' });
      }

      // Retorna uma resposta de sucesso
      return res.status(200).json({ ok: 'Óleo deletado com sucesso.' });
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Erro ao tentar deletar óleo:', err);
      return res.status(500).json({ err: 'Erro ao tentar deletar óleo' });
    }
  }
}

export default new OilController();
