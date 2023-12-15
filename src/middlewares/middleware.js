import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import 'dotenv/config';

class Middleware {
  // Middleware para autenticação do usuário
  async authUser(req, res, next) {
    // Obtém o token do cabeçalho da requisição
    const tokenHeader = req.headers.authorization;

    try {
      // Verifica se o cabeçalho de autorização está presente
      if (!tokenHeader) {
        return res.status(401).json({ err: 'Token não autorizado.' });
      }

      // Expressão regular para extrair o token (formato "Bearer <token>")
      const tokenRegex = /^Bearer (.+)$/;

      // Tenta fazer o match da expressão regular com o cabeçalho de autorização
      const match = tokenHeader.match(tokenRegex);

      // Verifica se houve match e se o token está presente
      if (!match || !match[1]) {
        return res
          .status(401)
          .json({ err: 'Token vazio ou formato inválido.' });
      }

      // Extrai o token do match
      const token = match[1];

      // Decodifica o token usando a chave secreta
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SEC);

      // Adiciona o ID do usuário decodificado ao objeto de requisição
      req.user_id = decoded.id;

      // Chama a próxima função no pipeline de middleware
      return next();
    } catch (err) {
      // Trata erros durante o processo de autenticação
      console.error('Erro na autenticação:', err);
      return res.status(401).json({ err: 'Token inválido.' });
    }
  }
}

export default new Middleware();
