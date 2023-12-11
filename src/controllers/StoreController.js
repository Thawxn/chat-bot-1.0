import * as Yup from 'yup';
import Store from '../models/Store.js';

class StoreController {
  // registrando loja
  async register(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cnpj: Yup.string().email().required(),
      phone: Yup.number().required(),
      location: Yup.string().required(),
      description: Yup.string().required(),
    });

    const { name, cnpj, phone, location, description } = req.body;

    try {
      if (!schema.isValid(req.body)) {
        return res
          .status(400)
          .json({ err: 'Preencha todos os campos corretamente.' });
      }

      const newStore = await Store.create({
        name,
        cnpj,
        phone,
        location,
        description,
        user: req.user_id,
      });

      return res.status(200).json(newStore);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new StoreController();
