// ChatController.js
import twilioClient from '../config/twilio.js';

class ChatController {
  async zapMessege(req, res) {
    const { From, Body } = req.body;

    try {
      // Analisa a mensagem recebida em letras minúsculas para tornar a comparação sem distinção entre maiúsculas e minúsculas
      const lowerCaseBody = Body.toLowerCase();

      // Verifica se a mensagem recebida é um "oi"
      if (lowerCaseBody === 'oi' || lowerCaseBody === 'olá') {
        // Se for um "oi", envia uma resposta de "Hello World"
        await twilioClient.messages.create({
          body: 'Hello World!',
          from: 'whatsapp:+14155238886',
          to: `whatsapp:${From}`,
        });

        console.log('Resposta enviada: Hello World!');
      }

      // Log da mensagem recebida
      console.log(`Mensagem recebida do número: ${From}`);
      console.log(`Conteúdo da mensagem: ${Body}`);

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
