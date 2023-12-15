import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

class UserController {
  // Método para registrar um novo usuário
  async register(req, res) {
    // Define um schema de validação usando o Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      phone: Yup.number().required(),
    });

    // Extrai os dados da requisição
    const { name, phone, email, password } = req.body;

    try {
      // Valida os dados de entrada usando o schema definido
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      // Gera um hash seguro para a senha usando bcrypt
      const salt = bcrypt.genSaltSync(8);
      const hash = bcrypt.hashSync(password, salt);

      // Cria um novo usuário no banco de dados
      const newUser = await User.create({
        name,
        phone,
        email,
        password: hash,
      });

      // Retorna o novo usuário como resposta
      return res.status(200).json(newUser);
    } catch (err) {
      console.error('Erro ao registrar usuário:', err);

      if (err.name === 'ValidationError') {
        // Erro de validação do Yup
        const validationErrors = err.errors.map(error => ({
          field: error.path,
          message: error.message,
        }));
        return res.status(400).json({ validationErrors });
      }

      // Outros erros
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }

  // Método para editar informações do usuário
  async edit(req, res) {
    const { name, email, phone } = req.body;

    try {
      // Verifica se já existe um usuário com o nome fornecido
      const nameFind = await User.findOne({ name });
      if (nameFind) {
        return res.status(400).json({ err: 'Nome de usuário já existe' });
      }

      // Verifica se já existe um usuário com o email fornecido
      const emailFind = await User.findOne({ email });
      if (emailFind) {
        return res
          .status(400)
          .json({ err: 'E-mail já está sendo usado por outro usuário' });
      }

      // Atualiza as informações do usuário no banco de dados
      await User.findByIdAndUpdate(req.user_id, {
        name,
        email,
        phone,
      });

      // Retorna uma resposta de sucesso após a atualização
      return res.status(200).json({ ok: 'Usuário editado com sucesso' });
    } catch (err) {
      console.error('Erro ao editar usuário:', err);

      if (err.name === 'ValidationError') {
        // Erro de validação do Yup
        const validationErrors = err.errors.map(error => ({
          field: error.path,
          message: error.message,
        }));
        return res.status(400).json({ validationErrors });
      }

      // Outros erros
      return res.status(500).json({ error: 'Erro ao editar usuário.' });
    }
  }
}

export default new UserController();
