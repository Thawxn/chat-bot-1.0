import * as Yup from 'yup';
import Store from '../models/Store.js';

class StoreController {
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
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      // Cria uma nova loja no banco de dados
      const newStore = await Store.create({
        name,
        cnpj,
        phone,
        location,
        openingHours,
        description,
        user: req.user_id, // Assume que o ID do usuário está disponível na requisição
      });

      // Retorna a loja recém-criada como resposta
      return res.status(200).json(newStore);
    } catch (err) {
      // Trata erros, loga detalhes e retorna uma resposta de erro
      console.error('Erro ao registrar loja:', err);

      return res.status(500).json({
        error: 'Erro ao registrar loja. Por favor, tente novamente.',
      });
    }
  }
}

export default new StoreController();
