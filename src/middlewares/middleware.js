import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import 'dotenv/config';

class Middleware {
  async authUser(req, res, next) {
    const tokenHeader = req.headers.authorization;

    try {
      if (!tokenHeader) {
        return res.status(401).json({ err: 'Token não autorizado.' });
      }

      const [, token] = tokenHeader.split(' ');

      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SEC);

      req.user_id = decoded.id;

      return next();
    } catch (err) {
      return res.status(401).json({ err: 'Token inválido.' });
    }
  }
}

export default new Middleware();
