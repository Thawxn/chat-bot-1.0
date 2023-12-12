import Store from '../models/Store.js';
import twilioClient from '../config/twilio.js';

class ChatController {
  async zapMessege(req, res) {
    const { From, Body } = req.body;

    try {
      // Consultar o banco de dados para obter informações da loja com base na mensagem
      const storeInfo = await Store.find().select(Body.toLowerCase()).lean();

      const modifiedResponse = storeInfo.map(item => {
        // eslint-disable-next-line no-unused-vars
        const { _id, ...rest } = item;
        return rest;
      });

      console.log(modifiedResponse[0].name);

      if (modifiedResponse) {
        // Se encontrou informações da loja, envia a resposta
        await twilioClient.messages.create({
          body: `Informações da Loja:\nNome: ${modifiedResponse[0].name}`,
          from: 'whatsapp:+14155238886',
          to: `whatsapp:${From}`,
        });

        console.log('Resposta enviada: Informações da Loja');
      } else {
        // Se não encontrou informações da loja, envia uma resposta padrão
        await twilioClient.messages.create({
          body: 'Desculpe, não encontramos informações para a palavra-chave fornecida.',
          from: 'whatsapp:+14155238886',
          to: `whatsapp:${From}`,
        });

        console.log('Resposta enviada: Informações não encontradas');
      }

      return res
        .status(200)
        .json({ success: true, message: 'Mensagem processada com sucesso.' });
    } catch (err) {
      console.error(`Erro ao processar mensagem: ${err.message}`);
      return res
        .status(500)
        .json({ success: false, error: 'Erro ao processar mensagem.' });
    }
  }
}

export default new ChatController();
