import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import 'dotenv/config';

class SessionController {
  // Método para autenticar um usuário e gerar token
  async session(req, res) {
    // Define um schema de validação usando o Yup
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    // Extrai os dados da requisição
    const { email, password } = req.body;

    try {
      // Valida os dados de entrada usando o schema definido
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      // Busca o usuário no banco de dados pelo email
      const data = await User.findOne({ email });

      // Verifica se o usuário foi encontrado
      if (data !== null) {
        // Compara as senhas usando bcrypt
        const correct = bcrypt.compareSync(password, data.password);

        // Se a senha estiver correta, gera um token JWT
        if (correct) {
          const token = jwt.sign(
            { id: data._id, email: data.email },
            process.env.JWT_SEC,
            { expiresIn: '24h' },
          );

          // Remove a senha do objeto de resposta
          // eslint-disable-next-line no-unused-vars, no-shadow
          const { password, ...others } = data._doc;

          // Retorna os dados do usuário e o token JWT
          return res.status(200).json({ user: others, token });
        }
      }

      // Retorna uma resposta de erro se o usuário não for encontrado ou a senha estiver incorreta
      return res.status(400).json({ err: 'E-mail ou senha incorreta.' });
    } catch (err) {
      // Trata erros e retorna uma resposta de erro
      console.error('Erro durante a autenticação:', err);
      return res.status(500).json({ error: 'Erro durante a autenticação.' });
    }
  }
}

export default new SessionController();
