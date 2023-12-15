import * as Yup from 'yup';
import Store from '../models/Store.js';
import 'express-async-errors';

class StoreController {
  // Método para listar informações da loja
  async index(req, res) {
    try {
      // Busca todas as lojas no banco de dados
      const response = await Store.find();
      return res.status(200).json(response);
    } catch (err) {
      // Trata erros ao buscar lojas e retorna uma resposta de erro
      console.error('Erro ao buscar lojas:', err);
      return res.status(500).json({ error: 'Erro ao buscar lojas.' });
    }
  }

  // Método para registrar uma nova loja
  async register(req, res) {
    // Define um schema de validação usando o Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cnpj: Yup.string().required(),
      phone: Yup.number().required(),
      location: Yup.string().required(),
      openingHours: Yup.string().required(),
      description: Yup.string().required(),
    });

    // Extrai os dados da requisição
    const { name, cnpj, phone, location, openingHours, description } = req.body;

    try {
      // Valida os dados de entrada usando o schema definido
      await schema.validate(req.body, { abortEarly: false });

      // Cria uma nova loja no banco de dados
      const newStore = await Store.create({
        name,
        cnpj,
        phone,
        location,
        openingHours,
        description,
        user: req.user_id,
      });

      // Retorna a loja recém-criada como resposta
      return res.status(200).json(newStore);
    } catch (err) {
      // Trata erros durante a validação e criação da loja
      console.error('Erro ao registrar loja:', err);

      // Verifica se o erro é de validação do Yup
      if (err instanceof Yup.ValidationError) {
        // Mapeia os erros de validação para um formato mais amigável
        const validationErrors = err.errors.map(error => ({
          field: error.path,
          message: error.message,
        }));

        // Retorna uma resposta de erro com os detalhes da validação
        return res.status(400).json({ validationErrors });
      }

      // Retorna uma resposta de erro genérica
      return res.status(500).json({
        error: 'Erro ao registrar loja. Por favor, tente novamente.',
      });
    }
  }

  // Método para editar informações da loja
  async edit(req, res) {
    const { id } = req.params;
    const { name, cnpj, phone, location, openingHours, description } = req.body;

    try {
      // Verifica se o ID foi fornecido na requisição
      if (!id) {
        return res.status(400).json({ error: 'ID da loja não fornecido' });
      }

      // Atualiza as informações da loja no banco de dados
      const updatedStore = await Store.findByIdAndUpdate(id, {
        name,
        cnpj,
        phone,
        location,
        openingHours,
        description,
      });

      // Verifica se a loja foi encontrada e atualizada
      if (!updatedStore) {
        return res.status(404).json({ error: 'Loja não encontrada' });
      }

      // Retorna uma resposta de sucesso após a atualização
      return res
        .status(200)
        .json({ ok: 'Informações da loja atualizadas com sucesso' });
    } catch (err) {
      // Trata erros durante a edição da loja e retorna uma resposta de erro
      console.error('Erro ao editar loja:', err);
      return res.status(500).json({ error: 'Erro ao editar loja.' });
    }
  }

  // Método para deletar informações da loja
  async delete(req, res) {
    const { id } = req.params;

    try {
      // Verifica se o ID foi fornecido na requisição
      if (!id) {
        return res.status(400).json({ error: 'ID da loja não fornecido' });
      }

      // Deleta as informações da loja no banco de dados
      const deletedStore = await Store.findByIdAndDelete(id);

      // Verifica se a loja foi encontrada e deletada
      if (!deletedStore) {
        return res.status(404).json({ error: 'Loja não encontrada' });
      }

      // Retorna uma resposta de sucesso após a exclusão
      return res
        .status(200)
        .json({ ok: 'Informações da loja deletadas com sucesso' });
    } catch (err) {
      // Trata erros durante a exclusão da loja e retorna uma resposta de erro
      console.error('Erro ao deletar loja:', err);
      return res.status(500).json({ error: 'Erro ao deletar loja.' });
    }
  }
}

export default new StoreController();
