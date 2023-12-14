import Store from '../models/Store.js';
import twilioClient from '../config/twilio.js';

class ChatController {
  // Função principal para processar mensagens do WhatsApp
  async zapMessage(req, res) {
    // Extração de dados da requisição
    const { From, Body } = req.body;

    try {
      // Transforma o corpo da mensagem para minúsculas para facilitar a comparação
      const lowerCaseBody = Body.toLowerCase();

      // Divide a mensagem em partes com base no uso de 'e' ou 'e'
      const parts = lowerCaseBody.split(/ e | e/);

      // Array para armazenar as tarefas assíncronas
      const tasks = [];

      // Processa cada parte da mensagem
      // eslint-disable-next-line no-restricted-syntax
      for (const part of parts) {
        // Verifica se a mensagem é uma saudação
        if (this.isGreeting(part)) {
          // Adiciona a tarefa assíncrona de lidar com a saudação ao array
          tasks.push(this.handleGreeting(From));
        } else if (this.isLocationRequest(part)) {
          // Adiciona a tarefa assíncrona de lidar com a solicitação de localização ao array
          tasks.push(this.handleLocationRequest(From));
        } else if (this.isNameRequest(part)) {
          // Adiciona a tarefa assíncrona de lidar com a solicitação de nome ao array
          tasks.push(this.handleNameRequest(From));
        } else if (this.isOpeHoursRequest(part)) {
          // Adiciona a tarefa assíncrona de lidar com a solicitação de horário de funcionamento ao array
          tasks.push(this.handleOpenHoursRequest(From));
        }
      }

      // Espera que todas as tarefas assíncronas sejam concluídas antes de continuar
      await Promise.all(tasks);

      // Responde com sucesso
      return res
        .status(200)
        .json({ success: true, message: 'Mensagem processada com sucesso.' });
    } catch (err) {
      // Trata erros e retorna uma resposta de erro
      console.error(`Erro ao processar mensagem: ${err.message}`);
      return res
        .status(500)
        .json({ success: false, error: 'Erro ao processar mensagem.' });
    }
  }

  // Verifica se a mensagem é uma saudação
  isGreeting(body) {
    return (
      body.includes('olá') ||
      body.includes('oi') ||
      body.includes('e aí') ||
      body.includes('tudo bem') ||
      body.includes('opa') ||
      body.includes('alô') ||
      body.includes('ei') ||
      body.includes('bom dia') ||
      body.includes('boa tarde') ||
      body.includes('boa noite') ||
      body.includes('ola') ||
      body.includes('eai') ||
      body.includes('e ai')
    );
  }

  // Envia uma resposta para uma saudação
  async handleGreeting(to) {
    await this.sendMessage(to, 'Olá! Como posso ajudar você hoje?');
    console.log('Resposta enviada: Saudação');
  }

  // Verifica se a mensagem é um pedido de informação da localização da loja
  isLocationRequest(body) {
    return (
      body.includes('localização') ||
      body.includes('local') ||
      body.includes('localizacaum') ||
      body.includes('lokal') ||
      body.includes('localzção') ||
      body.includes('loqlizaçao') ||
      body.includes('loclz') ||
      body.includes('localizacao')
    );
  }

  // Envia uma resposta para uma solicitação de informação de localização
  async handleLocationRequest(to) {
    const storeLocation = await Store.find().select({ location: 1 }).lean();

    if (storeLocation.length > 0) {
      // Se encontrou localização da loja, envia a resposta
      await this.sendMessage(
        to,
        `A Localização da nossa loja é ${storeLocation[0].location}`,
      );
      console.log('Resposta enviada: Informações da Loja');
    } else {
      // Se não encontrou informações da loja, envia uma resposta padrão
      await this.sendMessage(
        to,
        'Desculpe, não encontramos informações para a palavra-chave fornecida.',
      );
      console.log('Resposta enviada: Informações não encontradas');
    }
  }

  // Verificar se a mensagem é um pedido de informação sobre o nome da loja
  isNameRequest(body) {
    return (
      body.includes('nome') ||
      body.includes('nm') ||
      body.includes('nme') ||
      body.includes('noome') ||
      body.includes('nomi') ||
      body.includes('noimi')
    );
  }

  // Envia uma resposta para uma solicitação de informação do nome da loja
  async handleNameRequest(to) {
    const storeNome = await Store.find().select({ name: 1 }).lean();

    if (storeNome.length > 0) {
      // Se encontrou nome da loja, envia a resposta
      await this.sendMessage(to, `O Nome da nossa loja é ${storeNome[0].name}`);
      console.log('Resposta enviada: Informações da Loja');
    } else {
      // Se não encontrou informações do nome da loja, envia uma resposta padrão
      await this.sendMessage(
        to,
        'Desculpe, não encontramos informações para a palavra-chave fornecida.',
      );
      console.log('Resposta enviada: Informações não encontradas');
    }
  }

  // Verificar se a mensagem é um pedido de informação sobre o horário de funcionamento
  isOpeHoursRequest(body) {
    return (
      body.includes('horas') ||
      body.includes('hr') ||
      body.includes('hrs') ||
      body.includes('oras') ||
      body.includes('hras') ||
      body.includes('funciona') ||
      body.includes('funcna') ||
      body.includes('func') ||
      body.includes('funcionamento') ||
      body.includes('funiona') ||
      body.includes('aberto') ||
      body.includes('abertu') ||
      body.includes('abert') ||
      body.includes('abrt') ||
      body.includes('abre')
    );
  }

  // Envia uma resposta para uma solicitação de informação de horário de funcionamento
  async handleOpenHoursRequest(to) {
    const storeOpenhours = await Store.find()
      .select({ openingHours: 1 })
      .lean();

    if (storeOpenhours.length > 0) {
      // Se encontrou o horário de funcionamento da loja, envia a resposta
      await this.sendMessage(
        to,
        `O Horário de funcionamento é de ${storeOpenhours[0].openingHours}`,
      );
      console.log('Resposta enviada: Informações da Loja');
    } else {
      // Se não encontrou informações do horário de funcionamento, envia uma resposta padrão
      await this.sendMessage(
        to,
        'Desculpe, não encontramos informações para a palavra-chave fornecida.',
      );
      console.log('Resposta enviada: Informações não encontradas');
    }
  }

  // Função auxiliar para enviar mensagens usando o cliente Twilio
  async sendMessage(to, message) {
    await twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    });
  }
}

export default new ChatController();
