import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

class UserController {
  // registro de usuario
  async register(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      phone: Yup.number().required(),
    });

    const { name, phone, email, password } = req.body;

    try {
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      const salt = bcrypt.genSaltSync(8);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        name,
        phone,
        email,
        password: hash,
      });

      return res.status(200).json(newUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // editando usuario
  async edit(req, res) {
    const { name, email, phone } = req.body;

    try {
      const nameFind = await User.findOne({ name });
      const emailFind = await User.findOne({ email });

      if (nameFind) {
        return res.status(400).json({ err: 'Nome de usuario já existe' });
      }

      if (emailFind) {
        return res.status(400).json({ err: 'Nome de usuario já existe' });
      }

      await User.findByIdAndUpdate(req.user_id, {
        name,
        email,
        phone,
      });

      return res.status(200).json({ ok: 'Usuário editado com sucesso' });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UserController();
