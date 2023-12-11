import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import 'dotenv/config';

class SessionController {
  // logando na aplicação
  async session(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const { email, password } = req.body;

    try {
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      await User.findOne({ email })
        .then(data => {
          if (data !== undefined) {
            const correct = bcrypt.compareSync(password, data.password);

            if (correct) {
              const token = jwt.sign(
                { id: data._id, email: data.email },
                process.env.JWT_SEC,
                { expiresIn: '24h' },
              );

              // eslint-disable-next-line no-unused-vars, no-shadow
              const { password, ...others } = data._doc;

              return res.status(200).json({ others, token });
            }
          }
          return res.status(400).json({ err: 'E-mail ou senha incorreta.' });
        })
        .catch(err => res.status(500).json(err));

      return res.status(200);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new SessionController();
