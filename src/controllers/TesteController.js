import Store from '../models/Store.js';

class TesteController {
  async testeDePesquisa(req, res) {
    const { body } = req.body;

    try {
      const response = await Store.find().select(body).lean();

      // Remover o campo _id manualmente de cada objeto no array
      const modifiedResponse = response.map(item => {
        // eslint-disable-next-line no-unused-vars
        const { _id, ...rest } = item;
        return rest;
      });

      console.log(modifiedResponse);
      return res.status(200).json(modifiedResponse);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new TesteController();
